"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileExists = exports.writeFile = exports.readFile = exports.clearCache = exports.initCache = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const initCache = () => {
    if (!fs_1.default.existsSync(config_1.config.cache_path)) {
        fs_1.default.mkdirSync(config_1.config.cache_path);
    }
};
exports.initCache = initCache;
const clearCache = () => {
    if (fs_1.default.existsSync(config_1.config.cache_path)) {
        fs_1.default.rmSync(config_1.config.cache_path, { recursive: true });
    }
};
exports.clearCache = clearCache;
const readFile = (filename) => {
    const filePath = generateFilePath(filename);
    if (fs_1.default.existsSync(filePath)) {
        const dataString = fs_1.default.readFileSync(filePath, { encoding: "utf-8" });
        const data = JSON.parse(dataString);
        return data;
    }
};
exports.readFile = readFile;
/**
 * @return {string} filepath
 */
const writeFile = (filename, data) => {
    const filePath = generateFilePath(filename);
    const dataString = JSON.stringify(data);
    fs_1.default.writeFileSync(filePath, dataString);
    return filePath;
};
exports.writeFile = writeFile;
const checkFileExists = (filename) => {
    const filePath = generateFilePath(filename);
    return fs_1.default.existsSync(filePath);
};
exports.checkFileExists = checkFileExists;
const generateFilePath = (filename) => path_1.default.join(config_1.config.cache_path, filename);
