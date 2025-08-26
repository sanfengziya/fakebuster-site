import Link from 'next/link';
import { getLatestCases } from '@/lib/markdown';

export default async function Home() {
  const latestCases = await getLatestCases(6);

  return (
    <div className="">
      {/* 横幅区域 */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            真相只有一个！
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            专业调查团队，揭露事实真相，还原事件本质
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cases"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              查看所有案例
            </Link>
            <Link
              href="/team"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              了解我们团队
            </Link>
          </div>
        </div>
      </section>

      {/* 最新案例区域 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              最新案例
            </h2>
            <p className="text-lg text-gray-600">
              我们最近调查的真相案例，每一个都经过严格验证
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestCases.map((caseItem) => (
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

          <div className="text-center mt-12">
            <Link
              href="/cases"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              查看更多案例
            </Link>
          </div>
        </div>
      </section>

      {/* 特色介绍区域 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">专业调查</h3>
              <p className="text-gray-600">
                拥有专业的调查团队和先进的技术手段，确保每个案例的真实性
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">⚖️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">公正客观</h3>
              <p className="text-gray-600">
                坚持客观公正的原则，不偏不倚，只为还原事实真相
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">证据确凿</h3>
              <p className="text-gray-600">
                每个结论都有充分的证据支撑，经得起时间和事实的检验
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
