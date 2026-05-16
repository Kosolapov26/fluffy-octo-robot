// ========== ГЛОБАЛЬНАЯ КОНФИГУРАЦИЯ ==========
const SITE_CONFIG = {
    PLAYER_TOKEN: 'c9fe4f828ec190451e8bb5f66659838d',
    PLAYER_DOMAIN: 'https://tv-2-kinoserial.net'
};

function getPlayerUrl(kpId, imdbId, tmdbId, type) {
    let idValue = '';
    switch(type) {
        case 'imdb':
            idValue = imdbId;
            break;
        case 'tmdb':
            idValue = `tmdb${tmdbId}`;
            break;
        default:
            idValue = imdbId;
    }
    return `${SITE_CONFIG.PLAYER_DOMAIN}/embed_auto/${idValue}/?token=${SITE_CONFIG.PLAYER_TOKEN}`;
}