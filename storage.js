function getGifts() {
    return JSON.parse(localStorage.getItem("santasList")) || [];
}

function saveGifts(gifts) {
    localStorage.setItem("santasList", JSON.stringify(gifts));
}

function addGift(gift) {
    const gifts = getGifts();
    gifts.push(gift);
    saveGifts(gifts);
}

function removeGift(name) {
    const gifts = getGifts().filter(g => g.name !== name);
    saveGifts(gifts);
}
