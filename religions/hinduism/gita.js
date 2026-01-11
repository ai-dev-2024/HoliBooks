/**
 * HoliBooks - Bhagavad Gita Module
 * Using Bhagavad Gita API
 */

const API_BASE = 'https://bhagavadgitaapi.in';

// Chapter data
const CHAPTERS = [
    { number: 1, name: 'अर्जुनविषादयोग', english: 'Arjuna Vishada Yoga', meaning: 'The Yoga of Arjuna\'s Dejection', verses: 47 },
    { number: 2, name: 'सांख्ययोग', english: 'Sankhya Yoga', meaning: 'The Yoga of Knowledge', verses: 72 },
    { number: 3, name: 'कर्मयोग', english: 'Karma Yoga', meaning: 'The Yoga of Action', verses: 43 },
    { number: 4, name: 'ज्ञानकर्मसंन्यासयोग', english: 'Jnana Karma Sanyasa Yoga', meaning: 'The Yoga of Knowledge and Renunciation of Action', verses: 42 },
    { number: 5, name: 'कर्मसंन्यासयोग', english: 'Karma Sanyasa Yoga', meaning: 'The Yoga of Renunciation of Action', verses: 29 },
    { number: 6, name: 'आत्मसंयमयोग', english: 'Atma Samyama Yoga', meaning: 'The Yoga of Self-Control', verses: 47 },
    { number: 7, name: 'ज्ञानविज्ञानयोग', english: 'Jnana Vijnana Yoga', meaning: 'The Yoga of Knowledge and Wisdom', verses: 30 },
    { number: 8, name: 'अक्षरब्रह्मयोग', english: 'Akshara Brahma Yoga', meaning: 'The Yoga of the Imperishable Brahman', verses: 28 },
    { number: 9, name: 'राजविद्याराजगुह्ययोग', english: 'Raja Vidya Raja Guhya Yoga', meaning: 'The Yoga of Royal Knowledge and Royal Secret', verses: 34 },
    { number: 10, name: 'विभूतियोग', english: 'Vibhuti Yoga', meaning: 'The Yoga of Divine Glories', verses: 42 },
    { number: 11, name: 'विश्वरूपदर्शनयोग', english: 'Vishwarupa Darshana Yoga', meaning: 'The Yoga of the Vision of the Universal Form', verses: 55 },
    { number: 12, name: 'भक्तियोग', english: 'Bhakti Yoga', meaning: 'The Yoga of Devotion', verses: 20 },
    { number: 13, name: 'क्षेत्रक्षेत्रज्ञविभागयोग', english: 'Kshetra Kshetragna Vibhaga Yoga', meaning: 'The Yoga of the Field and the Knower of the Field', verses: 35 },
    { number: 14, name: 'गुणत्रयविभागयोग', english: 'Gunatraya Vibhaga Yoga', meaning: 'The Yoga of the Division of Three Gunas', verses: 27 },
    { number: 15, name: 'पुरुषोत्तमयोग', english: 'Purushottama Yoga', meaning: 'The Yoga of the Supreme Person', verses: 20 },
    { number: 16, name: 'दैवासुरसम्पद्विभागयोग', english: 'Daivasura Sampad Vibhaga Yoga', meaning: 'The Yoga of the Division between Divine and Demonic', verses: 24 },
    { number: 17, name: 'श्रद्धात्रयविभागयोग', english: 'Shraddhatraya Vibhaga Yoga', meaning: 'The Yoga of the Division of Threefold Faith', verses: 28 },
    { number: 18, name: 'मोक्षसंन्यासयोग', english: 'Moksha Sanyasa Yoga', meaning: 'The Yoga of Liberation through Renunciation', verses: 78 }
];

let currentChapter = 1;

const chapterSelect = document.getElementById('chapter-select');
const prevBtn = document.getElementById('prev-chapter');
const nextBtn = document.getElementById('next-chapter');
const chapterSanskrit = document.getElementById('chapter-sanskrit');
const chapterEnglish = document.getElementById('chapter-english');
const verseCount = document.getElementById('verse-count');
const versesContainer = document.getElementById('verses-container');
const themeToggle = document.getElementById('theme-toggle');

