import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const casesDirectory = path.join(process.cwd(), 'data/cases');

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
    const filePath = path.join(casesDirectory, `${id}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '案例不存在' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);

    return NextResponse.json({
      id,
      ...matterResult.data,
      content: matterResult.content
    });
  } catch (error) {
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
    const filePath = path.join(casesDirectory, `${id}.md`);

    if (!fs.existsSync(filePath)) {
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
    const fileContent = matter.stringify(content, frontmatter);

    // 写入文件
    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
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
    const filePath = path.join(casesDirectory, `${id}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: '案例不存在' },
        { status: 404 }
      );
    }

    // 删除文件
    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '删除案例失败' },
      { status: 500 }
    );
  }
}