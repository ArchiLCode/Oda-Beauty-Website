# Sanity CMS setup

The site remains a static Astro build. `CONTENT_SOURCE=sanity npm run build` fetches only published
documents, validates the mapped `LandingContent`, and writes the result to `dist/`.

## 1. Create the Sanity project

1. Log in with `npx sanity login`.
2. Create a project in Sanity Manage and create a public dataset named `production`.
3. Copy `.env.example` to `.env` and set `SANITY_PROJECT_ID`. The CLI mirrors this value into the
   browser-safe Studio variable automatically. Keep the dataset as `production`.
4. Create an Editor token and set it locally as `SANITY_WRITE_TOKEN` for the initial import.
5. Run `npm run studio:schema` to validate and extract the Studio schema.
6. Run `npm run sanity:import` to upload local CMS images and create or replace deterministic documents.
7. Run `npm run studio:dev`, inspect the imported content, and publish any drafts if needed.
8. Run `npm run studio:deploy` and choose the required `*.sanity.studio` hostname.

The import script does not upload fixed social-network SVG icons. It stores their existing `/img/*.svg`
paths in `landingPage`; every other landing image is uploaded to Sanity Assets with required alt text.

For a private dataset, create a Viewer token and set `SANITY_READ_TOKEN` in local and GitHub build
environments. A public dataset does not require a read token.

## 2. Verify the CMS build

```bash
CONTENT_SOURCE=static npm run verify
CONTENT_SOURCE=sanity npm run build
```

The CMS build deliberately fails if project configuration, the `landingPage` singleton, a relation, or
required content is missing. The singleton document id must remain `landingPage`.

## 3. Configure GitHub Actions

Add these repository secrets:

| Secret | Value |
| --- | --- |
| `SANITY_PROJECT_ID` | Sanity project id |
| `SANITY_DATASET` | `production` |
| `SANITY_READ_TOKEN` | Empty for a public dataset; Viewer token for a private dataset |
| `TIMEWEB_HOST` | SSH/SFTP hostname |
| `TIMEWEB_PORT` | SSH port, usually `22` |
| `TIMEWEB_USER` | SSH user |
| `TIMEWEB_SSH_KEY` | Private deploy key |
| `TIMEWEB_REMOTE_PATH` | Absolute public directory for the domain |

Install the matching public SSH key in Timeweb. The workflow verifies the static fallback, builds the
published Sanity content, and synchronizes `dist/` with `rsync --delete`.

## 4. Configure the publish webhook

Create a fine-grained GitHub token for this repository that can call the repository dispatch endpoint.
In Sanity Manage, add a webhook with these values:

- URL: `https://api.github.com/repos/ArchiLCode/Oda-Beauty-Website/dispatches`
- Method: `POST`
- Trigger: create, update, delete
- Filter:

```groq
_type in [
  "landingPage",
  "serviceCategory",
  "service",
  "teamMember",
  "galleryImage",
  "brandLogo",
  "review"
]
```

- Projection/body: `{ "event_type": "sanity-publish" }`
- Headers:
  - `Accept: application/vnd.github+json`
  - `Authorization: Bearer <GITHUB_TOKEN>`
  - `X-GitHub-Api-Version: 2022-11-28`

Enable the webhook only for published document changes, not drafts. Test it from Sanity Manage and
confirm that the `Build and deploy` workflow starts with the `repository_dispatch` event.

## 5. Acceptance check

1. Change a service price or an image in Studio and publish it.
2. Confirm a successful webhook delivery in Sanity.
3. Confirm a successful GitHub Actions build and deploy.
4. Open the production page and verify the published change.
