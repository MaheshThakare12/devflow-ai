import { OPENAI_API_KEY } from '../config/env';
import OpenAI from 'openai';

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export const suggestTasks = async (projectTitle: string, projectDescription?: string, count: number = 5) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a project management expert. Given a project title and description, suggest a list of actionable development tasks. Return ONLY a valid JSON array (no markdown, no explanation) with objects having these fields: title (string), description (string), priority ("low"|"medium"|"high"|"urgent"), tags (string[]). Suggest between ${Math.max(5, count - 2)} to ${count + 2} tasks.`
          },
          {
            role: 'user',
            content: `Project Title: ${projectTitle}\nDescription: ${projectDescription || 'N/A'}`
          }
        ],
        temperature: 0.7
      });

      const content = response.choices[0].message.content || '[]';
      // Attempt to strip markdown if it snuck in
      const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('OpenAI Error:', error);
      // Fallback to mock on error
    }
  } else {
    console.warn('OPENAI_API_KEY not set. Using mock tasks.');
  }

  // Fallback / Mock
  return [
    { title: 'Setup project repository', description: 'Initialize git, add README and ignore files.', priority: 'high', tags: ['setup', 'git'] },
    { title: 'Design database schema', description: 'Draft the initial entity relationships.', priority: 'urgent', tags: ['db', 'design'] },
    { title: 'Implement authentication', description: 'Setup JWT and login/register flows.', priority: 'high', tags: ['auth', 'backend'] },
    { title: 'Create initial UI components', description: 'Build the foundational layout and navbar.', priority: 'medium', tags: ['frontend', 'ui'] },
    { title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated testing.', priority: 'medium', tags: ['devops', 'ci/cd'] },
    { title: 'Write unit tests for core modules', description: 'Ensure essential functions have coverage.', priority: 'low', tags: ['testing'] }
  ];
};
