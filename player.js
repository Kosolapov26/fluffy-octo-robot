// ========== УНИВЕРСАЛЬНЫЙ ПЛЕЕР ==========

const PLAYERS = [
    { name: '🎬 Плеер 1', type: 'kp' },
    { name: '🎥 Плеер 2', type: 'imdb' },
    { name: '📺 Плеер 3', type: 'tmdb' }
];

function loadPlayer(kpId, imdbId, tmdbId, containerId = 'playerContainer') {
    const url = getPlayerUrl(kpId, imdbId, tmdbId, 'kp');
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay *; fullscreen *" style="width:100%; height:100%; border:none;"></iframe>`;
    }
}

function switchPlayer(playerIndex, kpId, imdbId, tmdbId, containerId = 'playerContainer') {
    const player = PLAYERS[playerIndex];
    if (!player) return;
    const url = getPlayerUrl(kpId, imdbId, tmdbId, player.type);
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<iframe src="${url}" allowfullscreen allow="autoplay *; fullscreen *" style="width:100%; height:100%; border:none;"></iframe>`;
    }
    document.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.player) === playerIndex) btn.classList.add('active');
    });
}