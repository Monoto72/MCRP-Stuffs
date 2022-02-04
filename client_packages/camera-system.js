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

mp.events.add('cameraColDestroy', () => {
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
});

mp.events.add('withinCameraColshape', (camera) => {
    withinCameraLocation = true;
    cameraObject = camera;
})

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
        mp.events.callRemote("removeCamera", [cameraObject]);
        mp.gui.chat.push("Yes")
        withinCameraLocation = !withinCameraLocation;
        cameraObject = null;
    }
});


localCameras = (name, location, type, serverName = "Currently within", serverID = "") => {

    const labelLocation = location.clone()
    labelLocation.z = labelLocation.z+1.5;

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
        "marker": mp.markers.new(1, location, type, {
            color: [255, 255, 255, 255]
        }),
        "label": mp.labels.new(`Camera: ${name} \n Server: ${serverName} \n Size: ${size(type)}`, labelLocation, {
            los: true,
            font: 1,
            drawDistance: 8,
        })
    }
    return camera;
}