import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { 
  getGitHubCaseFiles, 
  getGitHubFileContent, 
  parseMarkdownContent,
  createOrUpdateGitHubFile,
  generateMarkdownContent
} from '@/lib/github';

// 获取所有案例列表
export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const files = await getGitHubCaseFiles();
    const cases = [];

    for (const file of files) {
      const id = file.name.replace(/\.md$/, '');
      const fileContent = await getGitHubFileContent(file.name);
      
      if (fileContent) {
        const { frontmatter, content } = parseMarkdownContent(fileContent);

        // 计算纯文本字数（去除markdown语法）
        const plainText = content
          .replace(/#{1,6}\s+/g, '') // 去除标题标记
          .replace(/\*\*(.*?)\*\*/g, '$1') // 去除粗体标记
          .replace(/\*(.*?)\*/g, '$1') // 去除斜体标记
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 去除链接，保留文字
          .replace(/`(.*?)`/g, '$1') // 去除行内代码标记
          .replace(/```[\s\S]*?```/g, '') // 去除代码块
          .replace(/\n+/g, ' ') // 将换行替换为空格
          .replace(/\s+/g, ' ') // 合并多个空格
          .trim();
        
        cases.push({
          id,
          fileName: file.name,
          title: frontmatter.title,
          description: frontmatter.description,
          date: frontmatter.date,
          tags: frontmatter.tags || [],
          wordCount: plainText.length
        });
      }
    }

    // 按日期排序
    cases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ cases });
  } catch (error) {
    console.error('Error fetching cases:', error);
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

    const filename = `${id}.md`;
    
    // 检查文件是否已存在
    const existingContent = await getGitHubFileContent(filename);
    if (existingContent) {
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
    const fileContent = generateMarkdownContent(frontmatter, content);

    // 创建GitHub文件
    const success = await createOrUpdateGitHubFile(
      filename,
      fileContent,
      `Create new case: ${title}`
    );

    if (success) {
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json(
        { error: '创建案例失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: '创建案例失败' },
      { status: 500 }
    );
  }
}