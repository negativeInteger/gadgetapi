import { localStorage } from "../app.js";
/**
 * Stores an item in Node-localStorage with an expiration time (TTL).
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be stored.
 * @param {number} ttl - Time-to-live in milliseconds before expiration.
 */
export const setItemToLocalStorage = (key, value, ttl) => {
    const now = new Date();
    const item = {
        value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};
/**
 * Retrieves an item from Node-localStorage while checking its expiration time.
 * If the item has expired or doesn't exist, it is removed and an error is thrown.
 * @param {string} key - The key to retrieve the value.
 * @returns {any} The stored value if it is still valid.
 * @throws {Error} If the item is expired or not found.
 */
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
/**
 * Removes an item from localStorage.
 * @param {string} key - The key of the item to remove.
 */
export const removeItemFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};