import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VoiceAssistant from '@/components/VoiceAssistant';
import NotificationSubscribe from '@/components/NotificationSubscribe';

const Index = () => {
  const [activeSection, setActiveSection] = useState('Главная');
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>({ temp: 22, condition: 'Солнечно', forecast: [] });
  const [incidents, setIncidents] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const sections = ['Главная', 'Новости', 'События', 'Погода', 'Происшествия'];

  const fetchNews = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f165c29f-25e8-4e3d-9d86-6442b89e08df');
      const data = await response.json();
      
      setNews(data.news || []);
      setWeather(data.weather || { temp: 22, condition: 'Солнечно', forecast: [] });
      setIncidents(data.incidents || []);
      setLastUpdate(data.lastUpdate);
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    const interval = setInterval(() => {
      fetchNews();
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-secondary to-secondary/90 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Icon name="Newspaper" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-montserrat font-bold">ХАБАРОВСК</h1>
                <p className="text-sm text-gray-200">Новостной портал города</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowNotificationDialog(true)}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hidden md:flex"
              >
                <Icon name="Bell" size={18} className="mr-2" />
                Подписаться
              </Button>
              <div className="text-right">
                <div className="text-2xl font-bold">+{weather.temp}°C</div>
                <div className="text-xs text-gray-200">{weather.condition}</div>
              </div>
              <Icon name="Sun" size={40} className="text-yellow-300" />
            </div>
          </div>
          
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  activeSection === section
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Загрузка новостей...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {lastUpdate && (
              <div className="lg:col-span-3 flex items-center justify-center gap-2 text-sm text-gray-500 bg-white rounded-lg p-3 shadow">
                <Icon name="RefreshCw" size={16} />
                <span>Обновлено: {new Date(lastUpdate).toLocaleString('ru-RU')}</span>
                <span className="text-xs text-gray-400">• Следующее обновление через час</span>
              </div>
            )}
            <div className="lg:col-span-2 space-y-6">
              {news.filter(item => item.featured).map((item, index) => (
              <Card 
                key={item.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in border-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-96 overflow-hidden group">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="mb-3 bg-primary text-white border-0 font-semibold">
                      {item.category}
                    </Badge>
                    <h2 className="text-4xl font-montserrat font-bold mb-3 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-lg text-gray-200 mb-3">{item.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Icon name="Clock" size={16} />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="grid md:grid-cols-2 gap-4">
              {news.filter(item => !item.featured).map((item, index) => (
                <Card 
                  key={item.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up border-0 group cursor-pointer"
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-white border-0">
                      {item.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-montserrat font-bold mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{item.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Icon name="Clock" size={14} />
                      <span>{item.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="CloudSun" size={48} />
                  <div>
                    <h3 className="text-2xl font-montserrat font-bold">Погода</h3>
                    <p className="text-sm text-blue-100">Хабаровск</p>
                  </div>
                </div>
                <div className="text-5xl font-bold mb-2">+{weather.temp}°C</div>
                <p className="text-blue-100 mb-4">{weather.condition}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {weather.forecast?.map((day: any, idx: number) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-2">
                      <div className="text-xs text-blue-100">{day.day}</div>
                      <div className="text-lg font-bold">+{day.temp}°C</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="AlertTriangle" size={24} className="text-primary" />
                  <h3 className="text-xl font-montserrat font-bold">Происшествия</h3>
                </div>
                <div className="space-y-3">
                  {incidents.map((incident) => (
                    <div 
                      key={incident.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <p className="font-semibold text-sm mb-1">{incident.title}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Icon name="Clock" size={12} />
                        <span>{incident.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Все происшествия
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-red-600 text-white animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="TrendingUp" size={24} />
                  <h3 className="text-lg font-montserrat font-bold">Популярное</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="hover:text-red-100 cursor-pointer transition-colors">• Открытие нового моста через Амур</li>
                  <li className="hover:text-red-100 cursor-pointer transition-colors">• Фестиваль уличной еды в выходные</li>
                  <li className="hover:text-red-100 cursor-pointer transition-colors">• Расписание общественного транспорта</li>
                </ul>
              </CardContent>
            </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-secondary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-montserrat font-bold text-lg mb-3">О портале</h4>
              <p className="text-sm text-gray-300">Актуальные новости Хабаровска 24/7</p>
            </div>
            <div>
              <h4 className="font-montserrat font-bold text-lg mb-3">Разделы</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                {sections.map(section => (
                  <li key={section} className="hover:text-white cursor-pointer transition-colors">{section}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-bold text-lg mb-3">Контакты</h4>
              <p className="text-sm text-gray-300">Email: news@khabarovsk.ru</p>
              <p className="text-sm text-gray-300">Тел: +7 (4212) 00-00-00</p>
            </div>
            <div>
              <h4 className="font-montserrat font-bold text-lg mb-3">Подписка</h4>
              <p className="text-sm text-gray-300 mb-2">Получайте последние новости</p>
              <Button 
                onClick={() => setShowNotificationDialog(true)}
                variant="outline" 
                className="bg-white text-secondary hover:bg-gray-100"
              >
                <Icon name="Bell" size={16} className="mr-2" />
                Подписаться
              </Button>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm text-gray-300">
            <p>© 2024 Хабаровск News. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <VoiceAssistant onSectionChange={setActiveSection} />
      <NotificationSubscribe 
        isOpen={showNotificationDialog} 
        onClose={() => setShowNotificationDialog(false)} 
      />
    </div>
  );
};

export default Index;