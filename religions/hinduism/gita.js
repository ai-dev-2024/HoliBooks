/**
 * HoliBooks - Bhagavad Gita Module
 * Using Bhagavad Gita API
 */

const API_BASE = 'https://vedicscriptures.github.io';

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

    // Check URL params
    const params = HoliBooks.getQueryParams();
    if (params.chapter) {
        const chapterNum = parseInt(params.chapter);
        if (chapterNum >= 1 && chapterNum <= 18) {
            currentChapter = chapterNum;
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
    const SAMPLE_VERSES = {
        1: [
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
        ],
        2: [
            {
                slok: 'सञ्जय उवाच |\nतं तथा कृपयाविष्टमश्रुपूर्णाकुलेक्षणम् |\nविषीदन्तमिदं वाक्यमुवाच मधुसूदनः ||१||',
                transliteration: 'sañjaya uvāca\ntaṃ tathā kṛpayāviṣṭam aśru-pūrṇākulekṣaṇam\nviṣīdantam idaṃ vākyam uvāca madhusūdanaḥ',
                tej: { ht: 'संजय ने कहा: इस प्रकार करुणा से व्याप्त, आँसुओं से भरी और व्याकुल आँखों वाले, शोक करते हुए अर्जुन से मधुसूदन ने कहा।' },
                spiit: 'Sanjaya said: To him who was thus overcome with pity, whose eyes were filled with tears and who was agitated, Madhusudana spoke these words.'
            },
            {
                slok: 'श्रीभगवानुवाच |\nकुतस्त्वा कश्मलमिदं विषमे समुपस्थितम् |\nअनार्यजुष्टमस्वर्ग्यमकीर्तिकरमर्जुन ||२||',
                transliteration: 'śrī-bhagavān uvāca\nkutas tvā kaśmalam idaṃ viṣame samupasthitam\nanārya-juṣṭam asvargyam akīrti-karam arjuna',
                tej: { ht: 'श्री भगवान ने कहा: हे अर्जुन! इस कठिन समय में तुम्हें यह मोह कैसे हुआ? यह श्रेष्ठ पुरुषों के योग्य नहीं, न स्वर्ग देने वाला है, न कीर्ति देने वाला।' },
                spiit: 'The Supreme Lord said: From where has this weakness arisen in you at this critical time? It is not befitting a noble person, nor does it lead to heaven or glory, O Arjuna.'
            },
            {
                slok: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||४७||',
                transliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
                tej: { ht: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तुम कर्मफल के हेतु मत बनो और अकर्म में भी तुम्हारी आसक्ति न हो।' },
                spiit: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results, and never be attached to inaction.'
            },
            {
                slok: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय |\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||४८||',
                transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṃ yoga ucyate',
                tej: { ht: 'हे धनञ्जय! योग में स्थित होकर और आसक्ति त्यागकर कर्म करो। सिद्धि और असिद्धि में समान भाव रखो; यह समत्व ही योग कहलाता है।' },
                spiit: 'Be steadfast in yoga, O Arjuna. Perform your duty and abandon all attachment to success or failure. Such evenness of mind is called yoga.'
            }
        ],
        3: [
            {
                slok: 'अर्जुन उवाच |\nज्यायसी चेत्कर्मणस्ते मता बुद्धिर्जनार्दन |\nतत्किं कर्मणि घोरे मां नियोजयसि केशव ||१||',
                transliteration: 'arjuna uvāca\njyāyasī cet karmaṇas te matā buddhir janārdana\ntat kiṃ karmaṇi ghore māṃ niyojayasi keśava',
                tej: { ht: 'अर्जुन ने कहा: हे जनार्दन! यदि कर्म से बुद्धि श्रेष्ठ है, तो फिर हे केशव! आप मुझे इस भयंकर कर्म में क्यों लगाते हैं?' },
                spiit: 'Arjuna said: O Janardana, if you consider knowledge superior to action, why then do you urge me to engage in this terrible action, O Keshava?'
            },
            {
                slok: 'न हि कश्चित्क्षणमपि जातु तिष्ठत्यकर्मकृत् |\nकार्यते ह्यवशः कर्म सर्वः प्रकृतिजैर्गुणैः ||५||',
                transliteration: 'na hi kaścit kṣaṇam api jātu tiṣṭhaty akarma-kṛt\nkāryate hy avaśaḥ karma sarvaḥ prakṛti-jair guṇaiḥ',
                tej: { ht: 'कोई भी मनुष्य एक क्षण भी बिना कर्म किए नहीं रह सकता, क्योंकि प्रकृति जनित गुणों द्वारा सभी विवश होकर कर्म करते हैं।' },
                spiit: 'No one can remain without action even for a moment. Everyone is helplessly driven to action by the qualities born of material nature.'
            }
        ]
    };
    return SAMPLE_VERSES[chapterNum] || [];
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
