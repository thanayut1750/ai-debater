
import type { ComponentType } from 'react';

export interface DebateTopic {
  title: string;
  question: string;
  emoji: string;
}

export type DebaterId = 'A' | 'B';

export interface Message {
  id: string;
  text: string;
  debaterId: DebaterId;
}

export interface Debater {
  id: DebaterId;
  name: string;
  // FIX: Use ComponentType directly instead of React.ComponentType
  icon: ComponentType<{ className?: string }>;
  bubbleClassName: string;
  persona: (topic: string) => string;
}
