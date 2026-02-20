import { Sprite } from './Sprite.js';
import { spawnAttackHitbox } from './World.js';

export const Player = {
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    speed: 200,
    jumpForce: -400,
    width: 32,
    height: 48,
    grounded: false,
    facingRight: true,
    state: 'idle', // idle, run, jump, attack
    health: 100,
    coins: 0,
    resources: 0,
    weapons: ['Basic Sword'],
    currentWeaponStats: { damage: 10, range: 40 },
    sprites: {},
    attackTimer: 0
};

// Map keys to inputs
const inputs = { left: false, right: false, up: false, attack: false, interact: false };

export function handleInput(code, isDown) {
    if (code === 'ArrowLeft' || code === 'KeyA') inputs.left = isDown;
    if (code === 'ArrowRight' || code === 'KeyD') inputs.right = isDown;
    if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') inputs.up = isDown;
    if (code === 'KeyF' || code === 'KeyZ' || code === 'Enter') inputs.attack = isDown;
    if (code === 'KeyE') inputs.interact = isDown;
}

export function initPlayer() {
    Player.sprites = {
        idle: new Sprite('/public/Character/Idle/Idle-Sheet.png', null, null, 4, 8),
        run: new Sprite('/public/Character/Run/Run-Sheet.png', null, null, 8, 5),
        jump: new Sprite('/public/Character/Jump-All/Jump-All-Sheet.png', null, null, 15, 4),
        attack: new Sprite('/public/Character/Attack-01/Attack-01-Sheet.png', null, null, 8, 4),
        dead: new Sprite('/public/Character/Dead/Dead-Sheet.png', null, null, 8, 8),
    };
}

export function updatePlayer(dt, gameState) {
    if (Player.health <= 0) {
        Player.state = 'dead';
        Player.sprites.dead.update();
        return;
    }

    if (Player.attackTimer > 0) {
        Player.attackTimer -= dt;
        Player.sprites.attack.update();
    } else {
        // Movement
        if (inputs.left) {
            Player.vx = -Player.speed;
            Player.facingRight = false;
        } else if (inputs.right) {
            Player.vx = Player.speed;
            Player.facingRight = true;
        } else {
            Player.vx = 0;
        }

        // Jump
        if (inputs.up && Player.grounded) {
            Player.vy = Player.jumpForce;
            Player.grounded = false;
        }

        // Attack
        if (inputs.attack && Player.grounded) {
            Player.state = 'attack';
            Player.attackTimer = 0.5; // attack duration
            Player.sprites.attack.currentFrame = 0; // reset
            spawnAttackHitbox(Player);
            inputs.attack = false; // prevent hold spam
        } else {
            // State
            if (!Player.grounded) {
                Player.state = 'jump';
            } else if (Math.abs(Player.vx) > 0) {
                Player.state = 'run';
            } else {
                Player.state = 'idle';
            }
        }
    }

    // Apply Velocity
    Player.vy += 1000 * dt; // gravity
    Player.x += Player.vx * dt;
    Player.y += Player.vy * dt;

    // Floor collision temp
    const floorY = gameState.height - 100;
    if (Player.y + Player.height / 2 >= floorY) {
        Player.y = floorY - Player.height / 2;
        Player.vy = 0;
        Player.grounded = true;
    } else {
        Player.grounded = false;
    }

    // Update sprite
    if (Player.sprites[Player.state]) {
        Player.sprites[Player.state].update();
    }

    // Camera follow
    gameState.camera.x = Player.x - gameState.width / 2;
    // gameState.camera.y = Player.y - gameState.height / 2 + 100;
}

export function drawPlayer(ctx, gameState) {
    const scale = 2; // pixel scale
    const sprite = Player.sprites[Player.state];

    if (sprite && sprite.isReady) {
        sprite.draw(ctx, Player.x, Player.y + Player.height / 2, scale, !Player.facingRight);
    } else {
        // Fallback rectangular player
        ctx.fillStyle = 'red';
        ctx.fillRect(Player.x - Player.width / 2, Player.y - Player.height / 2, Player.width, Player.height);
    }
}
