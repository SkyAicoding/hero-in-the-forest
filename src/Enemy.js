import { Sprite } from './Sprite.js';
import { Player } from './Player.js';

export class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.vx = (Math.random() > 0.5 ? 1 : -1) * 50; // Random direction
        this.vy = 0;
        this.health = 30;
        this.state = 'idle';
        this.facingRight = this.vx > 0;

        let spritePath = `/public/Mob/${this.type}/Idle/Idle-Sheet.png`;
        this.sprite = new Sprite(spritePath, null, null, 4, 10);
        this.deadTime = 0;
    }

    update(dt, floorY) {
        if (this.health <= 0) {
            this.deadTime += dt;
            return;
        }

        // Simple patrol
        this.x += this.vx * dt;

        // Boundaries arbitrary for now
        if (this.x < 0 || this.x > 3000) {
            this.vx *= -1;
            this.facingRight = this.vx > 0;
        }

        // Gravity
        this.vy += 1000 * dt;
        this.y += this.vy * dt;
        if (this.y + this.height / 2 >= floorY) {
            this.y = floorY - this.height / 2;
            this.vy = 0;
        }

        // Damage Player
        if (Math.abs(this.x - Player.x) < this.width / 2 + Player.width / 2 &&
            Math.abs(this.y - Player.y) < this.height / 2 + Player.height / 2) {
            if (Player.attackTimer <= 0) {
                Player.health -= 10 * dt; // DPS
            }
        }

        this.sprite.update();
    }

    draw(ctx) {
        if (this.health <= 0) {
            ctx.globalAlpha = Math.max(0, 1 - this.deadTime);
        }

        if (this.sprite.isReady) {
            this.sprite.draw(ctx, this.x, this.y + this.height / 2, 2, !this.facingRight);
        } else {
            ctx.fillStyle = this.type === 'Boar' ? 'brown' : 'orange';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }

        ctx.globalAlpha = 1.0;
    }
}
