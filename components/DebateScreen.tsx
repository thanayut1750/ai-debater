import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import type { DebateTopic, Message, DebaterId, DebatingStyle } from '../types';
import { DEBATERS, PERSONA_STYLES } from '../constants';
import { createDebaterChat, generateDebateSummary } from '../services/geminiService';
import ChatBubble from './ChatBubble';

interface DebateScreenProps {
  topic: DebateTopic;
  styles: { [key in DebaterId]: DebatingStyle };
  onBack: () => void;
}

const DEFAULT_DEBATE_DURATION_SECONDS = 300; // 5 minutes

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-3">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    </div>
);

const SummaryDisplay: React.FC<{ summary: { A: string; B: string } }> = ({ summary }) => (
    <div className="mt-8 mb-4 p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg animate-fade-in">
        <h3 className="font-orbitron text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Debate Summary
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
            {(['A', 'B'] as const).map((debaterId) => {
                const debater = DEBATERS[debaterId];
                return (
                    <div key={debaterId} className={`flex flex-col p-4 rounded-lg bg-gray-900/50 border-2 ${debaterId === 'A' ? 'border-blue-500/50' : 'border-purple-500/50'}`}>
                        <div className="flex items-center space-x-3 mb-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${debater.bubbleClassName.split(' ')[0]}`}>
                                <debater.icon className="w-5 h-5 text-white" />
                            </div>
                            <h4 className={`font-bold text-lg ${debaterId === 'A' ? 'text-blue-400' : 'text-purple-400'}`}>{debater.name}'s Arguments</h4>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{summary[debaterId]}</p>
                    </div>
                );
            })}
        </div>
    </div>
);


