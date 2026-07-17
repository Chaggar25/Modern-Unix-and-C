import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

export const progressPath = join(homedir(), ".modern-unix-c", "progress.json");
export const defaultProgress = { schemaVersion: 1, completedLessons: [], bookmarkedLessons: [], exerciseAttempts: [], conceptsNeedingReview: [], commandsMastered: [], exercisesCompleted: [], lastLesson: null };

export function loadProgress(path = progressPath) {
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    if (
      parsed &&
      parsed.schemaVersion === 1 &&
      Array.isArray(parsed.completedLessons) &&
      Array.isArray(parsed.bookmarkedLessons)
    ) {
      return { ...defaultProgress, ...parsed };
    }
  } catch {
    // Missing or malformed progress should never stop learning.
  }
  return { ...defaultProgress };
}

export function saveProgress(progress, path = progressPath) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(progress, null, 2)}\n`);
}

export function markComplete(id, progress = loadProgress()) {
  if (!progress.completedLessons.includes(id)) {
    progress.completedLessons.push(id);
  }
  progress.lastLesson = id;
  return progress;
}

export function markExerciseComplete(id, progress = loadProgress()) {
  progress.exercisesCompleted ??= [];
  if (!progress.exercisesCompleted.includes(id)) progress.exercisesCompleted.push(id);
  return progress;
}

export function markProductionActivity(id, progress = loadProgress()) {
  return markExerciseComplete(id, progress);
}

export function markCommandMastered(command, progress = loadProgress()) {
  progress.commandsMastered ??= [];
  if (!progress.commandsMastered.includes(command)) progress.commandsMastered.push(command);
  return progress;
}

export function toggleBookmark(id, progress = loadProgress()) {
  progress.bookmarkedLessons = progress.bookmarkedLessons.includes(id)
    ? progress.bookmarkedLessons.filter((item) => item !== id)
    : [...progress.bookmarkedLessons, id];
  return progress;
}

export function completionPercent(progress, totalLessons) {
  if (totalLessons === 0) return 0;
  return Math.round((new Set(progress.completedLessons).size / totalLessons) * 100);
}
