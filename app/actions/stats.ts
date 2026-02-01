'use server';

export async function getLiveStats() {
  try {
    const res = await fetch('http://127.0.0.1:4000/api/stats', {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    return await res.json();
  } catch (err) {
    return null;
  }
}