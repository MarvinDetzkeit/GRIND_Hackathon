import { GameContext } from './lib.js';
import { Block } from './level.js';
import { Collectable } from './level.js';
import { Obstacle } from './level.js';
import { Level } from './level.js';
import { playJumpSound, playHitSound, playFailSound } from './sound.js';

const jumpSpeed = -20;
const slideTime = 30;

const standing = new Image();
standing.src = "game/assets/slide/HamsterStanding.png";
standing.onload = () => {};

const sliding = new Image();
sliding.src = "game/assets/slide/HamsterSliding.png";
sliding.onload = () => {};

const running = [];
for (let i = 1; i <= 2; i++) {
    running[i-1] = new Image();
    running[i-1].src = `game/assets/walk/HamsterRunning${i}.png`;
    running[i-1].onload = () => {};
}

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
        this.rFrames = 0;
        this.coins = 0;

        this.multiplier = 1;
        this.hasDoubleJump = false;
        this.canDoubleJump = false;
    }

    render(camera) {
        //GameContext.ctx.fillStyle = 'blue';
        let positionX = this.x  + camera.renderOffsetX - camera.x;
        let positionY = this.y  + camera.renderOffsetY - camera.y + 3;

        if (!GameContext.gameIsRunning) {
            GameContext.ctx.drawImage(standing, positionX, positionY, GameContext.tileSize, GameContext.tileSize * 1.5);
            return;
        }
        if (this.slideFrames > 0) {
            GameContext.ctx.drawImage(sliding, positionX, positionY, GameContext.tileSize, GameContext.tileSize * 1.5);
        }
        else {
            GameContext.ctx.drawImage(running[Math.floor(this.rFrames)], positionX, positionY,  GameContext.tileSize, GameContext.tileSize * 1.5);
        }
        
    }

    updateFrames() {
        this.rFrames += 0.125;
        if (this.rFrames >= 2) {
            this.rFrames = 0;
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
            playJumpSound();
        }
        if (this.state === "air" && this.hasDoubleJump && this.canDoubleJump && this.speedY >= -6) {
            this.canDoubleJump = false;
            this.speedY = -18 - GameContext.gravity;
            playJumpSound();
        }
    }

    handleHit() {
        if (this.iFrames <= 0) {
        this.hp -= 1;
        this.iFrames = 60;
        if (this.hp <= 0) {
            GameContext.gameIsRunning = false;
            playFailSound();
        }
        else {
            playHitSound();
        }
        }
    }
    move(level) {
        // x axis
        this.lastFrameX = this.x;
        this.x += this.speedX;
        const abstand = (GameContext.tileSize / 32) * 7;
        //iterate
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                if (j === 0 && this.slideFrames > 0) {
                    continue;
                }
                let x = this.x + (i * this.sizeX) + (abstand - (2 * abstand * i));
                let y = this.y + (j * this.sizeY / 2);
                if (j == 0) {
                    y += 18;
                }
                let tileX = Math.floor(x / GameContext.tileSize);
                let tileY = Math.floor(y / GameContext.tileSize)
                const tile = level.getTile(tileX, tileY);
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
                let x = this.x + (i * this.sizeX) + (abstand - (2 * abstand * i));
                let y = this.y + (j * this.sizeY / 2);
                if (j == 0) {
                    y += 18;
                }
                let tileX = Math.floor(x / GameContext.tileSize);
                let tileY = Math.floor(y / GameContext.tileSize)
                const tile = level.getTile(tileX, tileY);
                if (tile !== null && tile.collectable) {
                    tile.collect();
                    this.coins += this.multiplier * tile.ultra;
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
            this.canDoubleJump = true;
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
        if (this.state === "ground") {
            this.updateFrames();
        }
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