/* ==========================================================================
   Nesquik Duo · Site JS
   ========================================================================== */

(() => {
    'use strict';

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
        burger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            burger.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
        });

        // Закрываем при клике на пункт меню
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                burger.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Плавная прокрутка с учётом навбара ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: 'smooth' });
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

            try {
                await navigator.clipboard.writeText(text);
            } catch {
                // Фолбэк для старых браузеров
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }

            btn.classList.add('copied');
            btn.textContent = '✓ готово';
            showToast('Скопировано в буфер обмена ♡');

            setTimeout(() => {
                btn.classList.remove('copied');
                btn.textContent = 'копировать';
            }, 1800);
        });
    });

    /* ---------- Reveal-анимация при прокрутке ---------- */
    const revealTargets = document.querySelectorAll(
        '.version-card-new, .code-card, .script-card, .guide-step, .extension-card, .download-card, .install-guide, .info-panel, .section-header'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
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
                        a.style.color = isActive ? 'var(--violet-400)' : '';
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
            if (intervalId) return;
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
    document.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalWidth === 0) {
            img.style.display = 'none';
            img.parentElement?.classList.add('placeholder');
        }
    });

    console.log('%cNesquik Duo ♡', 'color: #b892ff; font-size: 18px; font-weight: bold;');
    console.log('%cПресет загружен с любовью ✦', 'color: #ff9ec8; font-size: 12px;');
})();
