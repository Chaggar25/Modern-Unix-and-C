# Architecture

Modern Unix and C is a terminal-first Node.js CLI with no runtime package dependencies. The application is organized around hands-on labs instead of long reading pages or multiple-choice-first lessons.

## Runtime

`bin/modern-unix-c.mjs` is the executable entry point. It parses dashboard, modes, lesson, lab, edit, external-editor, search, complete, bookmark, progress, and review-mistakes commands.

## Data-driven content

`lib/course.mjs` contains short course metadata. `lib/exercises.mjs` contains the hands-on stdin/stdout/EOF lab definition, including workspace seed files, guided typing prompts, command exercises, code exercises, debugging prompts, hints, tests, and flashcards. Runtime logic does not hardcode the lesson body.

## Well-defined structures

Version 1 uses documented JavaScript object shapes rather than TypeScript types:

- `Exercise`: shared id, kind, prompt, hints, and checks.
- `CommandExercise`: command prompt plus expected behavior.
- `CodeExercise`: source file, tests, hints, and solution snippet.
- `ExerciseAttempt`: lesson id, exercise id, pass/fail, concept, and timestamp saved in progress.
- `TestCase`: name, stdin input, expected stdout, and expected exit status.
- `TestResult`: pass flag, expected, actual, concept to review, and next action.
- `Hint`: ordered level and text.
- `Animation`: id, title, and frames.
- `AnimationFrame`: caption and ASCII art.
- `LessonWorkspace`: `~/.modern-unix-c/workspaces/<lesson-id>/`.
- `LearnerSkillProgress`: completed exercises, commands mastered, concepts needing review, and attempts.

## Workspace manager

`lib/workspace.mjs` creates, resets, seeds, reads, and writes isolated lesson workspaces. It rejects paths that leave the workspace.

## Safe command runner

`lib/runner.mjs` parses shell commands, allows a small beginner command set, rejects dangerous patterns such as broad `rm -rf`, rejects absolute paths and `..`, runs accepted commands inside the workspace, and captures stdout, stderr, and exit status separately.

## Compiler and process runners

`lib/runner.mjs` also compiles C with `-std=c17 -Wall -Wextra -Wpedantic -Wconversion -Wshadow -Wformat=2`, runs compiled programs with captured stdin/stdout/stderr/status, and parses compiler warnings/errors.

## Production-first completion

`lib/production.mjs` defines required production activity kinds, evaluates learner-produced text answers, checks whether every important concept has a production activity, and gates lab completion on required activities. This prevents a learner from completing a technical module by guessing recognition questions alone.

## Test runner and layered feedback

`lib/checker.mjs` evaluates command and code exercises by behavior, not by exact source formatting. Failed checks state what was expected, what occurred, what concept to review, and one next action.

## Hint engine and attempt history

`lib/hints.mjs` returns progressively stronger hints, records attempts, tracks concepts needing review, and powers Review Mistakes.

## ASCII animation engine

`lib/animation.mjs` defines reusable animation state with frames, captions, step forward, step backward, replay, skip, reduced-motion initialization, and static fallback.

## Editor integration

`lib/editor.mjs` supports replacing a workspace file from the CLI and opening files in the learner's configured external editor with `$EDITOR`.

## Testing strategy

The project uses Node's built-in `node:test` and `node:assert/strict`. Tests cover guided typing comparison, whitespace-tolerant code checking, command parsing, workspace path restrictions, dangerous-command rejection, output/status capture, compiler diagnostics, automated C tests, hint progression, animation controls, reduced-motion/static fallback, persistence helpers, review selection, and workspace reset.
