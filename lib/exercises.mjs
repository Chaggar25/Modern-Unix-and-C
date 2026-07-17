export const cFlags = ["-std=c17", "-Wall", "-Wextra", "-Wpedantic", "-Wconversion", "-Wshadow", "-Wformat=2"];

export const stdinStdoutLesson = {
  id: "stdin-stdout-eof-lab",
  title: "Standard input, standard output, standard error, and EOF",
  mode: "Guided Lessons",

  importantConcepts: ["stdin", "stdout", "stderr", "EOF", "getc loop", "compiler warnings", "err_sys is not standard C"],
  productionActivities: [
    { id: "pipe-copy", kind: "type-command", concept: "stdin", expected: "Type and run a pipe command that feeds copy through stdin.", requiredTerms: ["printf", "copy"] },
    { id: "command-from-goal", kind: "write-command-from-goal", concept: "stdout", expected: "Write a command from the goal: feed abc to ./copy and show it on stdout.", requiredTerms: ["printf", "abc", "copy"] },
    { id: "predict-copy-output", kind: "predict-output", concept: "stdout", expected: "Predict that printf abc piped into copy prints abc.", requiredTerms: ["abc"] },
    { id: "type-getc-loop", kind: "type-c-statement", concept: "getc loop", expected: "Type while ((c = getc(stdin)) != EOF).", requiredTerms: ["while", "getc", "stdin", "EOF"] },
    { id: "uppercase-output", kind: "complete-c-code", concept: "stdout", expected: "Complete upper.c so it writes uppercase output.", requiredTerms: ["toupper", "putc"] },
    { id: "char-c-debug", kind: "debug-program", concept: "EOF", expected: "Explain and fix char c by using int c.", requiredTerms: ["int", "EOF"] },
    { id: "err-sys-debug", kind: "debug-program", concept: "err_sys is not standard C", expected: "Replace err_sys with standard C diagnostics.", requiredTerms: ["err_sys", "not standard", "perror"] },
    { id: "explain-stderr", kind: "explain-line", concept: "stderr", expected: "Explain that diagnostics use stderr so stdout stays clean for pipes.", requiredTerms: ["stderr", "diagnostics", "stdout"] },
    { id: "explain-getc-line", kind: "explain-line", concept: "getc loop", expected: "Explain getc, assignment to c, EOF comparison, and loop repeat.", requiredTerms: ["getc", "assign", "EOF", "loop"] },
    { id: "trace-c-variable", kind: "trace-variable", concept: "EOF", expected: "Trace c through read, assignment, comparison, and body execution.", requiredTerms: ["read", "c", "compare", "EOF"] },
    { id: "compile-copy", kind: "compile-run", concept: "compiler warnings", expected: "Compile copy.c with strict warnings and run it.", requiredTerms: ["compile", "run"] },
    { id: "upper-tests", kind: "automated-tests", concept: "stdout", expected: "Pass automated tests for uppercase output.", requiredTerms: ["pass"] },
  ],
  workspaceSeed: {
    "input.txt": "hello from a file\n",
    "server.log": "info: boot\nerror: disk full\ninfo: shutdown\n",
    "copy.c": `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void)\n{\n    int c;\n\n    while ((c = getc(stdin)) != EOF)\n    {\n        if (putc(c, stdout) == EOF)\n        {\n            perror("output error");\n            return EXIT_FAILURE;\n        }\n    }\n\n    if (ferror(stdin))\n    {\n        perror("input error");\n        return EXIT_FAILURE;\n    }\n\n    return EXIT_SUCCESS;\n}\n`,
    "upper.c": `#include <ctype.h>\n#include <stdio.h>\n#include <stdlib.h>\n\nint main(void)\n{\n    int c;\n\n    while ((c = getc(stdin)) != EOF)\n    {\n        /* TODO: write the uppercase character to stdout. */\n    }\n\n    if (ferror(stdin))\n    {\n        perror("input error");\n        return EXIT_FAILURE;\n    }\n\n    return EXIT_SUCCESS;\n}\n`,
    "broken-char.c": `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void)\n{\n    char c;\n    while ((c = getc(stdin)) != EOF)\n    {\n        putc(c, stdout);\n    }\n    return EXIT_SUCCESS;\n}\n`,
    "broken-err-sys.c": `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void)\n{\n    err_sys("not standard C");\n    return EXIT_SUCCESS;\n}\n`,
  },
  animationId: "stdin-flow",
  typing: {
    command: "printf 'abc\\n' | ./copy",
    codeChunk: "while ((c = getc(stdin)) != EOF)",
  },
  commandExercise: {
    id: "pipe-copy",
    kind: "CommandExercise",
    prompt: "Run copy with piped input so stdout prints abc.",
    expectedCommand: "printf 'abc\\n' | ./copy",
  },
  codeExercise: {
    id: "uppercase-output",
    kind: "CodeExercise",
    file: "upper.c",
    prompt: "Complete upper.c so input bytes are written to stdout as uppercase characters.",
    tests: [
      { name: "uppercase pipe", input: "abc xyz\n", expectedStdout: "ABC XYZ\n", expectedExitStatus: 0 },
      { name: "preserve digits", input: "a1b2\n", expectedStdout: "A1B2\n", expectedExitStatus: 0 },
    ],
    hints: [
      "Read one value with getc(stdin), keep it in an int, and stop at EOF.",
      "toupper expects a value representable as unsigned char or EOF; here c came from getc.",
      "Write the converted value with putc(toupper(c), stdout) and check for EOF.",
      "Inside the loop, call putc(toupper(c), stdout) and return EXIT_FAILURE if it fails.",
    ],
    solutionSnippet: `if (putc(toupper(c), stdout) == EOF)\n        {\n            perror("output error");\n            return EXIT_FAILURE;\n        }`,
  },
  debugExercises: [
    {
      id: "char-c-debug",
      file: "broken-char.c",
      concept: "EOF needs int storage",
      expected: "Use int c so getc can return every byte value plus EOF.",
    },
    {
      id: "err-sys-debug",
      file: "broken-err-sys.c",
      concept: "err_sys is not standard C",
      expected: "Replace err_sys with standard C diagnostics such as perror or fprintf(stderr, ...).",
    },
  ],
  flashcards: [
    { front: "Why is c an int when using getc?", back: "getc returns every unsigned byte value plus EOF, so char is not enough." },
    { front: "Where should diagnostics go?", back: "stderr, so normal stdout can still be piped or redirected." },
    { front: "Is err_sys standard C?", back: "No. APUE-style examples provide it with a support library/header." },
  ],
};

export const practiceModes = [
  "Guided Lessons",
  "Command Practice",
  "C Typing Practice",
  "Coding Challenges",
  "Debugging Lab",
  "Output Prediction",
  "Flashcards",
  "Projects",
  "Review Mistakes",
];
