let teleports = require('./configs/teleports.json').teleports;

mp.events.addCommand('pos', (player) => console.log(player.position));

mp.events.addCommand('warp', (player, _, location) => {
    if (location && location.trim().length > 0) {
        player.position = new mp.Vector3(teleports[location][0], teleports[location][1], teleports[location][2]);
    } else {
        const locations = Object.keys(teleports).join(" ");
        player.outputChatBox(`Command syntax: /warp [${locations}]`);
    }
});

mp.events.addCommand('tp', (player, _, playerID) => {
    if (playerID && playerID.trim().length > 0) {
        let sourcePlayer = mp.players.at(parseInt(playerID));

        if (sourcePlayer) {
            let playerPos = sourcePlayer.position;
            playerPos.x += 1;
            player.position = playerPos;
        } else {
            player.outputChatBox(`Warp: player with such ID not found!`);
        }
    } else {
        player.outputChatBox(`Command syntax: /warp [player_id]`);
    }
});

mp.events.addCommand('skin', (player, _, skinName) => {
    if (skinName && skinName.trim().length > 0) {
        player.model = mp.joaat(skinName);
    } else {
        player.outputChatBox(`Command syntax: /skin [skin_name]`);
    }
});

mp.events.addCommand('weapon', (player, _, weaponName) => {
    if (weaponName.trim().length > 0) {
        player.giveWeapon(mp.joaat(`weapon_${weaponName}`), 100);
    } else {
        player.outputChatBox(`Command syntax: /weapon [weapon_name]`);
    }
});
