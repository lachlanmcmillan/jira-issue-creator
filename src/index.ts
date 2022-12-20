#!/usr/bin/env node

import parseArgs from "yargs-parser";

import { getProjects, createIssue } from "./jira";
import {
  promptChooseProject,
  promptChooseIssueType,
  promptWriteSummary,
  promptJiraDetails,
} from "./prompts";
import { setConfig, readConfigFromFS, writeConfigToFS, config } from "./config";
import { clearCache, initCache } from "./filesystem";

/**
 * Program arguments for use in CLI, must be prefixed with --, eg.
 *   jira-issue-creator --clear_cache
 */
interface IProgramArgs {
  clear_cache?: boolean;
  print_config?: boolean;
  clearCache?: boolean;
}

const main = async (): Promise<void> => {
  const args: IProgramArgs = parseArgs(
    process.argv.slice(2),
  ) as unknown as IProgramArgs;

  if (args.clear_cache || args.clearCache) {
    clearCache();
  }

  initCache();

  let hasConfig: boolean = readConfigFromFS();

  if (args.print_config) {
    console.log(config);
    return;
  }

  let availableProjects;

    while (!hasConfig) {
      const newConfig = await promptJiraDetails();
      setConfig(newConfig);

      process.stdout.write("\ntesting credentials... ");
      try {
        availableProjects = await getProjects();
        process.stdout.write("PASSED\n");
        writeConfigToFS();
        break;
      } catch (e) {
        // continue
        process.stdout.write("FAILED\n\n");
      }
    }

  if (!availableProjects) {
    availableProjects = await getProjects();
  }

  const project = await promptChooseProject(availableProjects);
  const issueType = await promptChooseIssueType();
  const summary = await promptWriteSummary();

  let createResult;
  try {
    createResult = await createIssue({
      projectKey: project.key,
      issueType,
      summary,
    });
  } catch (e) {
    console.error("Failed to create issue");
    process.exit(1);
  }

  console.log(
    "\n",
    `  Issue: ${createResult.key}\n`,
    `  Url:   https://${config.jira_organisation}.atlassian.net/browse/${createResult.key}\n`,
    "\n",
  );
};

main();
