const header = document.querySelector("#header");

populateLogs = (entries) => {

    if(isKeyInObject(entries[0], "name") != true) {
        header.insertAdjacentHTML('afterend', `<div class="flex w-full p-2 border-b border-gray-300">
            <div class="w-full select-none text-center">${entries}</div>
        </div>`);
    } else {
        let logEntries = [];

        for (let i = 0; i < 10; i++) {
            if (entries[i]) {
                let date = new Date(entries[i].time);
                let dateFormatted = ("[" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + "]");

                let isWearingMask = entries[0].clothing.accessories == 0 ? "" : ", wearing a mask";
                //let isHoldingWeapon = entries[0].weapon == null ? "" : ` and holding ${entries[0].weapon}`
                let isHostile = entries[0].weapon == null ? false : true;

                let descriptionPassive = `A man can be seen ${entries[0].type} the camera in a passive manner.`
                let descriptionHostile = `A man can be seen ${entries[0].type} the camera in a hostile manner ${isWearingMask} ${isHoldingWeapon}`;

                let description = "";

                if (entries[0].clothing.accessories != 0 || entries.weapon != null) {
                    description = descriptionHostile;
                } else {
                    description = descriptionPassive;
                }

                logEntries.push(`<div class="flex w-full p-2 border-b border-gray-300">
                    <div class="w-1/7 select-none text-center">${dateFormatted}</div>
                    <div class="w-1/7 select-none text-center">Character</div>
                    <div class="w-1/7 select-none text-center">Date</div>
                    <div class="w-1/7 select-none text-center">${isHostile}</div>
                    <div class="w-4/7 select-none text-center">${description}</div>
                </div>`)
            }
        }
        
        logEntries.forEach(element => {
            header.insertAdjacentHTML('afterend', element)
        })
    }
}

isKeyInObject = (element, key) => {
    return Object.keys(element).some(e => e == key);
}
