# Modern Unix and C

A beginner-friendly **terminal-based, hands-on** course app for learning Unix/Linux concepts and modern C together. The main experience is not multiple-choice quizzes: learners type commands, edit C files, predict behavior, run programs, debug failures, and verify their work inside a safe lesson workspace.

## Why terminal-first?

The learner is studying Unix, C, standard streams, files, compilers, and process behavior. A terminal-first app keeps practice in the same environment where those concepts actually live. Version 1 has no runtime npm dependencies, so restricted networks can still run it.

```bash
npm install
npm run dev
```

## Core learning loop

Hands-on labs follow this rhythm:

1. **WATCH** an ASCII animation.
2. **FOLLOW ALONG** by typing a command or C statement.
3. **TRY WITH GUIDANCE** by completing a starter file.
4. **DO IT YOURSELF** from requirements.
5. **DEBUG** broken code or an incorrect command.
6. **EXPLAIN** by predicting output.
7. **VERIFY** with automated checks.
8. **REVIEW** with flashcards and mistake tracking.


## Performance over recognition

Important concepts require production activities. A learner must produce answers such as commands, predictions, explanations, traces, code edits, debug explanations, compiled programs, and passing tests. Multiple-choice questions may be added later only as short supporting checks; they are not sufficient to complete a technical lab.

The stdin/stdout/EOF lab currently gates completion on required production activities including command typing, writing a command from a goal, predicting output, typing a C statement, completing C code, debugging `char c`, debugging undeclared `err_sys()`, explaining the `getc` loop, tracing `c`, compiling/running, and passing automated tests.

## Implemented vertical slice

The complete working lab is:

```bash
npm run dev -- lab stdin
```

It includes:

- an animated stdin/stdout explanation;
- guided shell typing for a pipe command;
- guided C typing for `while ((c = getc(stdin)) != EOF)`;
- a seeded workspace at `~/.modern-unix-c/workspaces/stdin-stdout-eof-lab/`;
- strict C compilation;
- captured compiler stdout/stderr and exit status;
- captured program stdout/stderr and exit status;
- sandboxed command execution;
- an editable `upper.c` exercise;
- automated behavior tests;
- layered hints;
- debugging prompts for `char c` and undeclared `err_sys()`;
- flashcards;
- saved progress, attempts, mastered commands, and review concepts.

## Practice modes

The dashboard lists:

- Guided Lessons
- Command Practice
- C Typing Practice
- Coding Challenges
- Debugging Lab
- Output Prediction
- Flashcards
- Projects
- Review Mistakes

## Commands

- `npm run dev` or `npm start` — open the dashboard.
- `npm run dev -- modes` — list practice modes.
- `npm run dev -- lab stdin` — open the stdin/stdout/EOF lab.
- `npm run dev -- lab stdin reset` — reset the lesson workspace.
- `npm run dev -- lab stdin animate` — play the ASCII animation frames.
- `npm run dev -- lab stdin animate --static` — show reduced-motion fallback.
- `npm run dev -- lab stdin type command "printf 'abc\\n' | ./copy"` — check guided shell typing.
- `npm run dev -- lab stdin type code "while((c=getc(stdin))!=EOF)"` — check whitespace-tolerant C typing.
- `npm run dev -- lab stdin predict "abc"` — answer an output prediction prompt.
- `npm run dev -- lab stdin explain "getc reads, assigns to c, compares with EOF, loop repeats"` — explain a line in plain English.
- `npm run dev -- lab stdin trace "read c compare EOF"` — trace a variable through the loop.
- `npm run dev -- lab stdin debug char "use int c for EOF"` — produce a debug explanation for `char c`.
- `npm run dev -- lab stdin debug err_sys "err_sys is not standard, use perror"` — produce a debug explanation for `err_sys()`.
- `npm run dev -- lab stdin answer explain-stderr "stderr carries diagnostics so stdout stays clean"` — submit any production answer by id.
- `npm run dev -- lab stdin coverage` — show production coverage and completion gate status.
- `npm run dev -- lab stdin compile copy.c` — compile with strict warnings.
- `npm run dev -- lab stdin run copy abc` — run a compiled program with stdin.
- `npm run dev -- lab stdin command "printf 'abc\\n' | ./copy"` — run a sandboxed command.
- `npm run dev -- lab stdin test upper` — run automated tests for `upper.c`.
- `npm run dev -- lab stdin solve upper` — apply the guided uppercase solution for the vertical slice.
- `npm run dev -- lab stdin hint upper 0` — request a layered hint.
- `npm run dev -- lab stdin flashcards` — review generated flashcards.
- `npm run dev -- edit stdin upper.c "..."` — replace a workspace file from the CLI.
- `npm run dev -- external-editor stdin upper.c` — open a workspace file in `$EDITOR`.
- `npm run dev -- review-mistakes` — show concepts needing review.
- `npm test` — run built-in Node tests.
- `npm run validate` — run format check, syntax checks, and tests.

## Safety restrictions

Beginner shell commands run inside the lesson workspace. The safe runner:

- rejects empty commands;
- allows only a small command set;
- rejects broad `rm -rf` patterns;
- rejects absolute paths and `..` path traversal;
- rejects shell metacharacters outside the supported pipe flow;
- displays the command before execution;
- captures stdout, stderr, and exit status separately.

## Project structure

- `bin/modern-unix-c.mjs` — CLI entry point and command routing.
- `lib/exercises.mjs` — hands-on lab and exercise definitions.
- `lib/workspace.mjs` — workspace manager.
- `lib/runner.mjs` — safe command, compiler, and process runners.
- `lib/checker.mjs` — automated checks and layered feedback records.
- `lib/typing.mjs` — guided typing comparison.
- `lib/animation.mjs` — reusable ASCII animation engine.
- `lib/hints.mjs` — hint progression, attempts, and mistake review.
- `lib/editor.mjs` — file replacement and external editor integration.
- `lib/progress.mjs` — versioned local progress.
- `test/*.mjs` — no-dependency Node tests.

## Progress storage

Progress is stored as JSON at:

```text
~/.modern-unix-c/progress.json
```

The schema remains `schemaVersion: 1` and is backward-compatible with earlier `completedLessons` and `bookmarkedLessons` data. New fields track exercise attempts, commands mastered, exercises completed, and concepts needing review.

## What remains

- A true full-screen multiline editor; current support is file replacement plus `$EDITOR` integration.
- More labs for filesystem navigation, permissions, processes, and later POSIX APIs.
- Interactive prompts that pause for learner input inside a single session; current commands are scriptable and testable.
- Optional timed fluency mode for already-mastered commands.
