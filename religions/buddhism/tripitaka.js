/**
 * HoliBooks - Dhammapada Module
 * Buddhist scripture reader with multi-language support
 */

// Dhammapada chapters data
const CHAPTERS = [
    { number: 1, pali: 'Yamaka Vagga', english: 'The Pairs', verses: [1, 20] },
    { number: 2, pali: 'Appamāda Vagga', english: 'Heedfulness', verses: [21, 32] },
    { number: 3, pali: 'Citta Vagga', english: 'The Mind', verses: [33, 43] },
    { number: 4, pali: 'Puppha Vagga', english: 'Flowers', verses: [44, 59] },
    { number: 5, pali: 'Bāla Vagga', english: 'Fools', verses: [60, 75] },
    { number: 6, pali: 'Paṇḍita Vagga', english: 'The Wise', verses: [76, 89] },
    { number: 7, pali: 'Arahanta Vagga', english: 'The Arahant', verses: [90, 99] },
    { number: 8, pali: 'Sahassa Vagga', english: 'Thousands', verses: [100, 115] },
    { number: 9, pali: 'Pāpa Vagga', english: 'Evil', verses: [116, 128] },
    { number: 10, pali: 'Daṇḍa Vagga', english: 'Violence', verses: [129, 145] },
    { number: 11, pali: 'Jarā Vagga', english: 'Old Age', verses: [146, 156] },
    { number: 12, pali: 'Atta Vagga', english: 'The Self', verses: [157, 166] },
    { number: 13, pali: 'Loka Vagga', english: 'The World', verses: [167, 178] },
    { number: 14, pali: 'Buddha Vagga', english: 'The Buddha', verses: [179, 196] },
    { number: 15, pali: 'Sukha Vagga', english: 'Happiness', verses: [197, 208] },
    { number: 16, pali: 'Piya Vagga', english: 'Affection', verses: [209, 220] },
    { number: 17, pali: 'Kodha Vagga', english: 'Anger', verses: [221, 234] },
    { number: 18, pali: 'Mala Vagga', english: 'Impurity', verses: [235, 255] },
    { number: 19, pali: 'Dhammaṭṭha Vagga', english: 'The Just', verses: [256, 272] },
    { number: 20, pali: 'Magga Vagga', english: 'The Path', verses: [273, 289] },
    { number: 21, pali: 'Pakiṇṇaka Vagga', english: 'Miscellaneous', verses: [290, 305] },
    { number: 22, pali: 'Niraya Vagga', english: 'Hell', verses: [306, 319] },
    { number: 23, pali: 'Nāga Vagga', english: 'The Elephant', verses: [320, 333] },
    { number: 24, pali: 'Taṇhā Vagga', english: 'Craving', verses: [334, 359] },
    { number: 25, pali: 'Bhikkhu Vagga', english: 'The Monk', verses: [360, 382] },
    { number: 26, pali: 'Brāhmaṇa Vagga', english: 'The Brahmin', verses: [383, 423] }
];

// Language modes
const LANGUAGE_MODES = {
    'both': { name: 'Pali + English', showPali: true, showEnglish: true },
    'pali': { name: 'Pali Only', showPali: true, showEnglish: false },
    'english': { name: 'English Only', showPali: false, showEnglish: true }
};

// Sample verses with Pali and English
const SAMPLE_VERSES = {
    1: [
        { num: 1, pali: 'Manopubbaṅgamā dhammā, manoseṭṭhā manomayā.', english: 'Mind is the forerunner of all actions. All deeds are led by mind, created by mind.' },
        { num: 2, pali: 'Manasā ce paduṭṭhena, bhāsati vā karoti vā.', english: 'If one speaks or acts with an impure mind, suffering follows, as the wheel follows the hoof of the ox.' },
        { num: 3, pali: 'Akkocchi maṃ, avadhi maṃ, ajini maṃ, ahāsi me.', english: '"He abused me, he beat me, he defeated me, he robbed me." Those who harbor such thoughts never still their hatred.' },
    ],
    2: [
        { num: 21, pali: 'Appamādo amatapadaṃ, pamādo maccuno padaṃ.', english: 'Heedfulness is the path to the deathless; heedlessness is the path to death.' },
        { num: 22, pali: 'Appamattā na mīyanti, ye pamattā yathā matā.', english: 'The heedful do not die; the heedless are as if already dead.' },
    ]
};

let currentChapter = 1;
let currentLanguageMode = 'both';

const chapterSelect = document.getElementById('chapter-select');
const prevBtn = document.getElementById('prev-chapter');
const nextBtn = document.getElementById('next-chapter');
const chapterPali = document.getElementById('chapter-pali');
const chapterEnglish = document.getElementById('chapter-english');
const verseCount = document.getElementById('verse-count');
const versesContainer = document.getElementById('verses-container');
const themeToggle = document.getElementById('theme-toggle');
const languageBtn = document.getElementById('language-btn');
const currentLanguageSpan = document.getElementById('current-language');

