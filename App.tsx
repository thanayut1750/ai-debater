import React, { useState } from 'react';
import { DebateTopic, DebaterId } from './types';
import TopicSelection from './components/TopicSelection';
import DebateScreen from './components/DebateScreen';

export interface DebateConfig {
  topic: DebateTopic;
  personas: { [key in DebaterId]: string };
}

const App: React.FC = () => {
  const [debateConfig, setDebateConfig] = useState<DebateConfig | null>(null);

  const handleTopicSelect = (topic: DebateTopic, personas: { [key in DebaterId]: string }) => {
    setDebateConfig({ topic, personas });
  };

  const handleBack = () => {
    setDebateConfig(null);
  };

  return (
    <main className="h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
      {debateConfig ? (
        <DebateScreen 
          topic={debateConfig.topic} 
          personas={debateConfig.personas}
          onBack={handleBack} 
        />
      ) : (
        <TopicSelection onTopicSelect={handleTopicSelect} />
      )}
    </main>
  );
};

export default App;