import { AIApi } from './core';

export const chatAiApi = async (paper_id: string, question: string, user_id: string) => {
  const response = await AIApi.post('/chatAI', { paper_id, question, user_id });
  return response;
};
