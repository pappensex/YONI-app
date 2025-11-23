# Brand Registry

This directory tracks lightweight brand profiles used across operational tooling.
Each file stores a single brand record in JSON format, keyed by its `id`.

## Schema

- `id`: Unique identifier for the brand profile.
- `display_name`: Public-facing name.
- `role`: Role classification (e.g., `Brand`).
- `email_main`: Primary contact email.
- `public_url_main`: Primary public URL.
- `github_handle`: GitHub account handle.
- `shopify_store`: Shopify store slug or domain.
- `stripe_account`: Stripe account alias.
- `instagram_handle`: Instagram handle.
- `tiktok_handle`: TikTok handle.
- `avatar_url`: URL for the avatar or logo asset.
- `bio_short`: Short tagline.
- `bio_long`: Longer biography or description.

Add additional fields as required by downstream systems, keeping the structure
flat and using snake_case keys for consistency.
