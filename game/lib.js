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
  `bbbbbbbbbbbbbbbbbbbb\n` +
  `             uuuuuuu\n` +
  `                    \n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `        bbbbbbbbbbbb\n` +
  `       cbbbbbbbbbbbb\n` +
  `      c bbbbbbbbbbbb\n` +
  `     c  bbbbbbbbbbbb\n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `bbbbbbbbbbbbbbbbbbbb\n` +
  `bbbbbbbbbbbbbbbbbbbb\n` +
  `bbbbbbbbbbbbbbbbbbbb\n` +
  `bbbbbbbbbbbbbbbbbbbb\n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `                    \n` +
  `    ccc             \n` +
  `                    \n` +
  `  bbb    b   b      \n` +
  `bbbbbbbbbbbbbbbbbbbb`,
  
  `     c       c      \n` +
  `                    \n` +
  `                    \n` +
  `    bbb  o   bb     \n` +
  `bbbbbbbbbbbbbbbbbbbb`,
  
  `c   c   c   c   c   \n` +
  `                    \n` +
  `                    \n` +
  `   bb    bbb        \n` +
  `bbbbbbbbbbbbbbbbbbbb`,
  
  `         c          \n` +
  `              c     \n` +
  `   c                \n` +
  `  bb   bbb     bb   \n` +
  `bbbbbbbbbbbbbbbbbbbb`,
  
  `      c c c         \n` +
  ` c c c c c c c c c  \n` +
  `      bbbbb         \n` +
  `    bbcccccbb       \n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  ` ccc    ccc    ccc  \n` +
  `bbbbb  bbbbb  bbbbb \n` +
  `  c      c      c   \n` +
  `                    \n` +
  `bbbbbbbbbbbbbbbbbbbb`,


  `       c            \n` +
  `       c          bb\n` +
  `   bb            bb \n` +
  ` bb  oo      bb  cc \n` +
  `bbbbbbbbbbbbbbbbbbbb`,


  `   c   c   c   c    \n` +
  `                    \n` +
  `   bb   bb   bb     \n` +
  `      c      c      \n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `   c                \n` +
  `             c      \n` +
  `  bbb     o     bb  \n` +
  `      c     c       \n` +
  `bbbbbbbbbbbbbbbbbbbb`,


  `     c    c    c    \n` +
  `                    \n` +
  `  bb  bb  bb  bb  b \n` +
  `        c      c    \n` +
  `bbbbbbbbbbbbbbbbbbbb`,


  `    o       o     o \n` +
  `                    \n` +
  `  c     c     c     \n` +
  `bb    bb    bb    bb\n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `     o   o   o      \n` +
  `  ccccccccccccccc   \n` +
  `  bbbbbbbbbbbbbbb   \n` +
  `   c  c  c  c  c    \n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `   o     o     o    \n` +
  ` c     c     c     c\n` +
  `    bb     bb     bb\n` +
  `         c      o   \n` +
  `bbbbbbbbbbbbbbbbbbbb`,

  `        c    c      \n` +
  ` o    o    o    o   \n` +
  `bb   bb   bb   bb   \n` +
  `   c      c         \n` +
  `bbbbbbbbbbbbbbbbbbbb`
  ];