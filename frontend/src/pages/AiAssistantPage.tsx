import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  MapPin,
  ShieldAlert,
  Info,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChatMessage } from '../types';

// Formatter to completely eliminate raw asterisks and render clean editorial typography
const cleanAndFormatMessage = (content: string) => {
  if (!content) return null;

  // Thoroughly strip all asterisk symbols (**bold** -> bold, *italic* -> italic, * bullet -> •)
  const sanitized = content
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^\s*\*\s+/gm, '• ')
    .replace(/\*/g, '')
    .trim();

  const lines = sanitized.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Section Headers (starting with ### or Title-like)
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-heading font-bold text-sm sm:text-base text-charcoal pt-1">
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }

        // Bullet items (starting with • or - or number)
        const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed);
        if (isBullet) {
          const bulletText = trimmed.replace(/^[•\-]\s+/, '').replace(/^\d+\.\s+/, '');
          const colonIdx = bulletText.indexOf(':');

          if (colonIdx > 0 && colonIdx < 35) {
            const label = bulletText.substring(0, colonIdx);
            const rest = bulletText.substring(colonIdx + 1);
            return (
              <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm pl-1 py-0.5">
                <span className="text-forest-muted font-bold text-xs leading-none mt-1">●</span>
                <div className="flex-1">
                  <strong className="font-heading font-bold text-charcoal">{label}:</strong>
                  <span className="text-charcoal-700">{rest}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm pl-1 py-0.5">
              <span className="text-forest-muted font-bold text-xs leading-none mt-1">●</span>
              <span className="flex-1 text-charcoal-700">{bulletText}</span>
            </div>
          );
        }

        // Disclaimer or metadata Note
        if (trimmed.toLowerCase().startsWith('note:')) {
          return (
            <div key={idx} className="text-xs font-mono text-charcoal-400 bg-sand-200/60 p-2.5 rounded-xl border border-charcoal-100/40 mt-2">
              {trimmed}
            </div>
          );
        }

        // Standard paragraph line
        return (
          <p key={idx} className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-sans">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

export const AiAssistantPage: React.FC = () => {
  const { currentCity, airQualityData } = useLocation();
  const { user } = useAuth();

  const [persona, setPersona] = useState<string>(() => user?.persona || 'WORKING_PROFESSIONAL');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      senderRole: 'ASSISTANT',
      messageContent: `Hello! I am your AirWise AI Assistant.

I monitor real-time atmospheric measurements for ${currentCity} (Current AQI: ${airQualityData?.aqi || 148}).

Ask me anything about:
• Outdoor Safety: Running, cycling, or morning walking windows
• Severe Smog Protocols: Actions when AQI surges above 200
• Indoor Filtration: Air purifier CADR sizing & window ventilation
• Commute Strategies: Low-exposure routes and certified N95 mask fit`,
      timestamp: 'Just now',
      sourceAttribution: 'AirWise Environmental Intelligence Protocol',
      suggestedFollowUps: [
        'Is it safe to go running this morning?',
        'What should my family do when AQI reaches 250?',
        'How can I improve my indoor air quality?',
        'What is the safest time to commute today?'
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      senderRole: 'USER',
      messageContent: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputMessage('');
    setIsLoading(true);

    try {
      const resp = await api.askAi({
        message: textToSend,
        aqi: airQualityData?.aqi || 148,
        city: currentCity,
        persona
      });

      setMessages((prev) => [...prev, resp]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          senderRole: 'ASSISTANT',
          messageContent: 'I encountered an error retrieving live advice. Please verify network connection or try again.',
          timestamp: 'Just now',
          sourceAttribution: 'AirWise Fallback Service'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        senderRole: 'ASSISTANT',
        messageContent: `Consultation refreshed. Ready to assist with air quality guidelines for ${currentCity}.`,
        timestamp: 'Just now',
        sourceAttribution: 'AirWise Assistant',
        suggestedFollowUps: [
          'Is it safe to go running this morning?',
          'When is the best time to ventilate my room?',
          'Which mask provides real protection from PM2.5?'
        ]
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-charcoal-100/60">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-muted">
            <Bot className="w-4 h-4 text-forest-muted" />
            <span>AI Atmospheric Assistant</span>
            <span>•</span>
            <span className="text-charcoal-400">Powered by Gemini 1.5 & Air Physics</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal tracking-tight mt-1">
            Personalized Air Consultation
          </h1>
          <p className="text-sm font-sans text-charcoal-700 mt-1">
            Tailoring exposure mitigation for <strong>{currentCity}</strong> (AQI: {airQualityData?.aqi || 148}).
          </p>
        </div>

        {/* Persona Selector Chips */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-mono text-charcoal-400 hidden sm:inline">Profile:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="px-3 py-2 bg-white border border-charcoal-100/80 rounded-2xl text-xs font-heading font-medium text-charcoal shadow-subtle focus:outline-none focus:ring-1 focus:ring-forest-muted"
          >
            <option value="WORKING_PROFESSIONAL">Working Professional</option>
            <option value="PARENT">Parent (Infants & Kids)</option>
            <option value="STUDENT">Student (Transit & Campus)</option>
            <option value="SENIOR">Senior Citizen (Cardio-Pulmonary)</option>
            <option value="ATHLETE">Outdoor Athlete / Runner</option>
          </select>

          <button
            onClick={handleClearHistory}
            className="p-2 bg-white border border-charcoal-100/60 rounded-2xl text-charcoal-400 hover:text-charcoal shadow-subtle transition-all"
            title="Reset consultation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>


      {/* Transparency / Attribution Notice */}
      <div className="p-4 bg-sand-200/60 rounded-2xl border border-charcoal-100/50 flex items-start space-x-3 text-xs text-charcoal-700">
        <Info className="w-4 h-4 text-forest-muted flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparency Notice:</strong> Measurements (AQI {airQualityData?.aqi || 148}, PM2.5, NO₂) reflect live verified atmospheric sensors. Recommendations are synthesized by our AI engine for preventative guidance and do not substitute medical diagnoses.
        </p>
      </div>


      {/* Conversational Feed */}
      <div className="bg-white rounded-3xl border border-charcoal-100/60 shadow-card p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-6">
        {messages.map((msg, index) => {
          const isUser = msg.senderRole === 'USER';
          return (
            <div
              key={index}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${
                  isUser
                    ? 'bg-charcoal text-white'
                    : 'bg-sage-light text-forest-dark border border-forest-muted/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-2 max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-charcoal text-white rounded-tr-sm font-sans'
                      : 'bg-sand-100/80 text-charcoal rounded-tl-sm border border-charcoal-100/40 prose prose-sm max-w-none'
                  }`}
                >
                  {/* Clean Markdown-like Rendering with Asterisk Sanitization */}
                  {isUser ? (
                    <div className="whitespace-pre-line font-sans">{msg.messageContent}</div>
                  ) : (
                    cleanAndFormatMessage(msg.messageContent)
                  )}
                </div>

                {/* Footer Metadata & Suggested Actions */}
                <div
                  className={`flex items-center space-x-2 text-[10px] font-mono text-charcoal-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sourceAttribution && (
                    <span className="text-forest-muted font-medium">
                      ✓ {msg.sourceAttribution}
                    </span>
                  )}
                  {msg.sourceAttribution && <span>•</span>}
                  <span>{msg.timestamp || 'Just now'}</span>
                </div>

                {/* Suggested Follow-ups Pill Buttons */}
                {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {msg.suggestedFollowUps.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(prompt)}
                        className="text-xs font-mono bg-white hover:bg-sand-200 text-charcoal-700 px-3 py-1.5 rounded-full border border-charcoal-100 shadow-subtle transition-all text-left flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3 text-forest-muted" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-sage-light text-forest-dark flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-3xl bg-sand-100 border border-charcoal-100/40 text-xs font-mono text-charcoal-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-forest-muted animate-ping" />
              <span>Analyzing atmospheric conditions and health literature...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>


      {/* Input Composer Bar */}
      <div className="bg-white rounded-3xl p-2 sm:p-2.5 border border-charcoal-100 shadow-card flex items-center space-x-2 focus-within:border-forest-muted focus-within:ring-2 focus-within:ring-forest-muted/10 transition-all">
        <input
          type="text"
          placeholder="Ask a question (e.g. Can I exercise outside? How to size my purifier?)..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className="flex-1 px-4 py-2.5 bg-transparent text-sm text-charcoal placeholder-charcoal-400 focus:outline-none font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim() || isLoading}
          className="p-3 bg-charcoal hover:bg-charcoal-700 text-white rounded-2xl transition-all disabled:opacity-30 shadow-subtle flex-shrink-0"
        >
          <Send className="w-4 h-4 text-lime-accent" />
        </button>
      </div>

    </div>
  );
};
