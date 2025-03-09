import { localStorage } from "../app.js";

// Function to set item with expiry
export const setItemToLocalStorage = (key, value, ttl) => {
    const now = new Date();
    const item = {
        value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};
// Function to get item (checking expiry)
export const getItemFromLocalStorage = (key) => {
    const now = new Date();
    const itemStr = localStorage.getItem(key);
    const item = JSON.parse(itemStr);
    // If expired, throw code expiration error
    if (now.getTime() > item.expiry || !itemStr) {
        localStorage.removeItem(code);
        throw new Error('Code has expired or not found')
    };
    return item.value;
};
// removing code as from localstorage
export const removeItemFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};