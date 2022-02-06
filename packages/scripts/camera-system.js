let servers = [];
let serverID = 0; // Will be taken from a DB once added

mp.events.addCommand("place", (player, _, cameraType) => {
    let small = 2;
    let medium = 4;
    let large = 6;

    if (player.serverLimit != 1) return player.outputChatBox("You currently don't have a server: /deploy");
    const serverArea = servers[0].location.subtract(player.position).length();
    if (serverArea >= 12) return player.outputChatBox(`You are not within the servers range`);
    if (player.togglingCams) return player.outputChatBox("You are currently toggling cameras");
    if (!servers[0].active) return player.outputChatBox("Server is currently down please repair it...");
    if (player.cameraActive) return player.outputChatBox(`You are already placing a camera`);
    if (!cameraType) return player.outputChatBox(`Invalid syntax: /place <small|medium|large>`);

    switch(cameraType) {
        case "small":
            player.cameraActive = !player.cameraActive;
            cameraPreview(player, small)
        break;
        case "medium":
            player.cameraActive = !player.cameraActive;
            cameraPreview(player, medium)
        break;
        case "large":
            player.cameraActive = !player.cameraActive;
            cameraPreview(player, large)
        break;
        default:
            player.outputChatBox(`Invalid syntax: ${cameraType} does not exist! /place <small|medium|large>`);
    }
});

mp.events.addCommand("confirm", (player, _, name = "defaultCamera") => {
    if (!player.cameraActive) return player.outputChatBox("You are not currrently placing a camera");

    let server = servers.filter((element) => element.playerID == player.id);
    server[0].cameras.push({
        "colshape": player.camera[0],
        "serverName": server[0].name,
        "serverID": server[0].id,
        "name": name,
        "playerID": player.id,
        "location": player.camera[1],
        "size": player.camera[2],
        "active": true,
        "logs": []
    });

    player.call("cameraColDestroy");
    player.cameraActive = !player.cameraActive;
});

mp.events.addCommand("deny", (player) => {
    if (player.cameraActive) return player.outputChatBox("You are not currrently placing a camera");

    player.call("cameraColDestroy");
    player.cameraActive = !player.cameraActive;
});

mp.events.addCommand("servers", (player) => {
    let names = "";
    if (servers.length == 0) return player.outputChatBox(`No servers are active`);
    servers.forEach(element => {
        if (element.playerID == player.id) {
            names += element.name + ", ";
        }
    })
    player.outputChatBox(`Active Servers: ${names.slice(0, names.length - 2)}`)
});

mp.events.addCommand("checklogs", (player, _, server, camera) => {
    if (!server || !camera) return player.outputChatBox(`Invalid syntax: /checklogs <server> <camera>`);
    servers.forEach(element => {
        if (element.playerID == player.id) {
            if (element.name.toLowerCase() == server.toLowerCase()) {
                element.cameras.forEach(cameras => {
                    if (cameras.name.toLowerCase() == camera.toLowerCase()) {
                        if (cameras.logs.length > 0) {
                            cameras.logs.forEach(log => {
                                let date = new Date(log.time);
                                let formatedDate = ("[" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + "]");
                                player.outputChatBox(`(${log.playerID}) ${formatedDate} a male would be seen ${log.type} wearing a Super Kawaii Mask, alongside a Heavy Pistol in his right hand`);
                            });
                        } else if (element.active === false) return player.outputChatBox("Server is down, unfortunately all logs have been deleted from the server");
                        else return player.outputChatBox("No logs can be found");
                    }
                });
            }
        }
    });
});

// /checklogs defaultServer test

mp.events.addCommand("deploy", (player, _, name = "defaultServer") => {
    if (player.serverLimit < 1) {
        let placement = new mp.Vector3(player.position.x + Math.sin(-player.heading * Math.PI / 180) * 1.45, player.position.y + Math.cos(-player.heading * Math.PI / 180) * 1.45, player.position.z - 0.98);

        player.call("serverShowcase", [placement, 25])

        // xm_base_cia_server_01 - Inside Server
        // prop_elecbox_19 - Outside Server
        player.character.objects = mp.objects.new("prop_elecbox_19", placement, {
            rotation: new mp.Vector3(0, 0, player.heading)
        });

        player.server = mp.colshapes.newSphere(player.position.x + Math.sin(-player.heading * Math.PI / 180) * 1.45, player.position.y + Math.cos(-player.heading * Math.PI / 180) * 1.45, player.position.z - 0.98, 3);

        servers.push({
            "colshape": player.server,
            "name": name,
            "id": serverID,
            "playerID": player.id,
            "location": placement,
            "active": true,
            "cameras": []
        });

        serverID++;
        player.serverLimit++;
    }
});

