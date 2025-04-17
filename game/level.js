import { levelParts } from "./lib.js";
import { GameContext } from "./lib.js";
import { Camera } from "./player.js";

class LevelObject {
    constructor(collidable, collectable, harmful) {
        this.collidable = collidable;
        this.collectable = collectable;
        this.harmful = harmful;
    }
    render(x, y, camera) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        GameContext.ctx.fillRect(positionX, positionY, GameContext.tileSize, GameContext.tileSize);
    }
}

export class Block extends LevelObject {
    constructor() {
        super(true, false, false);
    }

    render(x, y, camera) {
        GameContext.ctx.fillStyle = 'green';
        super.render(x, y, camera);
    }
}

export class Collectable extends LevelObject {
    constructor() {
        super(false, true, false);
    }

    render(x, y, camera) {
        GameContext.ctx.fillStyle = 'yellow';
        super.render(x, y, camera);
    }
}

export class Obstacle extends LevelObject {
    constructor() {
        super(false, false, true);
    }

    render(x, y, camera) {
        GameContext.ctx.fillStyle = 'red';
        super.render(x, y, camera);
    }
}

export class Level {
    constructor() {
        this.height = 5       
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.length || y >= 5) {
            return null;
        }
        else {
            return this.grid[x][y];
        }
    }

    loadPart(part, offset) {
        const rows = levelParts[part].split("\n");
        const block = new Block();
        const obstacle = new Obstacle();
        offset = offset * 20;
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                switch (rows[rows.length - 1 - i][j]) {
                    case 'b':
                        this.grid[j + offset][rows.length - (i + 1)] = block;
                        break;
                    case 'c':
                        this.grid[j + offset][rows.length - (i + 1)] = new Collectable();
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
        for (let i = -14; i < 15; i++) {
            for (let j = 0; j < 5; j++) {
                let tile = this.getTile(tileX + i, j);
                if (tile !== null) { //render if tile exists at position
                    tile.render((i + tileX) * GameContext.tileSize, j * GameContext.tileSize, camera);
                }
            }
        }
    }

    generateSeed(count) {
        let n = levelParts.length;
        return Array.from({ length: n }, (_, i) => i);
        return Array.from({ length: count }, () =>
          Math.floor(Math.random() * n)
        );
      }
}