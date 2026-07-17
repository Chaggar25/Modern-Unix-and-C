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

export function renderDashboard(modules, progress, total, percent) {
  const lines = [
    heading("Modern Unix and C"),
    "A terminal-first systems programming course.",
    "",
    `${badge("progress")} ${progress.completedLessons.length}/${total} lessons complete (${percent}%)`,
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
