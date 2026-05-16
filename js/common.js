// ========== ОБЩИЕ ФУНКЦИИ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ==========

let currentFilter = 'all';
let currentSearch = '';
let isLoading = true;

async function init() {
    // Показываем загрузку
    const grid = document.getElementById('moviesGrid');
    grid.innerHTML = '<div class="loader">🎬 Загрузка фильмов из API...</div>';
    
    // Загружаем фильмы из API
    await fetchMoviesFromAPI();
    
    // Если API не вернул данных, используем демо
    if (MOVIES_LIST.length === 0) {
        console.log('⚠️ API не вернул данных, используем демо-режим');
        MOVIES_LIST = getDemoMovies();
        grid.innerHTML = '<div class="loader">⚠️ Демо-режим (API недоступен)</div>';
        setTimeout(() => {
            renderMovies();
        }, 1000);
    } else {
        renderMovies();
    }
    
    isLoading = false;
}

function filterMovies() {
    currentSearch = document.getElementById('searchInput').value.toLowerCase();
    renderMovies();
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) btn.classList.add('active');
    });
    renderMovies();
}

function renderMovies() {
    if (isLoading) return;
    
    let filtered = MOVIES_LIST.filter(m => {
        if (currentFilter !== 'all' && m.type !== currentFilter) return false;
        if (currentSearch && !m.title.toLowerCase().includes(currentSearch)) return false;
        return true;
    });

    const grid = document.getElementById('moviesGrid');
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="loader">😔 Ничего не найдено</div>';
        return;
    }

    grid.innerHTML = filtered.map(movie => {
        // Генерируем URL для страницы фильма
        const movieUrl = `movie.html?id=${movie.kp_id}&type=${movie.type}`;
        
        return `
            <a href="${movieUrl}" class="movie-card">
                <div class="movie-poster" style="background-image: url('${movie.poster || 'https://via.placeholder.com/300x450/2a2f4a/ffffff?text=No+Poster'}')">
                    <div class="play-overlay">▶</div>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-year">${movie.year}</div>
                    <div class="movie-type">${movie.type === 'movie' ? '🎬 Фильм' : '📺 Сериал'}</div>
                </div>
            </a>
        `;
    }).join('');
}

// Запускаем инициализацию
init();