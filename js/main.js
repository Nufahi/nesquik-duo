/* ==========================================================================
   Nesquik Duo · Site JS
   ========================================================================== */

(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
            badge.textContent = 'Генерация изображений';
            const title = document.createElement('h3');
            title.textContent = preset.title;
            const description = document.createElement('p');
            description.className = 'image-preset-description';
            description.textContent = preset.description;
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
                    tag.textContent = value;
                    tags.appendChild(tag);
                });
                body.appendChild(tags);
            }

            if (preset.downloadUrl) {
                const download = document.createElement('a');
                download.className = 'btn btn-primary btn-small';
                download.href = preset.downloadUrl;
                download.download = '';
                download.innerHTML = '<span>Скачать</span><svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-down"/></svg>';
                body.appendChild(download);
            }

            card.appendChild(body);
            imagePresetsGrid.appendChild(card);
        });
    }

    /* ---------- Переключатель темы (светлая/тёмная) ---------- */
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const updateThemeToggle = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeToggle.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
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
    const showToast = (text = 'Скопировано!') => {
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
                showToast('Не удалось скопировать — выдели текст вручную');
                return;
            }

            btn.classList.add('copied');
            const labelEl = btn.querySelector('.copy-btn-label');
            const prevLabel = labelEl ? labelEl.textContent : btn.textContent;
            if (labelEl) {
                labelEl.textContent = '✓ готово';
            } else {
                btn.textContent = '✓ готово';
            }
            showToast('Скопировано в буфер обмена ♡');

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
            dot.setAttribute('aria-label', `Пример ${index + 1}`);
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
                    showToast('Файл скачивается ♡');
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
        fallback.setAttribute('aria-label', 'Превью недоступно');
        fallback.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-image"/></svg><span>Превью недоступно</span>';
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
