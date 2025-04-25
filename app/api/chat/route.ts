import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client
// Note: You should add HF_ACCESS_TOKEN to your .env file
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// Job interface for type safety
interface Job {
  title: string;
  description: string;
  skills: string[];
  growthProspect: string;
  workStyle: string;
}

// Career domain interface
interface CareerDomain {
  field: string;
  tags: string[];
  education: string[];
  jobs: Job[];
}

// Match results interface
interface MatchResults {
  domains: string[];
  jobs: Job[];
}

// Career domain knowledge base
const careerDomains: CareerDomain[] = [
  {
    field: "Technology",
    tags: ['programming', 'coding', 'software', 'computer science', 'developer', 'engineering', 'tech'],
    education: ['computer science', 'engineering', 'technology', 'it', 'mathematics'],
    jobs: [
      {
        title: 'Software Engineer',
        description: 'Develops applications and systems using various programming languages and frameworks.',
        skills: ['Problem-solving', 'Programming', 'Debugging', 'System design'],
        growthProspect: 'High demand with above-average salary growth',
        workStyle: 'Flexible work arrangements often available'
      },
      {
        title: 'Data Scientist',
        description: 'Analyzes and interprets complex data to help organizations make better decisions.',
        skills: ['Statistics', 'Machine Learning', 'Programming', 'Data Visualization'],
        growthProspect: 'Rapidly growing field with excellent prospects',
        workStyle: 'Hybrid work common'
      },
      {
        title: 'UI/UX Designer',
        description: 'Creates user-friendly and visually appealing interfaces for applications and websites.',
        skills: ['Design thinking', 'User research', 'Prototyping', 'Visual design'],
        growthProspect: 'Growing demand as digital experiences become more important',
        workStyle: 'Often remote-friendly'
      },
      {
        title: 'DevOps Engineer',
        description: 'Bridges the gap between development and operations to streamline software delivery.',
        skills: ['CI/CD', 'Cloud platforms', 'Automation', 'Infrastructure management'],
        growthProspect: 'Increasingly essential role in modern tech teams',
        workStyle: 'Remote options widely available'
      },
      {
        title: 'AI Engineer',
        description: 'Builds and implements artificial intelligence models and systems.',
        skills: ['Machine learning', 'Deep learning', 'NLP', 'Computer vision'],
        growthProspect: 'Explosive growth with the AI revolution',
        workStyle: 'Flexible arrangements possible'
      }
    ]
  },
  {
    field: "Healthcare",
    tags: ['health', 'medical', 'biology', 'science', 'research', 'patient care'],
    education: ['biology', 'medicine', 'health', 'nursing', 'pharmacy'],
    jobs: [
      {
        title: 'Medical Researcher',
        description: 'Conducts studies to improve human health and medical treatments.',
        skills: ['Research methods', 'Data analysis', 'Scientific writing', 'Laboratory techniques'],
        growthProspect: 'Steady demand, especially in specialized fields',
        workStyle: 'Lab-based with some flexibility'
      },
      {
        title: 'Healthcare Administrator',
        description: 'Manages healthcare facilities and ensures efficient service delivery.',
        skills: ['Leadership', 'Healthcare regulations', 'Budgeting', 'Operations management'],
        growthProspect: 'Growing field with aging population',
        workStyle: 'Primarily on-site with some administrative flexibility'
      },
      {
        title: 'Nurse Practitioner',
        description: 'Provides advanced nursing care, often with prescribing authority.',
        skills: ['Patient assessment', 'Clinical decision-making', 'Communication', 'Compassion'],
        growthProspect: 'High demand and excellent job security',
        workStyle: 'Shift-based, typically on-site'
      }
    ]
  },
  {
    field: "Business",
    tags: ['business', 'management', 'finance', 'marketing', 'sales', 'economics'],
    education: ['business', 'finance', 'economics', 'marketing', 'management'],
    jobs: [
      {
        title: 'Financial Analyst',
        description: 'Evaluates financial data to guide investment decisions and business strategy.',
        skills: ['Financial modeling', 'Data analysis', 'Research', 'Communication'],
        growthProspect: 'Steady growth with opportunities in various industries',
        workStyle: 'Mix of office and remote options'
      },
      {
        title: 'Marketing Manager',
        description: 'Develops and implements strategies to promote products and services.',
        skills: ['Strategy development', 'Market research', 'Campaign management', 'Analytics'],
        growthProspect: 'Evolving field with good prospects, especially in digital',
        workStyle: 'Often hybrid arrangements'
      },
      {
        title: 'Product Manager',
        description: 'Oversees product development from conception to launch and beyond.',
        skills: ['Product strategy', 'User research', 'Cross-functional leadership', 'Analysis'],
        growthProspect: 'High demand across tech and other industries',
        workStyle: 'Flexible work arrangements common'
      }
    ]
  },
  {
    field: "Creative",
    tags: ['design', 'art', 'creative', 'visual', 'writing', 'content', 'media'],
    education: ['design', 'art', 'fine arts', 'visual', 'english', 'journalism', 'communications'],
    jobs: [
      {
        title: 'Content Strategist',
        description: 'Plans, creates, and manages content to achieve business goals.',
        skills: ['Content planning', 'SEO', 'Audience analysis', 'Editorial calendar management'],
        growthProspect: 'Growing importance with content marketing trends',
        workStyle: 'Often remote-friendly'
      },
      {
        title: 'UX Writer',
        description: 'Creates clear, concise text for user interfaces that guides users through products.',
        skills: ['Concise writing', 'User empathy', 'Information architecture', 'Design collaboration'],
        growthProspect: 'Emerging specialized role with good prospects',
        workStyle: 'Remote opportunities common'
      },
      {
        title: 'Art Director',
        description: 'Guides the visual style and creative vision of projects and brands.',
        skills: ['Visual design', 'Creative direction', 'Brand development', 'Team leadership'],
        growthProspect: 'Competitive field with opportunities for experienced professionals',
        workStyle: 'Mix of in-studio and remote work'
      }
    ]
  }
];

