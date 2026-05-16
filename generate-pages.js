// ========== ГЕНЕРАТОР СТРАНИЦ ==========
// Запуск: node generate-pages.js

const fs = require('fs');
const path = require('path');

// Функция для извлечения массива из JS файла
function extractArrayFromFile(filePath, arrayName) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(`const ${arrayName} = (\\[[\\s\\S]*?\\]);`);
    const match = content.match(regex);
    if (match) {
        return eval(match[1]);
    }
    return [];
}

// Загружаем сериалы из series.js
const seriesPath = path.join(__dirname, 'js', 'series.js');
let allItems = [];

if (fs.existsSync(seriesPath)) {
    const series = extractArrayFromFile(seriesPath, 'SERIES_LIST');
    allItems.push(...series);
    console.log(`📖 Загружено ${series.length} сериалов из series.js`);
}

// Загружаем фильмы из data.js (только фильмы, без сериалов)
const dataPath = path.join(__dirname, 'js', 'data.js');
if (fs.existsSync(dataPath)) {
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    // Извлекаем MOVIES_LIST и фильтруем только type: "movie"
    const match = dataContent.match(/const MOVIES_LIST = (\[[\s\S]*?\]);/);
    if (match) {
        const movies = eval(match[1]).filter(item => item.type === 'movie');
        allItems.push(...movies);
        console.log(`📖 Загружено ${movies.length} фильмов из data.js`);
    }
}

console.log(`\n📊 Всего позиций: ${allItems.length}\n`);

// ========== ФУНКЦИЯ: какие плееры доступны ==========
function getAvailablePlayers(movie) {
    const players = [];
    
    if (movie.kp_id && movie.kp_id !== '0' && movie.kp_id !== '') {
        players.push({ type: 'kp', name: '🎬 Плеер 1 (KP)', param: movie.kp_id });
    }
    if (movie.imdb_id && movie.imdb_id !== '') {
        players.push({ type: 'imdb', name: '🎥 Плеер 2 (IMDB)', param: movie.imdb_id });
    }
    if (movie.tmdb_id && movie.tmdb_id !== '') {
        players.push({ type: 'tmdb', name: '📺 Плеер 3 (TMDB)', param: `tmdb${movie.tmdb_id}` });
    }
    
    return players;
}

