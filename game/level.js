import { levelParts } from "./lib.js";
import { GameContext } from "./lib.js";
import { Camera } from "./player.js";
import { playCoinSound, playUltraCoinSound } from "./sound.js";

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
for (let i = 1; i <= 4; i++) {
    flyingEnemyFrames[i-1] = new Image();
    flyingEnemyFrames[i-1].src = `game/assets/flyingenemy/flying${i}.png`;
    flyingEnemyFrames[i-1].onload = () => {};
}

const coinFrames = [];
for (let i = 1; i <= 30; i++) {
    coinFrames[i-1] = new Image();
    coinFrames[i-1].src = `game/assets/coin/grindcoin${i}.png`
    coinFrames[i-1].onload = () => {};
}

const coinBurstFrames = [];
for (let i = 1; i <= 27; i++) {
    coinBurstFrames[i-1] = new Image();
    coinBurstFrames[i-1].src = `game/assets/coinburst/burst${i}.png`
    coinBurstFrames[i-1].onload = () => {};
}

const ultraCoinFrames = [];
for (let i = 1; i <= 30; i++) {
    ultraCoinFrames[i-1] = new Image();
    ultraCoinFrames[i-1].src = `game/assets/ultracoin/specialcoinrotate${i}.png`
    ultraCoinFrames[i-1].onload = () => {};
}

const ultraCoinBurstFrames = [];
for (let i = 1; i <= 14; i++) {
    ultraCoinBurstFrames[i-1] = new Image();
    ultraCoinBurstFrames[i-1].src = `game/assets/ultracoinburst/specialcoinburst${i}.png`
    ultraCoinBurstFrames[i-1].onload = () => {};
}

let cFrames = 0;
export function animateCoin() {
    cFrames += 0.5;
    if (cFrames >= 30) {
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
        if (tile != null && tile.collidable) {
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
        this.ultra = 1;
    }

    render(x, y, camera, level, tileX, tileY) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        if (this.collectable) {
            GameContext.ctx.drawImage(coinFrames[Math.floor(cFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
        }
        else {
            if (this.endFrames >= 27) {
                this.delete(level);
                return;
            }
            GameContext.ctx.drawImage(coinBurstFrames[Math.floor(this.endFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
            this.endFrames += 0.5;
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

export class UltraCoin extends LevelObject {
    constructor(x, y) {
        super(false, true, false);
        this.x = x;
        this.y = y;
        this.endFrames = 0;
        this.ultra = 10;
    }

    render(x, y, camera, level, tileX, tileY) {
        let positionX = x  + camera.renderOffsetX - camera.x;
        let positionY = y  + camera.renderOffsetY - camera.y;
        if (this.collectable) {
            GameContext.ctx.drawImage(ultraCoinFrames[Math.floor(cFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
        }
        else {
            if (this.endFrames >= 14) {
                this.delete(level);
                return;
            }
            GameContext.ctx.drawImage(ultraCoinBurstFrames[Math.floor(this.endFrames)], positionX, positionY, GameContext.tileSize, GameContext.tileSize);
            this.endFrames += 0.5;
        }
    }

    delete(level) {
        level.grid[this.x][this.y] = null;
    }

    collect() {
        this.collectable = false;
        playUltraCoinSound();
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
        if (tile != null && tile.collidable) {
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
        this.fFrames += (1 / 16);
        if (this.fFrames >= 4) {
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
        this.ultraCoins = false;
        this.length = 0;
    }

    getTile(x, y) {
        try {
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
    catch (e) {
        console.log("x: %d, y: %d, current length: ", x, y, this.length);
        throw e;
    }
    }

    loadPart(part, offset) {
        const rows = levelParts[part].split("\n");
        offset = 20 * offset;
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
                    case 'u':
                        if (!this.ultraCoins) break;
                        this.grid[j + offset][rows.length - (i + 1)] = new UltraCoin(j + offset, rows.length - (i + 1));
                        break;
                    case ' ':
                        this.grid[j + offset][rows.length - (i + 1)] = null;
                        break;
                    default:
                        this.grid[j + offset][rows.length - (i + 1)] = null;
                        break;
                }
            }
        }
    }

    load(seed) {
        this.grid = Array.from({ length: 20 * seed.length }, () => 
            Array(this.height).fill(null)
          );
        for (let i = 0; i < seed.length; i++) {
            this.length += 20;
            this.loadPart(seed[i], i);
        }
    }

    setBack(currentPart, player, camera) {
        if (currentPart < 8) return;
    
        // Deep copy individual tile values from previous/current/next part
        const sourceParts = [currentPart - 1, currentPart, currentPart + 1];
        for (let part = 0; part < 3; part++) {
            const sourceBase = sourceParts[part] * 20;
            const targetBase = part * 20;
            for (let i = 0; i < 20; i++) {
                const sourceRow = this.grid[sourceBase + i];
                const targetRow = [];
    
                for (let y = 0; y < this.height; y++) {
                    const tile = sourceRow[y];
                    if (tile == null || tile.collidable || tile.harmful) {
                        targetRow[y] = tile;
                    }
                    else if (tile.collectable) {
                        if (tile.ultra === 10) {
                            targetRow[y] = new UltraCoin(targetBase+i, y);
                        }
                        else {
                            targetRow[y] = new Collectable(targetBase+i, y);
                        }
                    }
                }
    
                this.grid[targetBase + i] = targetRow;
            }
        }
    
        const offset = (currentPart - 1) * GameContext.tileSize * 20;
        player.x -= offset;
        camera.x -= offset;
    
        // Load new level parts into slots 3–10
        for (let partIndex = 3; partIndex <= 10; partIndex++) {
            const randomPartId = Math.floor(Math.random() * (levelParts.length - 1)) + 1;
            this.loadPart(randomPartId, partIndex);
        }
    }
    
    

    render(camera) {
        let tileX = Math.floor(camera.x / GameContext.tileSize);
        for (let i = -19; i < 20; i++) {
            for (let j = 0; j < 15; j++) {
                let tile = this.getTile(tileX + i, j);
                if (tile != null) { //render if tile exists at position
                    tile.render((i + tileX) * GameContext.tileSize, j * GameContext.tileSize, camera, this, tileX + i, j);
                }
            }
        }
        obstacle.refreshAnimation();
    }

    generateSeed(count) {
        let n = levelParts.length;
        const arr = Array.from({ length: count + 4 }, () =>
          Math.floor(Math.random() * (n-1)) + 1
        );
        arr[0] = 0;
        arr[1] = 0;
        return arr;
      }
}