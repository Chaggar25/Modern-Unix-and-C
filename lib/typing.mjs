export function normalizeCode(text) {
  return text.trim().replace(/[ \t]+/g, " ").replace(/\s*([(){};,!=+\-*/<>])\s*/g, "$1");
}

export function compareTyping(expected, actual, { code = false } = {}) {
  const left = code ? normalizeCode(expected) : expected;
  const right = code ? normalizeCode(actual) : actual;
  if (left === right) return { passed: true, feedback: "Matched." };
  let index = 0;
  while (index < left.length && index < right.length && left[index] === right[index]) index += 1;
  const expectedChar = left[index] ?? "<end>";
  const actualChar = right[index] ?? "<end>";
  const problems = [];
  if (right.length < left.length) problems.push("missing characters");
  if (right.length > left.length) problems.push("extra characters");
  if (expectedChar.toLowerCase() === actualChar.toLowerCase() && expectedChar !== actualChar) problems.push("incorrect capitalization");
  if ("();{}".includes(expectedChar)) problems.push("missing or incorrect punctuation");
  return { passed: false, index, expectedChar, actualChar, feedback: `Check position ${index + 1}: expected ${expectedChar}, saw ${actualChar}. Possible issue: ${problems.join(", ") || "different text"}.` };
}
