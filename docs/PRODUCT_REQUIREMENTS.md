# Product requirements

## Product direction

Version 1 is a terminal-based learning app rather than a web application. The learner studies Unix and C inside the same terminal environment where they run commands and compile examples.

## Users

Beginners with some C exposure who use Unix-like systems at work and want one concept at a time.

## User stories

- As a learner, I can open a dashboard in my terminal.
- As a learner, I can search for concepts such as file descriptors, stdin, or warnings.
- As a learner, I can open a lesson by id or title.
- As a learner, I can mark a lesson complete and see progress later.
- As a learner, I can bookmark a lesson for review.
- As a learner, I can run the app in restricted environments without downloading large web dependencies.

## Functional requirements

- CLI dashboard.
- Lesson lookup.
- Search.
- Completion tracking.
- Bookmark tracking.
- Local JSON progress.
- Guided lesson for the `err_sys()` warning scenario.

## Nonfunctional requirements

- No runtime npm dependencies in version 1.
- Works with Node.js 20 or newer.
- No network, account, database, browser, or build step required.
- Recover gracefully from malformed progress files.

## Accessibility and usability

The terminal output should use clear headings, short lines, bullet lists, and text labels rather than relying on color alone.

## Definition of done

`npm install`, `npm run dev`, and `npm run validate` work in an environment with Node.js 20+.
