import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const casesDirectory = path.join(process.cwd(), 'data/cases');

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
export function getAllCases(): CaseMeta[] {
  const fileNames = fs.readdirSync(casesDirectory);
  const allCasesData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(casesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        id,
        title: matterResult.data.title,
        description: matterResult.data.description,
        image: matterResult.data.image,
        date: matterResult.data.date,
        tags: matterResult.data.tags || [],
      };
    });

  // 按日期排序，最新的在前
  return allCasesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 获取单个案例的完整数据
export async function getCaseData(id: string): Promise<CaseData | null> {
  try {
    // 对URL编码的文件名进行解码
    const decodedId = decodeURIComponent(id);
    const fullPath = path.join(casesDirectory, `${decodedId}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // 使用 remark 将 markdown 转换为 HTML
    const processedContent = await remark()
      .use(remarkGfm) // 支持 GitHub Flavored Markdown
      .use(html, { sanitize: false }) // 允许HTML标签
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      id: decodedId,
      title: matterResult.data.title,
      description: matterResult.data.description,
      image: matterResult.data.image,
      date: matterResult.data.date,
      tags: matterResult.data.tags || [],
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading case ${id}:`, error);
    return null;
  }
}

// 获取所有案例的ID列表（用于静态生成）
export function getAllCaseIds() {
  const fileNames = fs.readdirSync(casesDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

// 获取最新的几个案例
export function getLatestCases(count: number = 6): CaseMeta[] {
  const allCases = getAllCases();
  return allCases.slice(0, count);
}