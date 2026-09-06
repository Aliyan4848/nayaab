"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createAdminSessionToken, ADMIN_SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/admin-auth";

export interface FormState {
  error?: string;
}

const setupSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(10, "Password must be at least 10 characters."),
});

export async function setupFirstAdminAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = setupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const expectedToken = process.env.ADMIN_SETUP_TOKEN;
  if (!expectedToken) {
    return { error: "ADMIN_SETUP_TOKEN is not set in the environment. Set it before creating the first admin." };
  }
  if (parsed.data.token !== expectedToken) {
    return { error: "Invalid setup token." };
  }

  const existingCount = await prisma.adminUser.count();
  if (existingCount > 0) {
    return { error: "An admin account already exists. Use the login page, or ask an existing admin to invite you." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const admin = await prisma.adminUser.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "ADMIN_ACCOUNT_CREATED", entityType: "AdminUser", entityId: admin.id },
  });

  redirect("/admin/login?created=1");
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });

  // Constant-shape response whether the email exists or not, to avoid
  // leaking which admin emails are registered.
  const passwordOk = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false;

  if (!admin || !passwordOk || !admin.isActive) {
    if (admin) {
      await prisma.auditLog.create({
        data: { adminId: admin.id, action: "ADMIN_LOGIN_FAILED", entityType: "AdminUser", entityId: admin.id },
      });
    }
    return { error: "Invalid email or password." };
  }

  const token = await createAdminSessionToken({ adminId: admin.id, email: admin.email, role: admin.role });

  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });

  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  await prisma.auditLog.create({
    data: { adminId: admin.id, action: "ADMIN_LOGIN", entityType: "AdminUser", entityId: admin.id },
  });

  redirect("/admin");
}

export async function logoutAction() {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
