# Architecture

Modern Unix and C is now a terminal-first Node.js CLI with no runtime package dependencies.

## Runtime

`bin/modern-unix-c.mjs` is the executable entry point. It parses a small command set: dashboard, lesson, search, complete, bookmark, progress, and help.

## Content loading

Course content lives in `lib/course.mjs` as plain JavaScript objects. This keeps the prototype easy to run and avoids a build step. The module exposes helpers for all lessons, lookup by id/title, and search.

## Rendering

`lib/render.mjs` owns ANSI presentation: headings, badges, dashboard output, lesson output, and search results. Keeping rendering separate from content makes it easier to later replace the terminal renderer or add Markdown files.

## State management

`lib/progress.mjs` stores progress in `~/.modern-unix-c/progress.json` with `schemaVersion: 1`, `completedLessons`, and `bookmarkedLessons`. Malformed or missing progress returns defaults.

## Testing strategy

The project uses Node's built-in `node:test` and `node:assert/strict`, so tests do not require registry downloads. `npm run validate` runs formatting checks, syntax checks, and tests.

## Future content model

If lessons outgrow inline objects, move them to Markdown or JSON files and keep `lib/course.mjs` as the validation/loading boundary.
