import { prompt } from "enquirer";
import { readFile, writeFile } from "./filesystem";

export const promptUseDefaultProject = async (defaultProject: string) => {
  const answer = await prompt({
    type: "autocomplete",
    name: "result",
    message: "Issue type",
    choices: ["Story", "Bug", "Task"],
  });
  return (answer as any).result;
};

export const promptChooseProject = async (projects: any[]) => {
  const cacheKey = "default_project_key";
  const defaultProjectKey = readFile(cacheKey);

  const longestKey: number = projects
    .map((x) => x.key.length)
    .reduce((max, current) => (current > max ? current : max), 0);

  const choices = projects.map((x) => ({
    ...x,
    name: `${x.key.padEnd(longestKey, " ")} | ${x.name}`,
  }));

  const defaultChoice = projects.findIndex((x) => x.key === defaultProjectKey);

  const answer = await prompt({
    type: "autocomplete",
    name: "name",
    message: "Project",
    initial: defaultChoice,
    choices,
  });

  const chosenName = (answer as any).name;
  const result = choices.find((x) => x.name === chosenName);
  writeFile(cacheKey, result.key);
  return result;
};

export const promptChooseIssueType = async () => {
  const answer = await prompt({
    type: "autocomplete",
    name: "result",
    message: "Issue type",
    choices: ["Story", "Bug", "Task"],
  });
  return (answer as any).result;
};

export const promptWriteSummary = async () => {
  const answer = await prompt({
    type: "input",
    name: "result",
    message: "Summary",
  });
  return (answer as any).result;
};

export const promptJiraDetails = async () => {
  const jiraOrg: any = await prompt({
    type: "input",
    name: "result",
    message:
      "Your jira organisation name, eg. https://<organisation>.atlassian.net/jira\n",
  });

  const username: any = await prompt({
    type: "input",
    name: "result",
    message:
      "Your email address, see https://id.atlassian.com/manage-profile/email\n",
  });

  const apiToken: any = await prompt({
    type: "input",
    name: "result",
    message:
      "Create a new token at https://id.atlassian.com/manage-profile/security/api-tokens\n",
  });

  return {
    jira_organisation: jiraOrg.result,
    jira_api_username: username.result,
    jira_api_token: apiToken.result,
  };
};
