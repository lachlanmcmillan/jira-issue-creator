import path from 'path';
import { apiFetch } from './apiFetch';
import { config } from './config';

const PROJECTS_CACHE_FILENAME = "projects"

export const getProjects = (): Promise<any> => {
  const url = path.join(config.jira_api_url, '/project');
  return apiFetch({ url, apiUsername: config.jira_api_username, apiPassword: config.jira_api_token, cacheKey: PROJECTS_CACHE_FILENAME });
}

export const getCreateMeta = (projectKey: string) => {
  const url = `${config.jira_api_url}/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`;
  return apiFetch({ url, apiUsername: config.jira_api_username, apiPassword: config.jira_api_token });
}

type TIssueType = 'Story' | 'Bug' | 'Task';

export interface IIssueDetails {
  projectKey: string,
  summary: string,
  issueType: TIssueType
}

export const createIssue = (issueDetails: IIssueDetails): Promise<any> => {
  const url = `${config.jira_api_url}/issue`;
  return apiFetch({
    url,
    method: 'POST',
    apiUsername: config.jira_api_username,
    apiPassword: config.jira_api_token,
    body: convertToIssueJSON(issueDetails)
  });
};

const convertToIssueJSON = (x: IIssueDetails) => {
  // https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post
  const obj = {
    fields: {
      project:
      {
        key: x.projectKey
      },
      summary: x.summary,
      issuetype: {
        name: x.issueType
      }
    }
  }
  const asString = JSON.stringify(obj, null, 2);
  return asString;
}

