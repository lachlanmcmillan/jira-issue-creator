"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptJiraDetails = exports.promptWriteSummary = exports.promptChooseIssueType = exports.promptChooseProject = exports.promptUseDefaultProject = void 0;
const enquirer_1 = require("enquirer");
const filesystem_1 = require("./filesystem");
const promptUseDefaultProject = async (defaultProject) => {
    const answer = await (0, enquirer_1.prompt)({
        type: "autocomplete",
        name: "result",
        message: "Issue type",
        choices: ["Story", "Bug", "Task"],
    });
    return answer.result;
};
exports.promptUseDefaultProject = promptUseDefaultProject;
const promptChooseProject = async (projects) => {
    const cacheKey = "default_project_key";
    const defaultProjectKey = (0, filesystem_1.readFile)(cacheKey);
    const longestKey = projects
        .map((x) => x.key.length)
        .reduce((max, current) => (current > max ? current : max), 0);
    const choices = projects.map((x) => ({
        ...x,
        name: `${x.key.padEnd(longestKey, " ")} | ${x.name}`,
    }));
    const defaultChoice = projects.findIndex((x) => x.key === defaultProjectKey);
    const answer = await (0, enquirer_1.prompt)({
        type: "autocomplete",
        name: "name",
        message: "Project",
        initial: defaultChoice,
        choices,
    });
    const chosenName = answer.name;
    const result = choices.find((x) => x.name === chosenName);
    (0, filesystem_1.writeFile)(cacheKey, result.key);
    return result;
};
exports.promptChooseProject = promptChooseProject;
const promptChooseIssueType = async () => {
    const answer = await (0, enquirer_1.prompt)({
        type: "autocomplete",
        name: "result",
        message: "Issue type",
        choices: ["Story", "Bug", "Task"],
    });
    return answer.result;
};
exports.promptChooseIssueType = promptChooseIssueType;
const promptWriteSummary = async () => {
    const answer = await (0, enquirer_1.prompt)({
        type: "input",
        name: "result",
        message: "Summary",
    });
    return answer.result;
};
exports.promptWriteSummary = promptWriteSummary;
const promptJiraDetails = async () => {
    const jiraOrg = await (0, enquirer_1.prompt)({
        type: "input",
        name: "result",
        message: "Your jira organisation name, eg. https://<organisation>.atlassian.net/jira\n",
    });
    const username = await (0, enquirer_1.prompt)({
        type: "input",
        name: "result",
        message: "Your email address, see https://id.atlassian.com/manage-profile/email\n",
    });
    const apiToken = await (0, enquirer_1.prompt)({
        type: "input",
        name: "result",
        message: "Create a new token at https://id.atlassian.com/manage-profile/security/api-tokens\n",
    });
    return {
        jira_organisation: jiraOrg.result,
        jira_api_username: username.result,
        jira_api_token: apiToken.result,
    };
};
exports.promptJiraDetails = promptJiraDetails;