// ========== ГЕНЕРАЦИЯ HTML ==========
function generateMoviePage(movie) {
    const isSeries = movie.type === 'series';
    const players = getAvailablePlayers(movie);
    const defaultPlayer = players[0];
    
    if (!defaultPlayer) {
        console.log(`⚠️ Пропущен: ${movie.title} (нет ID для плеера)`);
        return null;
    }
    
    // Генерация кнопок
    let playerButtons = '';
    players.forEach((player, index) => {
        const isActive = index === 0 ? 'active' : '';
        playerButtons += `<button class="player-btn ${isActive}" data-player="${index}" onclick="switchPlayer(${index})">${player.name}</button>`;
    });
    
    // Генерация switch-case
    let switchCases = '';
    players.forEach((player, index) => {
        switchCases += `
            case ${index}:
                currentType = '${player.type}';
                currentParam = '${player.param}';
                break;`;
    });
    
    const posterFile = movie.poster ? movie.poster.replace('images/', '') : 'placeholder.jpg';
    
    let html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${movie.title} (${movie.year}) смотреть онлайн | KinoGorilla</title>
    <meta name="description" content="${(movie.description || '').substring(0, 150)}">
    <meta name="keywords" content="${movie.title}, ${movie.year}, смотреть онлайн, ${movie.genre || ''}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${movie.title} (${movie.year}) смотреть онлайн | KinoGorilla">
    <meta property="og:description" content="${(movie.description || '').substring(0, 150)}">
    <meta property="og:type" content="${isSeries ? 'video.tv_show' : 'video.movie'}">
    <meta property="og:image" content="https://kinogorilla.com/images/${posterFile}">
    <link rel="canonical" href="https://kinogorilla.com/movies/${movie.id}.html">
    <link rel="stylesheet" href="../css/style.css">
    <script src="../config.js"></script>
</head>
<body>

<div class="header">
    <div class="nav">
        <a href="../index.html" class="logo">🦍 KinoGorilla</a>
        <a href="../index.html" class="back-btn">← На главную</a>
    </div>
</div>

<div class="container">
    <div style="display: flex; gap: 30px; margin-bottom: 30px; flex-wrap: wrap;">
        <div style="width: 200px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); background: #2a2f4a;">
            <img src="../images/${posterFile}" alt="${movie.title}" style="width: 100%; height: auto; display: block;" onerror="this.src='https://via.placeholder.com/200x300/2a2f4a/ffffff?text=${encodeURIComponent(movie.title.substring(0, 20))}'">
        </div>
        <div style="flex: 1;">
            <h1 style="font-size: 32px; margin-bottom: 10px;">${movie.title} <span style="font-size: 18px; color: #ff8e53;">(${movie.year})</span></h1>
            <div style="margin: 15px 0;">
                <span style="background: #2a2f4a; padding: 5px 12px; border-radius: 20px; margin-right: 10px;">${isSeries ? '📺 Сериал' : '🎬 Фильм'}</span>
                <span style="background: #2a2f4a; padding: 5px 12px; border-radius: 20px; margin-right: 10px;">⭐ Рейтинг: ${movie.rating || '?'} / 10</span>
                <span style="background: #2a2f4a; padding: 5px 12px; border-radius: 20px;">🎭 ${movie.genre || 'Разное'}</span>
            </div>
            <p style="line-height: 1.6;">${movie.description || 'Описание отсутствует'}</p>
        </div>
    </div>

    <div class="player-container" id="playerContainer">
        <div class="loader">🎬 Загрузка плеера...</div>
    </div>

    <div class="player-selector">
        <strong>🎮 Выберите плеер:</strong>
        ${playerButtons}
    </div>
</div>

<div class="footer">
    <p>🦍 KinoGorilla — лучшие фильмы и сериалы в HD качестве</p>
</div>

<script>
    let currentType = '${defaultPlayer.type}';
    let currentParam = '${defaultPlayer.param}';
    
    function getPlayerUrl() {
        return SITE_CONFIG.PLAYER_DOMAIN + '/embed_auto/' + currentParam + '/?token=' + SITE_CONFIG.PLAYER_TOKEN;
    }

    function loadDefaultPlayer() {
        const url = getPlayerUrl();
        document.getElementById('playerContainer').innerHTML = '<iframe src="' + url + '" allowfullscreen allow="autoplay *; fullscreen *" style="width:100%; height:100%; border:none;"></iframe>';
    }
    
    function switchPlayer(idx) {
        switch(idx) {${switchCases}
            default:
                currentType = '${defaultPlayer.type}';
                currentParam = '${defaultPlayer.param}';
        }
        const url = getPlayerUrl();
        document.getElementById('playerContainer').innerHTML = '<iframe src="' + url + '" allowfullscreen allow="autoplay *; fullscreen *" style="width:100%; height:100%; border:none;"></iframe>';
        
        document.querySelectorAll('.player-btn').forEach((btn, i) => {
            if (i === idx) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
    
    loadDefaultPlayer();
</script>

</body>
</html>`;

    return html;
}

// ========== ЗАПУСК ГЕНЕРАЦИИ ==========
const moviesDir = path.join(__dirname, 'movies');

if (!fs.existsSync(moviesDir)) {
    fs.mkdirSync(moviesDir);
    console.log('📁 Создана папка movies/');
}

// Удаляем старые файлы
const oldFiles = fs.readdirSync(moviesDir);
oldFiles.forEach(file => {
    if (file.endsWith('.html')) {
        fs.unlinkSync(path.join(moviesDir, file));
        console.log(`🗑️ Удалён старый: ${file}`);
    }
});
console.log('');

let generatedCount = 0;

allItems.forEach(movie => {
    if (!movie.id || movie.id === '0' || movie.id === '') return;
    
    const content = generateMoviePage(movie);
    if (content) {
        const filePath = path.join(moviesDir, `${movie.id}.html`);
        fs.writeFileSync(filePath, content, 'utf8');
        const players = getAvailablePlayers(movie);
        console.log(`✅ ${movie.id}.html - ${movie.title} (${players.length} плеер: ${players.map(p => p.type).join(', ')})`);
        generatedCount++;
    }
});

console.log(`\n🎉 ГОТОВО! Создано ${generatedCount} страниц в папке "movies/"`);