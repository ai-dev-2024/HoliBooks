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
            // Subtle cached indicator
            versesContainer.innerHTML = `
                <div style="color: var(--text-muted); padding: 12px 20px; text-align: center; font-size: 0.85rem; border-radius: 8px; background: var(--bg-card); margin-bottom: 20px; opacity: 0.8;">
                    <small>📖 Cached content</small>
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
                        Content loading... Please try again later.
                    </p>
                </div>
            `;
        }
    }
}

// Comprehensive fallback data for Japji Sahib (Ang 1-8)
const FALLBACK_ANGS = {
    1: {
        page: [
            { line: { gurmukhi: { unicode: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥' }, transliteration: { english: 'ik oankaar sat naam karataa purakh nirabho niravair akaal moorat ajoonee saibhan gur prasaad ||' } }, translation: { english: { bdb: 'One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred. Image Of The Undying, Beyond Birth, Self-Existent. By Guru\'s Grace.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: '॥ ਜਪੁ ॥' }, transliteration: { english: '|| jap ||' } }, translation: { english: { bdb: 'Chant And Meditate:' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥' }, transliteration: { english: 'aad sach jugaad sach ||' } }, translation: { english: { bdb: 'True In The Primal Beginning. True Throughout The Ages.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥੧॥' }, transliteration: { english: 'hai bhee sach naanak hosee bhee sach ||1||' } }, translation: { english: { bdb: 'True Here And Now. O Nanak, Forever And Ever True. ||1||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੋਚੈ ਸੋਚਿ ਨ ਹੋਵਈ ਜੇ ਸੋਚੀ ਲਖ ਵਾਰ ॥' }, transliteration: { english: 'sochai soch na hovee je sochee lakh vaar ||' } }, translation: { english: { bdb: 'By thinking, He cannot be reduced to thought, even by thinking hundreds of thousands of times.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਚੁਪੈ ਚੁਪ ਨ ਹੋਵਈ ਜੇ ਲਾਇ ਰਹਾ ਲਿਵ ਤਾਰ ॥' }, transliteration: { english: 'chupai chup na hovee je laai rahaa liv taar ||' } }, translation: { english: { bdb: 'By remaining silent, inner silence is not obtained, even by remaining lovingly absorbed deep within.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਭੁਖਿਆ ਭੁਖ ਨ ਉਤਰੀ ਜੇ ਬੰਨਾ ਪੁਰੀਆ ਭਾਰ ॥' }, transliteration: { english: 'bhukhiaa bhukh na utaree je bannaa pureeaa bhaar ||' } }, translation: { english: { bdb: 'The hunger of the hungry is not appeased, even by piling up loads of worldly goods.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸਹਸ ਸਿਆਣਪਾ ਲਖ ਹੋਹਿ ਤ ਇਕ ਨ ਚਲੈ ਨਾਲਿ ॥' }, transliteration: { english: 'sahas siaaNapaa lakh hohi ta ik na chalai naal ||' } }, translation: { english: { bdb: 'Hundreds of thousands of clever tricks, but not even one of them will go along with you in the end.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਕਿਵ ਸਚਿਆਰਾ ਹੋਈਐ ਕਿਵ ਕੂੜੈ ਤੁਟੈ ਪਾਲਿ ॥' }, transliteration: { english: 'kiv sachiaaraa hoeeai kiv koorrai tutai paal ||' } }, translation: { english: { bdb: 'So how can you become truthful? And how can the veil of illusion be torn away?' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਹੁਕਮਿ ਰਜਾਈ ਚਲਣਾ ਨਾਨਕ ਲਿਖਿਆ ਨਾਲਿ ॥੧॥' }, transliteration: { english: 'hukam rajaaee chalanaa naanak likhiaa naal ||1||' } }, translation: { english: { bdb: 'O Nanak, it is written that you shall obey the Hukam of His Command, and walk in the Way of His Will. ||1||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    },
    2: {
        page: [
            { line: { gurmukhi: { unicode: 'ਹੁਕਮੀ ਹੋਵਨਿ ਆਕਾਰ ਹੁਕਮੁ ਨ ਕਹਿਆ ਜਾਈ ॥' }, transliteration: { english: 'hukamee hovan aakaar hukam na kahiaa jaaee ||' } }, translation: { english: { bdb: 'By His Command, bodies are created; His Command cannot be described.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਹੁਕਮੀ ਹੋਵਨਿ ਜੀਅ ਹੁਕਮਿ ਮਿਲੈ ਵਡਿਆਈ ॥' }, transliteration: { english: 'hukamee hovan jee-a hukam milai vadi-aaee ||' } }, translation: { english: { bdb: 'By His Command, souls come into being; by His Command, glory and greatness are obtained.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਹੁਕਮੀ ਉਤਮੁ ਨੀਚੁ ਹੁਕਮਿ ਲਿਖਿ ਦੁਖ ਸੁਖ ਪਾਈਅਹਿ ॥' }, transliteration: { english: 'hukamee utam neech hukam likh dukh sukh paa-ee-ah ||' } }, translation: { english: { bdb: 'By His Command, some are high and some are low; by His Written Command, pain and pleasure are obtained.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਇਕਨਾ ਹੁਕਮੀ ਬਖਸੀਸ ਇਕਿ ਹੁਕਮੀ ਸਦਾ ਭਵਾਈਅਹਿ ॥' }, transliteration: { english: 'iknaa hukamee bakhsees ik hukamee sadaa bhavaa-ee-ah ||' } }, translation: { english: { bdb: 'Some, by His Command, are blessed and forgiven; others, by His Command, wander aimlessly forever.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਹੁਕਮੀ ਅੰਦਰਿ ਸਭੁ ਕੋ ਬਾਹਰਿ ਹੁਕਮ ਨ ਕੋਇ ॥' }, transliteration: { english: 'hukamee andar sabh ko baahar hukam na ko-e ||' } }, translation: { english: { bdb: 'Everyone is subject to His Command; no one is beyond His Command.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਹੁਕਮੈ ਜੇ ਬੁਝੈ ਤ ਹਉਮੈ ਕਹੈ ਨ ਕੋਇ ॥੨॥' }, transliteration: { english: 'naanak hukamai je bujhai ta ha-umai kahai na ko-e ||2||' } }, translation: { english: { bdb: 'O Nanak, one who understands His Command, does not speak in ego. ||2||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਤਾਣੁ ਹੋਵੈ ਕਿਸੈ ਤਾਣੁ ॥' }, transliteration: { english: 'gaavai ko taan hovai kisai taan ||' } }, translation: { english: { bdb: 'Some sing of His Power-who has that Power?' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਦਾਤਿ ਜਾਣੈ ਨੀਸਾਣੁ ॥' }, transliteration: { english: 'gaavai ko daat jaanai neesaan ||' } }, translation: { english: { bdb: 'Some sing of His Gifts, and know His Sign and Insignia.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਗੁਣ ਵਡਿਆਈਆ ਚਾਰ ॥' }, transliteration: { english: 'gaavai ko gun vadi-aa-ee-aa chaar ||' } }, translation: { english: { bdb: 'Some sing of His Glorious Virtues, Greatness and Beauty.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਵਿਦਿਆ ਵਿਖਮੁ ਵੀਚਾਰੁ ॥' }, transliteration: { english: 'gaavai ko vidi-aa vikham veechaar ||' } }, translation: { english: { bdb: 'Some sing of knowledge obtained of Him, through difficult philosophical studies.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    },
    3: {
        page: [
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਸਾਜਿ ਕਰੇ ਤਨੁ ਖੇਹ ॥' }, transliteration: { english: 'gaavai ko saaj kare tan kheh ||' } }, translation: { english: { bdb: 'Some sing that He fashions the body, and then reduces it to dust.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਜੀਅ ਲੈ ਫਿਰਿ ਦੇਹ ॥' }, transliteration: { english: 'gaavai ko jee-a lai fir deh ||' } }, translation: { english: { bdb: 'Some sing that He takes life away, and then restores it.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਜਾਪੈ ਦਿਸੈ ਦੂਰਿ ॥' }, transliteration: { english: 'gaavai ko jaapai disai door ||' } }, translation: { english: { bdb: 'Some sing that He seems so very far away.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੈ ਕੋ ਵੇਖੈ ਹਾਦਰਾ ਹਦੂਰਿ ॥' }, transliteration: { english: 'gaavai ko vekhai haadraa hadoor ||' } }, translation: { english: { bdb: 'Some sing that He watches over us, face to face, ever-present.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਕਥਨਾ ਕਥੀ ਨ ਆਵੈ ਤੋਟਿ ॥' }, transliteration: { english: 'kathanaa kathee na aavai tot ||' } }, translation: { english: { bdb: 'There is no shortage of those who preach and teach.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਕਥਿ ਕਥਿ ਕਥੀ ਕੋਟੀ ਕੋਟਿ ਕੋਟਿ ॥' }, transliteration: { english: 'kath kath kathee kotee kot kot ||' } }, translation: { english: { bdb: 'Millions upon millions offer millions of sermons and stories.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਦੇਦਾ ਦੇ ਲੈਦੇ ਥਕਿ ਪਾਹਿ ॥' }, transliteration: { english: 'dedaa de laide thak paahi ||' } }, translation: { english: { bdb: 'The Great Giver keeps on giving, while those who receive grow weary of receiving.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਜੁਗਾ ਜੁਗੰਤਰਿ ਖਾਹੀ ਖਾਹਿ ॥' }, transliteration: { english: 'jugaa jugantar khaahee khaahi ||' } }, translation: { english: { bdb: 'Throughout the ages, consumers consume.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਹੁਕਮੀ ਹੁਕਮੁ ਚਲਾਏ ਰਾਹੁ ॥' }, transliteration: { english: 'hukamee hukam chalaa-e raahu ||' } }, translation: { english: { bdb: 'The Commander, by His Command, leads us to walk on the Path.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਵਿਗਸੈ ਵੇਪਰਵਾਹੁ ॥੩॥' }, transliteration: { english: 'naanak vigsai vayparvaahu ||3||' } }, translation: { english: { bdb: 'O Nanak, He blossoms forth, Carefree and Untroubled. ||3||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    },
    4: {
        page: [
            { line: { gurmukhi: { unicode: 'ਸਾਚਾ ਸਾਹਿਬੁ ਸਾਚੁ ਨਾਇ ਭਾਖਿਆ ਭਾਉ ਅਪਾਰੁ ॥' }, transliteration: { english: 'saachaa saahib saach naa-e bhaakhiaa bhaa-o apaar ||' } }, translation: { english: { bdb: 'True is the Master, True is His Name-speak it with infinite love.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਆਖਹਿ ਮੰਗਹਿ ਦੇਹਿ ਦੇਹਿ ਦਾਤਿ ਕਰੇ ਦਾਤਾਰੁ ॥' }, transliteration: { english: 'aakahi mangahi dehi dehi daat kare daataar ||' } }, translation: { english: { bdb: 'People beg and pray, "Give to us, give to us", and the Great Giver gives His Gifts.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਫੇਰਿ ਕਿ ਅਗੈ ਰਖੀਐ ਜਿਤੁ ਦਿਸੈ ਦਰਬਾਰੁ ॥' }, transliteration: { english: 'fer ki agai rakhee-ai jit disai darbaar ||' } }, translation: { english: { bdb: 'So what offering can we place before Him, by which we might see the Darbaar of His Court?' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਮੁਹੌ ਕਿ ਬੋਲਣੁ ਬੋਲੀਐ ਜਿਤੁ ਸੁਣਿ ਧਰੇ ਪਿਆਰੁ ॥' }, transliteration: { english: 'muho ki bolan bolee-ai jit sun dharay pi-aar ||' } }, translation: { english: { bdb: 'What words can we speak to evoke His Love?' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਅੰਮ੍ਰਿਤ ਵੇਲਾ ਸਚੁ ਨਾਉ ਵਡਿਆਈ ਵੀਚਾਰੁ ॥' }, transliteration: { english: 'amrit vaylaa sach naa-o vadi-aa-ee veechaar ||' } }, translation: { english: { bdb: 'In the Amrit Vaylaa, the ambrosial hours before dawn, chant the True Name, and contemplate His Glorious Greatness.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਕਰਮੀ ਆਵੈ ਕਪੜਾ ਨਦਰੀ ਮੋਖੁ ਦੁਆਰੁ ॥' }, transliteration: { english: 'karmee aavai kaprhaa nadree mokh du-aar ||' } }, translation: { english: { bdb: 'By the karma of past actions, the robe of this physical body is obtained. By His Grace, the Gate of Liberation is found.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਏਵੈ ਜਾਣੀਐ ਸਭੁ ਆਪੇ ਸਚਿਆਰੁ ॥੪॥' }, transliteration: { english: 'naanak ayvai jaanee-ai sabh aapay sachiaar ||4||' } }, translation: { english: { bdb: 'O Nanak, know this well: the True One Himself is All. ||4||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਥਾਪਿਆ ਨ ਜਾਇ ਕੀਤਾ ਨ ਹੋਇ ॥' }, transliteration: { english: 'thaapiaa na jaa-e keetaa na ho-e ||' } }, translation: { english: { bdb: 'He cannot be established, He cannot be created.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਆਪੇ ਆਪਿ ਨਿਰੰਜਨੁ ਸੋਇ ॥' }, transliteration: { english: 'aapay aap niranjan so-e ||' } }, translation: { english: { bdb: 'He Himself is Immaculate and Pure.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਜਿਨਿ ਸੇਵਿਆ ਤਿਨਿ ਪਾਇਆ ਮਾਨੁ ॥' }, transliteration: { english: 'jin sayvi-aa tin paa-i-aa maan ||' } }, translation: { english: { bdb: 'Those who serve Him are honored.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    },
    5: {
        page: [
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਗਾਵੀਐ ਗੁਣੀ ਨਿਧਾਨੁ ॥' }, transliteration: { english: 'naanak gaa-vee-ai gunee nidhaan ||' } }, translation: { english: { bdb: 'O Nanak, sing of the Lord, the Treasure of Excellence.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗਾਵੀਐ ਸੁਣੀਐ ਮਨਿ ਰਖੀਐ ਭਾਉ ॥' }, transliteration: { english: 'gaa-vee-ai sunee-ai man rakhee-ai bhaa-o ||' } }, translation: { english: { bdb: 'Sing, and listen, and let your mind be filled with love.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਦੁਖੁ ਪਰਹਰਿ ਸੁਖੁ ਘਰਿ ਲੈ ਜਾਇ ॥' }, transliteration: { english: 'dukh parhar sukh ghar lai jaa-e ||' } }, translation: { english: { bdb: 'Your pain shall be sent far away, and peace shall come to your home.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗੁਰਮੁਖਿ ਨਾਦੰ ਗੁਰਮੁਖਿ ਵੇਦੰ ਗੁਰਮੁਖਿ ਰਹਿਆ ਸਮਾਈ ॥' }, transliteration: { english: 'gurmukh naa-dang gurmukh vaydang gurmukh rahi-aa samaa-ee ||' } }, translation: { english: { bdb: 'The Guru\'s Word is the Sound-current of the Naad; the Guru\'s Word is the Wisdom of the Vedas; the Guru\'s Word is all-pervading.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗੁਰੁ ਈਸਰੁ ਗੁਰੁ ਗੋਰਖੁ ਬਰਮਾ ਗੁਰੁ ਪਾਰਬਤੀ ਮਾਈ ॥' }, transliteration: { english: 'gur eesar gur gorkh barmaa gur paarbattee maa-ee ||' } }, translation: { english: { bdb: 'The Guru is Shiva, the Guru is Gorakh and Brahma; the Guru is Parvati and Lakhshmi.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਜੇ ਹਉ ਜਾਣਾ ਆਖਾ ਨਾਹੀ ਕਹਣਾ ਕਥਨੁ ਨ ਜਾਈ ॥' }, transliteration: { english: 'je ha-o jaanaa aakhaa naahee kahnaa kathan na jaa-ee ||' } }, translation: { english: { bdb: 'Even knowing God, I cannot describe Him; He cannot be described in words.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਗੁਰਾ ਇਕ ਦੇਹਿ ਬੁਝਾਈ ॥' }, transliteration: { english: 'guraa ik dehi bujhaa-ee ||' } }, translation: { english: { bdb: 'The Guru has given me this one understanding.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸਭਨਾ ਜੀਆ ਕਾ ਇਕੁ ਦਾਤਾ ਸੋ ਮੈ ਵਿਸਰਿ ਨ ਜਾਈ ॥੫॥' }, transliteration: { english: 'sabhnaa jee-aa kaa ik daataa so mai visar na jaa-ee ||5||' } }, translation: { english: { bdb: 'There is only the One, the Giver of all souls. May I never forget Him! ||5||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਤੀਰਥਿ ਨਾਵਾ ਜੇ ਤਿਸੁ ਭਾਵਾ ਵਿਣੁ ਭਾਣੇ ਕਿ ਨਾਇ ਕਰੀ ॥' }, transliteration: { english: 'teerath naavaa je tis bhaavaa vin bhaanay ki naa-e karee ||' } }, translation: { english: { bdb: 'If I am pleasing to Him, then it is a pilgrimage at the sacred shrine; otherwise, it is not.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਜੇਤੀ ਸਿਰਠਿ ਉਪਾਈ ਵੇਖਾ ਵਿਣੁ ਕਰਮਾ ਕਿ ਮਿਲੈ ਨਾਈ ॥' }, transliteration: { english: 'jatee sirath upaa-ee vaykhaa vin karmaa ki milai naa-ee ||' } }, translation: { english: { bdb: 'I gaze upon all the created beings: without the karma of good actions, what are they given to receive?' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    },
    6: {
        page: [
            { line: { gurmukhi: { unicode: 'ਕਰਮੀ ਕਪੜਾ ਨਦਰੀ ਮੋਖੁ ਦੁਆਰੁ ॥' }, transliteration: { english: 'karmee kaprhaa nadree mokh du-aar ||' } }, translation: { english: { bdb: 'By the karma of good actions, the robe of honor is obtained; by His Grace, the Gate of Liberation is found.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਏਵੈ ਜਾਣੀਐ ਸਭੁ ਆਪੇ ਸਚਿਆਰੁ ॥੬॥' }, transliteration: { english: 'naanak ayvai jaanee-ai sabh aapay sachiaar ||6||' } }, translation: { english: { bdb: 'O Nanak, know this well: the True Lord Himself is All. ||6||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਜੇਤਾ ਕੀਤਾ ਤੇਤਾ ਨਾਉ ॥' }, transliteration: { english: 'jetaa keetaa tetaa naa-o ||' } }, translation: { english: { bdb: 'As much as the created creation can be created, that much is Your Name.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਵਿਣੁ ਨਾਵੈ ਨਾਹੀ ਕੋ ਥਾਉ ॥' }, transliteration: { english: 'vin naavai naahee ko thaa-o ||' } }, translation: { english: { bdb: 'Without the Name, there is no place at all.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਕੁਦਰਤਿ ਕਵਣ ਕਹਾ ਵੀਚਾਰੁ ॥' }, transliteration: { english: 'kudrat kavan kahaa veechaar ||' } }, translation: { english: { bdb: 'How can I describe Your Creative Power? I cannot even once be a sacrifice to You.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਵਾਰਿਆ ਨ ਜਾਵਾ ਏਕ ਵਾਰ ॥' }, transliteration: { english: 'vaari-aa na jaavaa ayk vaar ||' } }, translation: { english: { bdb: 'Whatever pleases You is the only good done, You, Forever and Ever the One.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਜੋ ਤੁਧੁ ਭਾਵੈ ਸਾਈ ਭਲੀ ਕਾਰ ॥' }, transliteration: { english: 'jo tudh bhaavai saa-ee bhalee kaar ||' } }, translation: { english: { bdb: 'You, the One, who is pervading in all.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਤੂ ਸਦਾ ਸਲਾਮਤਿ ਨਿਰੰਕਾਰ ॥੭॥' }, transliteration: { english: 'too sadaa salaamat niranakaar ||7||' } }, translation: { english: { bdb: 'You are Eternal and Forever; You are the One who does not decay. O Formless Lord! ||7||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਸਿਧ ਪੀਰ ਸੁਰਿ ਨਾਥ ॥' }, transliteration: { english: 'suni-ai sidh peer sur naath ||' } }, translation: { english: { bdb: 'Listening-the Siddhas, the spiritual teachers, the heroic warriors, the yogic masters.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਧਰਤਿ ਧਵਲ ਆਕਾਸ ॥' }, transliteration: { english: 'suni-ai dharat dhaval aakaas ||' } }, translation: { english: { bdb: 'Listening-the earth, its support and the sky.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    },
    7: {
        page: [
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਦੀਪ ਲੋਅ ਪਾਤਾਲ ॥' }, transliteration: { english: 'suni-ai deep lo-a paataal ||' } }, translation: { english: { bdb: 'Listening-the continents, the worlds and the nether regions of the underworld.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਪੋਹਿ ਨ ਸਕੈ ਕਾਲੁ ॥' }, transliteration: { english: 'suni-ai pohi na sakai kaal ||' } }, translation: { english: { bdb: 'Listening-Death cannot even touch you.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਭਗਤਾ ਸਦਾ ਵਿਗਾਸੁ ॥' }, transliteration: { english: 'naanak bhagtaa sadaa vigaas ||' } }, translation: { english: { bdb: 'O Nanak, the devotees are forever in bliss.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਦੂਖ ਪਾਪ ਕਾ ਨਾਸੁ ॥੮॥' }, transliteration: { english: 'suni-ai dookh paap kaa naas ||8||' } }, translation: { english: { bdb: 'Listening-pain and sin are erased. ||8||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਈਸਰੁ ਬਰਮਾ ਇੰਦੁ ॥' }, transliteration: { english: 'suni-ai eesar barmaa ind ||' } }, translation: { english: { bdb: 'Listening-Shiva, Brahma and Indra.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਮੁਖਿ ਸਾਲਾਹਣ ਮੰਦੁ ॥' }, transliteration: { english: 'suni-ai mukh saalaahan mand ||' } }, translation: { english: { bdb: 'Listening-even foul-mouthed people praise Him.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਜੋਗ ਜੁਗਤਿ ਤਨਿ ਭੇਦ ॥' }, transliteration: { english: 'suni-ai jog jugat tan bhayd ||' } }, translation: { english: { bdb: 'Listening-the technology of Yoga and the secrets of the body.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਸਾਸਤ ਸਿਮ੍ਰਿਤਿ ਵੇਦ ॥' }, transliteration: { english: 'suni-ai saasat simrit vayd ||' } }, translation: { english: { bdb: 'Listening-the Shaastras, the Simritees and the Vedas.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਭਗਤਾ ਸਦਾ ਵਿਗਾਸੁ ॥' }, transliteration: { english: 'naanak bhagtaa sadaa vigaas ||' } }, translation: { english: { bdb: 'O Nanak, the devotees are forever in bliss.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਦੂਖ ਪਾਪ ਕਾ ਨਾਸੁ ॥੯॥' }, transliteration: { english: 'suni-ai dookh paap kaa naas ||9||' } }, translation: { english: { bdb: 'Listening-pain and sin are erased. ||9||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    },
    8: {
        page: [
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਸਤੁ ਸੰਤੋਖੁ ਗਿਆਨੁ ॥' }, transliteration: { english: 'suni-ai sat santokh gi-aan ||' } }, translation: { english: { bdb: 'Listening-truth, contentment and spiritual wisdom.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਅਠਸਠਿ ਕਾ ਇਸਨਾਨੁ ॥' }, transliteration: { english: 'suni-ai athsathi kaa isnaan ||' } }, translation: { english: { bdb: 'Listening-take your cleansing bath at the sixty-eight places of pilgrimage.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਪੜਿ ਪੜਿ ਪਾਵਹਿ ਮਾਨੁ ॥' }, transliteration: { english: 'suni-ai parh parh paavahi maan ||' } }, translation: { english: { bdb: 'Listening-reading and reciting, honor is obtained.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਲਾਗੈ ਸਹਜਿ ਧਿਆਨੁ ॥' }, transliteration: { english: 'suni-ai laagai sahj dhi-aan ||' } }, translation: { english: { bdb: 'Listening-intuitively grasp the essence of meditation.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਨਾਨਕ ਭਗਤਾ ਸਦਾ ਵਿਗਾਸੁ ॥' }, transliteration: { english: 'naanak bhagtaa sadaa vigaas ||' } }, translation: { english: { bdb: 'O Nanak, the devotees are forever in bliss.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਦੂਖ ਪਾਪ ਕਾ ਨਾਸੁ ॥੧੦॥' }, transliteration: { english: 'suni-ai dookh paap kaa naas ||10||' } }, translation: { english: { bdb: 'Listening-pain and sin are erased. ||10||' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਸਰਾ ਗੁਣਾ ਕੇ ਗਾਹ ॥' }, transliteration: { english: 'suni-ai saraa gunaa kay gaah ||' } }, translation: { english: { bdb: 'Listening-the depths of the virtues of the oceans.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਸੇਖ ਪੀਰ ਪਾਤਿਸਾਹ ॥' }, transliteration: { english: 'suni-ai saykh peer paatisaah ||' } }, translation: { english: { bdb: 'Listening-sheikhs, religious scholars, spiritual teachers and kings.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਅੰਧੇ ਪਾਵਹਿ ਰਾਹੁ ॥' }, transliteration: { english: 'suni-ai andhay paavahi raahu ||' } }, translation: { english: { bdb: 'Listening-even the blind find the Path.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } },
            { line: { gurmukhi: { unicode: 'ਸੁਣਿਐ ਹਾਥ ਹੋਵੈ ਅਸਗਾਹੁ ॥' }, transliteration: { english: 'suni-ai haath hovai asgaahu ||' } }, translation: { english: { bdb: 'Listening-the Unreachable comes within your grasp.' } }, shabad: { writer: { english: 'Guru Nanak Dev Ji' } } }
        ]
    }
};

function getFallbackAng(angNum) {
    return FALLBACK_ANGS[angNum] || null;
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
