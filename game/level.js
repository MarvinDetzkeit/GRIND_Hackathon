import { levelParts } from "./lib.js";
import { GameContext } from "./lib.js";
import { Camera } from "./player.js";
import { playCoinSound } from "./sound.js";

const grassBlock = new Image();
grassBlock.src = "game/assets/grassblock.png";

grassBlock.onload = () => {
    // Ready to draw: ctx.drawImage(img, x, y);
  };

const grassBlockClean = new Image();
grassBlockClean.src = "game/assets/grassblockclean.png";

grassBlockClean.onload = () => {
    // Ready to draw: ctx.drawImage(img, x, y);
  };

const cactusFrames = [];
for (let i = 1; i <= 2; i++) {
    cactusFrames[i-1] = new Image();
    cactusFrames[i-1].src = `game/assets/cactus/cactus${i}.png`;
    cactusFrames[i-1].onload = () => {};
}

const flyingEnemyFrames = [];
for (let i = 1; i <= 6; i++) {
    flyingEnemyFrames[i-1] = new Image();
    flyingEnemyFrames[i-1].src = `game/assets/flyingenemy/flyingenemy${i}.png`;
    flyingEnemyFrames[i-1].onload = () => {};
}

const coinFrames = [];
for (let i = 1; i <= 4; i++) {
    coinFrames[i-1] = new Image();
    coinFrames[i-1].src = `game/assets/coin/coin${i}.png`
    coinFrames[i-1].onload = () => {};
}

const coinBurstFrames = [];
for (let i = 1; i <= 6; i++) {
    coinBurstFrames[i-1] = new Image();
    coinBurstFrames[i-1].src = `game/assets/coinburst/coinburst${i}.png`
    coinBurstFrames[i-1].onload = () => {};
}


let cFrames = 0;
export function animateCoin() {
    cFrames += (1 / 8);
    if (cFrames >= 4) {
        cFrames = 0;
    }
}

class LevelObject {
    constructor(collidable, collectable, harmful) {
        this.collidable = collidable;
        this.collectable = collectable;
        this.harmful = harmful;
    }
    render(x, y, camera, level, tileX, tileY) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        GameContext.ctx.fillRect(positionX, positionY, GameContext.tileSize, GameContext.tileSize);
    }
}

export class Block extends LevelObject {
    constructor() {
        super(true, false, false);
    }

    render(x, y, camera, level, tileX, tileY) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        let tile = level.getTile(tileX, tileY-1);
        if (tile !== null && tile.collidable) {
            GameContext.ctx.drawImage(grassBlockClean, positionX, positionY, GameContext.tileSize, GameContext.tileSize);
        }
        else {
            GameContext.ctx.drawImage(grassBlock, positionX, positionY, GameContext.tileSize, GameContext.tileSize);
        }
    }
}

export class Collectable extends LevelObject {
    constructor(x, y) {
        super(false, true, false);
        this.x = x;
        this.y = y;
        this.endFrames = 0;
    }

    render(x, y, camera, level, tileX, tileY) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        if (this.collectable) {
            GameContext.ctx.drawImage(coinFrames[Math.floor(cFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
        }
        else {
            GameContext.ctx.drawImage(coinBurstFrames[Math.floor(this.endFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
            this.endFrames += (1 / 4);
            if (this.endFrames >= 5) {
                this.delete(level);
            }
        }
    }

    delete(level) {
        level.grid[this.x][this.y] = null;
    }

    collect() {
        this.collectable = false;
        playCoinSound();
    }
}

export class Obstacle extends LevelObject {
    constructor() {
        super(false, false, true);
        this.cFrames = 0;
        this.fFrames = 0;
    }

    render(x, y, camera, level, tileX, tileY) {
        let tile = level.getTile(tileX, tileY + 1);
        if (tile !== null && tile.collidable) {
            this.renderCactus(x, y, camera);
        }
        else {
            this.renderFlyingEnemy(x, y, camera);
        }
    }

    renderCactus(x, y, camera) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        GameContext.ctx.drawImage(cactusFrames[Math.floor(this.cFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
    }

    renderFlyingEnemy(x, y, camera) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        GameContext.ctx.drawImage(flyingEnemyFrames[Math.floor(this.fFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
    }

    refreshAnimation() {
        this.fFrames += (1 / 8);
        if (this.fFrames >= 6) {
            this.fFrames = 0;
        }
        this.cFrames += (1 / 32);
        if (this.cFrames >= 2) {
            this.cFrames = 0;
        }
    }

}

const block = new Block();
const obstacle = new Obstacle();

export class Level {
    constructor() {
        this.height = 5       
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.length) {
            return null;
        }
        else if (y >= 5) {
            return block;
        }
        else {
            return this.grid[x][y];
        }
    }

    loadPart(part, offset) {
        const rows = levelParts[part].split("\n");
        offset = offset * 20;
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                switch (rows[rows.length - 1 - i][j]) {
                    case 'b':
                        this.grid[j + offset][rows.length - (i + 1)] = block;
                        break;
                    case 'c':
                        this.grid[j + offset][rows.length - (i + 1)] = new Collectable(j + offset, rows.length - (i + 1));
                        break;
                    case 'o':
                        this.grid[j + offset][rows.length - (i + 1)] = obstacle;
                        break;
                    case ' ':
                        this.grid[j + offset][rows.length - (i + 1)] = null;
                        break;
                    default:
                        throw new Error(`Unknown tile '${rows[rows.length - 1 - i][j]}'`);
                        break;
                }
            }
        }
    }

    load(seed) {
        this.length = 20 * seed.length;
        this.grid = Array.from({ length: this.length }, () => 
            Array(this.height).fill(null)
          );
        for (let i = 0; i < seed.length; i++) {
            this.loadPart(seed[i], i);
        }
    }

    render(camera) {
        let tileX = Math.floor(camera.x / GameContext.tileSize);
        for (let i = -13; i < 14; i++) {
            for (let j = 0; j < 10; j++) {
                let tile = this.getTile(tileX + i, j);
                if (tile !== null) { //render if tile exists at position
                    tile.render((i + tileX) * GameContext.tileSize, j * GameContext.tileSize, camera, this, tileX + i, j);
                }
            }
        }
        obstacle.refreshAnimation();
    }

    generateSeed(count) {
        let n = levelParts.length;
        //return Array.from({ length: n }, (_, i) => i);
        const arr = Array.from({ length: count + 4 }, () =>
          Math.floor(Math.random() * (n-3)) + 3
        );
        arr[0] = 0;
        arr[1] = 0;
        arr[arr.length - 2] = 1;
        arr[arr.length - 1] = 2;
        console.log(arr);
        return arr;
      }
}