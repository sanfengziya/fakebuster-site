import Link from 'next/link';
import { getAllCases } from '@/lib/markdown';

export default function CasesPage() {
  const allCases = getAllCases();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            所有案例
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            这里是我们调查过的所有真相案例，每一个都经过严格验证和深入调查
          </p>
        </div>
      </div>

      {/* 案例列表 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/case/${caseItem.id}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="aspect-video bg-gray-200 relative flex-shrink-0">
                  {/* 占位图片 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-600 text-lg font-semibold">
                      案例图片
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {caseItem.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {caseItem.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3 overflow-hidden">
                    {caseItem.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500">
                      {new Date(caseItem.date).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="text-red-600 font-semibold text-sm">
                      查看详情 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 如果没有案例 */}
          {allCases.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-3xl">📁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                暂无案例
              </h3>
              <p className="text-gray-600">
                我们正在努力调查更多案例，敬请期待！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}