import assert from "node:assert/strict";
import test from "node:test";
import { stdinStdoutLesson } from "../lib/exercises.mjs";
import { completionGate, evaluateProductionAnswer, productionCoverage, requiredActivityIds } from "../lib/production.mjs";

test("stdin lab has production activity coverage for important concepts", () => {
  const coverage = productionCoverage(stdinStdoutLesson);
  assert.equal(coverage.passed, true, JSON.stringify(coverage));
  assert.ok(requiredActivityIds(stdinStdoutLesson).includes("explain-getc-line"));
  assert.ok(requiredActivityIds(stdinStdoutLesson).includes("trace-c-variable"));
});

test("production answers require learner-generated terms", () => {
  const activity = stdinStdoutLesson.productionActivities.find((item) => item.id === "explain-getc-line");
  assert.equal(evaluateProductionAnswer(activity, "getc reads, assigns to c, compares with EOF, then the loop repeats").passed, true);
  const failed = evaluateProductionAnswer(activity, "it works");
  assert.equal(failed.passed, false);
  assert.ok(failed.missing.includes("getc"));
});

test("completion gate prevents guessing-only module completion", () => {
  const missing = completionGate(stdinStdoutLesson, { exercisesCompleted: [] });
  assert.equal(missing.passed, false);
  const complete = completionGate(stdinStdoutLesson, { exercisesCompleted: requiredActivityIds(stdinStdoutLesson) });
  assert.equal(complete.passed, true);
});
