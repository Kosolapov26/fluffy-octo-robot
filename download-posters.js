const axios = require('axios');
const fs = require('fs');
const path = require('path');

// === НАСТРОЙКИ ===
const API_KEY = '0b7b5259-52f7-4bf9-9ae6-853325d5dd65'; // получите на https://kinopoiskapiunofficial.tech
const SERIES_JS_PATH = path.join(__dirname, 'js', 'series.js');
const IMAGES_DIR = path.join(__dirname, 'images');

// === ИЗВЛЕЧЕНИЕ SERIES_LIST ИЗ JS-ФАЙЛА (безопасный eval) ===
function extractSeriesList(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    let SERIES_LIST = null;
    // Выполняем код в текущей области видимости – переменная SERIES_LIST заполнится
    eval(code);
    if (!SERIES_LIST) throw new Error('SERIES_LIST не найден');
    return SERIES_LIST;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function downloadPoster(kpId, filename) {
    const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${kpId}`;
    try {
        console.log(`🔍 Запрос для KP ID ${kpId} (${filename})...`);
        const response = await axios.get(url, {
            headers: { 'X-API-KEY': API_KEY }
        });
        const posterUrl = response.data.posterUrl;
        if (!posterUrl) {
            console.log(`❌ Постер не найден`);
            return;
        }
        console.log(`📥 Скачивание ${posterUrl}`);
        const imgRes = await axios.get(posterUrl, { responseType: 'stream' });
        const filePath = path.join(IMAGES_DIR, `${filename}.jpg`);
        const writer = fs.createWriteStream(filePath);
        imgRes.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', () => { console.log(`✅ Сохранён: ${filename}.jpg`); resolve(); });
            writer.on('error', reject);
        });
    } catch (err) {
        console.log(`⚠️ Ошибка для ${kpId}: ${err.message}`);
        if (err.response) console.log(`   Статус: ${err.response.status}`);
    }
}

async function main() {
    if (API_KEY === 'ВАШ_API_КЛЮЧ') {
        console.error('❌ Укажите реальный API-ключ в переменной API_KEY');
        console.log('   Получить: https://kinopoiskapiunofficial.tech');
        return;
    }

    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
        console.log('📁 Создана папка images');
    }

    console.log(`📖 Чтение сериалов из ${SERIES_JS_PATH}`);
    const allSeries = extractSeriesList(SERIES_JS_PATH);
    console.log(`🚀 Найдено сериалов: ${allSeries.length}`);

    for (const series of allSeries) {
        const kpId = series.kp_id;
        if (!kpId || kpId === '0') {
            console.log(`⏩ Пропуск: ${series.title} (нет KP ID)`);
            continue;
        }

        let filename = (series.poster || '').replace('images/', '').replace('.jpg', '');
        if (!filename) filename = series.id;

        const filePath = path.join(IMAGES_DIR, `${filename}.jpg`);
        if (fs.existsSync(filePath)) {
            console.log(`⏩ Файл уже существует: ${filename}.jpg`);
            continue;
        }

        await downloadPoster(kpId, filename);
        await delay(500);
    }
    console.log('🎉 Готово!');
}

main().catch(console.error);