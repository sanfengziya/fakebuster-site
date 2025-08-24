import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCaseData, getAllCaseIds } from '@/lib/markdown';

interface CasePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const cases = getAllCaseIds();
  return cases.map((caseItem) => ({
    id: caseItem.params.id,
  }));
}

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params;
  const caseData = await getCaseData(id);

  if (!caseData) {
    notFound();
  }

  return (
    <div className="case-page">
      <div className="case-header">
        <h1>封神榜</h1>
        <div className="case-breadcrumb">
          <Link href="/">首页</Link> / <Link href="/cases">案例</Link> / {caseData.title}
        </div>
      </div>
      
      <div className="case-container">
        <div className="case-tags">
          {caseData.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        
        <h2 className="case-title">{caseData.title}</h2>
        
        <div className="case-subtitle">{caseData.description}</div>
        
        <div className="case-info">
          发布时间：{new Date(caseData.date).toLocaleDateString('zh-CN')} ｜ 案例编号：{caseData.id.toUpperCase()}
        </div>
        
        <div className="case-image">案例封面图</div>
        
        <div 
          className="case-content"
          dangerouslySetInnerHTML={{ __html: caseData.content }}
        />
      </div>
    </div>
  );
}