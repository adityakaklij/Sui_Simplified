import { useState } from 'react';

export const useCopyFeedback = () => {
  const [copied, setCopied] = useState(false);

  const copyWithFeedback = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return { copied, copyWithFeedback };
};

