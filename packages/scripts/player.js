let spawnPoints = require('./configs/spawn_points.json').SpawnPoints;

mp.events.add('playerJoin', (player) => {
    player.character = {};
    player.cameraActive = false;
    player.togglingCams = false;
    player.character.nearServer = false;
    player.serverLimit = 0;
    player.gender = "Male"

    mp.players.forEach(_player => {
        if (_player != player)
            _player.call('playerJoinedServer', [player.id, player.name]);
    });

    player.spawn(spawnPoints[Math.floor(Math.random() * spawnPoints.length)]);

    player.model = "mp_m_freemode_01"
    player.health = 100;
    player.armour = 100;

    player.setClothes(1, 44, 0, 0);
});

mp.events.add('playerQuit', (player) => {
    if (player.character.vehicle) {
        player.character.vehicle.destroy();
    }

    mp.players.forEach(_player => {
        if (_player != player) {
            _player.call('playerLeavedServer', [player.id, player.name]);
        }
    });
});

mp.events.add('playerDeath', (player) => {
    player.spawn(spawnPoints[Math.floor(Math.random() * spawnPoints.length)]);

    player.health = 100;
    player.armour = 100;
});

mp.events.addCommand('kill', (player) => {
    player.health = 0;
});

mp.events.addCommand('heal', (player) => {
    player.health = 100;
});

mp.events.addCommand('armour', (player) => {
    player.armour = 100;
});