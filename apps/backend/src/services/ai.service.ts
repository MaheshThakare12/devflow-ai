import { OPENAI_API_KEY, GEMINI_API_KEY } from '../config/env';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const googleAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Smart keyword-based task templates
const TASK_POOL: Record<string, { title: string; description: string; priority: 'low'|'medium'|'high'|'urgent'; tags: string[] }[]> = {
  auth: [
    { title: 'Implement JWT authentication system', description: 'Set up access & refresh token flow with secure httpOnly cookies.', priority: 'urgent', tags: ['auth', 'jwt', 'security'] },
    { title: 'Build user login & registration API', description: 'Create POST /auth/login and /auth/register endpoints with validation.', priority: 'high', tags: ['auth', 'backend', 'api'] },
    { title: 'Add role-based access control (RBAC)', description: 'Define Admin, Manager, User roles and protect routes accordingly.', priority: 'high', tags: ['rbac', 'security', 'auth'] },
    { title: 'Implement OAuth2 (Google/GitHub) login', description: 'Integrate third-party login using Passport.js or NextAuth.', priority: 'medium', tags: ['oauth', 'auth', 'social'] },
    { title: 'Setup password reset via email', description: 'Generate one-time reset tokens and send via email service.', priority: 'medium', tags: ['email', 'auth', 'reset'] },
  ],
  ui: [
    { title: 'Design responsive landing page', description: 'Build a pixel-perfect, mobile-first landing page using Tailwind CSS.', priority: 'high', tags: ['ui', 'frontend', 'tailwind'] },
    { title: 'Create reusable component library', description: 'Build Button, Input, Modal, Card, Badge components with variants.', priority: 'high', tags: ['components', 'ui', 'frontend'] },
    { title: 'Implement dark mode toggle', description: 'Add theme context with localStorage persistence for dark/light mode.', priority: 'medium', tags: ['ui', 'theme', 'ux'] },
    { title: 'Add skeleton loading states', description: 'Replace empty states with animated skeleton placeholders during data fetch.', priority: 'low', tags: ['ui', 'ux', 'loading'] },
    { title: 'Build interactive dashboard with charts', description: 'Use Recharts to display stats, progress rings, and bar charts.', priority: 'high', tags: ['dashboard', 'charts', 'ui'] },
  ],
  db: [
    { title: 'Design MongoDB database schema', description: 'Draft entity relationships, indexes, and data models in Mongoose.', priority: 'urgent', tags: ['db', 'mongodb', 'schema'] },
    { title: 'Setup database connection pooling', description: 'Configure Mongoose connection with proper timeout and retry settings.', priority: 'high', tags: ['db', 'mongodb', 'config'] },
    { title: 'Create database seed script', description: 'Write a seed file to populate the database with test/demo data.', priority: 'medium', tags: ['db', 'seed', 'testing'] },
    { title: 'Implement data pagination & sorting', description: 'Add cursor-based or offset pagination to all list API endpoints.', priority: 'medium', tags: ['db', 'api', 'performance'] },
    { title: 'Add database backup automation', description: 'Schedule regular MongoDB Atlas backups or write a mongodump script.', priority: 'low', tags: ['db', 'backup', 'devops'] },
  ],
  api: [
    { title: 'Design RESTful API architecture', description: 'Define endpoint structure, HTTP verbs, status codes, and response format.', priority: 'urgent', tags: ['api', 'rest', 'backend'] },
    { title: 'Implement input validation middleware', description: 'Use express-validator or Zod to validate and sanitize all incoming data.', priority: 'high', tags: ['api', 'validation', 'security'] },
    { title: 'Add API rate limiting', description: 'Prevent abuse using express-rate-limit with per-user and per-IP rules.', priority: 'high', tags: ['api', 'security', 'rate-limit'] },
    { title: 'Generate Swagger/OpenAPI documentation', description: 'Auto-generate interactive API docs from JSDoc or swagger-jsdoc.', priority: 'medium', tags: ['api', 'docs', 'swagger'] },
    { title: 'Write integration tests for all endpoints', description: 'Use Jest + Supertest to test every API route with edge cases.', priority: 'medium', tags: ['testing', 'api', 'jest'] },
  ],
  devops: [
    { title: 'Setup GitHub Actions CI/CD pipeline', description: 'Automate build, test, and deploy on every push to main branch.', priority: 'high', tags: ['ci/cd', 'github', 'devops'] },
    { title: 'Dockerize the application', description: 'Create Dockerfile and docker-compose for consistent dev/prod environments.', priority: 'high', tags: ['docker', 'devops', 'deployment'] },
    { title: 'Configure environment variable management', description: 'Use .env files with a secrets manager for production deployments.', priority: 'urgent', tags: ['config', 'security', 'devops'] },
    { title: 'Setup application monitoring & alerts', description: 'Integrate Sentry for error tracking and Datadog for performance monitoring.', priority: 'medium', tags: ['monitoring', 'devops', 'sentry'] },
    { title: 'Deploy to cloud (Vercel + Railway)', description: 'Deploy frontend to Vercel and backend to Railway with env vars.', priority: 'medium', tags: ['deployment', 'vercel', 'railway'] },
  ],
  ai: [
    { title: 'Integrate OpenAI & Gemini API', description: 'Connect to AI APIs for text generation, summarization, and task suggestions.', priority: 'urgent', tags: ['ai', 'gemini', 'gpt'] },
    { title: 'Build AI prompt engineering system', description: 'Create reusable prompt templates with context injection for consistent AI responses.', priority: 'high', tags: ['ai', 'prompts', 'gpt'] },
    { title: 'Implement AI result caching', description: 'Cache AI responses using Redis to reduce API costs and improve speed.', priority: 'medium', tags: ['ai', 'cache', 'redis'] },
    { title: 'Add AI content moderation filter', description: 'Filter harmful or inappropriate AI outputs before displaying to users.', priority: 'high', tags: ['ai', 'moderation', 'safety'] },
    { title: 'Build AI usage analytics dashboard', description: 'Track token usage, response times, and model costs per user.', priority: 'low', tags: ['ai', 'analytics', 'monitoring'] },
  ],
  ecommerce: [
    { title: 'Implement product catalog with search', description: 'Build product listing page with filters, sorting, and full-text search.', priority: 'urgent', tags: ['ecommerce', 'search', 'product'] },
    { title: 'Integrate payment gateway (Razorpay/Stripe)', description: 'Add secure checkout with card payments, UPI, and wallet support.', priority: 'urgent', tags: ['payments', 'stripe', 'ecommerce'] },
    { title: 'Build shopping cart with persistence', description: 'Create cart state management with localStorage and DB sync for logged-in users.', priority: 'high', tags: ['cart', 'ecommerce', 'state'] },
    { title: 'Implement order management system', description: 'Track orders from placed → shipped → delivered with email notifications.', priority: 'high', tags: ['orders', 'ecommerce', 'email'] },
    { title: 'Add product review & rating system', description: 'Allow verified buyers to rate products with star ratings and text reviews.', priority: 'medium', tags: ['reviews', 'ecommerce', 'ux'] },
  ],
  general: [
    { title: 'Setup project structure & folder convention', description: 'Organize files by feature, set up linting (ESLint), formatting (Prettier).', priority: 'high', tags: ['setup', 'structure', 'lint'] },
    { title: 'Write comprehensive README documentation', description: 'Document setup steps, architecture, API endpoints, and environment variables.', priority: 'medium', tags: ['docs', 'readme', 'documentation'] },
    { title: 'Implement error handling & logging', description: 'Add global error handler, Winston logger, and structured error responses.', priority: 'high', tags: ['error-handling', 'logging', 'backend'] },
    { title: 'Add unit tests for business logic', description: 'Write Jest tests for all service functions and utility helpers.', priority: 'medium', tags: ['testing', 'jest', 'unit-test'] },
    { title: 'Optimize application performance', description: 'Add lazy loading, image optimization, code splitting, and caching headers.', priority: 'low', tags: ['performance', 'optimization', 'frontend'] },
    { title: 'Setup email notification service', description: 'Integrate Nodemailer or SendGrid for transactional email notifications.', priority: 'medium', tags: ['email', 'notifications', 'backend'] },
    { title: 'Build user profile management', description: 'Allow users to update avatar, bio, password, and notification preferences.', priority: 'medium', tags: ['profile', 'user', 'settings'] },
  ]
};

