const ansi = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
};

export function heading(text) {
  return `${ansi.bold}${ansi.cyan}${text}${ansi.reset}`;
}

export function badge(text) {
  return `${ansi.yellow}[${text}]${ansi.reset}`;
}

export function renderDashboard(modules, progress, total, percent, modes = []) {
  const lines = [
    heading("Modern Unix and C"),
    "A terminal-first systems programming course.",
    "",
    `${badge("progress")} ${progress.completedLessons.length}/${total} lessons complete (${percent}%)`,
    "",
    heading("Practice modes"),
    ...(modes.length ? modes.map((mode) => `  • ${mode}`) : ["  • Guided Lessons", "  • Command Practice", "  • C Typing Practice"]),
    "",
    heading("Modules"),
  ];
  for (const module of modules) {
    lines.push(`  ${module.id}  ${module.title}  ${ansi.dim}Project: ${module.project}${ansi.reset}`);
  }
  lines.push("", "Try: npm run dev -- lesson 0.1", "Try: npm run dev -- search descriptors");
  return lines.join("\n");
}

export function renderLesson(item, progress) {
  const done = progress.completedLessons.includes(item.id) ? "complete" : "not complete";
  const lines = [
    heading(`${item.id} ${item.title}`),
    `${badge(done)} ${badge(`${item.minutes} min`)} ${badge(item.module.title)}`,
    "",
    heading("Plain-English takeaways"),
    ...item.takeaways.map((takeaway) => `  • ${takeaway}`),
    "",
    heading("Why this matters"),
    "  Systems programmers must know which layer they are using: shell syntax, ISO C, POSIX APIs, or Linux-specific behavior.",
    "",
    heading("Tiny diagram"),
    "  keyboard/file -> stdin -> program -> stdout/stderr -> terminal/file/pipe",
    "",
    heading("Try it"),
    "  cc -Wall -Wextra -Wpedantic -Wconversion example.c -o example",
    "  printf 'abc\\n' | ./example",
  ];
  if (item.code) {
    lines.push("", heading("Standard C rewrite"), item.code);
  }
  lines.push("", `${ansi.green}Commands:${ansi.reset} complete ${item.id} | bookmark ${item.id} | search <term>`);
  return lines.join("\n");
}

export function renderSearch(results) {
  if (results.length === 0) return "No lessons matched. Try: descriptors, stdin, warnings, kernel.";
  return [heading("Search results"), ...results.map(({ id, title, module }) => `  ${id.padEnd(6)} ${title} ${ansi.dim}(${module.title})${ansi.reset}`)].join("\n");
}


export function renderLabOverview(lesson, workspace) {
  return [
    heading(lesson.title),
    `${badge("hands-on lab")} Workspace: ${workspace}`,
    "",
    heading("Learning loop"),
    "  1. WATCH an ASCII stdin animation",
    "  2. FOLLOW ALONG by typing a shell command and C loop",
    "  3. TRY WITH GUIDANCE by completing upper.c",
    "  4. DEBUG char c and undeclared err_sys examples",
    "  5. VERIFY with compiler output, program output, and tests",
    "  6. REVIEW with flashcards and mistake tracking",
    "",
    heading("Try these commands"),
    "  npm run dev -- lab stdin animate",
    "  npm run dev -- lab stdin compile copy.c",
    `  npm run dev -- lab stdin command "printf 'abc\\n' | ./copy"`,
    "  npm run dev -- lab stdin test upper",
  ].join("\n");
}

export function renderCheckResults(results) {
  return [
    heading("Automated checks"),
    ...results.map((item) => {
      const status = item.pass ? "PASS" : "FAIL";
      return `${badge(status)} ${item.name}\n  Expected: ${item.expected}\n  Occurred: ${item.actual}\n  Review: ${item.concept}\n  Next action: ${item.nextAction}`;
    }),
  ].join("\n");
}
