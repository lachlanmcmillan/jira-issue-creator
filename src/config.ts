import { homedir } from "os";
import path from "path";
import { checkFileExists, readFile, writeFile } from "./filesystem";

interface IConfig {
  cache_path: string;
  config_filename: string;
  jira_api_url: string;
  jira_organisation: string;
  jira_api_username: string;
  jira_api_token: string;
}

// singleton instance with defaults
export const config: IConfig = {
  cache_path: path.join(homedir(), ".jira-issue-creator"),
  config_filename: "config.json",
  jira_api_url: "",
  jira_organisation: "",
  jira_api_username: "",
  jira_api_token: "",
};

export const setConfig = (newConfig: Partial<IConfig>) => {
  if (newConfig.jira_organisation) {
    config.jira_api_url = `https://${newConfig.jira_organisation}.atlassian.net/rest/api/3`;
  }

  Object.entries(newConfig).forEach(([key, value]) => {
    config[key] = value;
  });
};

/**
 * @return true if config file exists and was read
 */
export const readConfigFromFS = (): boolean => {
  const newConfig = readFile(config.config_filename);
  if (newConfig) {
    setConfig(newConfig);
  }
  return Boolean(newConfig);
};

export const writeConfigToFS = () => {
  const filePath = writeFile(config.config_filename, config);
  console.log(`saved to ${filePath}...\n`);
};

export const configExistsOnFS = (): boolean => {
  return checkFileExists(config.config_filename);
};
