import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export function verifyAdminToken(request: NextRequest): boolean {
  try {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.admin === true;
  } catch (error) {
    return false;
  }
}

export function getAdminTokenFromCookies(cookies: string): boolean {
  try {
    // 解析cookie字符串
    const cookieObj: { [key: string]: string } = {};
    cookies.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookieObj[name] = value;
      }
    });

    const token = cookieObj['admin-token'];
    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.admin === true;
  } catch (error) {
    return false;
  }
}