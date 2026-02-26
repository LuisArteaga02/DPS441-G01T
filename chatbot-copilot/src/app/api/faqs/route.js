import { NextResponse } from 'next/server';
import faqs from '@/data/faqs.json';

export async function POST(req) {
  const { message } = await req.json();
  const query = message?.toLowerCase().trim();
  const match = faqs.find(f => 
    f.question.toLowerCase().includes(query) || 
    query.includes(f.question.toLowerCase())
  );

  return NextResponse.json({ 
    answers: match ? [match] : [] 
  });
}