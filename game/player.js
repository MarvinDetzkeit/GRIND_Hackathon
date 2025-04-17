import { GameContext } from './lib.js';
import { Block } from './level.js';
import { Collectable } from './level.js';
import { Obstacle } from './level.js';
import { Level } from './level.js';

const jumpSpeed = -20;
const slideTime = 30;

export class Player {
    constructor(x, y) {
        this.x = x;
        this.lastFrameX = x;
        this.sizeX = GameContext.tileSize;
        this.y = y;
        this.lastFrameY = y;
        this.sizeY = GameContext.tileSize * 1.5;
        this.speedX = 0;
        this.speedY = 0;


        this.state = "air";
        this.hp = 3;
        this.iFrames = 0;
        this.slideFrames = -slideTime;
    }

    render(camera) {
        GameContext.ctx.fillStyle = 'blue';
        let positionX = this.x  + camera.renderOffsetX - camera.x;
        let positionY = this.y  + camera.renderOffsetY - camera.y;
        //if not sliding
        if (this.slideFrames <= 0) {
            GameContext.ctx.fillRect(positionX, positionY, this.sizeX, this.sizeY);
        }
        else {
            GameContext.ctx.fillRect(positionX, positionY + (this.sizeY / 2), this.sizeX, this.sizeY / 2);
        }
    }

    gravity() {
        this.speedY += GameContext.gravity;
        if (this.speedY > -jumpSpeed) {
            this.speedY = -jumpSpeed;
        }
    }

    startStopSliding(level) {
        //start sliding if player hasn't slided or stop sliding
        if (this.slideFrames < -5 || (this.slideFrames > 0 && this.canGetUp(level))) {
            this.slideFrames *= -1;
        }
    }

    canGetUp(level) {
        let tile = level.getTile(Math.floor((this.x + 1) / GameContext.tileSize), Math.floor(this.y / GameContext.tileSize));
        if (tile !== null && tile.collidable) {
            return false;
        }
        tile = level.getTile(Math.floor((this.x - 1) / GameContext.tileSize) + 1, Math.floor(this.y / GameContext.tileSize));
        if (tile !== null && tile.collidable) {
            return false;
        }
        return true;
    }

    computeSliding(level) {
        this.slideFrames -= 1;
        this.slideFrames = Math.max(this.slideFrames, -slideTime);
        //keep sliding if player can't get up
        if (this.slideFrames === 0 && !this.canGetUp(level)) {
            this.slideFrames = 1;
        }
    }


    jump() {
        if (this.state === "ground") {
            this.state = "air";
            this.speedY = jumpSpeed - GameContext.gravity;
        }
    }

    handleHit() {
        console.log("got hit");
        if (this.iFrames <= 0) {
        this.hp -= 1;
        this.iFrames = 60;
        if (this.hp <= 0) {
            GameContext.gameIsRunning = false;
        }
        }
    }

    move(level) {
        // x axis
        this.lastFrameX = this.x;
        this.x += this.speedX;
        //iterate
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                if (j === 0 && this.slideFrames > 0) {
                    continue;
                }
                let x = this.x + (i * this.sizeX) + (1 - (2 * i));
                let y = this.y + (j * this.sizeY / 2);
                const tile = level.getTile(Math.floor(x / GameContext.tileSize), Math.floor(y / GameContext.tileSize));
                if (tile !== null && tile.collidable) {
                    const offset = x % GameContext.tileSize;
                    if (this.speedX > 0) {
                        this.x -= offset + 1;
                    }
                    else {
                        this.x += GameContext.tileSize - offset + 1;
                    }
                }
            }
        }

        //y axis
        this.lastFrameY = this.y;
        this.y += this.speedY;
        //iterate
        let touchedGround = false;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                if (j === 0 && this.slideFrames > 0) {
                    continue;
                }
                let x = this.x + (i * this.sizeX) + (1 - (2 * i));
                let y = this.y + (j * this.sizeY / 2);
                let tileX = Math.floor(x / GameContext.tileSize);
                let tileY = Math.floor(y / GameContext.tileSize)
                const tile = level.getTile(tileX, tileY);
                if (tile !== null && tile.collectable) {
                    level.grid[tileX][tileY] = null;
                }
                if (tile !== null && tile.harmful) {
                    this.handleHit();
                }
                if (tile !== null && tile.collidable) {
                    const offset = y % GameContext.tileSize;
                    if (this.speedY > 0) {
                        this.y -= offset + 1;
                        touchedGround = true;
                    }
                    else {
                        this.y += GameContext.tileSize - offset + 1;
                    }
                    this.speedY = 0;
                }

            }
        }
        if (touchedGround) {
            this.state = "ground";
        }
        else {
            this.state = "air";
        }

    }

    update(level) {
        this.gravity();
        this.move(level);
        this.computeSliding(level);
        this.iFrames -= 1;
        this.iFrames = Math.max(this.iFrames, 0);
    }
}

export class Camera {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.renderOffsetX = GameContext.canvas.width / 2;
        this.renderOffsetY = GameContext.canvas.height / 2;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }
}