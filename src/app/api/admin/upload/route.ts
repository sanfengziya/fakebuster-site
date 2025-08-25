import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const casesDirectory = path.join(process.cwd(), 'data/cases');

// 上传markdown文件
export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '未选择文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: '只支持.md文件' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const fileContent = await file.text();
    
    // 解析markdown文件
    let matterResult;
    try {
      matterResult = matter(fileContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Markdown文件格式错误' },
        { status: 400 }
      );
    }

    // 验证frontmatter
    const { data: frontmatter, content } = matterResult;
    if (!frontmatter.id || !frontmatter.title || !frontmatter.description || !frontmatter.date) {
      return NextResponse.json(
        { error: 'Markdown文件缺少必要的frontmatter字段 (id, title, description, date)' },
        { status: 400 }
      );
    }

    // 检查ID是否已存在
    const targetPath = path.join(casesDirectory, `${frontmatter.id}.md`);
    if (fs.existsSync(targetPath)) {
      return NextResponse.json(
        { error: `案例ID "${frontmatter.id}" 已存在` },
        { status: 400 }
      );
    }

    // 保存文件
    fs.writeFileSync(targetPath, fileContent, 'utf8');

    return NextResponse.json({
      success: true,
      id: frontmatter.id,
      title: frontmatter.title,
      message: '文件上传成功'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}