function getSmartMockTasks(projectTitle: string, projectDescription: string = '', count: number = 5) {
  const text = `${projectTitle} ${projectDescription}`.toLowerCase();
  
  // Detect which categories match based on keywords
  const matches: string[] = [];
  if (/auth|login|register|jwt|password|sign|account/.test(text)) matches.push('auth');
  if (/ui|frontend|design|dashboard|layout|component|tailwind|css/.test(text)) matches.push('ui');
  if (/db|database|mongo|mysql|postgres|schema|model/.test(text)) matches.push('db');
  if (/api|rest|endpoint|server|express|backend/.test(text)) matches.push('api');
  if (/devops|docker|ci|cd|deploy|pipeline|cloud/.test(text)) matches.push('devops');
  if (/ai|openai|gemini|gpt|ml|machine|chatbot|nlp|intelligent/.test(text)) matches.push('ai');
  if (/ecommerce|shop|cart|product|payment|order|store/.test(text)) matches.push('ecommerce');
  
  // Always include general tasks
  matches.push('general');

  // Collect tasks from all matching categories
  let pool: typeof TASK_POOL['general'] = [];
  for (const key of matches) {
    pool = pool.concat(TASK_POOL[key] || []);
  }

  // Shuffle randomly for variety each call
  const shuffled = pool.sort(() => Math.random() - 0.5);

  // Return unique tasks up to count
  const result = shuffled.slice(0, Math.min(count + 2, shuffled.length));
  
  // Personalize titles with project name
  return result.map(t => ({
    ...t,
    title: t.title.replace(/the project/gi, projectTitle),
  }));
}

