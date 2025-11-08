
import React from 'react';
import type { Message } from '../types';
import { DEBATERS } from '../constants';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const debater = DEBATERS[message.debaterId];
  const isDebaterA = debater.id === 'A';

  return (
    <div className={`flex items-end gap-3 ${isDebaterA ? 'justify-start' : 'justify-end'}`}>
      {isDebaterA && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${debater.bubbleClassName.split(' ')[0]}`}>
          <debater.icon className="w-6 h-6 text-white" />
        </div>
      )}
      <div
        className={`relative max-w-lg p-4 border rounded-xl text-white ${debater.bubbleClassName} ${
          isDebaterA ? 'rounded-bl-none' : 'rounded-br-none'
        }`}
      >
        <p className="text-base">{message.text}</p>
      </div>
      {!isDebaterA && (
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${debater.bubbleClassName.split(' ')[0]}`}>
          <debater.icon className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
