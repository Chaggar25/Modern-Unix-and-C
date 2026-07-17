import { loadProgress, saveProgress } from "./progress.mjs";

export function nextHint(exercise, used = 0) {
  const index = Math.min(used, exercise.hints.length - 1);
  return { level: index + 1, text: exercise.hints[index], exhausted: index === exercise.hints.length - 1 };
}

export function recordAttempt(lessonId, exerciseId, attempt, progress = loadProgress()) {
  progress.exerciseAttempts ??= [];
  progress.conceptsNeedingReview ??= [];
  progress.exerciseAttempts.push({ lessonId, exerciseId, at: new Date().toISOString(), ...attempt });
  if (!attempt.passed && attempt.concept && !progress.conceptsNeedingReview.includes(attempt.concept)) {
    progress.conceptsNeedingReview.push(attempt.concept);
  }
  saveProgress(progress);
  return progress;
}

export function reviewMistakes(progress = loadProgress()) {
  return (progress.conceptsNeedingReview ?? []).slice(0, 5);
}
