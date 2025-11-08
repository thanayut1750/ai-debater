import React, { useState } from 'react';
import type { DebateTopic } from '../types';
import { DEBATE_TOPICS } from '../constants';

interface TopicSelectionProps {
  onTopicSelect: (topic: DebateTopic) => void;
}

const TopicCard: React.FC<{ topic: DebateTopic; onClick: () => void }> = ({ topic, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center justify-center p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg transition-all duration-300 hover:border-cyan-400 hover:scale-105 hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
    aria-label={`Select debate topic: ${topic.title}`}
  >
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
    <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-125">{topic.emoji}</div>
    <h3 className="text-lg font-bold text-center text-gray-200 group-hover:text-cyan-300 transition-colors duration-300">{topic.title}</h3>
    <p className="text-sm text-center text-gray-400 mt-1">{topic.question}</p>
  </button>
);


const TopicSelection: React.FC<TopicSelectionProps> = ({ onTopicSelect }) => {
  const [customTopic, setCustomTopic] = useState('');

  const handleCustomTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTopic = customTopic.trim();
    if (trimmedTopic) {
        onTopicSelect({
            title: 'Custom Topic',
            question: trimmedTopic,
            emoji: '💬',
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="text-center mb-10">
        <h1 className="font-orbitron text-4xl sm:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          AI Debate Arena
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Witness two AIs debate a topic in real-time. Start with a suggestion below, or create your own.
        </p>
      </div>
      
      <div className="w-full max-w-xl mb-10 px-4">
        <form onSubmit={handleCustomTopicSubmit} className="relative group">
            <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter your own debate topic..."
                className="w-full p-4 pr-28 rounded-lg bg-gray-800/70 backdrop-blur-sm border-2 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
                aria-label="Custom debate topic"
            />
            <button
                type="submit"
                disabled={!customTopic.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform group-focus-within:scale-105"
            >
                Debate!
            </button>
        </form>
      </div>

      <div className="relative w-full max-w-5xl text-center mb-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
            <span className="bg-gray-900 px-4 text-sm text-gray-500 uppercase tracking-wider">OR CHOOSE A POPULAR TOPIC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {DEBATE_TOPICS.map((topic) => (
          <TopicCard key={topic.title} topic={topic} onClick={() => onTopicSelect(topic)} />
        ))}
      </div>
    </div>
  );
};

export default TopicSelection;