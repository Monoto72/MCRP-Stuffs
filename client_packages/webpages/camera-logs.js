const header = document.querySelector("#header");
const button = document.querySelector("#search-btn");

populateLogs = (entries) => {

    JSON.parse(entries)

    if (typeof entries != 'string') {
        header.insertAdjacentHTML('afterend',
        `<div class="flex w-full p-2 border-b border-gray-300">
            <div class="w-full select-none text-center">${entries}</div>
        </div>`)
        return;
    }

    logs.forEach(entry => {        
        header.insertAdjacentHTML('afterend',
        `<div class="flex w-full p-2 border-b border-gray-300">
            <div class="w-1/7 select-none text-center">test</div>
            <div class="w-1/7 select-none text-center">Character</div>
            <div class="w-1/7 select-none text-center">Date</div>
            <div class="w-1/7 select-none text-center">Amount</div>
            <div class="w-4/7 select-none text-center">Reason</div>
        </div>`)
    })
}

checkIfString = (element) => {
    if (typeof element !== 'string') return false;
    try {
        let json = JSON.parse(element);
        return (typeof json === 'object');
    } catch (e) {
        return false;
    }
}
