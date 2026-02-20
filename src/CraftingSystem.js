const PREFIXES = ["Rusty", "Iron", "Steel", "Mithril", "Legendary"];
const COLORS = ["#777", "#aaa", "#fff", "#aaf", "#fa0"];
const BASE_DAMAGE = [5, 10, 20, 45, 100];
const COST_COINS = 50;
const COST_RES = 10;

export function attemptCrafting(player) {
    if (player.coins < COST_COINS || player.resources < COST_RES) {
        return { success: false, reason: "Not enough resources (needs 10 Resources, 50 Coins)." };
    }

    // Consume
    player.coins -= COST_COINS;
    player.resources -= COST_RES;

    // Gacha Logic (higher is harder)
    let roll = Math.random() * 100;
    let tier = 0; // Rusty
    if (roll > 50) tier = 1; // Iron
    if (roll > 80) tier = 2; // Steel
    if (roll > 95) tier = 3; // Mithril
    if (roll > 99) tier = 4; // Legendary

    let wpn = {
        name: `${PREFIXES[tier]} Sword`,
        damage: BASE_DAMAGE[tier] + Math.floor(Math.random() * 5),
        range: 40 + (tier * 5),
        color: COLORS[tier],
        tier: tier
    };

    player.weapons.push(wpn);

    // Auto-equip if stronger
    if (!player.currentWeaponStats || wpn.damage > player.currentWeaponStats.damage) {
        player.currentWeaponStats = { damage: wpn.damage, range: wpn.range };
    }

    return { success: true, weapon: wpn };
}

export function attemptSynthesis(player, weaponIndex) {
    let costCoin = 25;
    let costRes = 5;

    if (player.coins < costCoin || player.resources < costRes) {
        return { success: false, reason: "Not enough resources to upgrade (needs 5 Resources, 25 Coins)." };
    }

    let wpn = player.weapons[weaponIndex];
    if (typeof wpn === 'string') {
        // Convert basic initial weapon
        wpn = { name: 'Enhanced Basic Sword', damage: 15, range: 42, color: '#ddd', tier: 0 };
        player.weapons[weaponIndex] = wpn;
    } else {
        // Upgrade existing
        wpn.damage += Math.floor(Math.random() * 5) + 2;
        wpn.name = `+1 ${wpn.name}`;
    }

    player.coins -= costCoin;
    player.resources -= costRes;

    // re-calculate auto equip
    let best = null;
    player.weapons.forEach(w => {
        let dmg = w.damage || 10;
        if (!best || dmg > best.damage) best = { damage: dmg, range: w.range || 40 };
    });
    player.currentWeaponStats = best;

    return { success: true, weapon: wpn };
}
