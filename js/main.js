/* ==========================================================================
   Nesquik Duo · Site JS
   ========================================================================== */

(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Переключатель языка интерфейса ---------- */
    const translations = new Map(Object.entries({
        'Версии': 'Versions',
        'Регексы': 'Regex',
        'Промпты': 'Prompts',
        'Стили': 'Styles',
        'Расширения': 'Extensions',
        'пресеты для SillyTavern': 'presets for SillyTavern',
        'Пресет для Claude Opus и других моделей Claude.': 'A preset for Claude Opus and other Claude models.',
        'Скачать последнюю версию': 'Download latest version',
        'Все версии': 'All versions',
        'актуальная версия': 'current version',
        'регексов': 'regex scripts',
        'пресета': 'presets',
        'Версии пресета': 'Preset versions',
        'Выбирай нужный вариант и скачивай файл одним кликом.': 'Choose the version you need and download it in one click.',
        'Самый свежий релиз пресета под Opus.': 'The latest preset release for Opus.',
        'Отдельный пресет, заточенный под Claude Sonnet 4.6': 'A dedicated preset optimized for Claude Sonnet 4.6',
        'Прошлые версии пресета для Claude Opus 4.6': 'Previous preset versions for Claude Opus 4.6',
        'Скачать': 'Download',
        'Гайд': 'Guide',
        'Пресеты для генерации изображений': 'Image generation presets',
        'Отдельный тип пресетов, не относящийся к версиям Claude.': 'A separate preset type unrelated to Claude versions.',
        'Регулярные выражения': 'Regular expressions',
        'Готовые регексы под пресет: одни делают чат красивым, другие чистят промпт от лишнего, чтобы не тратить токены. Скачивай и импортируй в SillyTavern через': 'Ready-made regex scripts for the preset: some improve the chat layout, while others clean unnecessary content from prompts to save tokens. Download and import them into SillyTavern via',
        'Сообщения': 'Messages',
        'Рамочка': 'Image frame',
        'Сдираем весь HTML': 'Strip all HTML',
        'Удали думалку': 'Remove thinking blocks',
        'Удалить инфоблок': 'Remove infoblock',
        'Чистим камтинки': 'Clean image containers',
        'отображение': 'display',
        'промпт': 'prompt',
        'Превращает переписку в чате в настоящие пузырьки мессенджера: имя контакта, входящие и исходящие сообщения. Пиши в формате': 'Turns chat messages into messenger-style bubbles with contact names and incoming and outgoing messages. Use the format',
        'остальное регекс сделает сам.': 'and the regex will handle the rest.',
        '— остальное регекс сделает сам.': 'and the regex will handle the rest.',
        'Оборачивает сгенерированные картинки в аккуратную рамку, которая подстраивается под цвета твоей темы SillyTavern. Картинки перестают выглядеть «вставленными» и становятся частью чата.': 'Wraps generated images in a neat frame that adapts to your SillyTavern theme colors, making images feel like part of the chat.',
        'Полностью вычищает HTML-теги из текста перед отправкой модели. Claude видит чистую прозу вместо разметки — меньше токенов, меньше шансов, что модель начнёт подражать тегам.': 'Removes all HTML tags before text is sent to the model. Claude sees clean prose instead of markup, saving tokens and reducing tag imitation.',
        'Срезает блоки размышлений': 'Removes',
        'из истории перед отправкой. Claude не перечитывает свои старые мысли, а контекст остаётся лёгким.': 'blocks from history before sending. Claude does not reread its old reasoning, keeping the context lighter.',
        'Вырезает блоки': 'Removes',
        'из старых сообщений, отправляемых модели. На экране инфоблоки остаются, а в промпт не попадают.': 'blocks from old messages sent to the model. Infoblocks remain visible on screen but are excluded from the prompt.',
        'Удаляет из промпта контейнеры со сгенерированными картинками. Картинки видишь только ты — модель получает чистый текст без мусорной обвязки.': 'Removes generated-image containers from prompts. You still see the images while the model receives clean text.',
        'скачать JSON': 'download JSON',
        'Метка': 'The',
        '— регекс чистит текст перед отправкой модели, метка': 'label means the regex cleans text before it is sent to the model; the',
        '— красиво оформляет сообщения на экране.': 'label means it formats on-screen messages.',
        'Для картинок. Жми на кнопку — текст скопируется в буфер, останется только вставить.': 'For images. Click the button to copy the text, then simply paste it.',
        'Картинки': 'Images',
        'Картинки шорт': 'Short images',
        'Картинки биг': 'Large images',
        'Комикс': 'Comic',
        'Градик подряд': 'Continuous gradient',
        'Градик': 'Gradient',
        'копировать весь промпт': 'copy full prompt',
        'Готовые стили для генерации изображений. Листай примеры и копируй текст одним кликом.': 'Ready-made image generation styles. Browse examples and copy the text in one click.',
        'копировать стиль': 'copy style',
        'Мои расширения': 'My extensions',
        'Расширения для SillyTavern, которые я сделала сама. Устанавливаются за минуту через': 'SillyTavern extensions I made myself. Install them in a minute via',
        'по ссылке с GitHub, а подробности — в постах в Telegram.': 'using a GitHub URL; details are available in the Telegram posts.',
        'Помощник по темам: помогает настраивать внешний вид SillyTavern без копания в CSS. Меняешь цвета и элементы — сразу видишь результат.': 'A theme assistant that lets you customize SillyTavern without digging through CSS. Change colors and elements and see the result instantly.',
        'Удобное управление лорбуками: быстрый доступ к записям, понятная структура и меньше кликов, когда лорбуков стало слишком много.': 'Convenient lorebook management with quick entry access, a clear structure, and fewer clicks when your collection grows.',
        'Инспектор элементов прямо внутри SillyTavern: кликаешь по любому элементу интерфейса — видишь его CSS-классы. Незаменим, когда пишешь свою тему.': 'An element inspector inside SillyTavern. Click any interface element to see its CSS classes, ideal for creating themes.',
        'Персональные переключатели промптов для каждого персонажа: включай и выключай нужные блоки на лету, не перелопачивая весь пресет.': 'Per-character prompt toggles that let you enable or disable blocks on the fly without editing the entire preset.',
        'Менеджер хранилища изображений SillyTavern: показывает папки и занимаемое место, поддерживает поиск, просмотр, массовую очистку и корзину. Интерфейс адаптирован для мобильных устройств.': 'A SillyTavern image storage manager with folder sizes, search, previews, bulk cleanup, trash, and a mobile-friendly interface.',
        'Менеджер уведомлений SillyTavern: фильтрует toast-сообщения по тексту, регулярному выражению и типу, ведёт журнал и позволяет настраивать положение, размер, длительность и оформление уведомлений.': 'A SillyTavern notification manager that filters toasts by text, regex, and type, keeps a log, and customizes their position, size, duration, and appearance.',
        'Пост': 'Post',
        'Благодарности': 'Credits',
        'Nesquik Duo не развивался бы без вас!': 'Nesquik Duo would not have grown without you!',
        '· Nesquik Duo представляет ·': '· Nesquik Duo presents ·',
        'моему первому фанату': 'my first fan',
        'за веру в меня и мои умственные возможности': 'for believing in me and my abilities',
        'за любовь к первому пову и диско опусу!': 'for loving first-person POV and disco Opus!',
        'чатик SISTAVERN': 'SISTAVERN chat',
        'за то, что мы никогда не попадем в рай': 'for ensuring we will never get into heaven',
        'все-все, кто использует пресет': 'everyone who uses the preset',
        'за то, что вы есть ♡': 'for being here ♡',
        '· конец ·': '· the end ·',
        'Пресет для SillyTavern под Claude Opus и другие модели Claude': 'A SillyTavern preset for Claude Opus and other Claude models',
        'Навигация': 'Navigation',
        'Ссылки': 'Links',
        'Благодарности': 'Credits',
        '© 2026 Nesquik Duo · Сделано с': '© 2026 Nesquik Duo · Made with',
        'Скопировано!': 'Copied!'
    }));

    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();
    const translatableAttributes = ['aria-label', 'title', 'alt', 'content'];
    const translateAttribute = (value) => {
        if (translations.has(value)) return translations.get(value);
        if (value.startsWith('Nesquik Duo — для SillyTavern')) {
            return 'Nesquik Duo for SillyTavern, Claude Opus, and other Claude models. Preset versions, regex scripts, prompts, styles, and extensions.';
        }
        return value
            .replace('Переключить тему', 'Toggle theme')
            .replace('Меню', 'Menu')
            .replace('Предыдущий пример', 'Previous example')
            .replace('Следующий пример', 'Next example')
            .replace('Выбор примера', 'Choose example')
            .replace('Титры с благодарностями', 'Scrolling credits')
            .replace('Иллюстрация', 'Illustration')
            .replace('кадр', 'slide')
            .replace('Пример:', 'Example:')
            .replace('пример', 'example');
    };
    let updateThemeToggle = () => {};
    const applyLanguage = (language) => {
        const isEnglish = language === 'en';
        document.documentElement.lang = isEnglish ? 'en' : 'ru';
        document.documentElement.dataset.lang = isEnglish ? 'en' : 'ru';
        document.title = isEnglish ? 'Nesquik Duo · Preset for SillyTavern' : 'Nesquik Duo · Пресет для SillyTavern';

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                return node.parentElement?.closest('script, style, svg, pre, code') || !node.textContent.trim()
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            }
        });
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!originalText.has(node)) originalText.set(node, node.textContent);
            const source = originalText.get(node);
            const trimmed = source.trim();
            const translated = translations.get(trimmed);
            node.textContent = isEnglish && translated
                ? source.replace(trimmed, translated)
                : source;
        }

        document.querySelectorAll(translatableAttributes.map(name => `[${name}]`).join(',')).forEach(element => {
            if (!originalAttributes.has(element)) originalAttributes.set(element, {});
            const originals = originalAttributes.get(element);
            translatableAttributes.forEach(name => {
                if (!element.hasAttribute(name)) return;
                if (!(name in originals)) originals[name] = element.getAttribute(name);
                element.setAttribute(name, isEnglish ? translateAttribute(originals[name]) : originals[name]);
            });
        });
    };
    const currentLanguage = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'ru';
    const t = (russian, english) => currentLanguage() === 'en' ? english : russian;
    applyLanguage(currentLanguage());

    const languageToggle = document.querySelector('.language-toggle');
    languageToggle?.addEventListener('click', () => {
        const next = currentLanguage() === 'ru' ? 'en' : 'ru';
        try { localStorage.setItem('nd-lang', next); } catch { /* ignore */ }
        applyLanguage(next);
        updateThemeToggle();
    });

    /* ---------- Отдельная категория пресетов для изображений ---------- */
    const imagePresetsGrid = document.getElementById('image-presets-grid');
    const imagePresets = Array.isArray(window.NESQUIK_IMAGE_PRESETS)
        ? window.NESQUIK_IMAGE_PRESETS.filter(preset => preset?.type === 'image-preset')
        : [];

    if (imagePresetsGrid) {
        imagePresets.forEach(preset => {
            const card = document.createElement('article');
            card.className = 'version-card-new image-preset-card';

            const body = document.createElement('div');
            body.className = 'image-preset-body';
            const badge = document.createElement('div');
            badge.className = 'version-badge badge-blue';
            badge.textContent = t('Генерация изображений', 'Image generation');
            originalText.set(badge.firstChild, 'Генерация изображений');
            const title = document.createElement('h3');
            title.textContent = preset.title;
            const description = document.createElement('p');
            description.className = 'image-preset-description';
            description.textContent = currentLanguage() === 'en' && preset.descriptionEn ? preset.descriptionEn : preset.description;
            originalText.set(description.firstChild, preset.description);
            if (preset.descriptionEn) translations.set(preset.description, preset.descriptionEn);
            body.append(badge, title, description);

            const metaValues = [preset.model, preset.version].filter(Boolean);
            if (metaValues.length) {
                const meta = document.createElement('div');
                meta.className = 'image-preset-meta';
                metaValues.forEach(value => {
                    const item = document.createElement('span');
                    item.textContent = value;
                    meta.appendChild(item);
                });
                body.appendChild(meta);
            }

            if (Array.isArray(preset.tags) && preset.tags.length) {
                const tags = document.createElement('div');
                tags.className = 'image-preset-tags';
                preset.tags.forEach(value => {
                    const tag = document.createElement('span');
                    tag.textContent = value === 'Изображения' ? t('Изображения', 'Images') : value;
                    originalText.set(tag.firstChild, value);
                    if (value === 'Изображения') translations.set(value, 'Images');
                    tags.appendChild(tag);
                });
                body.appendChild(tags);
            }

            if (preset.downloadUrl) {
                const download = document.createElement('a');
                download.className = 'btn btn-primary btn-small';
                download.href = preset.downloadUrl;
                download.download = '';
                download.innerHTML = `<span>${t('Скачать', 'Download')}</span><svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-down"/></svg>`;
                originalText.set(download.querySelector('span').firstChild, 'Скачать');
                body.appendChild(download);
            }

            card.appendChild(body);
            imagePresetsGrid.appendChild(card);
        });
    }

    /* ---------- Переключатель темы (светлая/тёмная) ---------- */
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        updateThemeToggle = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeToggle.setAttribute('aria-label', isDark
                ? t('Включить светлую тему', 'Enable light theme')
                : t('Включить тёмную тему', 'Enable dark theme'));
            themeToggle.setAttribute('aria-pressed', String(isDark));
        };
        updateThemeToggle();
        themeToggle.addEventListener('click', () => {
            const root = document.documentElement;
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('nd-theme', next); } catch { /* ignore */ }
            updateThemeToggle();
        });
    }

    /* ---------- Навигация: эффект прокрутки ---------- */
    const navbar = document.querySelector('.navbar');
    const onScroll = () => {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Бургер-меню ---------- */
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        const closeMenu = () => {
            navLinks.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        };

        burger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            burger.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
        });

        // Закрываем при клике на пункт меню
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
                burger.focus();
            }
        });

        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !burger.contains(event.target)) closeMenu();
        });
    }

    /* ---------- Плавная прокрутка с учётом навбара ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            // Чуть больше отступ для не-секций (карточек, контента),
            // чтобы они не упирались впритык под навбар
            const isSection = target.tagName === 'SECTION';
            const offset = isSection ? 90 : 110;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });

    /* ---------- Копирование кода ---------- */
    const toast = document.getElementById('toast');
    const showToast = (text = t('Скопировано!', 'Copied!')) => {
        if (!toast) return;
        toast.querySelector('.toast-text').textContent = text;
        toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
    };

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.dataset.copy;
            const codeEl = document.getElementById(targetId);
            if (!codeEl) return;

            const text = codeEl.textContent;

            const fallbackCopy = (str) => {
                const ta = document.createElement('textarea');
                ta.value = str;
                // Прячем от глаз, но оставляем доступным для выделения
                ta.setAttribute('readonly', '');
                ta.style.position = 'fixed';
                ta.style.top = '0';
                ta.style.left = '0';
                ta.style.width = '1px';
                ta.style.height = '1px';
                ta.style.padding = '0';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                ta.setSelectionRange(0, str.length); // iOS Safari
                let ok = false;
                try { ok = document.execCommand('copy'); } catch { ok = false; }
                ta.remove();
                return ok;
            };

            let copied = false;
            // navigator.clipboard доступен только в защищённом контексте (https/localhost)
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(text);
                    copied = true;
                } catch {
                    copied = fallbackCopy(text);
                }
            } else {
                copied = fallbackCopy(text);
            }

            if (!copied) {
                showToast(t('Не удалось скопировать — выдели текст вручную', 'Could not copy. Select the text manually.'));
                return;
            }

            btn.classList.add('copied');
            const labelEl = btn.querySelector('.copy-btn-label');
            const prevLabel = labelEl ? labelEl.textContent : btn.textContent;
            if (labelEl) {
                labelEl.textContent = t('✓ готово', '✓ done');
            } else {
                btn.textContent = t('✓ готово', '✓ done');
            }
            showToast(t('Скопировано в буфер обмена ♡', 'Copied to clipboard ♡'));

            setTimeout(() => {
                btn.classList.remove('copied');
                if (labelEl) {
                    labelEl.textContent = prevLabel;
                } else {
                    btn.textContent = prevLabel;
                }
            }, 1800);
        });
    });

    /* ---------- Reveal-анимация при прокрутке ---------- */
    const revealTargets = document.querySelectorAll(
        '.version-card-new, .code-card, .prompt-card, .style-card, .script-card, .guide-step, .extension-card, .download-card, .install-guide, .info-panel, .section-header, .credits-screen, .regex-hint'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    if (reduceMotion) {
        revealTargets.forEach(el => el.classList.add('visible'));
    } else if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    // Небольшая задержка для каскадного эффекта
                    const delay = (entry.target.dataset.revealDelay || idx * 60);
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealTargets.forEach(el => io.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('visible'));
    }

    /* ---------- Подсветка активного раздела в меню ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navAnchors.forEach(a => {
                        const isActive = a.getAttribute('href') === `#${id}`;
                        a.classList.toggle('is-active', isActive);
                        if (isActive) a.setAttribute('aria-current', 'true');
                        else a.removeAttribute('aria-current');
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-30% 0px -50% 0px' });

        sections.forEach(s => spy.observe(s));
    }

    /* ---------- Лёгкий параллакс для hero-card ---------- */
    const heroCard = document.querySelector('.hero-card');
    if (heroCard && window.matchMedia('(hover: hover)').matches) {
        const heroVisual = document.querySelector('.hero-visual');
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroCard.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        heroVisual.addEventListener('mouseleave', () => {
            heroCard.style.transform = '';
        });
    }

    /* ---------- Hero слайдер: плавная смена картинок ----------
       Картинки crossfade'ятся раз в ~6 секунд, плюс при каждом возврате
       в hero-секцию переключаемся на следующий слайд (даёт ощущение «обновления»). */
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let activeIdx = 0;
        const setActive = (idx) => {
            heroSlides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
            activeIdx = idx;
        };
        const nextSlide = () => setActive((activeIdx + 1) % heroSlides.length);

        // Автосмена каждые 6 секунд, только когда hero на экране (экономим CPU)
        let intervalId = null;
        const startAuto = () => {
            if (intervalId || reduceMotion) return;
            intervalId = setInterval(nextSlide, 6000);
        };
        const stopAuto = () => {
            if (!intervalId) return;
            clearInterval(intervalId);
            intervalId = null;
        };

        const heroSection = document.getElementById('hero');
        if (heroSection && 'IntersectionObserver' in window) {
            // Дополнительный флаг: переключаем слайд каждый раз, когда hero
            // снова попадает в видимость (после скролла вниз и возврата вверх)
            let wasOutOfView = false;
            const heroIO = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAuto();
                        if (wasOutOfView) {
                            // Вернулись — даём «свежую» картинку
                            nextSlide();
                            wasOutOfView = false;
                        }
                    } else {
                        stopAuto();
                        wasOutOfView = true;
                    }
                });
            }, { threshold: 0.25 });
            heroIO.observe(heroSection);
        } else {
            startAuto();
        }

        // На всякий случай — пауза, если вкладка не активна
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAuto();
            else if (heroSection && heroSection.getBoundingClientRect().bottom > 0) startAuto();
        });
    }

    /* ---------- Карусели примеров стилей ---------- */
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const slides = [...carousel.querySelectorAll('.style-slide')];
        const dotsWrap = carousel.querySelector('.carousel-dots');
        if (!slides.length || !dotsWrap) return;

        let activeIdx = 0;
        const dots = slides.map((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `carousel-dot${index === 0 ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', `${t('Пример', 'Example')} ${index + 1}`);
            if (index === 0) dot.setAttribute('aria-current', 'true');
            dotsWrap.appendChild(dot);
            return dot;
        });

        const setActive = (index) => {
            activeIdx = (index + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === activeIdx));
            dots.forEach((dot, i) => {
                dot.classList.toggle('is-active', i === activeIdx);
                if (i === activeIdx) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
        };

        carousel.querySelector('.carousel-prev')?.addEventListener('click', () => setActive(activeIdx - 1));
        carousel.querySelector('.carousel-next')?.addEventListener('click', () => setActive(activeIdx + 1));
        dots.forEach((dot, index) => dot.addEventListener('click', () => setActive(index)));

        let touchStart = 0;
        const slidesWrap = carousel.querySelector('.style-slides');
        slidesWrap.addEventListener('touchstart', event => {
            touchStart = event.changedTouches[0].clientX;
        }, { passive: true });
        slidesWrap.addEventListener('touchend', event => {
            const distance = event.changedTouches[0].clientX - touchStart;
            if (Math.abs(distance) > 45) setActive(activeIdx + (distance < 0 ? 1 : -1));
        }, { passive: true });
    });

    /* ---------- Принудительное скачивание файлов (Blob) ----------
       Браузеры иногда игнорируют атрибут download для .json/.txt и просто
       открывают файл в новой вкладке. Делаем скачивание через fetch + Blob,
       чтобы файл всегда сохранялся, а не открывался. */
    document.querySelectorAll('a[download][href]').forEach(link => {
        const href = link.getAttribute('href');
        // Только локальные относительные ссылки (не внешние домены, не data:, не #)
        if (!href || /^(https?:|data:|mailto:|#)/i.test(href)) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();

            const url = link.href;
            const filename = link.getAttribute('download') ||
                decodeURIComponent(url.split('/').pop().split('?')[0]) ||
                'download';

            const original = link.style.opacity;
            link.style.opacity = '0.6';
            link.style.pointerEvents = 'none';

            const restore = () => {
                link.style.opacity = original;
                link.style.pointerEvents = '';
            };

            // XHR работает и в file:// (в отличие от fetch с CORS-проверкой)
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 0) {
                    // Принудительный octet-stream — чтобы браузер точно скачал
                    const forced = new Blob([xhr.response], { type: 'application/octet-stream' });
                    const objectUrl = URL.createObjectURL(forced);

                    const a = document.createElement('a');
                    a.href = objectUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
                    showToast(t('Файл скачивается ♡', 'File download started ♡'));
                } else {
                    window.location.href = url;
                }
                restore();
            };

            xhr.onerror = () => {
                console.error('Download failed');
                window.location.href = url;
                restore();
            };

            xhr.send();
        });
    });

    /* ---------- Обработка ошибок загрузки картинок (подстраховка) ---------- */
    document.querySelectorAll('.prompt-preview').forEach(preview => {
        const image = preview.querySelector('img');
        if (!image) return;
        preview.style.setProperty('--preview-position', image.dataset.objectPosition || 'center');
        preview.style.setProperty('--preview-fit', image.dataset.imageFit === 'contain' ? 'contain' : 'cover');

        const fallback = document.createElement('div');
        fallback.className = 'prompt-preview-fallback';
        fallback.setAttribute('role', 'img');
        fallback.setAttribute('aria-label', t('Превью недоступно', 'Preview unavailable'));
        fallback.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-image"/></svg><span>${t('Превью недоступно', 'Preview unavailable')}</span>`;
        preview.appendChild(fallback);
    });

    document.querySelectorAll('img').forEach(img => {
        const handleError = () => {
            img.style.display = 'none';
            img.parentElement?.classList.add('placeholder');
        };
        img.addEventListener('error', handleError, { once: true });
        if (img.complete && img.naturalWidth === 0) {
            handleError();
        }
    });

    console.log('%cNesquik Duo ♡', 'color: #9D315F; font-size: 18px; font-weight: bold;');
    console.log('%cПресет загружен с любовью ✦', 'color: #D85F91; font-size: 12px;');
})();