// Find matching careers based on user input
function findMatchingCareers(userMessage: string): MatchResults {
  const lowercaseMessage = userMessage.toLowerCase();
  const matchedJobs: Job[] = [];
  const matchedDomains = new Set<string>();
  
  // Find direct matches based on interests and education
  careerDomains.forEach(domain => {
    const matchesTags = domain.tags.some(tag => lowercaseMessage.includes(tag.toLowerCase()));
    const matchesEducation = domain.education.some(edu => lowercaseMessage.includes(edu.toLowerCase()));
    
    if (matchesTags || matchesEducation) {
      matchedDomains.add(domain.field);
      matchedJobs.push(...domain.jobs);
    }
  });
  
  // If no specific matches, provide more general guidance
  if (matchedJobs.length === 0) {
    return {
      domains: ["General"],
      jobs: []
    };
  }
  
  return {
    domains: Array.from(matchedDomains),
    jobs: matchedJobs
  };
}

// Generate prompt for the AI model based on user input and career matches
function generatePrompt(userMessage: string, matchResults: MatchResults): string {
  const { domains, jobs } = matchResults;
  
  if (domains.includes("General")) {
    return `You are a friendly, creative, and helpful career guidance assistant. The user has said: "${userMessage}"
    
Please provide personalized career guidance based on their message. Be empathetic and engaging.
Ask them more about their interests, skills, and education to help provide better recommendations.
Suggest some career fields they might want to explore based on any information they've shared.
Use a warm, optimistic tone and provide actionable next steps for their career exploration journey.
Keep your response concise but helpful.`;
  }
  
  // Create job suggestions section
  let jobSuggestions = '';
  if (jobs.length > 0) {
    const sampleJobs = jobs.slice(0, 3); // Limit to 3 suggestions for conciseness
    sampleJobs.forEach((job: Job) => {
      jobSuggestions += `- ${job.title}: ${job.description}\n`;
    });
  }
  
  return `You are a friendly, creative, and helpful career guidance assistant. The user has said: "${userMessage}"

Based on their message, they seem interested in ${domains.join(', ')} careers.

Here are some job suggestions that might interest them:
${jobSuggestions}

Reply to the user in a warm, encouraging tone. Provide personalized insights about these career options.
Mention growth prospects, required skills, and work-life balance considerations for these careers.
Ask follow-up questions to better understand their specific interests within these fields.
Keep your response creative, informative, and engaging. Use emojis appropriately.
Make your response sound natural and conversational, not like a generic list.`;
}

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages: ChatMessage[] };
    
    // Get the latest user message
    const latestUserMessage = messages.filter((m: ChatMessage) => m.role === 'user').pop()?.content || '';
    
    if (!latestUserMessage) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Find career matches based on user input
    const matchResults = findMatchingCareers(latestUserMessage);
    
    // Generate prompt for the AI model
    const prompt = generatePrompt(latestUserMessage, matchResults);
    
    // Call Hugging Face model without streaming
    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.1,
      }
    });
    
    // Return complete response at once
    return NextResponse.json({ 
      response: response.generated_text 
    });
    
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 