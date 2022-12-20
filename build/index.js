"use strict";
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_parser_1 = __importDefault(require("yargs-parser"));
const jira_1 = require("./jira");
const prompts_1 = require("./prompts");
const config_1 = require("./config");
const filesystem_1 = require("./filesystem");
const main = async () => {
    const args = (0, yargs_parser_1.default)(process.argv.slice(2));
    if (args.clear_cache || args.clearCache) {
        (0, filesystem_1.clearCache)();
    }
    (0, filesystem_1.initCache)();
    let hasConfig = (0, config_1.readConfigFromFS)();
    if (args.print_config) {
        console.log(config_1.config);
        return;
    }
    let availableProjects;
    while (!hasConfig) {
        const newConfig = await (0, prompts_1.promptJiraDetails)();
        (0, config_1.setConfig)(newConfig);
        process.stdout.write("\ntesting credentials... ");
        try {
            availableProjects = await (0, jira_1.getProjects)();
            process.stdout.write("PASSED\n");
            (0, config_1.writeConfigToFS)();
            break;
        }
        catch (e) {
            // continue
            process.stdout.write("FAILED\n\n");
        }
    }
    if (!availableProjects) {
        availableProjects = await (0, jira_1.getProjects)();
    }
    const project = await (0, prompts_1.promptChooseProject)(availableProjects);
    const issueType = await (0, prompts_1.promptChooseIssueType)();
    const summary = await (0, prompts_1.promptWriteSummary)();
    let createResult;
    try {
        createResult = await (0, jira_1.createIssue)({
            projectKey: project.key,
            issueType,
            summary,
        });
    }
    catch (e) {
        console.error("Failed to create issue");
        process.exit(1);
    }
    console.log("\n", `  Issue: ${createResult.key}\n`, `  Url:   https://${config_1.config.jira_organisation}.atlassian.net/browse/${createResult.key}\n`, "\n");
};
main();
