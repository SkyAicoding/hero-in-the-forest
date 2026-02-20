import { initWorld, updateWorld, drawWorld } from './World.js';
import { updatePlayer, drawPlayer, handleInput, Player, initPlayer } from './Player.js';
import { updateUI } from './UI.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
export const GameState = {
  keys: {},
  camera: { x: 0, y: 0 },
  gravity: 0.5,
  deltaTime: 0,
  lastTime: 0,
  width: 0,
  height: 0
};

// Handle window resizing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  GameState.width = canvas.width;
  GameState.height = canvas.height;
  ctx.imageSmoothingEnabled = false; // keep pixel art sharp
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initialize size

// Input handling
window.addEventListener('keydown', (e) => {
  GameState.keys[e.code] = true;
  handleInput(e.code, true);
});

window.addEventListener('keyup', (e) => {
  GameState.keys[e.code] = false;
  handleInput(e.code, false);
});

async function init() {
  initPlayer();
  await initWorld();

  // Start game loop
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  GameState.deltaTime = (timestamp - GameState.lastTime) / 1000;
  if (GameState.deltaTime > 0.1) GameState.deltaTime = 0.1; // Cap dt
  GameState.lastTime = timestamp;

  update(GameState.deltaTime);
  draw(ctx);

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  updatePlayer(dt, GameState);
  updateWorld(dt, GameState);
  updateUI(Player);
}

function draw(ctx) {
  // Clear screen
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // Move camera
  ctx.translate(-GameState.camera.x, -GameState.camera.y);

  drawWorld(ctx, GameState);
  drawPlayer(ctx, GameState);

  ctx.restore();
}

// Start
init();
