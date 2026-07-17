#!/usr/bin/env node
import { modules, allLessons, findLesson, searchLessons } from "../lib/course.mjs";
import {
  completionPercent,
  loadProgress,
  markComplete,
  saveProgress,
  toggleBookmark,
} from "../lib/progress.mjs";
import { renderDashboard, renderLesson, renderSearch } from "../lib/render.mjs";

const [command = "dashboard", ...args] = process.argv.slice(2);
const progress = loadProgress();

function help() {
  console.log(`Modern Unix and C\n\nCommands:\n  dashboard                 Show modules and progress\n  lesson <id-or-title>       Read a lesson\n  search <term>              Search lessons\n  complete <id>              Mark a lesson complete\n  bookmark <id>              Toggle a bookmark\n  progress                  Show saved progress\n  help                      Show this help\n\nExamples:\n  npm run dev -- lesson 0.1\n  npm run dev -- search file descriptors\n  npm run dev -- complete guided`);
}

switch (command) {
  case "dashboard":
  case "home":
    console.log(renderDashboard(modules, progress, allLessons().length, completionPercent(progress, allLessons().length)));
    break;
  case "lesson": {
    const lesson = findLesson(args.join(" "));
    if (!lesson) {
      console.error("Lesson not found. Try: npm run dev -- search <term>");
      process.exitCode = 1;
    } else {
      console.log(renderLesson(lesson, progress));
    }
    break;
  }
  case "search":
    console.log(renderSearch(searchLessons(args.join(" "))));
    break;
  case "complete": {
    const lesson = findLesson(args.join(" "));
    if (!lesson) {
      console.error("Lesson not found.");
      process.exitCode = 1;
    } else {
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
    console.log(`Bookmarks: ${progress.bookmarkedLessons.join(", ") || "none"}`);
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
