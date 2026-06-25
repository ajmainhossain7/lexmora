# Lexmora — Digital Life Lessons

Lexmora is a premium full-stack platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom they have gathered over time. The platform encourages mindful reflection, preserving personal wisdom, and learning from the experiences of a global community.

## Live URL
[Lexmora Live Site](https://lexmora-one.vercel.app)

---

## Key Features
* **Authentication**: Fully secure registration and login using email/password or Google Login via **Better Auth**. Includes validation rules (uppercase, lowercase, min 6 characters).
* **Payment Integration**: Lifetime Premium upgrade via **Stripe Checkout** for a one-time fee of ৳1500, updated asynchronously via Stripe webhooks.
* **Premium Access Control**:
  * Free users can browse public free lessons. Premium lessons are dynamically blurred with a locked prompt.
  * Premium members can read all free and premium lessons and create their own premium exclusive lessons.
* **Wisdom Feed (Challenge 1 & 3)**: Browse public lessons with dynamic search by keyword, filter by categories (Resilience, Focus, Growth, Strategy, etc.) or emotional tone, and sort by newest or most saved. Includes single-page pagination.
* **Lesson details (Private)**: Deep insights with creator author cards, estimated reading time, comment section, likes count, saving to favorites, and a flag/reporting mechanism.
* **Unified Dashboard Layout**:
  * A single, reusable dashboard route (`/dashboard`) loading standard user options or admin mod controls dynamically.
  * **User View**: Profile information updates, analytics cards, emotional tone charts, favorite lists, and user's public contributions.
  * **Admin View**: Monthly user/lessons growth graphs, user role promotion/deletions, featured lesson toggles, and moderation of flagged reports.
* **Aesthetics & UI**: Curated premium dark and light theme toggles with smooth `framer-motion` page transitions, layout route groupings, and complete accessibility controls.
* **Wisdom PDF Export**: Premium users can export clean, print-friendly copies of wisdom articles to PDF format.

---

## Packages Used

### Client-Side (`lexmora`)
* `next` (v16.2.9)
* `react` (v19.2.4)
* `react-dom` (v19.2.4)
* `@heroui/react` (v3.2.1) — UI component library
* `framer-motion` (v12.40.0) — animations and page transitions
* `next-themes` (v0.4.4) — light/dark theme toggle
* `react-hot-toast` (v2.6.0) — notifications and error popups
* `lucide-react` (v1.21.0) & `react-icons` (v5.6.0) & `@gravity-ui/icons` (v2.18.0) — icon assets
* `stripe` & `@stripe/stripe-js` — payment gateway integration
* `better-auth` — authentication client wrapper

### Server-Side (`lexmora-server`)
* `express` — backend REST API framework
* `cors` — Cross-Origin Resource Sharing middleware
* `dotenv` — environment variables handling
* `mongodb` — database connection client
* `stripe` — Stripe backend payment handler
