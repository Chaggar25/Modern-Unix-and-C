export const animations = {
  "stdin-flow": {
    id: "stdin-flow",
    title: "stdin flows into getc",
    frames: [
      { caption: "You type bytes at the keyboard.", art: "Keyboard\n   |" },
      { caption: "The terminal driver receives them.", art: "Keyboard\n   |\n   v\nTerminal driver" },
      { caption: "The program reads from stdin / fd 0.", art: "Terminal driver\n   |\n   v\nstdin / file descriptor 0" },
      { caption: "getc() returns one value at a time.", art: "stdin / fd 0\n   |\n   v\ngetc()\n   |\n   v\nint c" },
    ],
  },
};

export function animationState(animation, { reducedMotion = false } = {}) {
  return { animation, index: reducedMotion ? animation.frames.length - 1 : 0, paused: false, skipped: false };
}

export function currentFrame(state) {
  return state.animation.frames[state.index];
}

export function stepForward(state) {
  return { ...state, index: Math.min(state.index + 1, state.animation.frames.length - 1) };
}

export function stepBackward(state) {
  return { ...state, index: Math.max(state.index - 1, 0) };
}

export function replay(state) {
  return { ...state, index: 0, skipped: false };
}

export function skip(state) {
  return { ...state, index: state.animation.frames.length - 1, skipped: true };
}

export function staticFallback(animation) {
  const frame = animation.frames.at(-1);
  return `${animation.title}\n${frame.art}\n${frame.caption}`;
}
