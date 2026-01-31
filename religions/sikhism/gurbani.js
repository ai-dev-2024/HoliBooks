/**
 * HoliBooks - Guru Granth Sahib Module
 * Using GurbaniNow API with multi-language support
 */

const API_BASE = 'https://api.gurbaninow.com/v2';
const TOTAL_ANGS = 1430;

// Language modes
const LANGUAGE_MODES = {
    'all': { name: 'Gurmukhi + English', showGurmukhi: true, showTransliteration: true, showTranslation: true },
    'gurmukhi': { name: 'Gurmukhi Only', showGurmukhi: true, showTransliteration: false, showTranslation: false },
    'transliteration': { name: 'Transliteration', showGurmukhi: false, showTransliteration: true, showTranslation: false },
    'translation': { name: 'English Only', showGurmukhi: false, showTransliteration: false, showTranslation: true }
};

let currentAng = 1;
let currentLanguageMode = 'all';
let currentAngData = null;

const angInput = document.getElementById('ang-input');
const goBtn = document.getElementById('go-ang');
const prevBtn = document.getElementById('prev-ang');
const nextBtn = document.getElementById('next-ang');
const angTitle = document.getElementById('ang-title');
const versesContainer = document.getElementById('verses-container');
const themeToggle = document.getElementById('theme-toggle');
const languageBtn = document.getElementById('language-btn');
const currentLanguageSpan = document.getElementById('current-language');

async function init() {
    // Load saved preferences
    const savedAng = HoliBooks.storage.get('gurbani_ang');
    const savedLanguage = HoliBooks.storage.get('gurbani_language');
    
    if (savedAng) currentAng = savedAng;
    if (savedLanguage && LANGUAGE_MODES[savedLanguage]) currentLanguageMode = savedLanguage;

    // Check URL params
    const params = HoliBooks.getQueryParams();
    if (params.page) {
        const pageNum = parseInt(params.page);
        if (pageNum >= 1 && pageNum <= TOTAL_ANGS) {
            currentAng = pageNum;
        }
    }

    angInput.value = currentAng;
    updateLanguageButton();
    updateMobileLanguageButtons();
    await loadAng(currentAng);
    setupEventListeners();
}

async function loadAng(angNum) {
    if (angNum < 1 || angNum > TOTAL_ANGS) return;

    currentAng = angNum;
    HoliBooks.showLoading(versesContainer, 'Loading Gurbani...');

    try {
        const response = await HoliBooks.fetchWithRetry(`${API_BASE}/ang/${angNum}`, {}, 2);
        currentAngData = response;

        angTitle.textContent = `ਅੰਗ ${angNum}`;
        document.querySelector('.ang-subtitle').textContent = `Ang (Page) ${angNum} of 1430`;

        renderVerses(response);
        updateNavigation();

        HoliBooks.storage.set('gurbani_ang', angNum);
        angInput.value = angNum;
        HoliBooks.scrollToTop();

    } catch (error) {
        console.error('Failed to load ang:', error);
        // Use fallback sample data
        const fallbackData = getFallbackAng(angNum);
        if (fallbackData) {
            currentAngData = fallbackData;
            angTitle.textContent = `ਅੰਗ ${angNum}`;
            document.querySelector('.ang-subtitle').textContent = `Ang (Page) ${angNum} of 1430`;
            renderVerses(fallbackData);
            updateNavigation();
            versesContainer.innerHTML = `
                <div style="color: var(--text-muted); padding: 20px; text-align: center; font-size: 0.9rem; border-radius: 12px; background: var(--bg-card); margin-bottom: 20px;">
                    ⚠️ Live API unavailable. Showing sample content.<br>
                    <small>The full Guru Granth Sahib will load when API is accessible.</small>
                </div>
            ` + versesContainer.innerHTML;
        } else {
            versesContainer.innerHTML = `
                <div class="ang-info-card">
                    <h3 style="color: var(--sikhism-primary);">ਅੰਗ ${angNum}</h3>
                    <p style="color: var(--text-secondary); margin-top: 10px;">
                        This is Ang (page) ${angNum} of Sri Guru Granth Sahib Ji.
                    </p>
                    <p style="color: var(--text-muted); margin-top: 10px; font-size: 0.9rem;">
                        API unavailable. Please try again later.
                    </p>
                </div>
            `;
        }
    }
}

