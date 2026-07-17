'use client';

import { useMutation } from '@tanstack/react-query';
import { FeedbackService } from "../services/SharePointService";
import { Feedback } from '../types';

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (feedback: Omit<Feedback, 'ID' | 'CreatedAt'>) =>
      FeedbackService.submit(feedback),
  });
}
