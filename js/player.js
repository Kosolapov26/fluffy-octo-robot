// ========== УНИВЕРСАЛЬНЫЙ ПЛЕЕР ==========

const PLAYERS = [
    { name: '🎥 Плеер 1 (IMDB)', type: 'imdb' },
    { name: '📺 Плеер 2 (TMDB)', type: 'tmdb' }
];

function loadPlayer(kpId, imdbId, tmdbId, containerId = 'playerContainer') {
    const url = getPlayerUrl(kpId, imdbId, tmdbId, 'imdb');
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay *; fullscreen *" style="width:100%; height:100%; border:none;"></iframe>`;
    }
    setTimeout(() => {
        document.querySelectorAll('.player-btn').forEach((btn, idx) => {
            if (idx === 0) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }, 100);
}

function switchPlayer(playerIndex, kpId, imdbId, tmdbId, containerId = 'playerContainer') {
    const player = PLAYERS[playerIndex];
    if (!player) return;
    const url = getPlayerUrl(kpId, imdbId, tmdbId, player.type);
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay *; fullscreen *" style="width:100%; height:100%; border:none;"></iframe>`;
    }
    document.querySelectorAll('.player-btn').forEach((btn, idx) => {
        if (idx === playerIndex) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}