// Fallback sample data for Ang 1 (Mool Mantar)
function getFallbackAng(angNum) {
    if (angNum === 1) {
        return {
            page: [
                {
                    line: { 
                        gurmukhi: { unicode: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥' },
                        transliteration: { english: 'ik oankaar sat naam karataa purakh nirabho niravair akaal moorat ajoonee saibhan gur prasaad ||' }
                    },
                    translation: { english: { bdb: 'One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred. Image Of The Undying, Beyond Birth, Self-Existent. By Guru\'s Grace.' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                },
                {
                    line: { 
                        gurmukhi: { unicode: '॥ ਜਪੁ ॥' },
                        transliteration: { english: '|| jap ||' }
                    },
                    translation: { english: { bdb: 'Chant And Meditate:' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                },
                {
                    line: { 
                        gurmukhi: { unicode: 'ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥' },
                        transliteration: { english: 'aad sach jugaad sach ||' }
                    },
                    translation: { english: { bdb: 'True In The Primal Beginning. True Throughout The Ages.' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                },
                {
                    line: { 
                        gurmukhi: { unicode: 'ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥੧॥' },
                        transliteration: { english: 'hai bhee sach naanak hosee bhee sach ||1||' }
                    },
                    translation: { english: { bdb: 'True Here And Now. O Nanak, Forever And Ever True. ||1||' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                }
            ]
        };
    }
    return null;
}

function renderVerses(data) {
    const page = data.page || [];
    const mode = LANGUAGE_MODES[currentLanguageMode];

    if (page.length === 0) {
        versesContainer.innerHTML = `
            <div class="shabad-card">
                <p class="shabad-translation">Content for Ang ${currentAng} is being loaded...</p>
            </div>
        `;
        return;
    }

    let html = '';
    page.forEach((line, index) => {
        const gurmukhi = line.line?.gurmukhi?.unicode || '';
        const transliteration = line.line?.transliteration?.english || '';
        const translation = line.line?.translation?.english?.default || line.translation?.en?.bdb || '';
        const writer = line.shabad?.writer?.english || '';

        html += `
            <article class="shabad-card">
                ${mode.showGurmukhi && gurmukhi ? `<p class="shabad-gurmukhi">${gurmukhi}</p>` : ''}
                ${mode.showTransliteration && transliteration ? `<p class="shabad-transliteration">${transliteration}</p>` : ''}
                ${mode.showTranslation && translation ? `<p class="shabad-translation">${translation}</p>` : ''}
                ${writer ? `<p class="shabad-writer" style="font-size: 0.85rem; color: var(--text-muted); margin-top: var(--space-sm); font-style: italic;">— ${writer}</p>` : ''}
            </article>
        `;
    });

    versesContainer.innerHTML = html || '<p class="loading">No content found for this Ang</p>';
}

function updateNavigation() {
    prevBtn.disabled = currentAng <= 1;
    nextBtn.disabled = currentAng >= TOTAL_ANGS;
}

function changeLanguageMode(mode) {
    if (LANGUAGE_MODES[mode]) {
        currentLanguageMode = mode;
        HoliBooks.storage.set('gurbani_language', currentLanguageMode);
        updateLanguageButton();
        updateMobileLanguageButtons();
        
        // Re-render with new language mode
        if (currentAngData) {
            renderVerses(currentAngData);
        }
    }
}

function updateLanguageButton() {
    const mode = LANGUAGE_MODES[currentLanguageMode];
    if (mode) {
        currentLanguageSpan.textContent = mode.name;
    }
}

function updateMobileLanguageButtons() {
    document.querySelectorAll('.mobile-language-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguageMode);
    });
}

function setupEventListeners() {
    goBtn.addEventListener('click', () => {
        const num = parseInt(angInput.value);
        if (num >= 1 && num <= TOTAL_ANGS) {
            loadAng(num);
        }
    });

    angInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const num = parseInt(angInput.value);
            if (num >= 1 && num <= TOTAL_ANGS) {
                loadAng(num);
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentAng > 1) loadAng(currentAng - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentAng < TOTAL_ANGS) loadAng(currentAng + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === 'ArrowLeft' && currentAng > 1) loadAng(currentAng - 1);
        if (e.key === 'ArrowRight' && currentAng < TOTAL_ANGS) loadAng(currentAng + 1);
    });

    themeToggle.addEventListener('click', () => {
        HoliBooks.theme.toggle();
        updateThemeIcons();
    });

    // Language selector button
    languageBtn.addEventListener('click', () => {
        // Cycle through language modes
        const modes = Object.keys(LANGUAGE_MODES);
        const currentIndex = modes.indexOf(currentLanguageMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        changeLanguageMode(modes[nextIndex]);
    });

    // Mobile Menu
    setupMobileMenu();

    updateThemeIcons();
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Mobile language options
    document.querySelectorAll('.mobile-language-option').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguageMode(btn.dataset.lang);
            closeMobileMenu();
        });
    });

    // Mobile theme toggle
    mobileThemeBtn.addEventListener('click', () => {
        HoliBooks.theme.toggle();
        updateThemeIcons();
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function updateThemeIcons() {
    const isDark = HoliBooks.theme.current === 'dark';
    
    // Desktop theme icons
    const themeIconDark = document.getElementById('theme-icon-dark');
    const themeIconLight = document.getElementById('theme-icon-light');
    if (themeIconDark && themeIconLight) {
        themeIconDark.style.display = isDark ? 'block' : 'none';
        themeIconLight.style.display = isDark ? 'none' : 'block';
    }

    // Mobile theme button
    const mobileThemeText = document.getElementById('mobile-theme-text');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    if (mobileThemeText) {
        mobileThemeText.textContent = isDark ? 'Dark Mode' : 'Light Mode';
    }
    if (mobileThemeIcon) {
        mobileThemeIcon.innerHTML = isDark 
            ? '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>'
            : '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
    }
}

document.addEventListener('DOMContentLoaded', init);
