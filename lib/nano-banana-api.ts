export interface GenerateImageOptions {
  type?: 'TEXTTOIAMGE' | 'IMAGETOIAMGE';
  numImages?: number;
  callBackUrl?: string;
  watermark?: string;
  imageUrls?: string[];
}

export interface TaskStatus {
  code: number;
  msg: string;
  data: {
    taskId: string;
    paramJson: string;
    completeTime: string | null;
    response: {
      resultImageUrl: string;
    } | null;
    successFlag: number; // 0: GENERATING, 1: SUCCESS, 2: CREATE_TASK_FAILED, 3: GENERATE_FAILED
    errorCode: string | null;
    errorMessage: string | null;
    createTime: string;
  };
}

export class NanoBananaAPI {
  private apiKey: string;
  private baseUrl = 'https://api.nanobananaapi.ai/api/v1/nanobanana';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string, options: GenerateImageOptions = {}, retries = 3): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // Increased to 45 seconds

      try {
        console.log(`Attempt ${attempt}/${retries}: Sending request to Nano Banana API...`);
        
        const response = await fetch(`${this.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt,
            type: options.type || 'TEXTTOIAMGE',
            numImages: options.numImages || 1,
            callBackUrl: options.callBackUrl,
            watermark: options.watermark,
            imageUrls: options.imageUrls
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const result = await response.json();
        
        if (!response.ok || result.code !== 200) {
          throw new Error(`Generation failed: ${result.msg || 'Unknown error'}`);
        }

        console.log(`Successfully generated task ID: ${result.data.taskId}`);
        return result.data.taskId;
        
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log(`Attempt ${attempt} timed out`);
          } else if (error.message.includes('ETIMEDOUT') || error.message.includes('fetch failed')) {
            console.log(`Attempt ${attempt} failed with network error:`, error.message);
          } else {
            // Non-network error, don't retry
            throw error;
          }
        }
        
        // If this was the last attempt, throw the error
        if (attempt === retries) {
          throw new Error(`Failed after ${retries} attempts. Network timeout - please check your internet connection and try again.`);
        }
        
        // Wait before retrying (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw new Error('Unexpected error in generateImage');
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${this.baseUrl}/record-info?taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      // Log the full server response for debugging
      console.log('Full API response for taskId', taskId, ':', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Status check timeout. Please try again.');
      }
      throw error;
    }
  }

  async waitForCompletion(taskId: string, maxWaitTime = 300000): Promise<string> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getTaskStatus(taskId);
      
      const successFlag = status.data.successFlag;
      console.log('Processing status for taskId', taskId, 'successFlag:', successFlag, 'type:', typeof successFlag);
      
      switch (successFlag) {
        case 0:
          console.log('Task is still generating...');
          break;
        case 1:
          console.log('Task completed successfully!');
          if (status.data.response?.resultImageUrl) {
            return status.data.response.resultImageUrl;
          }
          throw new Error('Generation completed but no image URL returned');
        case 2:
        case 3:
          console.log('Task failed with status:', successFlag);
          throw new Error(status.data.errorMessage || 'Generation failed');
        default:
          console.log('Unknown status flag received:', successFlag, 'Full status object:', status);
          throw new Error(`Unknown status flag: ${successFlag}`);
      }
      
      // Wait 3 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    throw new Error('Generation timeout');
  }
}
