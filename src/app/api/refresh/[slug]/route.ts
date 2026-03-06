import { NextResponse } from 'next/server';

const CACHE_SERVER = process.env.CACHE_SERVER_URL || 'http://localhost:3847';

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const res = await fetch(`${CACHE_SERVER}/api/client/${params.slug}/refresh`, {
      method: 'POST',
    });
    
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Cache server error: ${res.status}` },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh' },
      { status: 500 }
    );
  }
}
