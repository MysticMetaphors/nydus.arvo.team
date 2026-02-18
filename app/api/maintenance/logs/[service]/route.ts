import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ service: string }> }
) {
    const { service } = await params;
    const BOT_API_URL = `http://127.0.0.1:4000/api/maintenance/logs/${service}`;

    try {
        const botRes = await fetch(BOT_API_URL, { cache: 'no-store' });
        if (!botRes.ok) throw new Error(`Bot returned ${botRes.status}`);
        const data = await botRes.json();
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}