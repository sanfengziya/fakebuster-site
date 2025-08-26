import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { 
  getGitHubFileContent, 
  parseMarkdownContent,
  createOrUpdateGitHubFile,
  deleteGitHubFile,
  getGitHubFileSha,
  generateMarkdownContent
} from '@/lib/github';

// 获取单个案例详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const filename = `${id}.md`;
    const fileContent = await getGitHubFileContent(filename);

    if (!fileContent) {
      return NextResponse.json(
        { error: '案例不存在' },
        { status: 404 }
      );
    }

    const { frontmatter, content } = parseMarkdownContent(fileContent);

    return NextResponse.json({
      id,
      ...frontmatter,
      content
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: '读取案例失败' },
      { status: 500 }
    );
  }
}

// 更新案例
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { title, description, image, date, tags, content } = await request.json();
    const filename = `${id}.md`;

    // 检查文件是否存在并获取SHA
    const sha = await getGitHubFileSha(filename);
    if (!sha) {
      return NextResponse.json(
        { error: '案例不存在' },
        { status: 404 }
      );
    }

    // 验证必填字段
    if (!title || !description || !date || !content) {
      return NextResponse.json(
        { error: '缺少必填字段' },
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

    // 更新GitHub文件
    const success = await createOrUpdateGitHubFile(
      filename,
      fileContent,
      `Update case: ${title}`,
      sha
    );

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '更新案例失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: '更新案例失败' },
      { status: 500 }
    );
  }
}

// 删除案例
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const filename = `${id}.md`;

    // 获取文件SHA用于删除
    const sha = await getGitHubFileSha(filename);
    if (!sha) {
      return NextResponse.json(
        { error: '案例不存在' },
        { status: 404 }
      );
    }

    // 删除GitHub文件
    const success = await deleteGitHubFile(filename, sha);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '删除案例失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: '删除案例失败' },
      { status: 500 }
    );
  }
}