import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ service: string }> }
) {
    const { service } = await params; 
    const BOT_API_URL = `http://127.0.0.1:4000/api/maintenance/restart/${service}`;

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
        try {
            const botRes = await fetch(BOT_API_URL);
            if (!botRes.body) throw new Error('No response body from Bot');

            const reader = botRes.body.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                await writer.write(value);
            }
        } catch (err: any) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ status: 'error', message: err.message, done: true })}\n\n`));
        } finally {
            writer.close();
        }
    })();

    return new Response(responseStream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}