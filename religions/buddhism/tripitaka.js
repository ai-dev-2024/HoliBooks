/**
 * HoliBooks - Dhammapada Module
 * Buddhist scripture reader
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

// Sample verses (embedded for reliability)
const SAMPLE_VERSES = {
    1: [
        { num: 1, pali: 'Manopubbaṅgamā dhammā, manoseṭṭhā manomayā.', translation: 'Mind is the forerunner of all actions. All deeds are led by mind, created by mind.' },
        { num: 2, pali: 'Manasā ce paduṭṭhena, bhāsati vā karoti vā.', translation: 'If one speaks or acts with an impure mind, suffering follows, as the wheel follows the hoof of the ox.' },
        { num: 3, pali: 'Akkocchi maṃ, avadhi maṃ, ajini maṃ, ahāsi me.', translation: '"He abused me, he beat me, he defeated me, he robbed me." Those who harbor such thoughts never still their hatred.' },
    ],
    2: [
        { num: 21, pali: 'Appamādo amatapadaṃ, pamādo maccuno padaṃ.', translation: 'Heedfulness is the path to the deathless; heedlessness is the path to death.' },
        { num: 22, pali: 'Appamattā na mīyanti, ye pamattā yathā matā.', translation: 'The heedful do not die; the heedless are as if already dead.' },
    ]
};

let currentChapter = 1;

const chapterSelect = document.getElementById('chapter-select');
const prevBtn = document.getElementById('prev-chapter');
const nextBtn = document.getElementById('next-chapter');
const chapterPali = document.getElementById('chapter-pali');
const chapterEnglish = document.getElementById('chapter-english');
const verseCount = document.getElementById('verse-count');
const versesContainer = document.getElementById('verses-container');
const themeToggle = document.getElementById('theme-toggle');

async function init() {
    const saved = HoliBooks.storage.get('dhammapada_chapter');
    if (saved) currentChapter = saved;

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
                ${verse.pali ? `<p class="gatha-pali">${verse.pali}</p>` : ''}
                <p class="gatha-translation">${verse.translation}</p>
            </article>
        `;
    });

    versesContainer.innerHTML = html;
}

function updateNavigation() {
    prevBtn.disabled = currentChapter <= 1;
    nextBtn.disabled = currentChapter >= 26;
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

    themeToggle.addEventListener('click', () => HoliBooks.theme.toggle());
}

document.addEventListener('DOMContentLoaded', init);
