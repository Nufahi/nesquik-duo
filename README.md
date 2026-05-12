# Nesquik Duo — сайт пресета для SillyTavern

Одностраничный сайт с пастельной (розовый/фиолетовый/голубой) кавайной темой.
Чистый HTML + CSS + JS, без сборки.

## Запуск

Открой `index.html` в браузере двойным кликом — этого достаточно.

Для локального сервера (рекомендуется, чтобы корректно работали `fetch`/пути):

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Потом зайди на `http://localhost:8000`.

## Структура

```
nesquik-duo-site/
├── index.html              # вся разметка
├── css/style.css           # стили, пастельная тема
├── js/main.js              # навигация, копирование, reveal-анимации
└── assets/
    ├── images/             # скриншоты и превью (см. README.txt внутри)
    └── downloads/          # файлы пресета, регексов, скриптов (см. README.txt внутри)
```

## Что заменить под себя

1. **Картинки превью** (если не положить — покажется заглушка):
   - `assets/images/preview-main.png` — главное превью на hero
   - `assets/images/scripts/infoblock-panel.png`, `msg-bubbles.png`, `reflexio.png` — превью скриптов
   - `assets/images/guides/runner-1.png`..`runner-3.png` — шаги импорта скриптов через JS-Slash-Runner

2. **Описания** — плейсхолдеры вида `[описание ... — заполни]` в `index.html`
   (регексы, скрипты, расширения).

3. **Тексты версий** и ссылки на гайды — в секции `#versions` в `index.html`.

4. **Ссылки** — в футере (`<footer>`) можно добавить свои.

## Деплой

Можно закинуть на GitHub Pages / Netlify / Vercel / Cloudflare Pages одной кнопкой —
никакой сборки не нужно, всё статическое.

---

Сделано с ♡ для комьюнити SillyTavern.
