// ========== БАЗА ДАННЫХ KINOGORILLA ==========
// Фильмы и сериалы объединяются здесь

// Импортируем сериалы из отдельного файла
// (в браузере нужно подключать оба файла, поэтому используем глобальную переменную)

// Сериалы будут добавлены через SERIES_LIST из series.js
// Фильмы пока оставляем те, что есть

const MOVIES_LIST = [
    // === ФИЛЬМЫ (пока оставляем как есть) ===
    {
        id: "barbie-2023",
        title: "Барби",
        year: "2023",
        type: "movie",
        kp_id: "478052",
        imdb_id: "tt1517268",
        tmdb_id: "346698",
        poster: "images/barbie.jpg",
        rating: "7.2",
        duration: "1 ч 54 мин",
        genre: "Фэнтези, Комедия",
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
        poster: "images/oppenheimer.jpg",
        rating: "8.5",
        duration: "3 ч 0 мин",
        genre: "Биография, Драма",
        description: "История создателя атомной бомбы."
    },
    {
        id: "duna-chast-2",
        title: "Дюна: Часть вторая",
        year: "2024",
        type: "movie",
        kp_id: "4540126",
        imdb_id: "tt15239678",
        tmdb_id: "693134",
        poster: "images/duna-2.jpg",
        rating: "8.2",
        duration: "2 ч 46 мин",
        genre: "Фантастика, Боевик",
        description: "Продолжение эпической саги."
    },
    {
        id: "azbuka-blagotvoritelnosti",
        title: "Азбука благотворительности со Смешариками",
        year: "2026",
        type: "movie",
        kp_id: "11122946",
        imdb_id: "",
        tmdb_id: "",
        poster: "images/azbuka.jpg",
        rating: "7.5",
        duration: "45 мин",
        genre: "Мультфильм, Детский",
        description: "Познавательный мультфильм о благотворительности."
    }
];

// Объединяем фильмы и сериалы в один массив (если SERIES_LIST существует)
if (typeof SERIES_LIST !== 'undefined') {
    MOVIES_LIST.push(...SERIES_LIST);
}