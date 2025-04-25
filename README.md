# Career Path Advisor

An AI-powered career guidance application built with Next.js that provides personalized job recommendations and career advice using the Mixtral AI model via Hugging Face.

## Features

- 🚀 Personalized career suggestions based on interests and education
- 💬 Streaming AI responses for a smooth user experience
- 📱 Responsive design that works on all devices
- 📊 Detailed information about job prospects and requirements
- 🔍 Fine-tuned responses that are creative and informative

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Hugging Face account and API token

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/career-guide.git
cd career-guide
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following content:

```
HF_ACCESS_TOKEN=your_huggingface_token_here
```

You can obtain a Hugging Face token at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

The application uses:

- Next.js 15 for the frontend and API routes
- Hugging Face's Mixtral-8x7B model for generating career advice
- Streaming responses for a better user experience
- Tailwind CSS for styling
- React Markdown for formatting AI responses

The AI model analyzes user input about their interests, skills, and education to provide tailored career suggestions with detailed information about job prospects, required skills, and work-life balance.

## Customization

You can customize the career knowledge base by editing the `careerDomains` array in `app/api/chat/route.ts` to add more fields, tags, and job descriptions.

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Hugging Face](https://huggingface.co/)
- [Mixtral AI](https://mistral.ai/)
- [Vercel](https://vercel.com/) for hosting
