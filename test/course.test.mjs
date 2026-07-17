import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { allLessons, findLesson, modules, searchLessons } from "../lib/course.mjs";
import { completionPercent, defaultProgress, loadProgress, markComplete, saveProgress, toggleBookmark } from "../lib/progress.mjs";

test("course includes the terminal-first starting roadmap", () => {
  assert.equal(modules.length, 3);
  assert.ok(allLessons().length >= 28);
  assert.equal(findLesson("0.1").module.title, "Terminal and Linux Foundations");
});

test("search finds file descriptors", () => {
  const results = searchLessons("file descriptors");
  assert.ok(results.some((item) => item.id === "2.4"));
});

test("progress survives save/load and corrupt files recover", () => {
  const dir = mkdtempSync(join(tmpdir(), "modern-unix-c-"));
  const path = join(dir, "progress.json");
  const progress = toggleBookmark("0.1", markComplete("0.1", { schemaVersion: 1, completedLessons: [], bookmarkedLessons: [] }));
  saveProgress(progress, path);
  assert.deepEqual(loadProgress(path).completedLessons, ["0.1"]);
  assert.equal(completionPercent(loadProgress(path), 4), 25);
  rmSync(dir, { recursive: true, force: true });
  assert.deepEqual(loadProgress(path), defaultProgress);
});
