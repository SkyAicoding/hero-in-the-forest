import { attemptCrafting, attemptSynthesis } from './CraftingSystem.js';

const uiHealth = document.getElementById('hud-health');
const uiCoins = document.getElementById('hud-coins');
const uiResources = document.getElementById('hud-resources');
const interactionPrompt = document.getElementById('interaction-prompt');
const inventoryUI = document.getElementById('inventory-ui');
const btnCraft = document.getElementById('btn-craft');
const gachaResult = document.getElementById('gacha-result');
const weaponList = document.getElementById('weapon-list');

let menuOpen = false;

export function updateUI(player) {
    uiHealth.textContent = `Health: ${Math.floor(player.health)}`;
    uiCoins.textContent = `Coins: ${player.coins}`;
    uiResources.textContent = `Resources: ${player.resources}`;

    // Interaction prompt
    if (window.nearCraftingTable && !menuOpen) {
        interactionPrompt.style.display = 'block';
    } else {
        interactionPrompt.style.display = 'none';
    }

    // List weapons
    if (menuOpen) {
        weaponList.innerHTML = '';
        player.weapons.forEach((w, index) => {
            let desc = w.name ? `${w.name} (Dmg:${w.damage})` : w;
            weaponList.innerHTML += `<li>
                ${desc}
                <button onclick="window.upgradeWeapon(${index})" style="padding: 2px 5px; font-size: 12px; margin-left: 10px;">Upgrade (+5 Res/25 Coin)</button>
            </li>`;
        });
    }
}

// Global Input specific to UI
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') {
        if (window.nearCraftingTable) {
            menuOpen = !menuOpen;
            inventoryUI.style.display = menuOpen ? 'block' : 'none';
            if (!menuOpen) gachaResult.textContent = '';
        }
    }
});

btnCraft.addEventListener('click', () => {
    // import player by closure or global (lazy way since ES6 modules are singletons)
    import('./Player.js').then(module => {
        const p = module.Player;
        const res = attemptCrafting(p);
        if (res.success) {
            gachaResult.style.color = 'lightgreen';
            gachaResult.innerHTML = `Success! You crafted a <b style="color:${res.weapon.color}">${res.weapon.name}</b>!<br>Damage: ${res.weapon.damage}, Range: ${res.weapon.range}`;
            updateUI(p); // refresh list
        } else {
            gachaResult.style.color = 'red';
            gachaResult.textContent = res.reason;
        }
    });
});

window.upgradeWeapon = function (index) {
    import('./Player.js').then(module => {
        const p = module.Player;
        const res = attemptSynthesis(p, index);
        if (res.success) {
            gachaResult.style.color = 'lightgreen';
            gachaResult.innerHTML = `Upgraded to <b style="color:${res.weapon.color}">${res.weapon.name}</b> (+Dmg/Range)!`;
            updateUI(p); // refresh list
        } else {
            gachaResult.style.color = 'red';
            gachaResult.textContent = res.reason;
        }
    });
};
