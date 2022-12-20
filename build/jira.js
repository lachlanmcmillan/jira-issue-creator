"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIssue = exports.getCreateMeta = exports.getProjects = void 0;
const path_1 = __importDefault(require("path"));
const apiFetch_1 = require("./apiFetch");
const config_1 = require("./config");
const PROJECTS_CACHE_FILENAME = "projects";
const getProjects = () => {
    const url = path_1.default.join(config_1.config.jira_api_url, "/project");
    return (0, apiFetch_1.apiFetch)({
        url,
        apiUsername: config_1.config.jira_api_username,
        apiPassword: config_1.config.jira_api_token,
        cacheKey: PROJECTS_CACHE_FILENAME,
    });
};
exports.getProjects = getProjects;
const getCreateMeta = (projectKey) => {
    const url = `${config_1.config.jira_api_url}/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`;
    return (0, apiFetch_1.apiFetch)({
        url,
        apiUsername: config_1.config.jira_api_username,
        apiPassword: config_1.config.jira_api_token,
    });
};
exports.getCreateMeta = getCreateMeta;
const createIssue = (issueDetails) => {
    const url = `${config_1.config.jira_api_url}/issue`;
    return (0, apiFetch_1.apiFetch)({
        url,
        method: "POST",
        apiUsername: config_1.config.jira_api_username,
        apiPassword: config_1.config.jira_api_token,
        body: convertToIssueJSON(issueDetails),
    });
};
exports.createIssue = createIssue;
const convertToIssueJSON = (x) => {
    // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post
    const obj = {
        fields: {
            project: {
                key: x.projectKey,
            },
            summary: x.summary,
            issuetype: {
                name: x.issueType,
            },
        },
    };
    const asString = JSON.stringify(obj, null, 2);
    return asString;
};