async function init() {
    const saved = HoliBooks.storage.get('gita_chapter');
    if (saved) currentChapter = saved;

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
    HoliBooks.showLoading(versesContainer, 'Loading shlokas...');

    try {
        const chapter = CHAPTERS[chapterNum - 1];

        // Update chapter info
        chapterSanskrit.textContent = `अध्याय ${chapterNum}: ${chapter.name}`;
        chapterEnglish.textContent = chapter.meaning;
        verseCount.textContent = `${chapter.verses} Shlokas`;

        // Fetch verses with retry
        const response = await HoliBooks.fetchWithRetry(`${API_BASE}/slok/${chapterNum}`, {}, 2);

        // Render verses
        renderVerses(response, chapter);
        updateNavigation();

        HoliBooks.storage.set('gita_chapter', chapterNum);
        chapterSelect.value = chapterNum;
        HoliBooks.scrollToTop();

    } catch (error) {
        console.error('Failed to load chapter:', error);
        // Use fallback sample data
        const chapter = CHAPTERS[chapterNum - 1];
        const fallbackVerses = getFallbackVerses(chapterNum);

        if (fallbackVerses && fallbackVerses.length > 0) {
            renderVerses(fallbackVerses, chapter);
            updateNavigation();
            versesContainer.innerHTML = `
                <div style="color: var(--text-muted); padding: 20px; text-align: center; font-size: 0.9rem; border-radius: 12px; background: var(--bg-card); margin-bottom: 20px;">
                    ⚠️ Live API unavailable. Showing sample shlokas.<br>
                    <small>The full Bhagavad Gita will load when API is accessible.</small>
                </div>
            ` + versesContainer.innerHTML;
        } else {
            versesContainer.innerHTML = `
                <div class="chapter-info-card" style="margin-top: 20px;">
                    <p style="color: var(--text-secondary);">
                        This chapter contains ${chapter.verses} shlokas about "${chapter.meaning}".
                    </p>
                    <p style="color: var(--text-muted); margin-top: 10px; font-size: 0.9rem;">
                        API unavailable. Please try again later.
                    </p>
                </div>
            `;
        }
    }
}

// Fallback sample verses for when API is blocked by CORS
function getFallbackVerses(chapterNum) {
    if (chapterNum === 1) {
        return [
            {
                slok: 'धृतराष्ट्र उवाच |\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||१||',
                transliteration: 'dhṛtarāṣṭra uvāca\ndharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāś caiva kim akurvata sañjaya',
                tej: { ht: 'धृतराष्ट्र ने कहा: हे संजय! धर्मभूमि कुरुक्षेत्र में युद्ध की इच्छा से एकत्रित मेरे और पाण्डु के पुत्रों ने क्या किया?' },
                spiit: 'Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do when they assembled on the holy field of Kurukshetra, eager to fight?'
            },
            {
                slok: 'सञ्जय उवाच |\nदृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा |\nआचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ||२||',
                transliteration: 'sañjaya uvāca\ndṛṣṭvā tu pāṇḍavānīkaṃ vyūḍhaṃ duryodhanas tadā\nācāryam upasaṅgamya rājā vacanam abravīt',
                tej: { ht: 'संजय ने कहा: पाण्डवों की सेना की व्यूहरचना को देखकर राजा दुर्योधन ने अपने गुरु द्रोणाचार्य के पास जाकर कहा।' },
                spiit: 'Sanjaya said: O King, after seeing the army of the Pandavas arranged in military formation, King Duryodhana approached his teacher Drona and spoke these words.'
            },
            {
                slok: 'पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् |\nव्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ||३||',
                transliteration: 'paśyaitāṃ pāṇḍu-putrāṇām ācārya mahatīṃ camūm\nvyūḍhāṃ drupada-putreṇa tava śiṣyeṇa dhīmatā',
                tej: { ht: 'हे आचार्य! पाण्डु पुत्रों की इस विशाल सेना को देखिए, जिसे आपके बुद्धिमान शिष्य द्रुपद पुत्र ने व्यवस्थित किया है।' },
                spiit: 'O teacher, behold this mighty army of the sons of Pandu, arrayed for battle by your intelligent disciple, the son of Drupada.'
            }
        ];
    }
    return [];
}

function renderVerses(data, chapter) {
    // If data is array of verses
    let verses = Array.isArray(data) ? data : (data.verses || []);

    if (verses.length === 0) {
        // Generate placeholder verses based on chapter info
        let html = '';
        for (let i = 1; i <= chapter.verses; i++) {
            html += `
                <article class="shloka-card">
                    <span class="shloka-number">Shloka ${i}</span>
                    <p class="shloka-translation" style="color: var(--text-muted);">
                        Verse ${currentChapter}.${i} - Coming soon
                    </p>
                </article>
            `;
        }
        versesContainer.innerHTML = html;
        return;
    }

    let html = '';
    verses.forEach((verse, index) => {
        html += `
            <article class="shloka-card">
                <span class="shloka-number">Shloka ${index + 1}</span>
                ${verse.slok ? `<p class="shloka-sanskrit">${verse.slok}</p>` : ''}
                ${verse.transliteration ? `<p class="shloka-transliteration">${verse.transliteration}</p>` : ''}
                ${verse.tej?.ht ? `<p class="shloka-translation">${verse.tej.ht}</p>` : ''}
            </article>
        `;
    });

    versesContainer.innerHTML = html || '<p class="loading">No verses found</p>';
}

function updateNavigation() {
    prevBtn.disabled = currentChapter <= 1;
    nextBtn.disabled = currentChapter >= 18;
}

function setupEventListeners() {
    chapterSelect.addEventListener('change', (e) => {
        loadChapter(parseInt(e.target.value));
    });

    prevBtn.addEventListener('click', () => {
        if (currentChapter > 1) loadChapter(currentChapter - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentChapter < 18) loadChapter(currentChapter + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowLeft' && currentChapter > 1) loadChapter(currentChapter - 1);
        if (e.key === 'ArrowRight' && currentChapter < 18) loadChapter(currentChapter + 1);
    });

    themeToggle.addEventListener('click', () => HoliBooks.theme.toggle());
}

document.addEventListener('DOMContentLoaded', init);