mp.events.addCommand("toggleCams", (player) => {
    let currentServer = player.character.nearServer[1];

    if (currentServer.cameras.length === 0 && !player.togglingCams) {
        if (!player.character.nearServer[0]) return player.outputChatBox(`Try going to a server`)
        if (currentServer.playerID !== player.id) return player.outputChatBox(`This is not your server`);
        if (currentServer.cameras.length === 0) return player.outputChatBox(`${currentServer.name} has no cameras within`);
    }

    if (!player.togglingCams) {
        let currentCams = [];

        servers.forEach(element => {
            if (element.playerID == player.id) {
                element.cameras.forEach(camera => {
                    currentCams.push(camera);
                });
            }
        });
        player.call("cameraShowcaseAll", [currentCams]);

        player.outputChatBox("Camera showcase has been enabled");
        player.togglingCams = !player.togglingCams;
    } else {
        player.call("cameraColDestroy");

        player.outputChatBox("Camera showcase has been disabled");
        player.togglingCams = !player.togglingCams;
    };
});

mp.events.addCommand("test", (player) => {
     console.dir(servers);
     console.dir(servers[0].cameras)
});

// && player.character.nearServer[1].playerID !== playerID
mp.events.addCommand("cut", (player) => {
    if (player.character.nearServer[0] === true && player.character.nearServer[1].active === true) {
        player.character.nearServer[1].active = false;
        player.character.nearServer[1].cameras.forEach(element => {
            element.active = false;
            element.logs = [];
        });
    } else {
        player.outputChatBox("Server has recently been cut");
    }
});

mp.events.addCommand("repair", (player) => {
    if (player.character.nearServer[0] === true && player.character.nearServer[1].active === false) {
        player.character.nearServer[1].active = true;
        player.character.nearServer[1].cameras.forEach(element => {
            element.active = true;
        });
    } else {
        player.outputChatBox("Server is already repaired")
    }
});

mp.events.add('playerEnterColshape', (player, colshape) => {
    let serverIndex = servers.findIndex(server => server.cameras.some(camera => camera.colshape.id === colshape.id));

    if (servers[serverIndex]) {
        servers[serverIndex].cameras.forEach(element => {
            if (element.colshape.id == colshape.id && element.active === true) {
                if (element.playerID == player.id && player.togglingCams) player.call("withinCameraColshape", [true, element])
                if (element.logs.length <= 200) element.logs.shift();

                element.logs.push(logs(player, "entering"));
            }
        });
    }

    servers.forEach(element => {
        if (element.colshape.id == colshape.id) {
            player.character.nearServer = [!player.character.nearServer, element];
        }
    });
});

mp.events.add('playerExitColshape', (player, colshape) => {
    let serverIndex = servers.findIndex(server => server.cameras.some(camera => camera.colshape.id === colshape.id));

    if (servers[serverIndex]) {
        servers[serverIndex].cameras.forEach(element => {
            if (element.colshape.id == colshape.id && element.active === true) {
                if (element.playerID == player.id && player.togglingCams) player.call("withinCameraColshape", [false, element])
                if (element.logs.length <= 200) element.logs.shift();

                element.logs.push(logs(player, "exiting"));
            }
        });
    }

    servers.forEach(element => {
        if (element.colshape.id == colshape.id) {
            player.character.nearServer = !player.character.nearServer;
        }
    });
});

mp.events.add('removeCamera', (player, localCamera) => {
    localCamera = JSON.parse(localCamera);
    let localCameraLocation = new mp.Vector3(localCamera.location.x, localCamera.location.y, localCamera.location.z);
    let serverIndex = servers.findIndex(server => server.cameras.some(camera => localCameraLocation.equals(camera.location)));
    let cameraIndex = 0;

    servers[serverIndex].cameras.forEach(camera => {
        if (localCameraLocation.equals(camera.location)) {
            player.call("cameraColDestroy", [camera])
            servers[serverIndex].cameras.splice(cameraIndex, 1);
        }
        cameraIndex++;
    })
});

logs = (player, type) => {
    const playerLog = {
        "name":player.name,
        "playerID":player.id,
        "clothing":{
            "head": player.getClothes(0),
            "beard": player.getClothes(1),
            "hair": player.getClothes(2),
            "torso": player.getClothes(3),
            "legs": player.getClothes(4),
            "foot": player.getClothes(6),
            "accessories": player.getClothes(9)
        },
        "vehicle": player.vehicle == null ? "none" : {
            "car": player.vehicle.model,
            "plate": player.vehicle.numberPlate
        },
        "type": type,
        "time": Date.now()
    }
    return playerLog;
}

cameraPreview = (player, size) => {
    player.camera = [mp.colshapes.newSphere(player.position.x, player.position.y, player.position.z, size), player.position, size];

    player.call("cameraShowcase", [size]);
}

sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}