export const modules = [
  {
    id: "m0",
    title: "Terminal and Linux Foundations",
    project: "Terminal investigation toolkit",
    lessons: [
      lesson("0.1", "What Unix, Linux, the kernel, and the shell are", ["Unix is a family of operating-system ideas.", "Linux is a kernel used by many Unix-like systems.", "A shell is a program that reads commands and starts other programs."], "terminal kernel shell linux unix"),
      lesson("0.3", "Commands, arguments, options, and exit status", ["A command names a program or shell built-in.", "Arguments are words passed to the program.", "An exit status of 0 conventionally means success; nonzero means something went wrong."], "command arguments options exit status shell"),
      lesson("0.4", "pwd, ls, cd, and filesystem navigation", ["pwd prints the current directory.", "ls lists directory entries.", "cd changes the shell's current directory."], "pwd ls cd filesystem navigation"),
      lesson("0.5", "Absolute paths and relative paths", ["An absolute path starts at the filesystem root /.", "A relative path starts from the current directory.", ". means here; .. means parent directory."], "absolute relative paths filesystem"),
      lesson("0.9", "Standard input, standard output, and standard error", ["Programs usually start with three standard streams.", "stdin is input, stdout is normal output, stderr is diagnostics.", "Keeping stderr separate makes pipelines easier to debug."], "stdin stdout stderr streams"),
      lesson("0.10", "Redirection", ["The shell can connect a program's streams to files.", "> replaces output; >> appends output; < reads input from a file; 2> captures errors.", "Redirection is shell syntax, not C syntax."], "redirection shell stdout stderr"),
      lesson("0.11", "Pipes", ["A pipe connects one program's stdout to another program's stdin.", "Pipelines let small programs cooperate.", "The shell creates the pipe before starting the commands."], "pipes pipeline shell stdin stdout"),
      lesson("0.16", "Manual pages and built-in help", ["man pages are local reference documents.", "Use man 1 for commands, man 2 for system calls, and man 3 for C library functions.", "Built-in help explains shell features that are not external programs."], "man manual help shell"),
    ],
  },
  {
    id: "m1",
    title: "Modern C Foundations",
    project: "Modern command-line text analyzer",
    lessons: [
      lesson("1.1", "What C is and how source code becomes a program", ["C source code is text for humans and compilers.", "A compiler translates C into machine code and links it into a program.", "Warnings are early feedback, not noise."], "c compiler source program"),
      lesson("1.2", "Compiler, preprocessor, assembler, and linker", ["The preprocessor handles include lines and macros.", "The compiler checks C and produces assembly or object code.", "The linker combines object files and libraries."], "compiler preprocessor assembler linker"),
      lesson("1.3", "Creating and compiling a C program", ["Start with int main(void).", "Include headers for declarations you use.", "Compile with warnings enabled: -Wall -Wextra -Wpedantic -Wconversion."], "compile c warnings main"),
      lesson("1.9", "Functions and function prototypes", ["A prototype declares how to call a function.", "A definition provides the function body.", "Modern C compilers diagnose undeclared function calls."], "functions prototypes declarations definitions"),
      lesson("1.12", "Strings and null terminators", ["A C string is an array of characters ending in a null byte.", "The terminator is part of the representation.", "Forgetting room for the terminator causes bugs."], "strings null terminator arrays"),
      lesson("1.13", "Pointers", ["A pointer stores the address of an object or function.", "The pointed-to object must still be alive when you use the pointer.", "Pointer types help the compiler check your intent."], "pointers address lifetime"),
      lesson("1.17", "Header files and multiple source files", ["Headers usually contain declarations shared between files.", "Source files contain definitions and private helpers.", "Include guards prevent accidental repeated declarations."], "headers source files declarations"),
      lesson("1.18", "Error handling and return codes", ["Return codes communicate success or failure.", "Use EXIT_SUCCESS and EXIT_FAILURE for beginner examples.", "Print diagnostics to stderr, not stdout."], "error handling return codes stderr"),
      lesson("1.19", "Undefined behavior", ["Undefined behavior means the C standard gives no required result.", "Examples include out-of-bounds access and signed integer overflow.", "Sanitizers help find some undefined behavior during testing."], "undefined behavior sanitizer c"),
      lesson("1.20", "Compiler warnings and sanitizers", ["Use warnings every time you compile.", "-Werror can be useful in controlled exercises but inconvenient with platform-dependent warnings.", "AddressSanitizer and UndefinedBehaviorSanitizer catch many mistakes at runtime."], "warnings sanitizers werror"),
      guidedLesson(),
    ],
  },
  {
    id: "m2",
    title: "The Unix Programming Model",
    project: "File-descriptor explorer",
    lessons: [
      lesson("2.1", "Programs, processes, and the kernel", ["A program is an executable file; a process is a running instance.", "The kernel manages processes, memory, files, and devices.", "User programs ask the kernel for services through system calls."], "program process kernel system calls"),
      lesson("2.3", "System calls versus library functions", ["A library function is ordinary code linked with your program.", "A system call crosses into the kernel.", "Some C library functions wrap system calls."], "system calls library functions posix iso c"),
      lesson("2.4", "File descriptors", ["A file descriptor is a small integer handle owned by a process.", "POSIX read and write use file descriptors.", "0, 1, and 2 conventionally start as stdin, stdout, and stderr."], "file descriptors fd stdin stdout stderr"),
      lesson("2.5", "stdin, stdout, and stderr in C", ["ISO C exposes standard streams as FILE pointers.", "They often correspond to file descriptors 0, 1, and 2 on POSIX systems.", "Do not confuse C streams with shell syntax."], "stdin stdout stderr c streams file descriptors"),
      lesson("2.6", "Buffered and unbuffered I/O", ["Buffered I/O stores data temporarily before moving it.", "stdio is buffered; POSIX read/write are lower level.", "Buffering improves speed but changes when output appears."], "buffered unbuffered io stdio read write"),
      lesson("2.7", "errno and error reporting", ["errno is set by many failing library and POSIX calls.", "Check the function's return value first; then inspect errno when documented.", "perror and strerror turn errno values into messages."], "errno perror strerror errors"),
      lesson("2.8", "POSIX and ISO C", ["ISO C defines portable C language and library behavior.", "POSIX defines many Unix APIs.", "Linux implements POSIX features and also adds Linux-specific interfaces."], "posix iso c linux standards"),
      lesson("2.10", "Command-line arguments", ["main can receive argc and argv.", "argc counts argument strings.", "argv contains the program name followed by user-supplied arguments."], "argc argv command line arguments"),
      lesson("2.11", "Exit status", ["A process returns a small status to its parent.", "Shells use $? to show the last foreground command's status.", "Use EXIT_SUCCESS and EXIT_FAILURE in portable C examples."], "exit status return code shell"),
    ],
  },
];

