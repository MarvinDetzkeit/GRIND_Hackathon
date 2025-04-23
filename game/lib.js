export const GameContext = {
    canvas: document.getElementById('game'),
    ctx: null,
    tileSize: 64,
    scrollingSpeed: 10,
    gravity: 2,
    gameIsRunning: false,
  };
  
GameContext.ctx = GameContext.canvas.getContext('2d');

export const Input = {
  keys: {},
  frameInputs: []
}

export const levelParts = [
  `                    \n` +
  `                    \n` +
  `                    \n` +
  `                    \n` +
  `                    `,

  `                    \n` +
  `              o     \n` +
  `              u     \n` +
  `   c  c  c          \n` +
  `   o     o          `,

  `                    \n` +
  `           c        \n` +
  `     cc       cc    \n` +
  `          o         \n` +
  `    obbbbbbbbbb     `,

  `                    \n` +
  `        u           \n` +
  `   bbbb c bbbb      \n` +
  `    oc     oc       \n` +
  `                    `,

  `                    \n` +
  `     c        c     \n` +
  `         c          \n` +
  `    bbb  o   bbb    \n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `                u   \n` +
  ` ccc          bb    \n` +
  `          bb   c    \n` +
  `      bb   c        \n` +
  `  bb   c       o    `,

  `     o              \n` +
  `                o   \n` +
  `          u   o     \n` +
  `     c    o   c     \n` +
  `     o    c         `,

  `         ccc        \n` +
  `        c   c       \n` +
  `          o         \n` +
  `       bbbbbbb      \n` +
  `    bb cccuccc bb   `,

  ` ccc    ccc    ccc  \n` +
  `bbbbb  bbbbb  bbbbb \n` +
  `  c      c      c   \n` +
  `                    \n` +
  `  o      o      o   `,

  `            o       \n` +
  `       c            \n` +
  `       c         bb \n` +
  `   bb          bb   \n` +
  ` bb  oo    bb  cccc `,

  `   c   c   c   c    \n` +
  `                    \n` +
  `   bb   bb   bb     \n` +
  `      coc   o u o   \n` +
  `                    `,

  `                    \n` +
  `  cc                \n` +
  `          c         \n` +
  `      o c   c       \n` +
  ` o          o       `,

  `     c    u    c    \n` +
  `                    \n` +
  `  c       o      c  \n` +
  `  o    bbbbbb    o  \n` +
  `bbbbb    cc    bbbbb`,

  `                    \n` +
  `          u         \n` +
  `cccccccccccccccccccc\n` +
  `         oo         \n` +
  `                    `,

  `   c     u       c  \n` +
  `     o       o      \n` +
  `                    \n` +
  `   c   c   c   c    \n` +
  `  coc coc coc coc   `,

  ` o          ccc    o\n` +
  `             o      \n` +
  `     bbbbbbbbbbbbbbb\n` +
  `   bbb  o           \n` +
  ` b  ccccocucucuccccc`,

  `    cccccccccccc    \n` +
  `    bbbbbbbbbbbb  c \n` +
  `                c   \n` +
  `        o       c   \n` +
  `  bbocc   o     o   `
];
