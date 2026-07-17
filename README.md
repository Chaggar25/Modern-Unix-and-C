# Modern Unix and C

A beginner-friendly **terminal-based** course app for learning Unix/Linux concepts and modern C together. The goal is to keep version 1 small, dependable, and easy to run in the same environment where the learner practices shell commands and compiles C.

## Why terminal-first?

The previous web direction required Next.js, React, browser tooling, and many npm packages. That made installation fragile in restricted networks. This pivot keeps the product idea but moves the experience into a dependency-free Node CLI so learners can start with:

```bash
npm install
npm run dev
```

No registry packages are required for the current version.

## What the app does

- Shows a presentable ANSI terminal dashboard.
- Lists course modules and projects.
- Opens beginner-friendly lessons by id or title.
- Searches lesson titles, tags, and takeaways.
- Marks lessons complete.
- Toggles bookmarks.
- Saves progress locally in the user's home directory.
- Includes the guided `getc` / `putc` / `err_sys()` warning lesson.
- Uses only built-in Node.js modules.

## Commands

- `npm run dev` or `npm start` — open the dashboard.
- `npm run dev -- lesson 0.1` — read a lesson.
- `npm run dev -- search descriptors` — search lessons.
- `npm run dev -- complete 0.1` — mark a lesson complete.
- `npm run dev -- bookmark guided` — toggle a bookmark.
- `npm run progress` — show saved progress.
- `npm test` — run built-in Node tests.
- `npm run lint` — run syntax checks with `node --check`.
- `npm run format` — normalize simple formatting rules.
- `npm run format:check` — verify formatting.
- `npm run validate` — run format check, syntax checks, and tests.

## Project structure

- `bin/modern-unix-c.mjs` — CLI entry point and command routing.
- `lib/course.mjs` — course modules, lessons, search helpers, and guided lesson content.
- `lib/progress.mjs` — local JSON progress loading, saving, completion, and bookmarks.
- `lib/render.mjs` — ANSI terminal rendering helpers.
- `scripts/format.mjs` — no-dependency formatting gate.
- `test/course.test.mjs` — Node test suite.
- `docs` — requirements, curriculum, architecture, and content style guidance.

## How progress is stored

Progress is stored as JSON at:

```text
~/.modern-unix-c/progress.json
```

The schema is versioned with `schemaVersion: 1`. If the file is missing or malformed, the app falls back to empty progress instead of crashing.

## Adding a module or lesson

Edit `lib/course.mjs`. Keep content original, beginner-friendly, and careful about the difference between ISO C, POSIX, Linux-specific behavior, and shell behavior. Then run:

```bash
npm run validate
```

## Known limitations

- Version 1 is intentionally minimal and terminal-only.
- It currently includes three core modules instead of every future advanced module in executable CLI data.
- Quizzes are represented as lesson takeaways and practice prompts rather than an interactive quiz engine.
- The terminal UI is deliberately simple: ANSI headings, badges, lists, and local progress.

## Roadmap

- Add interactive multiple-choice quizzes in the terminal.
- Expand the CLI data to all 13 planned modules.
- Add lesson files in Markdown for easier editing.
- Add exportable practice C files.
- Add a `reset` command and richer progress summaries.
