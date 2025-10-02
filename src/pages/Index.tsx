import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VoiceAssistant from '@/components/VoiceAssistant';

const Index = () => {
  const [activeSection, setActiveSection] = useState('Главная');

  const sections = ['Главная', 'Новости', 'События', 'Погода', 'Происшествия'];

  const news = [
    {
      id: 1,
      title: 'Хабаровск готовится к празднованию Дня города',
      category: 'События',
      image: '/img/da67e97b-1254-401a-bae7-64a40dbfe1e2.jpg',
      time: '2 часа назад',
      excerpt: 'В этом году День города пройдет с особым размахом. Запланированы концерты, фестивали и праздничный салют.',
      featured: true
    },
    {
      id: 2,
      title: 'Новый парк открылся в центре города',
      category: 'Новости',
      image: '/img/6c937c6b-c878-4380-8a71-733b0ddc2680.jpg',
      time: '4 часа назад',
      excerpt: 'Жители уже оценили современную зону отдыха с детскими площадками и велодорожками.',
      featured: false
    },
    {
      id: 3,
      title: 'Погода: солнечная неделя ждет хабаровчан',
      category: 'Погода',
      image: '/img/f994bb22-48a1-42a6-8ca5-3eda862f7b57.jpg',
      time: '5 часов назад',
      excerpt: 'Температура воздуха поднимется до +22°C. Осадков не ожидается.',
      featured: false
    },
    {
      id: 4,
      title: 'Реконструкция набережной завершена досрочно',
      category: 'Новости',
      image: '/img/da67e97b-1254-401a-bae7-64a40dbfe1e2.jpg',
      time: '6 часов назад',
      excerpt: 'Обновленная набережная Амура стала любимым местом прогулок горожан.',
      featured: false
    }
  ];

  const incidents = [
    { id: 1, title: 'ДТП на улице Ленина', time: '1 час назад' },
    { id: 2, title: 'Отключение электричества в районе', time: '3 часа назад' },
    { id: 3, title: 'Ремонт дороги на Амурском бульваре', time: '5 часов назад' }
  ];

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
              <div className="text-right">
                <div className="text-2xl font-bold">+22°C</div>
                <div className="text-xs text-gray-200">Солнечно</div>
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
        <div className="grid lg:grid-cols-3 gap-6">
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
                <div className="text-5xl font-bold mb-2">+22°C</div>
                <p className="text-blue-100 mb-4">Солнечно, без осадков</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="text-xs text-blue-100">Завтра</div>
                    <div className="text-lg font-bold">+20°C</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="text-xs text-blue-100">Ср</div>
                    <div className="text-lg font-bold">+21°C</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="text-xs text-blue-100">Чт</div>
                    <div className="text-lg font-bold">+23°C</div>
                  </div>
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
              <Button variant="outline" className="bg-white text-secondary hover:bg-gray-100">
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
    </div>
  );
};

export default Index;