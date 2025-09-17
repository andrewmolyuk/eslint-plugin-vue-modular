# Development flow — signed commits and `next` branch

This document describes a minimal, practical flow that uses a `next` branch for ongoing work and requires GPG-signed commits and tags.

## Branch model

- `main`: every commit triggers a release via CI - automatic publish on push by [semantic-release](https://semantic-release.gitbook.io/semantic-release/).
- `next`: integration branch for the upcoming release (features, breaking changes).
- feature branches: `feat/<name>` or `fix/<name>` branched off `next`. Optional, but recommended to keep work isolated and reviewable when working on larger changes.

## Day-to-day workflow

Sync branches:

- git checkout next
- git pull origin next

Create a feature branch:

- git checkout -b feat/do-thing

Work and make signed commits:

- git add .
- git commit -S -m "feat: implement do-thing"
- (if `commit.gpgSign` is true, plain `git commit -m "..."` signs automatically)

Push and open a PR to `next`:

- git push -u origin feat/do-thing

Open PR with base `next`.

## Pull request & CI

- PRs target `next`.
- Enforce branch protection on `next` and `main`: require passing CI and require signed commits (on platforms that support signature enforcement).
- Review and squash or rebase as policy dictates. When squashing/rebasing locally, ensure the final commits remain signed (use git commit -S --amend or rebase --exec "git commit --amend --no-edit -n -S" ...).

## Preparing a release from `next`

Merge `next` into `main` when ready to publish (or create a release branch):

- git checkout main
- git pull origin main
- git merge --no-ff next

Push to `main`. **Every commit to `main` will trigger an automatic release via CI (semantic-release).**

- No manual tag or version bump is needed; the release workflow handles versioning and publishing.
- Only push signed commits to `main`.

## Verifying signatures

- Verify a commit signature:
  - git log --show-signature -1 `<commit>`
- Verify a tag signature:
  - git tag -v v1.2.0

## Notes and best practices

- Require signed commits in branch protection to enforce provenance.
- Keep `next` deployable in CI (run tests/lint on every PR).
- For hotfixes, branch from `main`, apply fix, sign commits, merge into `main`, then propagate to `next` (merge main → next) to avoid regressions.
- If team uses SSH-based signing (OpenSSH), set git config gpg.format ssh and use an SSH key formatted for signing.

This flow keeps work centralized on `next` while ensuring every commit and release is signed and verifiable.
