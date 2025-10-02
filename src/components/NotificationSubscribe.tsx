import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface NotificationSubscribeProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSubscribe = ({ isOpen, onClose }: NotificationSubscribeProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Новости', 'События', 'Происшествия']);
  const { toast } = useToast();

  const categories = [
    { name: 'Новости', icon: 'Newspaper', color: 'bg-blue-500' },
    { name: 'События', icon: 'Calendar', color: 'bg-purple-500' },
    { name: 'Погода', icon: 'CloudSun', color: 'bg-cyan-500' },
    { name: 'Происшествия', icon: 'AlertTriangle', color: 'bg-red-500' }
  ];

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      const subscription = localStorage.getItem('newsSubscription');
      if (subscription) {
        setIsSubscribed(true);
        setSelectedCategories(JSON.parse(subscription));
      }
    }
  }, []);

  const toggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Не поддерживается',
        description: 'Ваш браузер не поддерживает уведомления',
        variant: 'destructive'
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        localStorage.setItem('newsSubscription', JSON.stringify(selectedCategories));
        setIsSubscribed(true);
        
        new Notification('Подписка активирована! 🎉', {
          body: `Вы будете получать уведомления о: ${selectedCategories.join(', ')}`,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: 'subscription-success'
        });

        toast({
          title: 'Успешно подписаны!',
          description: `Вы будете получать уведомления о важных событиях`,
        });

        setTimeout(onClose, 2000);
      } else {
        toast({
          title: 'Доступ запрещен',
          description: 'Разрешите уведомления в настройках браузера',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось оформить подписку',
        variant: 'destructive'
      });
    }
  };

  const unsubscribe = () => {
    localStorage.removeItem('newsSubscription');
    setIsSubscribed(false);
    toast({
      title: 'Подписка отменена',
      description: 'Вы больше не будете получать уведомления'
    });
  };

  const sendTestNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Тестовое уведомление 📰', {
        body: 'Хабаровск: Открытие нового моста через Амур запланировано на следующую неделю',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'test-notification'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-primary to-red-600 p-2 rounded-lg">
              <Icon name="Bell" size={24} className="text-white" />
            </div>
            <DialogTitle className="font-montserrat text-2xl">Push-уведомления</DialogTitle>
          </div>
          <DialogDescription>
            Получайте важные новости Хабаровска мгновенно на ваше устройство
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {isSubscribed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Icon name="CheckCircle2" size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 text-sm">Подписка активна</p>
                <p className="text-xs text-green-700 mt-1">Вы получаете уведомления</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Icon name="List" size={18} />
              Выберите категории
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => toggleCategory(category.name)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedCategories.includes(category.name)
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`${category.color} p-1.5 rounded`}>
                      <Icon name={category.icon as any} size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  {selectedCategories.includes(category.name) && (
                    <Icon name="Check" size={16} className="text-primary ml-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedCategories.length === 0 && (
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              Выберите хотя бы одну категорию
            </p>
          )}

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Zap" size={16} className="text-primary" />
              <span>Мгновенные уведомления о важных событиях</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Volume2" size={16} className="text-primary" />
              <span>Звуковые оповещения</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Shield" size={16} className="text-primary" />
              <span>Безопасно и без спама</span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isSubscribed ? (
              <Button
                onClick={requestPermission}
                disabled={selectedCategories.length === 0}
                className="flex-1 bg-gradient-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-700"
              >
                <Icon name="Bell" size={18} className="mr-2" />
                Подписаться
              </Button>
            ) : (
              <>
                <Button
                  onClick={sendTestNotification}
                  variant="outline"
                  className="flex-1"
                >
                  <Icon name="Send" size={18} className="mr-2" />
                  Тест
                </Button>
                <Button
                  onClick={unsubscribe}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Icon name="BellOff" size={18} className="mr-2" />
                  Отписаться
                </Button>
              </>
            )}
          </div>

          {notificationPermission === 'denied' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 flex items-start gap-2">
                <Icon name="XCircle" size={16} className="mt-0.5" />
                <span>Уведомления заблокированы. Разрешите их в настройках браузера.</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSubscribe;
