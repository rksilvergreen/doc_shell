# Release to main (`@git-release`)

Use this command to release the current branch by merging it into main with a version bump, tag, and push.

## How it works

This command delegates to **`@git-merge-to-main`**, passing it the arguments described below. Follow the full instructions in **`@git-merge-to-main`** for executing the merge workflow.

## Arguments

The user must provide the **`version`** to release. Do not invent a version yourself.

Pass the following arguments to **`git_merge_to_main`**:

- **`version`** — the version provided by the user.
- **`prepare_release`** — a callback that updates the `"version"` field in the root `package.json` to match the release version. The callback receives `(repo_root: Path, version: str)` and should read `repo_root / "package.json"`, set its `"version"` field to `version`, and write it back, preserving the existing formatting (2-space indent, trailing newline).
- **`release_commit_message`** — `"chore: Bump version to {version}"` (with `{version}` replaced by the actual version string).

All other arguments follow the defaults described in **`@git-merge-to-main`** unless the user explicitly specifies otherwise.
