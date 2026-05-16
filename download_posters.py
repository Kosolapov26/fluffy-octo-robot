import requests
import json
import re
import os
import time
from pathlib import Path

# --- НАСТРОЙКИ ---
# Укажите правильный путь к series.js
SERIES_JS_PATH = r"C:\Users\Артем\Desktop\KinoGorilla\js\series.js"
# Папка для сохранения постеров
IMAGES_DIR = r"C:\Users\Артем\Desktop\KinoGorilla\images"
# API-ключ (получите на kinopoiskapiunofficial.tech)
API_KEY = "0b7b5259-52f7-4bf9-9ae6-853325d5dd65"  # ЗАМЕНИТЕ НА РЕАЛЬНЫЙ КЛЮЧ
REQUEST_DELAY = 0.5  # задержка между запросами

# --- ФУНКЦИЯ ИЗВЛЕЧЕНИЯ МАССИВА СЕРИАЛОВ ИЗ JS-ФАЙЛА ---
def extract_series_list(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Ищем массив SERIES_LIST = [ ... ];
    match = re.search(r'const SERIES_LIST = (\[[\s\S]*?\n\]);', content)
    if not match:
        raise Exception("Не удалось найти SERIES_LIST в файле series.js")
    
    array_str = match.group(1)
    
    # Удаляем однострочные комментарии //
    array_str = re.sub(r'//.*?$', '', array_str, flags=re.MULTILINE)
    # Удаляем многострочные комментарии /* ... */
    array_str = re.sub(r'/\*[\s\S]*?\*/', '', array_str)
    # Заменяем одинарные кавычки на двойные (для JSON-совместимости)
    array_str = re.sub(r"'", '"', array_str)
    # Убираем завершающие запятые перед закрывающей скобкой (невалидный JSON)
    array_str = re.sub(r',\s*\]', ']', array_str)
    # Убираем возможные trailing commas внутри объектов
    array_str = re.sub(r',\s*}', '}', array_str)
    
    # Преобразуем строку в список объектов Python
    try:
        series_list = json.loads(array_str)
    except json.JSONDecodeError as e:
        print("Ошибка при разборе JSON. Распечатываю проблемную строку для отладки:")
        print(array_str[:500])
        raise e
    
    return series_list

# --- ФУНКЦИЯ СКАЧИВАНИЯ ПОСТЕРА ---
def download_poster(kp_id, filename):
    url = f"https://kinopoiskapiunofficial.tech/api/v2.2/films/{kp_id}"
    headers = {'X-API-KEY': API_KEY, 'Content-Type': 'application/json'}
    
    try:
        print(f"🔍 Ищу постер для KP ID {kp_id} ({filename})...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        poster_url = data.get('posterUrl')
        if not poster_url:
            print(f"❌ Постер для KP ID {kp_id} не найден.")
            return
        
        # Скачиваем изображение
        img_response = requests.get(poster_url, stream=True)
        img_response.raise_for_status()
        
        file_path = Path(IMAGES_DIR) / f"{filename}.jpg"
        with open(file_path, 'wb') as f:
            for chunk in img_response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"✅ Постер сохранён: {file_path}")
    except Exception as e:
        print(f"⚠️ Ошибка для KP ID {kp_id}: {e}")

# --- ГЛАВНАЯ ФУНКЦИЯ ---
def main():
    if API_KEY == "ВАШ_API_КЛЮЧ":
        print("❌ Ошибка: укажите ваш API-ключ в переменной API_KEY.")
        print("   Получить ключ бесплатно: https://kinopoiskapiunofficial.tech")
        return
    
    # Создаём папку images, если её нет
    Path(IMAGES_DIR).mkdir(parents=True, exist_ok=True)
    
    print(f"📖 Чтение данных из файла: {SERIES_JS_PATH}")
    all_series = extract_series_list(SERIES_JS_PATH)
    
    print(f"🚀 Начинаю загрузку постеров для {len(all_series)} сериалов...")
    for series in all_series:
        kp_id = series.get('kp_id')
        if not kp_id or kp_id == '0':
            print(f"⏩ Пропускаем '{series.get('title')}': нет KP ID")
            continue
        
        # Имя файла берём из поля poster (без пути images/ и расширения)
        poster_field = series.get('poster', '')
        filename = poster_field.replace('images/', '').replace('.jpg', '')
        if not filename:
            filename = series['id']  # запасной вариант
        
        download_poster(kp_id, filename)
        time.sleep(REQUEST_DELAY)
    
    print("\n🎉 Готово! Постеры загружены в папку images.")

if __name__ == "__main__":
    main()