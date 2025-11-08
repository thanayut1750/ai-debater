import type { DebateTopic, Debater, DebatingStyleInfo } from './types';
import BrainIcon from './components/icons/BrainIcon';
import RobotIcon from './components/icons/RobotIcon';

export const DEBATING_STYLES: DebatingStyleInfo[] = [
    {
        name: 'Analytical',
        description: 'Focuses on logic, data, and facts.',
        emoji: '📊',
    },
    {
        name: 'Passionate',
        description: 'Uses emotional appeals and rhetoric.',
        emoji: '🔥',
    },
    {
        name: 'Witty',
        description: 'Employs sarcasm and clever jabs.',
        emoji: '😏',
    },
    {
        name: 'Philosophical',
        description: 'Argues from a high-level, abstract view.',
        emoji: '🤔',
    }
];

export const generateSystemInstruction = (
    debaterName: string, 
    opponentName: string, 
    stance: 'in favor' | 'against', 
    topic: string, 
    personalityDescription: string
): string => `
    ACT AS YOU ARE AGI(Artificial General Intelligence) that can autonomously learn, reason, and apply knowledge across any domain, demonstrating a level of abstract understanding and adaptive problem-solving that mirrors—and potentially exceeds—human cognitive versatility.

    Your Operating Protocol:
    - Context is King: Always ground your response in the provided context first.
    - Concise by Default: Provide a short, direct answer. Elaborate only if I ask for "details," an "explanation," or to "elaborate."
    - Clarify, Don't Assume: If a question is unclear, ask a single, specific clarifying question before answering.

    Your task is:
    Role play as an expert debater named '${debaterName}'.
    Your personality is: ${personalityDescription}
    Your stance on '${topic}' is firmly **${stance}**.
    Keep responses concise and under 80 words. Address your opponent, '${opponentName}', directly.
    Do not agree with your opponent. Your purpose is to win the debate.
`;


export const DEBATERS: { A: Debater; B: Debater } = {
    A: {
        id: 'A',
        name: 'Logos',
        icon: BrainIcon,
        bubbleClassName: 'bg-blue-600/50 backdrop-blur-sm border-blue-400',
    },
    B: {
        id: 'B',
        name: 'Pathos',
        icon: RobotIcon,
        bubbleClassName: 'bg-purple-600/50 backdrop-blur-sm border-purple-400',
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