#!/usr/bin/env node
import { modules, allLessons, findLesson, searchLessons } from "../lib/course.mjs";
import { stdinStdoutLesson, practiceModes } from "../lib/exercises.mjs";
import { animations, animationState, currentFrame, stepForward, stepBackward, skip, staticFallback } from "../lib/animation.mjs";
import { compareTyping } from "../lib/typing.mjs";
import { compileC, runCommand, runProgram, parseCompilerErrors } from "../lib/runner.mjs";
import { runCodeExercise, evaluateCommandExercise } from "../lib/checker.mjs";
import { completionGate, evaluateProductionAnswer, productionCoverage } from "../lib/production.mjs";
import { nextHint, recordAttempt, reviewMistakes } from "../lib/hints.mjs";
import { applyEdit, openExternalEditor } from "../lib/editor.mjs";
import { ensureWorkspace, resetWorkspace, readWorkspaceFile } from "../lib/workspace.mjs";
import {
  completionPercent,
  loadProgress,
  markComplete,
  saveProgress,
  toggleBookmark,
  markExerciseComplete,
  markCommandMastered,
  markProductionActivity,
} from "../lib/progress.mjs";
import { renderDashboard, renderLesson, renderSearch, renderLabOverview, renderCheckResults } from "../lib/render.mjs";

const [command = "dashboard", ...args] = process.argv.slice(2);
const progress = loadProgress();

function help() {
  console.log(`Modern Unix and C\n\nCommands:\n  dashboard                         Show modules, modes, and progress\n  modes                             List practice modes\n  lesson <id-or-title>               Read a short lesson\n  lab stdin                          Open the stdin/stdout/EOF hands-on lab\n  lab stdin reset                    Reset the lab workspace\n  lab stdin animate [--static]       Watch or render the stdin animation\n  lab stdin type command <text>      Check guided shell typing\n  lab stdin type code <text>         Check guided C typing\n  lab stdin predict <answer>         Produce an output prediction\n  lab stdin explain <answer>         Explain the getc loop in your own words\n  lab stdin trace <answer>           Trace c through getc/EOF evaluation\n  lab stdin debug char <answer>      Explain the char c bug\n  lab stdin debug err_sys <answer>   Explain the undeclared err_sys bug\n  lab stdin answer <activity-id> <text>  Submit any production answer\n  lab stdin coverage                 Show production-activity coverage\n  lab stdin compile copy.c           Compile C with strict warnings\n  lab stdin run copy <input>         Run a compiled program with stdin\n  lab stdin command <command>        Run a sandboxed command\n  lab stdin test upper               Run automated tests for upper.c\n  lab stdin solve upper              Apply the guided uppercase solution\n  lab stdin hint upper [used]        Show layered hint\n  lab stdin flashcards               Print review flashcards\n  edit stdin upper.c <text>          Replace a workspace file\n  external-editor stdin upper.c      Open file in $EDITOR\n  search <term>                      Search lessons\n  complete <id>                      Mark a lesson complete\n  bookmark <id>                      Toggle a bookmark\n  progress                           Show saved progress\n  review-mistakes                    Show concepts needing review`);
}

function stdinLab(subcommand, rest) {
  const lesson = stdinStdoutLesson;
  const workspace = ensureWorkspace(lesson);
  switch (subcommand ?? "overview") {
    case "overview":
      console.log(renderLabOverview(lesson, workspace));
      break;
    case "reset":
      console.log(`Reset workspace: ${resetWorkspace(lesson)}`);
      break;
    case "animate": {
      const animation = animations[lesson.animationId];
      if (rest.includes("--static") || rest.includes("--reduced-motion")) {
        console.log(staticFallback(animation));
      } else {
        let state = animationState(animation);
        for (let i = 0; i < animation.frames.length; i += 1) {
          const frame = currentFrame(state);
          console.log(`Frame ${state.index + 1}/${animation.frames.length}: ${frame.caption}\n${frame.art}\n`);
          state = stepForward(state);
        }
      }
      break;
    }
    case "type": {
      const [kind, ...typedParts] = rest;
      const typed = typedParts.join(" ");
      const expected = kind === "code" ? lesson.typing.codeChunk : lesson.typing.command;
      const comparison = compareTyping(expected, typed, { code: kind === "code" });
      console.log(JSON.stringify(comparison, null, 2));
      if (comparison.passed) {
        markProductionActivity(kind === "code" ? "type-getc-loop" : "pipe-copy", progress);
        saveProgress(progress);
      }
      break;
    }
    case "compile": {
      const source = rest[0] ?? "copy.c";
      const result = compileC(workspace, source);
      console.log(`Compiler command: ${result.command}`);
      console.log(`Compiler stdout:\n${result.stdout || "<empty>"}`);
      console.log(`Compiler stderr:\n${result.stderr || "<empty>"}`);
      console.log(`Exit status: ${result.exitStatus}`);
      if (result.stderr) console.log(`Diagnostics: ${JSON.stringify(parseCompilerErrors(result.stderr), null, 2)}`);
      if (result.exitStatus === 0) {
        markProductionActivity("compile-copy", progress);
        saveProgress(progress);
      }
      break;
    }
    case "run": {
      const [program = "copy", ...inputParts] = rest;
      const result = runProgram(workspace, program, `${inputParts.join(" ")}\n`);
      console.log(`Program command: ${result.command}`);
      console.log(`Program stdout:\n${result.stdout || "<empty>"}`);
      console.log(`Program stderr:\n${result.stderr || "<empty>"}`);
      console.log(`Exit status: ${result.exitStatus}`);
      break;
    }
    case "command": {
      const shellCommand = rest.join(" ");
      console.log(`Sandbox workspace: ${workspace}`);
      console.log(`About to run: ${shellCommand}`);
      const result = runCommand(shellCommand, workspace);
      console.log(`stdout:\n${result.stdout || "<empty>"}`);
      console.log(`stderr:\n${result.stderr || "<empty>"}`);
      console.log(`exit status: ${result.exitStatus}`);
      const check = evaluateCommandExercise(lesson.commandExercise, result);
      console.log(renderCheckResults([check]));
      if (check.pass) {
        markCommandMastered(shellCommand, progress);
        markExerciseComplete(lesson.commandExercise.id, progress);
        markProductionActivity("command-from-goal", progress);
        saveProgress(progress);
      } else {
        recordAttempt(lesson.id, lesson.commandExercise.id, { passed: false, concept: check.concept });
      }
      break;
    }
    case "test": {
      const target = rest[0] ?? "upper";
      if (target !== "upper") {
        console.error("Only upper is available in this vertical slice.");
        process.exitCode = 1;
        break;
      }
      const result = runCodeExercise(workspace, lesson.codeExercise);
      console.log(`Compiler command: ${result.compile.command}`);
      console.log(`Compiler stderr:\n${result.compile.stderr || "<empty>"}`);
      console.log(renderCheckResults(result.tests));
      recordAttempt(lesson.id, lesson.codeExercise.id, { passed: result.passed, concept: "stdin/stdout byte flow" });
      if (result.passed) {
        markExerciseComplete(lesson.codeExercise.id, progress);
        markProductionActivity("upper-tests", progress);
        saveProgress(progress);
      }
      break;
    }
    case "solve": {
      if ((rest[0] ?? "upper") !== "upper") {
        console.error("Only upper is available in this vertical slice.");
        process.exitCode = 1;
        break;
      }
      const current = readWorkspaceFile(workspace, lesson.codeExercise.file);
      applyEdit(workspace, lesson.codeExercise.file, current.replace("/* TODO: write the uppercase character to stdout. */", lesson.codeExercise.solutionSnippet));
      console.log("Applied the guided uppercase solution to upper.c.");
      break;
    }
    case "predict":
    case "explain":
    case "trace": {
      const idByCommand = { predict: "predict-copy-output", explain: "explain-getc-line", trace: "trace-c-variable" };
      const activity = lesson.productionActivities.find((item) => item.id === idByCommand[subcommand]);
      const answer = rest.join(" ");
      const evaluated = evaluateProductionAnswer(activity, answer);
      console.log(JSON.stringify(evaluated, null, 2));
      if (evaluated.passed) {
        markProductionActivity(activity.id, progress);
        saveProgress(progress);
      } else {
        recordAttempt(lesson.id, activity.id, { passed: false, concept: activity.concept });
      }
      break;
    }
    case "debug": {
      const debugKind = rest[0];
      const id = debugKind === "char" ? "char-c-debug" : "err-sys-debug";
      const activity = lesson.productionActivities.find((item) => item.id === id);
      const evaluated = evaluateProductionAnswer(activity, rest.slice(1).join(" "));
      console.log(JSON.stringify(evaluated, null, 2));
      if (evaluated.passed) {
        markProductionActivity(activity.id, progress);
        saveProgress(progress);
      } else {
        recordAttempt(lesson.id, activity.id, { passed: false, concept: activity.concept });
      }
      break;
    }
    case "answer": {
      const [activityId, ...answerParts] = rest;
      const activity = lesson.productionActivities.find((item) => item.id === activityId);
      if (!activity) {
        console.error(`Unknown production activity: ${activityId}`);
        process.exitCode = 1;
        break;
      }
      const evaluated = evaluateProductionAnswer(activity, answerParts.join(" "));
      console.log(JSON.stringify(evaluated, null, 2));
      if (evaluated.passed) {
        markProductionActivity(activity.id, progress);
        saveProgress(progress);
      } else {
        recordAttempt(lesson.id, activity.id, { passed: false, concept: activity.concept });
      }
      break;
    }
    case "coverage":
      console.log(JSON.stringify(productionCoverage(lesson), null, 2));
      console.log(JSON.stringify(completionGate(lesson, progress), null, 2));
      break;
    case "hint": {
      const used = Number(rest[1] ?? 0);
      const hint = nextHint(lesson.codeExercise, Number.isNaN(used) ? 0 : used);
      console.log(`Hint level ${hint.level}: ${hint.text}`);
      if (hint.exhausted) console.log(`Partial solution:\n${lesson.codeExercise.solutionSnippet}`);
      break;
    }
    case "flashcards":
      for (const card of lesson.flashcards) console.log(`Q: ${card.front}\nA: ${card.back}\n`);
      break;
    case "show":
      console.log(readWorkspaceFile(workspace, rest[0] ?? "copy.c"));
      break;
    default:
      console.error(`Unknown lab command: ${subcommand}`);
      process.exitCode = 1;
  }
}

