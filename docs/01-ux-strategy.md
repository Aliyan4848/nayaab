# NAYAAB — UX & Product Strategy (Phase 1)

This is the internal strategy that drives every later design and engineering decision. It's grounded in known, well-established patterns from Pakistani/South Asian fashion ecommerce, premium fashion ecommerce generally, and mobile-commerce/COD-market behavior — not copied from any single competitor.

## 1. Target customer
- Primarily women 20–45, shopping for themselves or family, often browsing on a phone during commute/evening hours.
- Comfortable buying unstitched fabric — understands "3-piece," "shirt/trouser/dupatta," fabric names (lawn, chiffon, khaddar) natively; no need to over-explain basics, but *does* need precise specifics (meters, weight, exact pieces).
- High price-sensitivity relative to Western luxury shoppers, but "premium" here means fabric quality, print/embroidery precision, and trustworthy delivery — not flashy UI.
- A meaningful share prefers to finalize or confirm an order over WhatsApp even after browsing the website — the site is often the catalog, WhatsApp is often the checkout counter.

## 2. Shopping behavior
- Heavy mobile usage (assume 75-85% mobile traffic). Sessions are short, interrupted, and resumed later — cart/wishlist persistence matters more than flashy interactions.
- Browsing is visual-first: fabric texture, print scale, and true color matter more than marketing copy. Customers zoom into fabric photos before reading descriptions.
- Comparison happens across few products in the same collection ("which lawn print do I want") more than across brands in-session.

## 3. Product discovery
- Entry points: Instagram/WhatsApp story links directly to a product or collection far more than homepage-first browsing.
- "New Arrivals" and "Sale" are the two most-clicked nav items in this category.
- Fabric-based browsing (Lawn / Chiffon / Linen / Khaddar) is a primary mental model, not just category-based.

## 4. Product comparison & confidence
- Because it's unstitched, customers cannot "try it on" — confidence must come from: precise fabric composition, exact pieces included, true-to-life photography (including close-up fabric texture and a styled/model shot), and clear embroidery/print description.
- Ambiguity about "what exactly do I receive" is the #1 driver of support questions in this category — the PDP must answer it without the customer needing to ask.

## 5. Checkout friction
- Forced account creation is a major abandonment cause — guest checkout must be the default path, not a secondary option.
- Address entry should be short: name, phone, full address, city, province — avoid asking for anything not needed for COD delivery.
- Phone number is effectively the primary identity field in this market (more reliable than email for delivery coordination).

## 6. COD expectations
- Cash on Delivery is the default trust mechanism, not a fallback payment method — it must be visually reassuring and *not* buried as a minor option.
- Customers expect to be able to confirm/cancel an order via phone or WhatsApp before dispatch — this maps to the "Confirmed" status step and the WhatsApp order-confirmation message.

## 7. WhatsApp usage
- WhatsApp is used for: pre-purchase questions ("is this in stock," "can I see more of the fabric"), order placement for customers who prefer not to use online checkout, and post-order status questions.
- A prefilled WhatsApp message (product name, SKU, URL) removes friction and reduces mistyped/ambiguous inquiries for the business.

## 8. Mobile shopping
- Design mobile-first, not "responsive-as-an-afterthought." Sticky Add-to-Cart/Buy-Now, large touch targets, bottom-sheet filters, and swipeable galleries are baseline expectations, not enhancements.

## 9. Order tracking
- Customers want a simple, no-login lookup: order number + phone/email. A visual step timeline (placed → confirmed → processing → dispatched → delivered) matters more than granular courier data most couriers don't reliably provide in this market.

## 10. Returns/exchanges
- Must be clearly and honestly stated up front (fabric-based products often have tighter or different return norms than stitched garments) — no invented guarantees; policy text is a business-owned, editable field, not hard-coded marketing copy.

## 11. Trust signals
- Real trust signals for this brand: clear delivery info, clear return/exchange policy, responsive WhatsApp/contact channel, and genuine (not fabricated) reviews once they exist. No fake counters, fake urgency, fake press badges.

## 12. Design implication summary
| Behavior | Design decision |
|---|---|
| Mobile-first, interrupted sessions | Persistent cart/wishlist, minimal typing, sticky CTAs |
| Can't touch fabric | Rich, standardized image set per product incl. texture/close-up |
| WhatsApp-native buyers | WhatsApp CTA on PDP + cart, prefilled structured message |
| COD-default trust model | COD shown prominently and reassuringly, not hidden |
| Guest-first checkout | No forced signup; account is optional, post-purchase upsell |
| Low tolerance for ambiguity | Explicit "What's Included," fabric detail, care instructions blocks on every PDP |
| No fake trust props | All social-proof elements pull from real, admin-managed data only |

This strategy governs Phase 5 (Homepage), Phase 6 (PLP), Phase 7 (PDP), Phase 10 (Checkout), and Phase 13 (Tracking) decisions below.
