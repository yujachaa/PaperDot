import { AIApi } from './core';

export const chatAiApi = async (paper_id: string, question: string, user_id: string) => {
  try {
    const response = await AIApi.post('/chatAI', { paper_id, question, user_id });
    return response;
  } catch (err: any) {
    throw new Error(err);
  }
};
