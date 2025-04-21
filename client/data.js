let data;

export function setData(newData) {
    data = newData;
}

export function addPoints(newPoints) {
    data.points += newPoints;
}

export function changeNickName(newNickName) {
    data.nickName = newNickName;
}

export function addPerk(newPerk) {
    if (data.perks.includes(newPerk)) {
        console.log("Player already has perk: ", newPerk);
        return false;
    }
    data.perks.push(newPerk);r
    return true;
}

export function addSkin(newSkin) {
    if (data.skins.includes(newSkin)) {
        console.log("Player already has skin: ", newSkin);
        return false;
    }
    data.skins.push(newSkin);
    return true;
}

export function getData() {
    return data;
}