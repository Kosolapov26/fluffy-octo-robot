// ========== ЗАГРУЗКА ФИЛЬМОВ ИЗ API VIDEOSEED ==========

const API_TOKEN = '367700083be0be7be1e8a30f47703c27';
const API_URL = 'https://api.videoseed.tv/apiv2.php';

// Используем CORS-прокси для обхода блокировок
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

async function fetchFromAPI(url) {
    // Пробуем прямой запрос
    try {
        const response = await fetch(url);
        if (response.ok) return await response.json();
    } catch (e) {
        console.log('Прямой запрос не удался, пробуем через прокси...');
    }
    
    // Пробуем через прокси
    try {
        const proxyUrl = CORS_PROXY + url;
        const response = await fetch(proxyUrl);
        if (response.ok) return await response.json();
    } catch (e) {
        console.error('Оба способа не сработали:', e);
    }
    
    return null;
}

async function fetchMoviesFromAPI() {
    try {
        console.log('🔄 Загрузка фильмов из API...');
        
        const moviesUrl = `${API_URL}?token=${API_TOKEN}&list=movie&from=1&items=20&sort_by=post_date%20desc`;
        const seriesUrl = `${API_URL}?token=${API_TOKEN}&list=serial&from=1&items=20&sort_by=post_date%20desc`;
        
        const [moviesData, seriesData] = await Promise.all([
            fetchFromAPI(moviesUrl),
            fetchFromAPI(seriesUrl)
        ]);
        
        let allItems = [];
        
        if (moviesData && moviesData.data) {
            const movies = moviesData.data.map(movie => ({
                id: movie.id_kp || movie.id,
                title: movie.name,
                year: movie.year,
                type: 'movie',
                kp_id: movie.id_kp,
                imdb_id: movie.id_imdb,
                tmdb_id: movie.id_tmdb,
                poster: movie.poster,
                description: movie.description || 'Описание отсутствует'
            }));
            allItems.push(...movies);
            console.log(`✅ Загружено ${movies.length} фильмов`);
        }
        
        if (seriesData && seriesData.data) {
            const series = seriesData.data.map(ser => ({
                id: ser.id_kp || ser.id,
                title: ser.name,
                year: ser.year,
                type: 'series',
                kp_id: ser.id_kp,
                imdb_id: ser.id_imdb,
                tmdb_id: ser.id_tmdb,
                poster: ser.poster,
                description: ser.description || 'Описание отсутствует'
            }));
            allItems.push(...series);
            console.log(`✅ Загружено ${series.length} сериалов`);
        }
        
        if (allItems.length === 0) {
            console.warn('⚠️ API не вернул данные, используем локальную базу');
            return getLocalMovies();
        }
        
        return allItems;
        
    } catch (error) {
        console.error('❌ Ошибка загрузки из API:', error);
        return getLocalMovies();
    }
}

// Локальная база (резерв)
function getLocalMovies() {
    return [
        {
            id: "barbie-2023",
            title: "Барби",
            year: "2023",
            type: "movie",
            kp_id: "974256",
            imdb_id: "tt1517268",
            tmdb_id: "346698",
            poster: "https://via.placeholder.com/300x450/ff69b4/ffffff?text=Barbie",
            description: "Фэнтези-комедия о культовой кукле."
        },
        {
            id: "oppenheimer-2023",
            title: "Оппенгеймер",
            year: "2023",
            type: "movie",
            kp_id: "4664634",
            imdb_id: "tt15398776",
            tmdb_id: "872585",
            poster: "https://via.placeholder.com/300x450/333333/ffffff?text=Oppenheimer",
            description: "История создателя атомной бомбы."
        },
        {
            id: "walking-dead",
            title: "Ходячие мертвецы",
            year: "2010",
            type: "series",
            kp_id: "228165",
            imdb_id: "tt1520211",
            tmdb_id: "1402",
            poster: "https://via.placeholder.com/300x450/2F4F4F/ffffff?text=Walking+Dead",
            description: "Культовый постапокалиптический сериал."
        }
    ];
}