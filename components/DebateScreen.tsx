import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import type { DebateTopic, Message, DebaterId } from '../types';
import { DEBATERS } from '../constants';
import { createDebaterChat } from '../services/geminiService';
import ChatBubble from './ChatBubble';

interface DebateScreenProps {
  topic: DebateTopic;
  onBack: () => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-3">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    </div>
);


const DebateScreen: React.FC<DebateScreenProps> = ({ topic, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDebating, setIsDebating] = useState(true);
  const [isThinking, setIsThinking] = useState<DebaterId | null>('A');
  
  const chatA = useRef<Chat | null>(null);
  const chatB = useRef<Chat | null>(null);
  const lastMessage = useRef<string>('');
  const currentTurn = useRef<DebaterId>('A');
  // FIX: Replace NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility
  const debateLoopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const stopDebate = () => {
    setIsDebating(false);
    setIsThinking(null);
    if (debateLoopTimeout.current) {
      clearTimeout(debateLoopTimeout.current);
    }
  };

  useEffect(() => {
    chatA.current = createDebaterChat(DEBATERS.A.persona(topic.question));
    chatB.current = createDebaterChat(DEBATERS.B.persona(topic.question));
    lastMessage.current = `Let's begin the debate on: ${topic.question}. Please provide your opening statement in a concise and impactful manner.`;
    currentTurn.current = 'A';
    setMessages([]);
    setIsThinking('A');
    setIsDebating(true);
    
    const debateTurn = async () => {
        if (!isDebating) return;

        const currentChat = currentTurn.current === 'A' ? chatA.current : chatB.current;
        const debaterId = currentTurn.current;
        
        setIsThinking(debaterId);
        
        try {
            const result = await currentChat!.sendMessage({ message: lastMessage.current });
            const newText = result.text;

            if (isDebating) {
                setMessages(prev => [...prev, { id: `msg-${Date.now()}`, text: newText, debaterId }]);
                lastMessage.current = newText;
                currentTurn.current = currentTurn.current === 'A' ? 'B' : 'A';
                
                debateLoopTimeout.current = setTimeout(debateTurn, 1500);
            }
        } catch (error) {
            console.error("Error during debate:", error);
            setMessages(prev => [...prev, { id: 'error', text: 'An error occurred. The debate has ended.', debaterId: 'A' }]);
            stopDebate();
        } finally {
            if (isDebating) {
                setIsThinking(currentTurn.current);
            } else {
                setIsThinking(null);
            }
        }
    };
    
    debateLoopTimeout.current = setTimeout(debateTurn, 500);

    return () => {
      stopDebate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);
  
  // FIX: Assign the icon component to a capitalized variable for JSX to render it correctly.
  const ThinkingIcon = isThinking ? DEBATERS[isThinking].icon : null;

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-grid-gray-700/[0.2] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30"></div>

        <header className="relative flex-shrink-0 p-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">&larr; Change Topic</button>
                <div className="text-center">
                    <h2 className="font-orbitron text-lg font-bold text-gray-200">{topic.title}</h2>
                    <p className="text-sm text-gray-400 max-w-md mx-auto">{topic.question}</p>
                </div>
                <button 
                    onClick={stopDebate} 
                    disabled={!isDebating}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Stop
                </button>
            </div>
        </header>
        
        <main className="flex-grow overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                {isThinking && ThinkingIcon && (
                     <div className={`flex ${isThinking === 'A' ? 'justify-start' : 'justify-end'}`}>
                        <div className="flex items-center space-x-3 max-w-lg">
                           <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${DEBATERS[isThinking].bubbleClassName.split(' ')[0]}`}>
                               <ThinkingIcon className="w-6 h-6 text-white"/>
                           </div>
                           <TypingIndicator />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </main>
    </div>
  );
};

export default DebateScreen;