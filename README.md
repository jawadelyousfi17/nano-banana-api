# Nano Banana AI Image Generator

A Next.js application that uses the Nano Banana API to generate stunning AI images with predefined prompt templates. Users can customize one part of the prompt and download the generated images.

## Features

- 🎨 **Multiple Style Templates**: Choose from Landscape, Portrait, Fantasy, Cyberpunk, and Anime styles
- ✨ **Easy Customization**: Simply enter your subject and let the template do the rest
- 🖼️ **High-Quality Images**: Generate detailed, professional-quality AI images
- 💾 **Download Support**: Download generated images directly to your device
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Real-time Generation**: See your images generate in real-time

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- A Nano Banana API key (get one at [https://nanobananaapi.ai/api-key](https://nanobananaapi.ai/api-key))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nano-banana-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Nano Banana API key:
   ```
   NANO_BANANA_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Choose a Style**: Select from one of the predefined prompt templates (Landscape, Portrait, Fantasy, etc.)

2. **Enter Your Subject**: Type what you want to see in the image (e.g., "a majestic lion", "a futuristic city")

3. **Preview the Prompt**: See how your input will be combined with the template

4. **Generate**: Click the "Generate Image" button and wait for your AI masterpiece

5. **Download**: Once generated, click the download button to save the image

## Prompt Templates

The application includes several carefully crafted prompt templates:

- **Landscape**: Perfect for nature scenes and scenic views
- **Portrait**: Ideal for character and people images
- **Fantasy**: Great for magical and mythical scenes
- **Cyberpunk**: Perfect for futuristic and sci-fi imagery
- **Anime Style**: Beautiful anime-style illustrations

## API Integration

This project uses the [Nano Banana API](https://docs.nanobananaapi.ai/) for image generation:

- **Text-to-Image Generation**: Converts text prompts into high-quality images
- **Asynchronous Processing**: Handles long-running image generation tasks
- **Error Handling**: Robust error handling for failed generations

## Project Structure

```
nano-banana-api/
├── app/
│   ├── api/generate/route.ts    # API route for image generation
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page component
├── lib/
│   └── nano-banana-api.ts       # API client library
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Nano Banana API**: AI image generation service

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NANO_BANANA_API_KEY` | Your Nano Banana API key | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `NANO_BANANA_API_KEY` environment variable in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues:

1. Check the [Nano Banana API documentation](https://docs.nanobananaapi.ai/)
2. Ensure your API key is valid and has sufficient credits
3. Check the browser console for error messages
4. Open an issue in this repository

## Credits

- Built with [Nano Banana API](https://nanobananaapi.ai/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
