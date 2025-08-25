import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const casesDirectory = path.join(process.cwd(), 'data/cases');

// 获取所有案例列表
export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const fileNames = fs.readdirSync(casesDirectory);
    const cases = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(casesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        // 计算纯文本字数（去除markdown语法）
        const plainText = matterResult.content
          .replace(/#{1,6}\s+/g, '') // 去除标题标记
          .replace(/\*\*(.*?)\*\*/g, '$1') // 去除粗体标记
          .replace(/\*(.*?)\*/g, '$1') // 去除斜体标记
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 去除链接，保留文字
          .replace(/`(.*?)`/g, '$1') // 去除行内代码标记
          .replace(/```[\s\S]*?```/g, '') // 去除代码块
          .replace(/\n+/g, ' ') // 将换行替换为空格
          .replace(/\s+/g, ' ') // 合并多个空格
          .trim();
        
        return {
          id,
          fileName,
          title: matterResult.data.title,
          description: matterResult.data.description,
          date: matterResult.data.date,
          tags: matterResult.data.tags || [],
          wordCount: plainText.length
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ cases });
  } catch (error) {
    return NextResponse.json(
      { error: '读取案例列表失败' },
      { status: 500 }
    );
  }
}

// 创建新案例
export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { id, title, description, image, date, tags, content } = await request.json();

    // 验证必填字段
    if (!id || !title || !description || !date || !content) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查文件是否已存在
    const filePath = path.join(casesDirectory, `${id}.md`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '案例ID已存在' },
        { status: 400 }
      );
    }

    // 创建frontmatter
    const frontmatter = {
      id,
      title,
      description,
      image: image || `/images/${id}-cover.jpg`,
      date,
      tags: tags || []
    };

    // 生成markdown文件内容
    const fileContent = matter.stringify(content, frontmatter);

    // 写入文件
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: '创建案例失败' },
      { status: 500 }
    );
  }
}