export const requiredProductionActivityKinds = new Set([
  "type-command",
  "write-command-from-goal",
  "predict-output",
  "type-c-statement",
  "complete-c-code",
  "debug-program",
  "explain-line",
  "trace-variable",
  "compile-run",
  "automated-tests",
]);

export function normalizeText(text) {
  return text.toLowerCase().replace(/[^a-z0-9_$?]+/g, " ").trim();
}

export function evaluateProductionAnswer(activity, answer) {
  const normalized = normalizeText(answer);
  const missing = (activity.requiredTerms ?? []).filter((term) => !normalized.includes(normalizeText(term)));
  return {
    passed: missing.length === 0,
    activityId: activity.id,
    kind: activity.kind,
    concept: activity.concept,
    expected: activity.expected,
    actual: answer,
    missing,
    feedback: missing.length === 0 ? "Production answer accepted." : `Add or clarify: ${missing.join(", ")}.`,
  };
}

export function productionCoverage(lesson) {
  const activities = lesson.productionActivities ?? [];
  const kinds = new Set(activities.map((activity) => activity.kind));
  const missingKinds = [...requiredProductionActivityKinds].filter((kind) => !kinds.has(kind));
  const conceptsWithoutProduction = (lesson.importantConcepts ?? []).filter(
    (concept) => !activities.some((activity) => activity.concept === concept),
  );
  return {
    passed: missingKinds.length === 0 && conceptsWithoutProduction.length === 0,
    missingKinds,
    conceptsWithoutProduction,
    activityCount: activities.length,
  };
}

export function requiredActivityIds(lesson) {
  return (lesson.productionActivities ?? []).filter((activity) => activity.requiredForCompletion !== false).map((activity) => activity.id);
}

export function completionGate(lesson, progress) {
  const completed = new Set(progress.exercisesCompleted ?? []);
  const missing = requiredActivityIds(lesson).filter((id) => !completed.has(id));
  return { passed: missing.length === 0, missing };
}
