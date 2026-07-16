# Curriculum

The long-term curriculum still follows the original Modern Unix and C roadmap:

1. Terminal and Linux Foundations
2. Modern C Foundations
3. The Unix Programming Model
4. Files and Directories
5. Processes
6. Signals
7. Interprocess Communication
8. Threads and Concurrency
9. Memory and Resource Management
10. Networking
11. Build Tools and Professional Workflow
12. Systems Projects
13. Advanced Linux Systems Programming

## Terminal prototype scope

The terminal prototype implements the first three modules because they are the best fit for a minimal CLI learning loop:

- Module 0 — Terminal and Linux Foundations
- Module 1 — Modern C Foundations
- Module 2 — The Unix Programming Model

The included lessons cover the originally requested initial lesson set for those modules plus a guided `getc`, `putc`, `ferror`, `stdin`, `stdout`, `EOF`, and `err_sys()` warning lesson.

Future modules should be added gradually after the terminal interaction model is proven.
