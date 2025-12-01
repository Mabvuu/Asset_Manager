import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body?.to) {
      return NextResponse.json({ error: 'Missing "to"' }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      tokenId: 'demo-' + Date.now(),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
