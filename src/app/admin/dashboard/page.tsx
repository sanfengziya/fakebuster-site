'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Case {
  id: string;
  fileName: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  wordCount: number;
}

export default function AdminDashboard() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/admin/cases');
      if (response.status === 401) {
        router.push('/admin');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setCases(data.cases);
      } else {
        setError('获取案例列表失败');
      }
    } catch (error) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个案例吗？此操作不可恢复。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cases/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCases(cases.filter(c => c.id !== id));
      } else {
        alert('删除失败');
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin');
    } catch (error) {
      router.push('/admin');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`文件上传成功: ${result.title}`);
        fetchCases(); // 重新获取案例列表
      } else {
        const data = await response.json();
        setError(data.error || '上传失败');
      }
    } catch (error) {
      setError('上传失败');
    } finally {
      setUploading(false);
      // 清空文件输入
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">案例管理后台</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".md"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? '上传中...' : '上传MD文件'}
                </label>
              </div>
              <Link
                href="/admin/cases/new"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                新建案例
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              案例列表 ({cases.length})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              管理所有案例文件
            </p>
          </div>
          
          {cases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无案例</p>
              <Link
                href="/admin/cases/new"
                className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                创建第一个案例
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cases.map((caseItem) => (
                <li key={caseItem.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-red-600 truncate">
                            {caseItem.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {caseItem.wordCount} 字
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {caseItem.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>{caseItem.date}</p>
                          </div>
                        </div>
                        {caseItem.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {caseItem.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <Link
                          href={`/admin/cases/${caseItem.id}`}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(caseItem.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}