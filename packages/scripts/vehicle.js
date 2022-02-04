mp.events.add('playerEnteredVehicle', (player) => {
    if (player.vehicle && player.seat === 0 || player.seat === 255)
        player.call('playerEnteredVehicle');
});

mp.events.add('playerExitVehicle', (player) => {
    player.call('playerExitVehicle');
});

mp.events.addCommand('vehicle', (player, _, vehName) => {
    if (vehName && vehName.trim().length > 0) {
        let pos = player.position;
        pos.x += 2;

        if (player.character.vehicle) {
            player.character.vehicle.model = mp.joaat(vehName);
        } else {
            player.character.vehicle = mp.vehicles.new(mp.joaat(vehName), pos);
        }
    } else {
        player.outputChatBox(`Command syntax: /vehicle [vehicle_name]`);
    }
});



mp.events.addCommand('fix', (player) => {
    if (player.vehicle)
        player.vehicle.repair();
    else
        player.outputChatBox(`Error: you are not in the vehicle!`);
});

mp.events.addCommand('flip', (player) => {
    if (player.vehicle) {
        let rotation = player.vehicle.rotation;
        rotation.y = 0;
        player.vehicle.rotation = rotation;
    } else {
        player.outputChatBox(`Error: you are not in the vehicle!`);
    }
});

mp.events.addCommand("car", (player, arr) => {

    if (player.character.vehicle) player.character.vehicle.destroy();

    let pos = player.position;
    pos.x += 2;

    player.character.vehicle = mp.vehicles.new(mp.joaat("retinue2"), pos, {
        numberPlate: "Alonso"
    });

    max(player.character);

    if (arr) {
        let mods = arr.split(", ");
        console.dir(mods);

        modifications(player.character, mods);
    }
});

modifications = (player, mod) => {
    player.vehicle.setMod(0, Number(mod[0])); // Spoiler
    player.vehicle.setMod(1, Number(mod[1])); // Front Bumper
    player.vehicle.setMod(2, Number(mod[2])); // Rear Bumper
    player.vehicle.setMod(5, Number(mod[3])); // Roll Cage
    player.vehicle.setMod(7, Number(mod[4])); // Hood
    player.vehicle.setMod(8, Number(mod[5])); // Fender
    player.vehicle.setMod(10, Number(mod[6])); // Roof
    player.vehicle.setMod(11, Number(mod[7])); // Mirror
    player.vehicle.setMod(37, Number(mod[8])); // Trunk
}

max = (player) => {
    player.vehicle.setMod(11, 3); // Engine
    player.vehicle.setMod(12, 2); // Break
    player.vehicle.setMod(13, 2); // Transmission
    player.vehicle.setMod(15, 2); // Suspension
    player.vehicle.setMod(18, 0); // Turbo

    player.vehicle.setMod(22, 0); // Xenon
    player.vehicle.setMod(46, 1); // Window Tint
    player.vehicle.setMod(23, 18) // Wheel

    player.vehicle.setColor(14, 0) // Main/ Secondary Color
    player.vehicle.pearlescentColor = 106;
}

// /car 5, 5, 0, 4, 6, 3, 4, 3, 3