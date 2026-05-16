// ========== ЗАГРУЗКА ФИЛЬМОВ ИЗ API VIDEOSEED ==========

const API_TOKEN = '367700083be0be7be1e8a30f47703c27';
const API_URL = 'https://api.videoseed.tv/apiv2.php';

// Глобальный массив для хранения загруженных фильмов
let MOVIES_LIST = [];

// Загрузка фильмов из API
async function fetchMoviesFromAPI() {
    try {
        console.log('🔄 Загрузка фильмов из API...');
        
        // Загружаем фильмы и сериалы параллельно
        const [moviesRes, seriesRes] = await Promise.all([
            fetch(`${API_URL}?token=${API_TOKEN}&list=movie&from=1&items=20&sort_by=post_date%20desc`),
            fetch(`${API_URL}?token=${API_TOKEN}&list=serial&from=1&items=20&sort_by=post_date%20desc`)
        ]);
        
        const moviesData = await moviesRes.json();
        const seriesData = await seriesRes.json();
        
        let allItems = [];
        
        // Обрабатываем фильмы
        if (moviesData.status === 'success' && moviesData.data) {
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
        
        // Обрабатываем сериалы
        if (seriesData.status === 'success' && seriesData.data) {
            const series = seriesData.data.map(ser => ({
                id: ser.id_kp || ser.id,
                title: ser.name,
                year: ser.year,
                type: 'series',
                kp_id: ser.id_kp,
                imdb_id: ser.id_imdb,
                tmdb_id: ser.id_tmdb,
                poster: ser.poster,
                description: ser.description || 'Описание отсутствует',
                seasons: ser.seasons ? Object.keys(ser.seasons).length : 1
            }));
            allItems.push(...series);
            console.log(`✅ Загружено ${series.length} сериалов`);
        }
        
        // Сортируем по дате добавления (новые первые)
        allItems.sort((a, b) => (b.year || 0) - (a.year || 0));
        
        MOVIES_LIST = allItems;
        console.log(`🎉 Всего загружено ${MOVIES_LIST.length} позиций`);
        
        return MOVIES_LIST;
        
    } catch (error) {
        console.error('❌ Ошибка загрузки из API:', error);
        // Возвращаем пустой массив, чтобы показать ошибку пользователю
        return [];
    }
}

// Поиск фильма по ID (для страницы фильма)
async function fetchMovieById(id, type) {
    try {
        let url = '';
        if (type === 'movie') {
            url = `${API_URL}?token=${API_TOKEN}&item=movie&kp=${id}`;
        } else {
            url = `${API_URL}?token=${API_TOKEN}&item=serial&kp=${id}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'success' && data.data && data.data[0]) {
            const item = data.data[0];
            return {
                id: item.id_kp || item.id,
                title: item.name,
                year: item.year,
                type: type,
                kp_id: item.id_kp,
                imdb_id: item.id_imdb,
                tmdb_id: item.id_tmdb,
                poster: item.poster,
                description: item.description || 'Описание отсутствует',
                seasons: item.seasons ? Object.keys(item.seasons).length : null
            };
        }
        return null;
    } catch (error) {
        console.error('Ошибка загрузки фильма:', error);
        return null;
    }
}

// Демо-данные на случай, если API не работает
function getDemoMovies() {
    return [
        {
            id: "walking-dead",
            title: "Ходячие мертвецы",
            year: "2010",
            type: "series",
            kp_id: "228165",
            imdb_id: "tt1520211",
            tmdb_id: "1402",
            poster: "https://via.placeholder.com/300x450/2F4F4F/ffffff?text=Walking+Dead",
            description: "Культовый постапокалиптический сериал о выживании в мире зомби."
        }
    ];
}