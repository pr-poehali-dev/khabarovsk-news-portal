import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VoiceAssistantProps {
  onSectionChange: (section: string) => void;
}

const VoiceAssistant = ({ onSectionChange }: VoiceAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('Привет! Я Aisi, ваш голосовой помощник. Спросите меня о новостях или попросите перейти в нужный раздел.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'ru-RU';

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          handleVoiceCommand(text);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          setResponse('Извините, произошла ошибка. Попробуйте ещё раз.');
        };
      }
    }

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  const handleVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    let responseText = '';

    if (lowerText.includes('новости') && !lowerText.includes('погод') && !lowerText.includes('происшеств')) {
      onSectionChange('Новости');
      responseText = 'Открываю раздел новостей';
    } else if (lowerText.includes('события')) {
      onSectionChange('События');
      responseText = 'Показываю городские события';
    } else if (lowerText.includes('погод')) {
      onSectionChange('Погода');
      responseText = 'Вот прогноз погоды для Хабаровска';
    } else if (lowerText.includes('происшеств')) {
      onSectionChange('Происшествия');
      responseText = 'Показываю последние происшествия';
    } else if (lowerText.includes('главн')) {
      onSectionChange('Главная');
      responseText = 'Возвращаюсь на главную страницу';
    } else if (lowerText.includes('что нового') || lowerText.includes('расскажи')) {
      responseText = 'Сегодня главная новость: Хабаровск готовится к празднованию Дня города. Также открылся новый парк в центре города.';
    } else if (lowerText.includes('температур') || lowerText.includes('градус')) {
      responseText = 'Сейчас в Хабаровске плюс двадцать два градуса, солнечно, без осадков';
    } else {
      responseText = 'Я могу открыть раздел Новости, События, Погода или Происшествия. Также могу рассказать о последних новостях города.';
    }

    setResponse(responseText);
    speak(responseText);
  };

  const speak = (text: string) => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      
      const voices = synthesisRef.current.getVoices();
      const femaleRussianVoice = voices.find(voice => 
        voice.lang.startsWith('ru') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => 
        voice.lang.startsWith('ru') && (voice.name.includes('Milena') || voice.name.includes('Elena') || voice.name.includes('Anna'))
      ) || voices.find(voice => voice.lang.startsWith('ru'));
      
      if (femaleRussianVoice) {
        utterance.voice = femaleRussianVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthesisRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleAssistant = () => {
    if (isOpen && synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    } else if (!isOpen) {
      speak('Здравствуйте! Чем могу помочь?');
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl z-50 flex items-center justify-center group"
        aria-label="Голосовой помощник"
      >
        {isOpen ? (
          <Icon name="X" size={28} className="text-white" />
        ) : (
          <Icon name="Mic" size={28} className="text-white animate-pulse" />
        )}
        {!isOpen && (
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
        )}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 shadow-2xl border-2 border-purple-200 z-50 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ${isSpeaking ? 'animate-pulse' : ''}`}>
                  <Icon name="Sparkles" size={24} className="text-white" />
                </div>
                {isSpeaking && (
                  <span className="absolute inset-0 w-12 h-12 rounded-full bg-purple-400 animate-ping opacity-75"></span>
                )}
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-xl">Aisi</h3>
                <p className="text-xs text-gray-500">Голосовой помощник</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4 min-h-[100px]">
              <p className="text-sm text-gray-700">{response}</p>
            </div>

            {transcript && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Вы сказали:</p>
                <p className="text-sm font-semibold text-blue-700">{transcript}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {isListening ? (
                  <>
                    <Icon name="Square" size={18} className="mr-2" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Icon name="Mic" size={18} className="mr-2" />
                    Говорите
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Попробуйте сказать:</p>
              <div className="flex flex-wrap gap-2">
                {['Новости', 'Погода', 'События', 'Что нового?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleVoiceCommand(suggestion)}
                    className="text-xs px-3 py-1 bg-white border border-purple-200 rounded-full hover:bg-purple-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default VoiceAssistant;
