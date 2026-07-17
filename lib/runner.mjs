import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { assertInsideWorkspace } from "./workspace.mjs";
import { cFlags } from "./exercises.mjs";

const allowed = new Set(["pwd", "ls", "cat", "head", "tail", "grep", "find", "mkdir", "touch", "cp", "mv", "rm", "chmod", "printf", "./copy", "./upper"]);
const blocked = [/\brm\s+(-[^\n]*[rf]|-[^\n]*[fr])\b/, /\.\./, /^\s*cd\s+\//, /[;&`$(){}]/];

export function parseCommand(command) {
  return command.split("|").map((part) => part.trim().split(/\s+/).filter(Boolean));
}

export function validateCommand(command, workspace) {
  if (!command.trim()) return { ok: false, reason: "Empty command." };
  for (const pattern of blocked) {
    if (pattern.test(command)) return { ok: false, reason: "Command rejected by sandbox safety rules." };
  }
  const commands = parseCommand(command);
  for (const argv of commands) {
    if (!allowed.has(argv[0])) return { ok: false, reason: `Command not allowed in beginner sandbox: ${argv[0]}` };
    for (const arg of argv.slice(1)) {
      if (arg.startsWith("/") || arg.includes("..")) return { ok: false, reason: `Path leaves workspace: ${arg}` };
      if (/^[\w./-]+$/.test(arg) && !arg.startsWith("-") && !arg.includes("\\")) assertInsideWorkspace(workspace, arg);
    }
  }
  return { ok: true, reason: "Command accepted." };
}

export function runCommand(command, workspace, { input = "" } = {}) {
  const validation = validateCommand(command, workspace);
  if (!validation.ok) return { command, stdout: "", stderr: validation.reason, exitStatus: 126, validation };
  const result = spawnSync("/bin/sh", ["-c", command], { cwd: workspace, input, encoding: "utf8", timeout: 5000 });
  return { command, stdout: result.stdout ?? "", stderr: result.stderr ?? "", exitStatus: result.status ?? 1, validation };
}

export function compilerCommand(source, output = basename(source, ".c")) {
  return [detectCompiler(), ...cFlags, source, "-o", output];
}

export function detectCompiler() {
  for (const cc of ["cc", "gcc", "clang"]) {
    const found = spawnSync("/bin/sh", ["-c", `command -v ${cc}`], { encoding: "utf8" });
    if (found.status === 0) return cc;
  }
  return "cc";
}

export function compileC(workspace, source, output = basename(source, ".c"), extraFlags = []) {
  assertInsideWorkspace(workspace, source);
  const argv = [detectCompiler(), ...cFlags, ...extraFlags, source, "-o", output];
  const result = spawnSync(argv[0], argv.slice(1), { cwd: workspace, encoding: "utf8", timeout: 10000 });
  return { command: argv.join(" "), stdout: result.stdout ?? "", stderr: result.stderr ?? "", exitStatus: result.status ?? 1, output, compilerAvailable: existsSync(`/usr/bin/${argv[0]}`) || argv[0] === "cc" };
}

export function runProgram(workspace, executable, input = "") {
  const result = spawnSync(`./${executable}`, [], { cwd: workspace, input, encoding: "utf8", timeout: 5000 });
  return { command: `./${executable}`, stdout: result.stdout ?? "", stderr: result.stderr ?? "", exitStatus: result.status ?? 1 };
}

export function parseCompilerErrors(stderr) {
  return stderr.split("\n").filter((line) => /error:|warning:/.test(line)).map((line) => ({ line, kind: line.includes("warning:") ? "warning" : "error" }));
}
