export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      codename: "真相探索者",
      specialty: "数据分析与网络调查",
      description: "擅长从海量数据中发现蛛丝马迹，精通网络痕迹追踪和数字取证技术。",
      avatar: "🕵️‍♂️"
    },
    {
      id: 2,
      codename: "证据收集员",
      specialty: "现场调查与证据保全",
      description: "具有丰富的实地调查经验，擅长证据收集、保全和分析工作。",
      avatar: "🔍"
    },
    {
      id: 3,
      codename: "技术分析师",
      specialty: "技术取证与系统分析",
      description: "专业的技术背景，擅长软件分析、系统漏洞发现和技术欺诈识别。",
      avatar: "💻"
    },
    {
      id: 4,
      codename: "心理分析师",
      specialty: "行为分析与动机推理",
      description: "深谙人性心理，擅长从行为模式中分析动机和预测行为趋势。",
      avatar: "🧠"
    },
    {
      id: 5,
      codename: "法律顾问",
      specialty: "法律分析与合规审查",
      description: "资深法律专家，确保所有调查活动合法合规，提供专业法律意见。",
      avatar: "⚖️"
    },
    {
      id: 6,
      codename: "媒体分析员",
      specialty: "舆情监控与信息验证",
      description: "专注于媒体信息的真实性验证，擅长识别虚假信息和操纵行为。",
      avatar: "📰"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            我们的团队
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            一支由各领域专家组成的专业调查团队，致力于揭露真相，维护正义。
            我们坚持客观公正的原则，用专业的技能和严谨的态度对待每一个案例。
          </p>
        </div>
      </div>

      {/* 团队成员 */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                {/* 头像 */}
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">{member.avatar}</span>
                </div>

                {/* 基本信息 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.codename}
                </h3>
                <p className="text-red-600 font-semibold mb-4">
                  {member.specialty}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>

                {/* 技能标签 */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    专业认证
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    经验丰富
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    值得信赖
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 团队理念 */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              我们的理念
            </h2>
            <p className="text-lg text-gray-600">
              真相是我们唯一的追求，正义是我们不变的信念
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">专业专注</h3>
              <p className="text-gray-600">
                每个成员都是各自领域的专家，专业技能过硬
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">团队协作</h3>
              <p className="text-gray-600">
                紧密合作，优势互补，确保调查的全面性和准确性
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">保密原则</h3>
              <p className="text-gray-600">
                严格遵守保密协议，保护相关人员的隐私和安全
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">高效执行</h3>
              <p className="text-gray-600">
                快速响应，高效执行，在最短时间内获得最准确的结果
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 联系我们 */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            需要我们的帮助？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            如果您遇到了需要调查的问题，或者想要了解更多关于我们团队的信息，
            请随时与我们联系。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@fakebuster.com"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              发送邮件
            </a>
            <a
              href="tel:400-123-4567"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              电话咨询
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}