export function lesson(id, title, takeaways, tags) {
  return {
    id,
    title,
    takeaways,
    tags: tags.split(" "),
    minutes: id === "guided" ? 35 : 12,
  };
}

function guidedLesson() {
  return {
    id: "guided",
    title: "Guided stdio copy program and err_sys warning",
    tags: ["getc", "putc", "ferror", "stdin", "stdout", "err_sys", "warnings"],
    minutes: 35,
    takeaways: [
      "The program copies bytes from stdin to stdout until EOF.",
      "int c is used because getc must represent every byte plus EOF.",
      "err_sys is not standard C; APUE-style examples provide it through a support header/library.",
      "A declaration/prototype tells the compiler how a function is called; a definition supplies the body.",
      "stdio.h and stdlib.h do not declare err_sys, so modern compilers warn or fail on that call.",
      "Rewrite beginner examples with fprintf(stderr, ...), perror, or a small custom helper.",
    ],
    code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void)\n{\n    int c;\n\n    while ((c = getc(stdin)) != EOF)\n    {\n        if (putc(c, stdout) == EOF)\n        {\n            fprintf(stderr, "output error\\n");\n            return EXIT_FAILURE;\n        }\n    }\n\n    if (ferror(stdin))\n    {\n        fprintf(stderr, "input error\\n");\n        return EXIT_FAILURE;\n    }\n\n    return EXIT_SUCCESS;\n}`,
  };
}

export function allLessons() {
  return modules.flatMap((module) => module.lessons.map((item) => ({ ...item, module })));
}

export function findLesson(idOrText) {
  const needle = idOrText.toLowerCase();
  return allLessons().find(
    ({ id, title }) => id.toLowerCase() === needle || title.toLowerCase().includes(needle),
  );
}

export function searchLessons(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return allLessons().filter(({ id, title, tags, takeaways }) =>
    [id, title, ...tags, ...takeaways].join(" ").toLowerCase().includes(needle),
  );
}
