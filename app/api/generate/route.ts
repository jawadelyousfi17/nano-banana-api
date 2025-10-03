import { NextRequest, NextResponse } from 'next/server';
import { NanoBananaAPI } from '@/lib/nano-banana-api';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NANO_BANANA_API_KEY;
    if (!apiKey) {
      console.error('NANO_BANANA_API_KEY environment variable not set');
      return NextResponse.json(
        { 
          error: 'API key not configured. Please set NANO_BANANA_API_KEY in your .env.local file.',
          success: false 
        },
        { status: 500 }
      );
    }

    console.log('Starting image generation with prompt:', prompt);
    const api = new NanoBananaAPI(apiKey);
    
    // Generate image
    const taskId = await api.generateImage(prompt, {
      type: 'TEXTTOIAMGE',
      numImages: 1
    });

    console.log('Generated task ID:', taskId);

    // Wait for completion
    const imageUrl = await api.waitForCompletion(taskId);

    console.log('Image generation completed:', imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
      taskId
    });

  } catch (error) {
    console.error('Generation error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      if (error.message.includes('ETIMEDOUT') || error.message.includes('fetch failed')) {
        errorMessage = 'Network timeout. Please check your internet connection and try again.';
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Invalid API key. Please check your NANO_BANANA_API_KEY.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Invalid request. Please try a different prompt.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        success: false 
      },
      { status: 500 }
    );
  }
}
