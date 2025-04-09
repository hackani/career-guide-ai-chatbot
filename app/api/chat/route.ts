import { NextResponse } from 'next/server';

// Simple job matching rules
const jobRules = [
  {
    keywords: ['programming', 'coding', 'software', 'computer science', 'developer', 'engineering'],
    education: ['computer science', 'engineering', 'technology', 'it'],
    suggestions: [
      'Software Developer',
      'Full Stack Developer',
      'Data Scientist',
      'DevOps Engineer',
      'Machine Learning Engineer'
    ]
  },
  {
    keywords: ['writing', 'communication', 'language', 'content', 'media'],
    education: ['english', 'journalism', 'communications', 'media'],
    suggestions: [
      'Content Writer',
      'Technical Writer',
      'Journalist',
      'Content Strategist',
      'Copywriter'
    ]
  },
  {
    keywords: ['business', 'management', 'finance', 'marketing', 'sales'],
    education: ['business', 'finance', 'economics', 'marketing'],
    suggestions: [
      'Business Analyst',
      'Marketing Manager',
      'Financial Analyst',
      'Project Manager',
      'Sales Manager'
    ]
  },
  {
    keywords: ['health', 'medical', 'biology', 'science', 'research'],
    education: ['biology', 'medicine', 'health', 'science'],
    suggestions: [
      'Medical Researcher',
      'Healthcare Administrator',
      'Biotech Researcher',
      'Clinical Data Analyst',
      'Public Health Specialist'
    ]
  },
  {
    keywords: ['design', 'art', 'creative', 'visual', 'graphic'],
    education: ['design', 'art', 'fine arts', 'visual'],
    suggestions: [
      'UX/UI Designer',
      'Graphic Designer',
      'Product Designer',
      'Art Director',
      'Visual Designer'
    ]
  }
];

function findMatchingJobs(message: string): string[] {
  const lowercaseMessage = message.toLowerCase();
  const matches = new Set<string>();

  jobRules.forEach(rule => {
    const hasMatchingKeywords = rule.keywords.some(keyword => 
      lowercaseMessage.includes(keyword.toLowerCase())
    );
    const hasMatchingEducation = rule.education.some(edu => 
      lowercaseMessage.includes(edu.toLowerCase())
    );

    if (hasMatchingKeywords || hasMatchingEducation) {
      rule.suggestions.forEach(job => matches.add(job));
    }
  });

  return Array.from(matches);
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const matchingJobs = findMatchingJobs(message);
    
    let response = '';
    if (matchingJobs.length > 0) {
      response = `Based on your interests and education, here are some career paths that might interest you:\n\n${matchingJobs.join('\n')}\n\nWould you like to know more about any of these careers?`;
    } else {
      response = "I couldn't find specific career matches based on your input. Could you please tell me more about your interests and educational background? For example, are you interested in technology, business, arts, or something else?";
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 