switch (command) {
  case "dashboard":
  case "home":
    console.log(renderDashboard(modules, progress, allLessons().length, completionPercent(progress, allLessons().length), practiceModes));
    break;
  case "modes":
    console.log(practiceModes.map((mode) => `- ${mode}`).join("\n"));
    break;
  case "lab":
    if (args[0] === "stdin") stdinLab(args[1], args.slice(2));
    else {
      console.error("Available lab: stdin");
      process.exitCode = 1;
    }
    break;
  case "edit":
    if (args[0] !== "stdin") {
      console.error("Available workspace: stdin");
      process.exitCode = 1;
    } else {
      const workspace = ensureWorkspace(stdinStdoutLesson);
      const [, file, ...text] = args;
      applyEdit(workspace, file, `${text.join(" ")}\n`);
      console.log(`Saved ${file} in ${workspace}`);
    }
    break;
  case "external-editor":
    if (args[0] !== "stdin") {
      console.error("Available workspace: stdin");
      process.exitCode = 1;
    } else {
      const workspace = ensureWorkspace(stdinStdoutLesson);
      console.log(JSON.stringify(openExternalEditor(workspace, args[1] ?? "upper.c"), null, 2));
    }
    break;
  case "lesson": {
    const lesson = findLesson(args.join(" "));
    if (!lesson) {
      console.error("Lesson not found. Try: npm run dev -- search <term>");
      process.exitCode = 1;
    } else console.log(renderLesson(lesson, progress));
    break;
  }
  case "search":
    console.log(renderSearch(searchLessons(args.join(" "))));
    break;
  case "complete": {
    const requested = args.join(" ");
    const lesson = requested === "stdin" ? { id: stdinStdoutLesson.id, lab: stdinStdoutLesson } : findLesson(requested);
    if (!lesson) {
      console.error("Lesson not found.");
      process.exitCode = 1;
    } else {
      if (lesson.lab) {
        const gate = completionGate(lesson.lab, progress);
        if (!gate.passed) {
          console.error(`Cannot complete stdin lab yet. Missing production activities: ${gate.missing.join(", ")}`);
          process.exitCode = 1;
          break;
        }
      }
      saveProgress(markComplete(lesson.id, progress));
      console.log(`Marked ${lesson.id} complete.`);
    }
    break;
  }
  case "bookmark": {
    const lesson = findLesson(args.join(" "));
    if (!lesson) {
      console.error("Lesson not found.");
      process.exitCode = 1;
    } else {
      const updated = toggleBookmark(lesson.id, progress);
      saveProgress(updated);
      console.log(`${updated.bookmarkedLessons.includes(lesson.id) ? "Bookmarked" : "Removed bookmark"}: ${lesson.id}`);
    }
    break;
  }
  case "progress":
    console.log(`${progress.completedLessons.length}/${allLessons().length} complete: ${completionPercent(progress, allLessons().length)}%`);
    console.log(`Exercises completed: ${(progress.exercisesCompleted ?? []).join(", ") || "none"}`);
    console.log(`Commands mastered: ${(progress.commandsMastered ?? []).join(", ") || "none"}`);
    console.log(`Bookmarks: ${progress.bookmarkedLessons.join(", ") || "none"}`);
    break;
  case "review-mistakes":
    console.log(reviewMistakes(progress).map((item) => `Review: ${item}`).join("\n") || "No mistakes recorded yet.");
    break;
  case "help":
  case "--help":
  case "-h":
    help();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    help();
    process.exitCode = 1;
}