const DebateScreen: React.FC<DebateScreenProps> = ({ topic, styles, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [isThinking, setIsThinking] = useState<DebaterId | null>(null);
  const [summary, setSummary] = useState<{ A: string; B: string } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [duration, setDuration] = useState(DEFAULT_DEBATE_DURATION_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DEBATE_DURATION_SECONDS);
  const [hasStarted, setHasStarted] = useState(false);
  
  const chatA = useRef<Chat | null>(null);
  const chatB = useRef<Chat | null>(null);
  const isDebatingRef = useRef(false);
  const isMounted = useRef(true);
  const debateEnded = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, summary, isSummarizing]);
  
  useEffect(() => {
    isDebatingRef.current = isDebating;
  }, [isDebating]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const stopDebate = () => {
    setIsDebating(false);
  };

  const startDebate = () => {
    setTimeLeft(duration);
    setHasStarted(true);
    setIsDebating(true);
  };

  // Timer effect
  useEffect(() => {
    if (!isDebating || !hasStarted || isSummarizing) return;

    if (timeLeft <= 0) {
      stopDebate();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isDebating, timeLeft, isSummarizing, hasStarted]);
  
  useEffect(() => {
    if (!hasStarted || isDebating || messages.length === 0 || debateEnded.current) return;
    
    debateEnded.current = true;
    
    const createSummary = async () => {
        if (!isMounted.current) return;
        setIsSummarizing(true);
        setSummary(null);

        const transcript = messages
            .map(msg => `${DEBATERS[msg.debaterId].name}: ${msg.text}`)
            .join('\n');

        try {
            const summaryResult = await generateDebateSummary(transcript, DEBATERS.A.name, DEBATERS.B.name);
            if (isMounted.current) {
                setSummary(summaryResult);
            }
        } catch (error) {
            console.error("Failed to generate summary:", error);
             if (isMounted.current) {
                setSummary({
                    A: 'Could not generate summary due to an error.',
                    B: 'Could not generate summary due to an error.'
                });
            }
        } finally {
            if (isMounted.current) {
                setIsSummarizing(false);
            }
        }
    };

    createSummary();
  }, [isDebating, messages.length, hasStarted]);

  // Effect to reset state when the topic or styles change
  useEffect(() => {
    setMessages([]);
    setSummary(null);
    setIsSummarizing(false);
    debateEnded.current = false;
    setHasStarted(false);
    setIsDebating(false);
    isDebatingRef.current = false;
    setDuration(DEFAULT_DEBATE_DURATION_SECONDS);
    setTimeLeft(DEFAULT_DEBATE_DURATION_SECONDS);
  }, [topic, styles]);


  // Effect to run the debate loop once started
  useEffect(() => {
    if (!hasStarted) return;

    const personaA = PERSONA_STYLES[styles.A](DEBATERS.A.name, DEBATERS.B.name, 'in favor', topic.question);
    const personaB = PERSONA_STYLES[styles.B](DEBATERS.B.name, DEBATERS.A.name, 'against', topic.question);

    chatA.current = createDebaterChat(personaA);
    chatB.current = createDebaterChat(personaB);
    
    let currentTurn: DebaterId = 'A';
    let lastMessage = `Let's begin the debate on: ${topic.question}. Please provide your opening statement in a concise and impactful manner.`;
    
    const runDebateLoop = async () => {
      while (isDebatingRef.current) {
        if (!isMounted.current) return;

        const currentChat = currentTurn === 'A' ? chatA.current : chatB.current;
        const debaterId = currentTurn;
        
        setIsThinking(debaterId);
        
        try {
          const result = await currentChat!.sendMessage({ message: lastMessage });
          
          if (!isDebatingRef.current || !isMounted.current) break;
          
          const newText = result.text;
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (!isDebatingRef.current || !isMounted.current) break;

          setMessages(prev => [...prev, { id: `msg-${Date.now()}`, text: newText, debaterId }]);
          lastMessage = newText;
          
          currentTurn = currentTurn === 'A' ? 'B' : 'A';
        } catch (error) {
          console.error("Error during debate turn:", error);
          if (isMounted.current) {
            setMessages(prev => [...prev, { id: 'error', text: 'An API error occurred. The debate has been paused.', debaterId: 'A' }]);
            stopDebate();
          }
          break;
        }
      }
      
      if (isMounted.current) {
        setIsThinking(null);
      }
    };
    
    runDebateLoop();

    return () => {
      isDebatingRef.current = false;
    };
  }, [hasStarted, topic, styles]);
  
  const ThinkingIcon = isThinking ? DEBATERS[isThinking].icon : null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-red-500';
    if (timeLeft <= 60) return 'text-yellow-400';
    return 'text-gray-200';
  };

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-grid-gray-700/[0.2] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30"></div>

        <header className="relative flex-shrink-0 p-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">&larr; Change Topic</button>
                <div className="text-center">
                    <h2 className="font-orbitron text-lg font-bold text-gray-200">{topic.title}</h2>
                    <p className="text-sm text-gray-400 max-w-md mx-auto mb-2">{topic.question}</p>
                    {hasStarted ? (
                        <div className={`font-orbitron text-2xl font-bold transition-colors duration-300 ${getTimerColor()}`}>
                            {formatTime(timeLeft)}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <label htmlFor="duration-input" className="text-sm font-bold text-gray-300">Duration (s):</label>
                            <input
                                id="duration-input"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Math.max(10, parseInt(e.target.value, 10) || 10))}
                                className="bg-gray-800/70 text-white w-24 text-center rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                aria-label="Set debate duration in seconds"
                            />
                        </div>
                    )}
                </div>
                {hasStarted ? (
                    <button 
                        onClick={stopDebate} 
                        disabled={!isDebating}
                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Stop
                    </button>
                ) : (
                    <button
                        onClick={startDebate}
                        className="px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
                    >
                        Start
                    </button>
                )}
            </div>
        </header>
        
        <main className="flex-grow overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {!hasStarted && (
                    <div className="text-center text-gray-400 p-8 border border-dashed border-gray-700 rounded-lg">
                        <p className="font-orbitron text-lg">Set the debate duration and click 'Start' to begin.</p>
                    </div>
                )}
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

            {isSummarizing && (
                <div className="text-center py-6">
                    <p className="text-lg font-orbitron text-cyan-400 animate-pulse">Generating Summary...</p>
                </div>
            )}
            {summary && <SummaryDisplay summary={summary} />}
           
        </main>
    </div>
  );
};

export default DebateScreen;