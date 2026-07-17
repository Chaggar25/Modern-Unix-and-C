import { spawnSync } from "node:child_process";
import { readWorkspaceFile, writeWorkspaceFile } from "./workspace.mjs";

export function applyEdit(workspace, file, contents) {
  writeWorkspaceFile(workspace, file, contents);
  return readWorkspaceFile(workspace, file);
}

export function openExternalEditor(workspace, file, editor = process.env.EDITOR) {
  if (!editor) return { opened: false, reason: "EDITOR is not set." };
  const result = spawnSync(editor, [file], { cwd: workspace, stdio: "inherit" });
  return { opened: result.status === 0, exitStatus: result.status ?? 1 };
}
