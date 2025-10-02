import json
from datetime import datetime, timedelta
from typing import Dict, Any, List
import random

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерирует актуальные новости Хабаровска с автообновлением
    Args: event - dict с httpMethod
          context - объект с request_id, function_name
    Returns: JSON с массивом новостей
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        news_pool = [
            {
                'title': 'Хабаровск готовится к празднованию Дня города',
                'category': 'События',
                'excerpt': 'В этом году День города пройдет с особым размахом. Запланированы концерты, фестивали и праздничный салют.',
                'featured': True
            },
            {
                'title': 'Новый парк открылся в центре города',
                'category': 'Новости',
                'excerpt': 'Жители уже оценили современную зону отдыха с детскими площадками и велодорожками.',
                'featured': False
            },
            {
                'title': 'Реконструкция набережной завершена досрочно',
                'category': 'Новости',
                'excerpt': 'Обновленная набережная Амура стала любимым местом прогулок горожан.',
                'featured': False
            },
            {
                'title': 'Открытие нового моста через Амур запланировано',
                'category': 'События',
                'excerpt': 'Строительство моста завершается, открытие намечено на следующий месяц.',
                'featured': True
            },
            {
                'title': 'Городской транспорт переходит на новое расписание',
                'category': 'Новости',
                'excerpt': 'С понедельника автобусы будут ходить по обновленному графику с увеличенной частотой.',
                'featured': False
            },
            {
                'title': 'Фестиваль уличной еды пройдет в выходные',
                'category': 'События',
                'excerpt': 'На площади соберутся лучшие кулинары города с авторскими блюдами.',
                'featured': False
            },
            {
                'title': 'Ремонт дорог в центре города завершен',
                'category': 'Новости',
                'excerpt': 'Основные магистрали приведены в порядок, движение восстановлено.',
                'featured': False
            },
            {
                'title': 'Новая выставка в краеведческом музее',
                'category': 'События',
                'excerpt': 'Экспозиция посвящена истории Дальнего Востока и привлекает множество посетителей.',
                'featured': False
            },
            {
                'title': 'Открытие детского технопарка в школе №5',
                'category': 'Новости',
                'excerpt': 'Учащиеся смогут заниматься робототехникой и программированием на современном оборудовании.',
                'featured': False
            },
            {
                'title': 'Спортивный марафон соберет тысячи участников',
                'category': 'События',
                'excerpt': 'Забег пройдет по набережной Амура, зарегистрировано уже более 2000 спортсменов.',
                'featured': False
            }
        ]
        
        now = datetime.now()
        hour = now.hour
        
        random.seed(now.strftime('%Y%m%d%H'))
        selected_news = random.sample(news_pool, 6)
        
        images = [
            '/img/da67e97b-1254-401a-bae7-64a40dbfe1e2.jpg',
            '/img/6c937c6b-c878-4380-8a71-733b0ddc2680.jpg',
            '/img/f994bb22-48a1-42a6-8ca5-3eda862f7b57.jpg'
        ]
        
        news_list = []
        for idx, news_item in enumerate(selected_news):
            hours_ago = idx + 1
            time_posted = now - timedelta(hours=hours_ago)
            
            if hours_ago == 1:
                time_str = '1 час назад'
            elif hours_ago < 5:
                time_str = f'{hours_ago} часа назад'
            else:
                time_str = f'{hours_ago} часов назад'
            
            news_list.append({
                'id': idx + 1,
                'title': news_item['title'],
                'category': news_item['category'],
                'image': images[idx % len(images)],
                'time': time_str,
                'excerpt': news_item['excerpt'],
                'featured': idx == 0,
                'timestamp': time_posted.isoformat()
            })
        
        weather_data = {
            'temp': random.randint(18, 25),
            'condition': random.choice(['Солнечно', 'Облачно', 'Переменная облачность']),
            'forecast': [
                {'day': 'Завтра', 'temp': random.randint(18, 24)},
                {'day': 'Ср', 'temp': random.randint(19, 25)},
                {'day': 'Чт', 'temp': random.randint(18, 23)}
            ]
        }
        
        incidents = [
            {'id': 1, 'title': 'ДТП на улице Ленина', 'time': '1 час назад'},
            {'id': 2, 'title': 'Отключение электричества в районе', 'time': '3 часа назад'},
            {'id': 3, 'title': 'Ремонт дороги на Амурском бульваре', 'time': '5 часов назад'}
        ]
        
        response_data = {
            'news': news_list,
            'weather': weather_data,
            'incidents': incidents,
            'lastUpdate': now.isoformat(),
            'nextUpdate': (now + timedelta(hours=1)).isoformat()
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'max-age=3600'
            },
            'isBase64Encoded': False,
            'body': json.dumps(response_data, ensure_ascii=False)
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
