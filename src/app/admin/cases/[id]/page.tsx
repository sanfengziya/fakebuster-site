'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CaseData {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  tags: string[] | string;
  content: string;
}

export default function EditCase({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [formData, setFormData] = useState<CaseData>({
    id: '',
    title: '',
    description: '',
    image: '',
    date: '',
    tags: [] as string[],
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCase();
  }, []);

  const fetchCase = async () => {
    try {
      const response = await fetch(`/api/admin/cases/${resolvedParams.id}`);
      if (response.status === 401) {
        router.push('/admin');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        setError('获取案例失败');
      }
    } catch (error) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const tagsArray = typeof formData.tags === 'string'
        ? formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
        : formData.tags;

      const response = await fetch(`/api/admin/cases/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || '保存失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              <Link
                href="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                ← 返回
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">编辑案例: {formData.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                  案例ID
                </label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  disabled
                  value={formData.id}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm text-gray-900"
                />
                <p className="mt-1 text-sm text-gray-500">案例ID不可修改</p>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  日期 *
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                标题 *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                描述 *
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                封面图片
              </label>
              <input
                type="text"
                name="image"
                id="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                标签
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
                placeholder="用逗号分隔"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                内容 *
              </label>
              <textarea
                name="content"
                id="content"
                required
                rows={20}
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm font-mono text-gray-900"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/dashboard"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}