'use client';

import { useState } from 'react';
import { Download, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import Image from 'next/image';

// Predefined prompt templates
const PROMPT_TEMPLATES = [
  {
    id: 'pictogram',
    name: 'Pictogram Style',
    template: 'Create a pictogram-style illustration of: {subject}. Style requirements: - Pictogram/icon style with simple geometric shapes - Pure black background (solid #000000) - Use ONLY white color (#FFFFFF) for all elements - Simple human figures with clear facial expressions - Rounded heads with expressive eyes and mouth - Full body stick-figure style or simple geometric bodies - Minimalist design with high contrast (white on black) - No gradients, no other colors, only pure white on pure black - No text or words in the image',
    placeholder: 'people having a meeting around a table'
  },
  {
    id: 'landscape',
    name: 'Landscape',
    template: 'A breathtaking {subject} landscape with dramatic lighting, ultra-detailed, 4K resolution',
    placeholder: 'mountain sunset'
  },
  {
    id: 'portrait',
    name: 'Portrait',
    template: 'Professional portrait of {subject}, studio lighting, high quality, detailed',
    placeholder: 'a young woman with curly hair'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    template: 'Magical fantasy scene with {subject}, ethereal lighting, mystical atmosphere, digital art',
    placeholder: 'a dragon in an enchanted forest'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    template: 'Futuristic cyberpunk scene featuring {subject}, neon lights, dark atmosphere, high-tech',
    placeholder: 'a robot in a neon city'
  },
  {
    id: 'anime',
    name: 'Anime Style',
    template: 'Beautiful anime-style illustration of {subject}, vibrant colors, detailed artwork',
    placeholder: 'a cat wearing a wizard hat'
  }
];

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState(PROMPT_TEMPLATES[0]); // Pictogram style is now first
  const [userInput, setUserInput] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!userInput.trim()) {
      setError('Please enter a subject for your image');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const finalPrompt = selectedTemplate.template.replace('{subject}', userInput.trim());
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
      setUserInput(''); // Clear input after successful generation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nano-banana-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  const currentPrompt = selectedTemplate.template.replace('{subject}', userInput || selectedTemplate.placeholder);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-800">Nano Banana AI</h1>
          </div>
          <p className="text-gray-600 text-lg">Generate stunning images with AI using customizable prompt templates</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Generate Button */}
            <button
              onClick={generateImage}
              disabled={isGenerating || !userInput.trim()}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>

            {/* Template Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Style</h2>
              <div className="grid grid-cols-2 gap-3">
                {PROMPT_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Input */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Customize Your Subject</h2>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating && userInput.trim()) {
                    generateImage();
                  }
                }}
                placeholder={selectedTemplate.placeholder}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>

            {/* Preview Prompt */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Final Prompt</h2>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-700 italic">{currentPrompt}</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Image Display */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Image</h2>
            
            <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600">Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <>
                  <Image
                    src={generatedImage}
                    alt="Generated image"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={downloadImage}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-lg shadow-lg transition-colors"
                    title="Download image"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Your generated image will appear here</p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {generatedImage && (
              <button
                onClick={downloadImage}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Image
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