async function init() {
    // Load saved preferences
    const savedChapter = HoliBooks.storage.get('dhammapada_chapter');
    const savedLanguage = HoliBooks.storage.get('dhammapada_language');
    
    if (savedChapter) currentChapter = savedChapter;
    if (savedLanguage && LANGUAGE_MODES[savedLanguage]) currentLanguageMode = savedLanguage;

    // Check URL params
    const params = HoliBooks.getQueryParams();
    if (params.chapter) {
        const chapterNum = parseInt(params.chapter);
        if (chapterNum >= 1 && chapterNum <= 26) {
            currentChapter = chapterNum;
        }
    }
    if (params.verse) {
        const verseNum = parseInt(params.verse);
        // Find which chapter contains this verse
        const chapter = CHAPTERS.find(ch => verseNum >= ch.verses[0] && verseNum <= ch.verses[1]);
        if (chapter) {
            currentChapter = chapter.number;
        }
    }

    populateChapterDropdown();
    updateLanguageButton();
    updateMobileLanguageButtons();
    await loadChapter(currentChapter);
    setupEventListeners();
}

function populateChapterDropdown() {
    chapterSelect.innerHTML = CHAPTERS.map(ch =>
        `<option value="${ch.number}">Chapter ${ch.number}: ${ch.english}</option>`
    ).join('');
    chapterSelect.value = currentChapter;
}

async function loadChapter(chapterNum) {
    currentChapter = chapterNum;
    HoliBooks.showLoading(versesContainer, 'Loading verses...');

    const chapter = CHAPTERS[chapterNum - 1];

    // Update chapter info
    chapterPali.textContent = chapter.pali;
    chapterEnglish.textContent = chapter.english;
    const verseRange = chapter.verses;
    verseCount.textContent = `Verses ${verseRange[0]} - ${verseRange[1]}`;

    // Use embedded sample verses or show placeholder
    const verses = SAMPLE_VERSES[chapterNum] || [];
    renderVerses(verses, chapter);

    updateNavigation();
    HoliBooks.storage.set('dhammapada_chapter', chapterNum);
    chapterSelect.value = chapterNum;
    HoliBooks.scrollToTop();
}

function renderVerses(verses, chapter) {
    const mode = LANGUAGE_MODES[currentLanguageMode];

    if (verses.length === 0) {
        // Show informative placeholder
        const verseRange = chapter.verses;
        const count = verseRange[1] - verseRange[0] + 1;

        let html = `
            <div class="chapter-info-card" style="text-align: left;">
                <p style="color: var(--buddhism-primary); font-style: italic; margin-bottom: 15px;">
                    "${chapter.english}" - Chapter ${chapter.number}
                </p>
                <p style="color: var(--text-secondary); line-height: 1.8;">
                    This chapter contains ${count} verses (${verseRange[0]} - ${verseRange[1]}) 
                    about ${chapter.english.toLowerCase()}.
                </p>
                <p style="color: var(--text-muted); margin-top: 15px; font-size: 0.9rem;">
                    The Dhammapada contains 423 verses in 26 chapters, summarizing the Buddha's essential teachings on the path to enlightenment.
                </p>
            </div>
        `;
        versesContainer.innerHTML = html;
        return;
    }

    let html = '';
    verses.forEach(verse => {
        html += `
            <article class="gatha-card">
                <span class="gatha-number">Verse ${verse.num}</span>
                ${mode.showPali && verse.pali ? `<p class="gatha-pali">${verse.pali}</p>` : ''}
                ${mode.showEnglish && verse.english ? `<p class="gatha-translation">${verse.english}</p>` : ''}
            </article>
        `;
    });

    versesContainer.innerHTML = html;
}

function updateNavigation() {
    prevBtn.disabled = currentChapter <= 1;
    nextBtn.disabled = currentChapter >= 26;
}

function changeLanguageMode(mode) {
    if (LANGUAGE_MODES[mode]) {
        currentLanguageMode = mode;
        HoliBooks.storage.set('dhammapada_language', currentLanguageMode);
        updateLanguageButton();
        updateMobileLanguageButtons();
        
        // Re-render current chapter
        const chapter = CHAPTERS[currentChapter - 1];
        const verses = SAMPLE_VERSES[currentChapter] || [];
        renderVerses(verses, chapter);
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
    chapterSelect.addEventListener('change', (e) => {
        loadChapter(parseInt(e.target.value));
    });

    prevBtn.addEventListener('click', () => {
        if (currentChapter > 1) loadChapter(currentChapter - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentChapter < 26) loadChapter(currentChapter + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowLeft' && currentChapter > 1) loadChapter(currentChapter - 1);
        if (e.key === 'ArrowRight' && currentChapter < 26) loadChapter(currentChapter + 1);
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
