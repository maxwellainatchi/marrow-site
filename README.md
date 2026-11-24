# Marrow site

The public website, privacy policy, terms of use and data-use page for [Marrow](https://marrow-info.ainatchi.me), a personal, self-hosted health record. These pages exist so Marrow can be registered as a patient-facing app on fhir.epic.com.

- Static HTML and CSS only: no scripts, no cookies, no analytics, and never any health record data.
- Pages live in `src/` and are wrapped in `layout.html`. Colors and type come from `vendor/tokens.css`, a copy of the Marrow Clinical design tokens; dark mode follows the system setting.
- `node build.mjs` writes `dist/`. The contact address is marrow@ainatchi.me; `MARROW_SITE_CONTACT` overrides it.
- Every push to `main` publishes to GitHub Pages through `.github/workflows/pages.yml`.

## URLs for the Epic app form

- Website: https://marrow-info.ainatchi.me/
- Terms and Conditions URL: https://marrow-info.ainatchi.me/terms
- Privacy policy: https://marrow-info.ainatchi.me/privacy
- Additional Disclosure Information URL: https://marrow-info.ainatchi.me/data-use
- JWK Set URL: https://marrow-info.ainatchi.me/.well-known/jwks.json

`src/.well-known/jwks.json` holds **public keys only**. Never put a private key in this repo.

The terms and privacy text is a starting draft, not legal advice.
