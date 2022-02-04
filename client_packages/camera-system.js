let instances = [];
let currentInstance;
let browser;

mp.events.add("cameraShowcase", (type) => {
    const cameraPreview = new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z-1);

    currentInstance = localCameras("Currently Placing", cameraPreview, type);
});

mp.events.add("cameraShowcaseAll", (cameras) => {
    cameras.forEach(element => {
        let cameraLocation = new mp.Vector3(element.location.x, element.location.y, element.location.z-1);
        instances.push(localCameras(element.name, cameraLocation));
    });
})

mp.events.add("cameraColDestroy", () => {
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


localCameras = (name, location, type = 4) => {

    const camera = {
        "marker": mp.markers.new(1, location, type, {
            color: [255, 255, 255, 255]
        }),
        "label": mp.labels.new(name, location, {
            los: true,
            font: 1,
            drawDistance: 8,
        })
    }
    return camera;
}