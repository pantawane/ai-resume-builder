import OpenAI from 'openai';

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  baseURL: process.env.OPENAI_BASE_URL as string,
});

export default ai;