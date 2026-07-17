import { compileC, runProgram } from "./runner.mjs";
import { readWorkspaceFile } from "./workspace.mjs";

export function result(pass, name, expected, actual, concept, nextAction) {
  return { pass, name, expected, actual, concept, nextAction };
}

export function evaluateCommandExercise(exercise, runResult) {
  const pass = runResult.exitStatus === 0 && runResult.stdout === "abc\n";
  return result(
    pass,
    exercise.id,
    "exit status 0 and stdout abc\\n",
    `exit ${runResult.exitStatus}, stdout ${JSON.stringify(runResult.stdout)}, stderr ${JSON.stringify(runResult.stderr)}`,
    "Pipes connect one program's stdout to another program's stdin.",
    pass ? "Move to the C typing exercise." : "Run: printf 'abc\\n' | ./copy",
  );
}

export function runCodeExercise(workspace, exercise) {
  const compile = compileC(workspace, exercise.file, "upper");
  const tests = [];
  if (compile.exitStatus !== 0) {
    tests.push(result(false, "compile", "warning-clean compilation", compile.stderr, "Compiler diagnostics", "Read the first compiler diagnostic, then request a hint."));
    return { compile, tests, passed: false };
  }
  for (const test of exercise.tests) {
    const program = runProgram(workspace, "upper", test.input);
    const pass = program.stdout === test.expectedStdout && program.exitStatus === test.expectedExitStatus;
    tests.push(result(pass, test.name, `stdout ${JSON.stringify(test.expectedStdout)} and exit ${test.expectedExitStatus}`, `stdout ${JSON.stringify(program.stdout)} stderr ${JSON.stringify(program.stderr)} exit ${program.exitStatus}`, "stdin/stdout byte flow", pass ? "Good. Try the next test." : "Focus on converting each input character before putc."));
  }
  return { compile, tests, passed: tests.every((item) => item.pass) };
}

export function sourceContains(workspace, file, text) {
  return readWorkspaceFile(workspace, file).includes(text);
}
