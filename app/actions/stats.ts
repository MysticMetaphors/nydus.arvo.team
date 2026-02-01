'use client';

export async function getLiveStats() {
  try {
    const res = await fetch('http://127.0.0.1:4000/api/stats', {
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}