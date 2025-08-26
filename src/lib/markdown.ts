import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { 
  getGitHubCaseFiles, 
  getGitHubFileContent, 
  parseMarkdownContent 
} from './github';

export interface CaseData {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  tags: string[];
  content: string;
}

export interface CaseMeta {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  tags: string[];
}

// 获取所有案例的元数据
export async function getAllCases(): Promise<CaseMeta[]> {
  try {
    const files = await getGitHubCaseFiles();
    const allCasesData: CaseMeta[] = [];

    for (const file of files) {
      const id = file.name.replace(/\.md$/, '');
      const content = await getGitHubFileContent(file.name);
      
      if (content) {
        const { frontmatter } = parseMarkdownContent(content);
        
        allCasesData.push({
          id,
          title: frontmatter.title,
          description: frontmatter.description,
          image: frontmatter.image,
          date: frontmatter.date,
          tags: frontmatter.tags || [],
        });
      }
    }

    // 按日期排序，最新的在前
    return allCasesData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error fetching all cases:', error);
    return [];
  }
}

// 获取单个案例的完整数据
export async function getCaseData(id: string): Promise<CaseData | null> {
  try {
    // 对URL编码的文件名进行解码
    const decodedId = decodeURIComponent(id);
    const filename = `${decodedId}.md`;
    const fileContent = await getGitHubFileContent(filename);
    
    if (!fileContent) {
      return null;
    }

    const { frontmatter, content } = parseMarkdownContent(fileContent);

    // 使用 remark 将 markdown 转换为 HTML
    const processedContent = await remark()
      .use(remarkGfm) // 支持 GitHub Flavored Markdown
      .use(html, { sanitize: false }) // 允许HTML标签
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      id: decodedId,
      title: frontmatter.title,
      description: frontmatter.description,
      image: frontmatter.image,
      date: frontmatter.date,
      tags: frontmatter.tags || [],
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading case ${id}:`, error);
    return null;
  }
}

// 获取所有案例的ID列表（用于静态生成）
export async function getAllCaseIds() {
  try {
    const files = await getGitHubCaseFiles();
    return files.map((file) => {
      return {
        params: {
          id: file.name.replace(/\.md$/, ''),
        },
      };
    });
  } catch (error) {
    console.error('Error fetching case IDs:', error);
    return [];
  }
}

// 获取最新的几个案例
export async function getLatestCases(count: number = 6): Promise<CaseMeta[]> {
  const allCases = await getAllCases();
  return allCases.slice(0, count);
}