export const suggestTasks = async (projectTitle: string, projectDescription?: string, count: number = 5) => {
  // 1. Try Google Gemini API first if key exists
  if (googleAI) {
    try {
      const model = googleAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
      const prompt = `You are an expert senior software architect. Analyze this project title and description, then generate 5 to 7 highly specific, technical, and actionable development tasks tailored EXACTLY to this project domain.

Project Title: "${projectTitle}"
Project Description: "${projectDescription || 'Software engineering application'}"

Return ONLY a valid raw JSON array of objects (NO markdown ticks \`\`\`json, NO text before or after). Each object must have:
- title: string (Clear action-oriented task title specific to ${projectTitle})
- description: string (Detailed 2-3 sentence implementation explanation with technical details)
- priority: "low" | "medium" | "high" | "urgent"
- tags: string[] (3-4 relevant technology, architecture, or domain tags)`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text() || '[]';
      // Strip any markdown code blocks
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error?.message || error);
    }
  }

  // 2. Try OpenAI API if key exists
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
      const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('OpenAI Error:', error);
    }
  }

  // 3. Smart Dynamic Mock Fallback
  return getSmartMockTasks(projectTitle, projectDescription, count);
};

export const enhanceTask = async (title: string, description?: string) => {
  // 1. Try Google Gemini API first
  if (googleAI) {
    try {
      const model = googleAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
      const prompt = `You are a senior technical project manager. Given a rough task title and description, polish and enhance it into a professional engineering task.

Rough Title: "${title}"
Rough Description: "${description || 'N/A'}"

Return ONLY a valid raw JSON object (NO markdown ticks \`\`\`json, NO text before or after) with fields:
- title: string (polished, action-oriented, professional title)
- description: string (detailed step-by-step description with acceptance criteria)
- priority: "low" | "medium" | "high" | "urgent"
- tags: string[] (3-4 relevant technical tags)`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text() || '{}';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && parsed.title) {
        return parsed;
      }
    } catch (error: any) {
      console.error('Gemini Enhance Error:', error?.message || error);
    }
  }


  // 2. Try OpenAI API

  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a software project manager and AI editor. Given a rough task title and/or description, enhance and rewrite it to be clear, professional, and actionable. Return ONLY a valid JSON object (no markdown) with fields:
            - title: string (polished, concise, action-oriented title)
            - description: string (detailed explanation with bullet points or clear steps)
            - priority: "low" | "medium" | "high" | "urgent"
            - tags: string[] (2-4 relevant tech or topic tags)`
          },
          {
            role: 'user',
            content: `Rough Title: ${title}\nRough Description: ${description || 'N/A'}`
          }
        ],
        temperature: 0.7
      });

      const content = response.choices[0].message.content || '{}';
      const jsonStr = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('OpenAI Enhance Error:', error);
    }
  }

  // 3. Smart Mock Enhancer Fallback
  const titleClean = title.trim();
  const enhancedTitle = titleClean.length < 5 ? `Implement ${titleClean} feature` : `Optimize and finalize: ${titleClean}`;
  return {
    title: enhancedTitle,
    description: description && description.length > 10 
      ? `${description}\n\n- Verified implementation & edge cases\n- Code refactored and unit test coverage added` 
      : `Refactor code, ensure security best practices, and document key endpoints for ${titleClean}.`,
    priority: 'high',
    tags: ['enhancement', 'ai-generated', 'refactor']
  };
};


