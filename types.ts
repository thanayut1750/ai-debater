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

export type DebatingStyle = 'Analytical' | 'Passionate' | 'Witty' | 'Philosophical';

export interface DebatingStyleInfo {
    name: DebatingStyle;
    description: string;
    emoji: string;
}

export interface Debater {
  id: DebaterId;
  name: string;
  icon: ComponentType<{ className?: string }>;
  bubbleClassName: string;
}
