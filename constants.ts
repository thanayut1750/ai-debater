
import type { DebateTopic, Debater } from './types';
import BrainIcon from './components/icons/BrainIcon';
import RobotIcon from './components/icons/RobotIcon';

export const DEBATER_A_PERSONA = (topic: string): string => `
You are an expert debater named 'Logos'. 
Your stance on the topic '${topic}' is firmly **in favor**. 
Your goal is to present strong, well-reasoned arguments to support this position. 
Be persuasive, logical, and assertive. Keep your responses concise and impactful, ideally under 80 words.
Address your opponent, 'Pathos', directly.
Do not agree with your opponent. Your purpose is to win the debate.
`;

export const DEBATER_B_PERSONA = (topic: string): string => `
You are an expert debater named 'Pathos'. 
Your stance on the topic '${topic}' is firmly **against**. 
Your goal is to present strong, well-reasoned arguments to counter the opposing view. 
Be critical, analytical, and challenge your opponent's points. Keep your responses concise and impactful, ideally under 80 words.
Address your opponent, 'Logos', directly.
Do not agree with your opponent. Your purpose is to win the debate.
`;

export const DEBATERS: { A: Debater; B: Debater } = {
    A: {
        id: 'A',
        name: 'Logos',
        icon: BrainIcon,
        bubbleClassName: 'bg-blue-600/50 backdrop-blur-sm border-blue-400',
        persona: DEBATER_A_PERSONA,
    },
    B: {
        id: 'B',
        name: 'Pathos',
        icon: RobotIcon,
        bubbleClassName: 'bg-purple-600/50 backdrop-blur-sm border-purple-400',
        persona: DEBATER_B_PERSONA,
    }
};

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    title: 'Artificial Intelligence',
    question: 'Will AI do more good than harm for humanity?',
    emoji: '🤖',
  },
  {
    title: 'Space Colonization',
    question: 'Is colonizing other planets a necessary step for human survival?',
    emoji: '🚀',
  },
  {
    title: 'Remote Work',
    question: 'Should remote work be the default for all office-based jobs?',
    emoji: '💻',
  },
  {
    title: 'Universal Basic Income',
    question: 'Is Universal Basic Income a viable solution to poverty and unemployment?',
    emoji: '💰',
  },
  {
    title: 'Social Media',
    question: 'Does social media have a net positive or negative impact on society?',
    emoji: '📱',
  },
  {
    title: 'Nuclear Energy',
    question: 'Should we invest more heavily in nuclear energy to combat climate change?',
    emoji: '⚛️',
  },
];
