import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { animations, animationState, currentFrame, skip, staticFallback, stepBackward, stepForward } from "../lib/animation.mjs";
import { runCodeExercise } from "../lib/checker.mjs";
import { stdinStdoutLesson } from "../lib/exercises.mjs";
import { nextHint, reviewMistakes } from "../lib/hints.mjs";
import { compileC, parseCommand, parseCompilerErrors, runCommand } from "../lib/runner.mjs";
import { compareTyping } from "../lib/typing.mjs";
import { assertInsideWorkspace, readWorkspaceFile, resetWorkspace, workspaceFor, writeWorkspaceFile } from "../lib/workspace.mjs";

test("guided typing comparison identifies exact and code-normalized matches", () => {
  assert.equal(compareTyping("pwd", "pwd").passed, true);
  assert.equal(compareTyping("while ((c = getc(stdin)) != EOF)", "while((c=getc(stdin))!=EOF)", { code: true }).passed, true);
  assert.match(compareTyping("pwd", "pw").feedback, /missing/);
});

test("animation controls support step, back, skip, and static fallback", () => {
  const state = animationState(animations["stdin-flow"]);
  assert.match(currentFrame(state).art, /Keyboard/);
  assert.equal(stepForward(state).index, 1);
  assert.equal(stepBackward(stepForward(state)).index, 0);
  assert.equal(skip(state).index, animations["stdin-flow"].frames.length - 1);
  assert.match(staticFallback(animations["stdin-flow"]), /getc/);
});

test("workspace reset seeds files and path restrictions block escapes", () => {
  const workspace = resetWorkspace(stdinStdoutLesson);
  assert.match(readWorkspaceFile(workspace, "copy.c"), /getc/);
  assert.throws(() => assertInsideWorkspace(workspace, "../escape.txt"), /leaves/);
});

test("safe command runner captures stdout stderr and rejects dangerous commands", () => {
  const workspace = resetWorkspace(stdinStdoutLesson);
  assert.deepEqual(parseCommand("printf hi | cat").map((argv) => argv[0]), ["printf", "cat"]);
  const ok = runCommand("printf 'abc\\n'", workspace);
  assert.equal(ok.stdout, "abc\n");
  assert.equal(ok.exitStatus, 0);
  const rejected = runCommand("rm -rf /", workspace);
  assert.equal(rejected.exitStatus, 126);
  assert.match(rejected.stderr, /rejected/);
});

test("compiler and automated C tests report failures then pass after fix", { skip: !process.env.RUN_C_COMPILER_TESTS && false }, () => {
  const workspace = resetWorkspace(stdinStdoutLesson);
  const compile = compileC(workspace, "copy.c");
  assert.equal(compile.exitStatus, 0, compile.stderr);
  assert.deepEqual(parseCompilerErrors("x.c:1: warning: no\ny.c:2: error: bad").map((item) => item.kind), ["warning", "error"]);
  const first = runCodeExercise(workspace, stdinStdoutLesson.codeExercise);
  assert.equal(first.passed, false);
  const fixed = readWorkspaceFile(workspace, "upper.c").replace("/* TODO: write the uppercase character to stdout. */", stdinStdoutLesson.codeExercise.solutionSnippet);
  writeWorkspaceFile(workspace, "upper.c", fixed);
  const second = runCodeExercise(workspace, stdinStdoutLesson.codeExercise);
  assert.equal(second.passed, true, JSON.stringify(second.tests));
});

test("hint progression and mistake review are deterministic", () => {
  assert.equal(nextHint(stdinStdoutLesson.codeExercise, 0).level, 1);
  assert.equal(nextHint(stdinStdoutLesson.codeExercise, 99).exhausted, true);
  assert.deepEqual(reviewMistakes({ conceptsNeedingReview: ["EOF", "stderr"] }), ["EOF", "stderr"]);
});
