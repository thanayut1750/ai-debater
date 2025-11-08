import React, { useState } from 'react';
import { DebateTopic, DebatingStyle, DebaterId } from './types';
import TopicSelection from './components/TopicSelection';
import DebateScreen from './components/DebateScreen';

export interface DebateConfig {
  topic: DebateTopic;
  styles: { [key in DebaterId]: DebatingStyle };
}

const App: React.FC = () => {
  const [debateConfig, setDebateConfig] = useState<DebateConfig | null>(null);

  const handleTopicSelect = (topic: DebateTopic, styles: { [key in DebaterId]: DebatingStyle }) => {
    setDebateConfig({ topic, styles });
  };

  const handleBack = () => {
    setDebateConfig(null);
  };

  return (
    <main className="h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
      {debateConfig ? (
        <DebateScreen 
          topic={debateConfig.topic} 
          styles={debateConfig.styles}
          onBack={handleBack} 
        />
      ) : (
        <TopicSelection onTopicSelect={handleTopicSelect} />
      )}
    </main>
  );
};

export default App;
