import matter from 'gray-matter';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = 'sanfengziya';
const REPO_NAME = 'fakebuster-cases';
const CASES_PATH = 'cases';

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

interface GitHubContent {
  content: string;
  encoding: string;
  sha: string;
}

// GitHub API请求封装
async function githubRequest(endpoint: string, options: RequestInit = {}) {
  const token = process.env.GITHUB_TOKEN;
  
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// 获取cases目录下的所有文件
export async function getGitHubCaseFiles(): Promise<GitHubFile[]> {
  try {
    const files = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CASES_PATH}`);
    return files.filter((file: GitHubFile) => file.name.endsWith('.md'));
  } catch (fetchError) {
    console.error('Error fetching GitHub case files:', fetchError);
    return [];
  }
}

// 获取单个文件内容
export async function getGitHubFileContent(filename: string): Promise<string | null> {
  try {
    const response: GitHubContent = await githubRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CASES_PATH}/${filename}`
    );
    
    if (response.encoding === 'base64') {
      return Buffer.from(response.content, 'base64').toString('utf8');
    }
    
    return response.content;
  } catch (fetchError) {
    console.error(`Error fetching GitHub file content for ${filename}:`, fetchError);
    return null;
  }
}

// 创建或更新文件
export async function createOrUpdateGitHubFile(
  filename: string,
  content: string,
  message: string,
  sha?: string
): Promise<boolean> {
  try {
    const body = {
      message,
      content: Buffer.from(content).toString('base64'),
      ...(sha && { sha })
    };

    await githubRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CASES_PATH}/${filename}`,
      {
        method: 'PUT',
        body: JSON.stringify(body)
      }
    );

    return true;
  } catch (updateError) {
    console.error(`Error creating/updating GitHub file ${filename}:`, updateError);
    return false;
  }
}

// 删除文件
export async function deleteGitHubFile(filename: string, sha: string): Promise<boolean> {
  try {
    await githubRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CASES_PATH}/${filename}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          message: `Delete case: ${filename}`,
          sha
        })
      }
    );

    return true;
  } catch (deleteError) {
    console.error(`Error deleting GitHub file ${filename}:`, deleteError);
    return false;
  }
}

// 获取文件的SHA值（用于更新和删除）
export async function getGitHubFileSha(filename: string): Promise<string | null> {
  try {
    const response = await githubRequest(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CASES_PATH}/${filename}`
    );
    return response.sha;
  } catch (fetchError) {
    console.error(`Error fetching GitHub file SHA for ${filename}:`, fetchError);
    return null;
  }
}

// 解析markdown文件内容
export function parseMarkdownContent(content: string) {
  const matterResult = matter(content);
  return {
    frontmatter: matterResult.data,
    content: matterResult.content
  };
}

// 生成markdown文件内容
export function generateMarkdownContent(frontmatter: Record<string, unknown>, content: string): string {
  return matter.stringify(content, frontmatter);
}