import { AIApi, api } from './core';

export const chatAiApi = async (paper_id: string, question: string, user_id: string) => {
  try {
    const response = await AIApi.post('/chatAI', { paper_id, question, user_id });
    return response;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getChatMessage = async (roomId: number) => {
  const response = await api.get(`/api/chat/room/${roomId}`);
  return response;
};
