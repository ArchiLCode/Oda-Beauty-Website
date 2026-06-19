# Timeweb FTP Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unavailable SSH/rsync deployment with validated FTP/FTPS mirroring to Timeweb.

**Architecture:** GitHub Actions builds the Sanity-backed static site, installs `lftp`, validates FTP secrets, then mirrors `dist/` into a guarded remote directory. `TIMEWEB_FTP_PROTOCOL` selects explicit TLS (`ftps`) or plain FTP (`ftp`).

**Tech Stack:** GitHub Actions, Bash, lftp, Vitest, Astro.

---

### Task 1: Lock the workflow contract

**Files:**
- Create: `tests/deploy-workflow.test.ts`

- [ ] Add a test that requires `lftp`, FTP secret names, `mirror --reverse --delete`, protocol validation, and rejects SSH/rsync commands.
- [ ] Run `npm test -- tests/deploy-workflow.test.ts` and confirm it fails against the current SSH workflow.

### Task 2: Replace SSH deploy with FTP/FTPS

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] Replace `TIMEWEB_HOST`, SSH key setup, and `rsync` with `TIMEWEB_FTP_*` secrets.
- [ ] Validate required values, numeric port, `ftp|ftps`, and a non-root absolute remote path.
- [ ] Install `lftp` and mirror `dist/` with `--reverse --delete`.
- [ ] Force TLS and certificate verification for `ftps`; allow plain transport only when protocol is explicitly `ftp`.

### Task 3: Update configuration guidance

**Files:**
- Modify: `.env`
- Modify: `.env.example`
- Modify: `docs/cms-setup.md`

- [ ] Add empty local `TIMEWEB_FTP_*` entries without storing real credentials in tracked files.
- [ ] Replace SSH documentation with the exact GitHub FTP secret list and values.

### Task 4: Verify

**Files:**
- Test: `tests/deploy-workflow.test.ts`

- [ ] Run the targeted test and then `npm run verify`.
- [ ] Parse `.github/workflows/deploy.yml` as YAML.
- [ ] Run `git diff --check` and report the remaining external requirement: real Timeweb FTP credentials.
