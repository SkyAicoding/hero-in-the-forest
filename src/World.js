import { Enemy } from './Enemy.js';
import { Player } from './Player.js';
import { Sprite } from './Sprite.js';

let enemies = [];
let drops = []; // coins and resources
let resourceNodes = [];
let craftingTable = { x: 500, y: 0, width: 80, height: 60 };
let bgSprites = [];

export function initWorld() {
    // Backgrounds
    bgSprites.push(new Sprite('/public/Background/Background.png', null, null, 1, 1)); // static for now

    // Initial mobs
    enemies.push(new Enemy(800, 300, 'Boar'));
    enemies.push(new Enemy(1200, 300, 'Boar'));

    // Resource Nodes (Rocks/Trees)
    resourceNodes.push({ x: 300, y: 0, width: 40, height: 50, health: 30, max: 30 });
    resourceNodes.push({ x: 1500, y: 0, width: 40, height: 50, health: 30, max: 30 });
}

export function updateWorld(dt, gameState) {
    const floorY = gameState.height - 100;
    craftingTable.y = floorY - craftingTable.height / 2;

    for (let node of resourceNodes) {
        node.y = floorY - node.height / 2;
    }

    // Update Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        e.update(dt, floorY);
        if (e.health <= 0 && e.deadTime > 1.0) {
            // Drop coin
            drops.push({ type: 'coin', x: e.x, y: e.y, vy: -200, life: 10 });
            enemies.splice(i, 1);
        }
    }

    // Update drops
    for (let i = drops.length - 1; i >= 0; i--) {
        let d = drops[i];
        d.vy += 1000 * dt;
        d.y += d.vy * dt;
        if (d.y > floorY - 10) d.y = floorY - 10;

        // Collect
        if (Math.abs(d.x - Player.x) < 30 && Math.abs(d.y - Player.y) < 50) {
            if (d.type === 'coin') Player.coins += Math.floor(Math.random() * 5) + 1;
            if (d.type === 'resource') Player.resources += 1;
            drops.splice(i, 1);
        } else {
            d.life -= dt;
            if (d.life <= 0) drops.splice(i, 1);
        }
    }

    // Check crafting table distance
    let distToTable = Math.abs(Player.x - craftingTable.x);
    if (distToTable < 100) {
        window.nearCraftingTable = true;
    } else {
        window.nearCraftingTable = false;
    }
}

export function spawnAttackHitbox(player) {
    let hitboxX = player.facingRight ? player.x + 20 : player.x - 60;
    let hitboxY = player.y - 20;
    let hitboxW = player.currentWeaponStats.range || 40;
    let hitboxH = 50;

    const damage = player.currentWeaponStats.damage || 10;

    // Check enemies
    for (let e of enemies) {
        if (e.health > 0) {
            if (hitboxX < e.x + e.width && hitboxX + hitboxW > e.x - e.width &&
                hitboxY < e.y + e.height && hitboxY + hitboxH > e.y - e.height) {
                e.health -= damage;
                e.vx *= -1; // knockback intent
                e.x += (player.facingRight ? 10 : -10);
            }
        }
    }

    // Check resources
    for (let i = resourceNodes.length - 1; i >= 0; i--) {
        let node = resourceNodes[i];
        if (hitboxX < node.x + node.width && hitboxX + hitboxW > node.x - node.width &&
            hitboxY < node.y + node.height && hitboxY + hitboxH > node.y - node.height) {
            node.health -= damage;
            if (node.health <= 0) {
                for (let c = 0; c < 3; c++) {
                    drops.push({ type: 'resource', x: node.x + Math.random() * 20, y: node.y - 10, vy: -150 - Math.random() * 100, life: 15 });
                }
                resourceNodes.splice(i, 1);
            }
        }
    }
}

export function drawWorld(ctx, gameState) {
    const floorY = gameState.height - 100;

    // Background (parallax pseudo)
    if (bgSprites[0] && bgSprites[0].isReady) {
        // Simple tile repeat
        ctx.fillStyle = '#121215';
        ctx.fillRect(-5000, 0, 10000, gameState.height);

        let bgImg = bgSprites[0].image;
        let scale = gameState.height / bgImg.height; // Scale to fill height
        let w = bgImg.width * scale;

        // draw repeating bg
        let camOffset = (gameState.camera.x * 0.2) % w;
        for (let i = -1; i < 4; i++) {
            ctx.drawImage(bgImg, gameState.camera.x - camOffset + i * w, 0, w, gameState.height);
        }
    }

    // Ground
    ctx.fillStyle = '#2d1b11';
    ctx.fillRect(gameState.camera.x, floorY, gameState.width, 100);
    ctx.fillStyle = '#4c321g'; // grass logic
    ctx.fillRect(gameState.camera.x, floorY, gameState.width, 15);

    // Crafting table
    ctx.fillStyle = '#853';
    ctx.fillRect(craftingTable.x - craftingTable.width / 2, craftingTable.y - craftingTable.height / 2, craftingTable.width, craftingTable.height);

    // Resource Nodes
    for (let node of resourceNodes) {
        ctx.fillStyle = '#778'; // grey rock
        ctx.fillRect(node.x - node.width / 2, node.y - node.height / 2, node.width, node.height);
        // Health bar
        ctx.fillStyle = 'black';
        ctx.fillRect(node.x - 20, node.y - node.height / 2 - 15, 40, 5);
        ctx.fillStyle = 'red';
        ctx.fillRect(node.x - 20, node.y - node.height / 2 - 15, 40 * (node.health / node.max), 5);
    }

    // Drops
    for (let d of drops) {
        ctx.fillStyle = d.type === 'coin' ? 'gold' : '#9bb';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.type === 'coin' ? 6 : 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.stroke();
    }

    // Enemies
    for (let e of enemies) {
        e.draw(ctx);
    }
}
