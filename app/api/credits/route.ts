import { NextRequest, NextResponse } from 'next/server';
import { NanoBananaAPI } from '@/lib/nano-banana-api';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NANO_BANANA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    const api = new NanoBananaAPI(apiKey);
    const creditsResponse = await api.getCredits();

    if (creditsResponse.code === 200 && creditsResponse.data !== null) {
      return NextResponse.json({
        success: true,
        credits: {
          remainingCredits: creditsResponse.data,
          totalCredits: creditsResponse.data, // Since we only get remaining, use it as total for display
          usedCredits: 0 // We don't have this info from the API
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: creditsResponse.msg || 'Failed to fetch credits' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch credits' 
      },
      { status: 500 }
    );
  }
}
