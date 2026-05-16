// ========== ОБЩИЕ ФУНКЦИИ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ==========

let currentFilter = 'all';
let currentSearch = '';

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

    grid.innerHTML = filtered.map(movie => `
        <a href="movies/${movie.id}.html" class="movie-card">
            <div class="movie-poster" style="background-image: url('${movie.poster}')">
                <div class="play-overlay">▶</div>
            </div>
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-year">${movie.year}</div>
                <div class="movie-type">${movie.type === 'movie' ? '🎬 Фильм' : '📺 Сериал'}</div>
            </div>
        </a>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderMovies);