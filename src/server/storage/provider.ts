// Storage provider abstraction — Phase 3 foundation.
// Swap providers via STORAGE_PROVIDER env var without touching call sites.
// No credentials are hard-coded; each provider throws a clear setup error
// if its env vars are missing, rather than silently no-op'ing.

export interface UploadResult {
  url: string;
  path: string;
}

export interface StorageProvider {
  upload(params: { buffer: Buffer; fileName: string; folder: string; contentType: string }): Promise<UploadResult>;
  delete(path: string): Promise<void>;
}

class SupabaseStorageProvider implements StorageProvider {
  private assertConfigured() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        "Supabase storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment."
      );
    }
  }

  async upload(): Promise<UploadResult> {
    this.assertConfigured();
    // Implementation wires up @supabase/supabase-js client with the
    // service role key in Phase 3's storage implementation pass.
    throw new Error("SupabaseStorageProvider.upload not yet implemented — Phase 3 build step.");
  }

  async delete(): Promise<void> {
    this.assertConfigured();
    throw new Error("SupabaseStorageProvider.delete not yet implemented — Phase 3 build step.");
  }
}

class CloudinaryStorageProvider implements StorageProvider {
  private assertConfigured() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
      );
    }
  }

  async upload(): Promise<UploadResult> {
    this.assertConfigured();
    throw new Error("CloudinaryStorageProvider.upload not yet implemented — Phase 3 build step.");
  }

  async delete(): Promise<void> {
    this.assertConfigured();
    throw new Error("CloudinaryStorageProvider.delete not yet implemented — Phase 3 build step.");
  }
}

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "supabase";
  if (provider === "cloudinary") return new CloudinaryStorageProvider();
  return new SupabaseStorageProvider();
}
