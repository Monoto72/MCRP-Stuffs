let instances = [];
let currentInstance;
let browser;
let withinCameraLocation = false;
let cameraObject = [];


mp.events.add('serverShowcase', (location, size) => {
    let serverPreview;

    serverPreview = mp.markers.new(1, location, size, {
        color: [0, 255, 0, 255]
    });

    setTimeout(() => {
        serverPreview.destroy();
    }, 10000)
});

mp.events.add('cameraShowcase', (type) => {
    const cameraPreview = new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z-1);

    currentInstance = localCameras("Currently Placing", cameraPreview, type);
});

mp.events.add('cameraShowcaseAll', (cameras) => {
    cameras.forEach(element => {
        let cameraLocation = new mp.Vector3(element.location.x, element.location.y, element.location.z-1);
        instances.push(localCameras(element.name, cameraLocation, element.size, element.serverName));
    });
})

mp.events.add('cameraColDestroy', (deletedCamera) => {
    if (!deletedCamera) {
        if (currentInstance) {
            currentInstance.marker.destroy();
            currentInstance.label.destroy();
            currentInstance = null;
        } else {
            instances.forEach(element => {
                element.marker.destroy();
                element.label.destroy();
            });
        }
    } else {
        let deletedLocation = new mp.Vector3(deletedCamera.location.x, deletedCamera.location.y, deletedCamera.location.z);
        let instanceIndex = instances.findIndex(element => (mp.game.system.vdist(element.location.x, element.location.y, element.location.z, deletedLocation.x, deletedLocation.y, deletedLocation.z)) == 1);

        instances[instanceIndex].marker.destroy();
        instances[instanceIndex].label.destroy();
        instances.splice(instanceIndex, 1);

        cameraObject = [];
    }
});

mp.events.add('withinCameraColshape', (toggle, camera) => {
    if (toggle) {
        withinCameraLocation = true;
        cameraObject = camera;
        mp.gui.chat.push(`[withinCameraColshape] entered ${camera.name}`)
    } else {
        cameraObject = [];
        mp.gui.chat.push(`[withinCameraColshape] exited ${camera.name}`)
    }
});

mp.keys.bind(0x71, true, () => {
    if (!browser) {
        browser = mp.browsers.new(`package://webpages/camera-logs.html`);
    }
});

mp.keys.bind(0x72, true, () => {
    if (browser) { 
        browser.destroy();
        browser = null;
    }
});

mp.keys.bind(0x2E, true, () => {
    if (withinCameraLocation) {
        mp.events.callRemote("removeCamera", JSON.stringify(cameraObject));
        mp.gui.chat.push(`[Delete] executed in colshape ${cameraObject.name}`)
        withinCameraLocation = !withinCameraLocation;
    }
});


localCameras = (name, location, type, serverName = "Currently within") => {
    const markerLocation = location.clone();
    const labelLocation = location.clone();

    markerLocation.z = labelLocation.z + 0.02;
    labelLocation.z = labelLocation.z + 1.5;

    size = () => {
        let size = "";

        switch (type) {
            case 2:
                size = "Small";
                break;
            case 4:
                size = "Medium";
                break;
            case 6:
                size = "Large";
                break;
            default:
        }
        return size;
    }

    const camera = {
        "marker": mp.markers.new(25, markerLocation, type, {
            color: [255, 255, 255, 255],
            rotation: new mp.Vector3(0, 0, 90)
        }),
        "label": mp.labels.new(`Camera: ${name} \n Server: ${serverName} \n Size: ${size(type)}`, labelLocation, {
            los: true,
            font: 1,
            drawDistance: 8,
        }),
        "location": location
    }
    return camera;
}