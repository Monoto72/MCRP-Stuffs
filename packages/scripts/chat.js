mp.events.add('playerChat', (player, message) => {
    mp.players.broadcast(`${player.name}[${player.id}]: ${message}`);
});