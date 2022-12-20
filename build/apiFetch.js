"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetch = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const filesystem_1 = require("./filesystem");
const apiFetch = async ({ url, apiUsername, apiPassword, cacheKey, method = "GET", body, }) => {
    const cachedData = cacheKey && (0, filesystem_1.readFile)(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    const response = await (0, node_fetch_1.default)(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: makeBasicAuthHeader(apiUsername, apiPassword),
        },
        body,
    });
    const bodyText = await response.text();
    if (!response.ok) {
        console.error(`API fetch responded with ${response.status}`);
        console.error(bodyText);
        throw new Error("response not ok");
    }
    let data;
    try {
        data = JSON.parse(bodyText);
    }
    catch (err) {
        console.error("Failed to parse API response data as JSON");
        console.error("URL: ", url);
        console.error("Response: ");
        console.error(bodyText);
        throw err;
    }
    if (cacheKey) {
        (0, filesystem_1.writeFile)(cacheKey, data);
    }
    return data;
};
exports.apiFetch = apiFetch;
/**
 * HTTP Authorization header
 */
const makeBasicAuthHeader = (username, password) => {
    const token = Buffer.from(`${username}:${password}`).toString("base64");
    return `Basic ${token}`;
};
