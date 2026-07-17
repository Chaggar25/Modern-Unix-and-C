import { rmSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { homedir } from "node:os";

export const workspaceRoot = join(homedir(), ".modern-unix-c", "workspaces");

export function workspaceFor(lessonId) {
  return join(workspaceRoot, lessonId);
}

export function assertInsideWorkspace(workspace, target) {
  const base = resolve(workspace);
  const resolved = resolve(base, target);
  const rel = relative(base, resolved);
  if (rel.startsWith("..") || resolve(resolved) === resolve(base, "..")) {
    throw new Error(`Path leaves the lesson workspace: ${target}`);
  }
  return resolved;
}

export function resetWorkspace(lesson) {
  const workspace = workspaceFor(lesson.id);
  rmSync(workspace, { recursive: true, force: true });
  mkdirSync(workspace, { recursive: true });
  for (const [name, contents] of Object.entries(lesson.workspaceSeed ?? {})) {
    const path = assertInsideWorkspace(workspace, name);
    mkdirSync(resolve(path, ".."), { recursive: true });
    writeFileSync(path, contents);
  }
  return workspace;
}

export function ensureWorkspace(lesson) {
  const workspace = workspaceFor(lesson.id);
  if (!existsSync(workspace)) return resetWorkspace(lesson);
  return workspace;
}

export function readWorkspaceFile(workspace, file) {
  return readFileSync(assertInsideWorkspace(workspace, file), "utf8");
}

export function writeWorkspaceFile(workspace, file, contents) {
  writeFileSync(assertInsideWorkspace(workspace, file), contents);
}
