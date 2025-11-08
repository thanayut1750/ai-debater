
import React, { useState } from 'react';
import { DebateTopic } from './types';
import TopicSelection from './components/TopicSelection';
import DebateScreen from './components/DebateScreen';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);

  const handleTopicSelect = (topic: DebateTopic) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  return (
    <main className="h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
      {selectedTopic ? (
        <DebateScreen topic={selectedTopic} onBack={handleBack} />
      ) : (
        <TopicSelection onTopicSelect={handleTopicSelect} />
      )}
    </main>
  );
};

export default App;
