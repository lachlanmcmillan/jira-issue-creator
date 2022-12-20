"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configExistsOnFS = exports.writeConfigToFS = exports.readConfigFromFS = exports.setConfig = exports.config = void 0;
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const filesystem_1 = require("./filesystem");
// singleton instance with defaults
exports.config = {
    cache_path: path_1.default.join((0, os_1.homedir)(), ".jira-issue-creator"),
    config_filename: "config.json",
    jira_api_url: "",
    jira_organisation: "",
    jira_api_username: "",
    jira_api_token: "",
};
const setConfig = (newConfig) => {
    if (newConfig.jira_organisation) {
        exports.config.jira_api_url = `https://${newConfig.jira_organisation}.atlassian.net/rest/api/3`;
    }
    Object.entries(newConfig).forEach(([key, value]) => {
        exports.config[key] = value;
    });
};
exports.setConfig = setConfig;
/**
 * @return true if config file exists and was read
 */
const readConfigFromFS = () => {
    const newConfig = (0, filesystem_1.readFile)(exports.config.config_filename);
    if (newConfig) {
        (0, exports.setConfig)(newConfig);
    }
    return Boolean(newConfig);
};
exports.readConfigFromFS = readConfigFromFS;
const writeConfigToFS = () => {
    const filePath = (0, filesystem_1.writeFile)(exports.config.config_filename, exports.config);
    console.log(`saved to ${filePath}...\n`);
};
exports.writeConfigToFS = writeConfigToFS;
const configExistsOnFS = () => {
    return (0, filesystem_1.checkFileExists)(exports.config.config_filename);
};
exports.configExistsOnFS = configExistsOnFS;
