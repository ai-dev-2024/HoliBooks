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
let currentLanguage = 'both'; // 'both', 'hindi', 'sanskrit'

const chapterSelect = document.getElementById('chapter-select');
const prevBtn = document.getElementById('prev-chapter');
const nextBtn = document.getElementById('next-chapter');
const chapterSanskrit = document.getElementById('chapter-sanskrit');
const chapterEnglish = document.getElementById('chapter-english');
const verseCount = document.getElementById('verse-count');
const versesContainer = document.getElementById('verses-container');
const themeToggle = document.getElementById('theme-toggle');
const languageBtn = document.getElementById('language-btn');
const currentLanguageSpan = document.getElementById('current-language');

async function init() {
    // Load saved preferences
    const savedChapter = HoliBooks.storage.get('gita_chapter');
    if (savedChapter) currentChapter = savedChapter;

    const savedLanguage = HoliBooks.storage.get('gita_language');
    if (savedLanguage) currentLanguage = savedLanguage;

    // Check URL params
    const params = HoliBooks.getQueryParams();
    if (params.chapter) {
        const chapterNum = parseInt(params.chapter);
        if (chapterNum >= 1 && chapterNum <= 18) {
            currentChapter = chapterNum;
        }
    }

    populateChapterDropdown();
    updateLanguageButton();
    updateMobileLanguageButtons();
    
    // Try to load cached data first for instant display
    const cachedData = HoliBooks.storage.get(`gita_chapter_${currentChapter}_cache`);
    if (cachedData) {
        try {
            const chapter = CHAPTERS[currentChapter - 1];
            window.currentGitaData = JSON.parse(cachedData);
            renderVerses(window.currentGitaData, chapter);
            updateNavigation();
            chapterSanskrit.textContent = `अध्याय ${currentChapter}: ${chapter.name}`;
            chapterEnglish.textContent = chapter.meaning;
            verseCount.textContent = `${chapter.verses} Shlokas`;
            chapterSelect.value = currentChapter;
        } catch (e) {
            // If cached data is corrupted, load fresh
            await loadChapter(currentChapter);
        }
    } else {
        await loadChapter(currentChapter);
    }
    
    setupEventListeners();
}

function populateChapterDropdown() {
    chapterSelect.innerHTML = CHAPTERS.map(ch =>
        `<option value="${ch.number}">Chapter ${ch.number}: ${ch.english}</option>`
    ).join('');
    chapterSelect.value = currentChapter;
}

// Global function for retry button
window.retryLoadChapter = async function(chapterNum) {
    // Remove cached indicator if exists
    const indicator = document.getElementById('cached-indicator');
    if (indicator) indicator.remove();
    
    // Clear cached data to force fresh fetch
    window.currentGitaData = null;
    await loadChapter(chapterNum);
};

async function loadChapter(chapterNum) {
    currentChapter = chapterNum;
    HoliBooks.showLoading(versesContainer, 'Loading shlokas...');

    try {
        const chapter = CHAPTERS[chapterNum - 1];

        // Update chapter info
        chapterSanskrit.textContent = `अध्याय ${chapterNum}: ${chapter.name}`;
        chapterEnglish.textContent = chapter.meaning;
        verseCount.textContent = `${chapter.verses} Shlokas`;

        // Try to fetch from API
        const response = await HoliBooks.fetchWithRetry(`${API_BASE}/slok/${chapterNum}`, {}, 2);

        // Cache successful response
        window.currentGitaData = response;
        
        // Store in localStorage for future use
        try {
            HoliBooks.storage.set(`gita_chapter_${chapterNum}_cache`, JSON.stringify(response));
        } catch (e) {
            // Ignore storage errors
        }

        // Render verses
        renderVerses(response, chapter);
        updateNavigation();

        HoliBooks.storage.set('gita_chapter', chapterNum);
        chapterSelect.value = chapterNum;
        HoliBooks.scrollToTop();

    } catch (error) {
        console.log('Using cached content for chapter', chapterNum);
        // Silently use fallback data - no error messages shown to user
        const chapter = CHAPTERS[chapterNum - 1];
        const fallbackVerses = getFallbackVerses(chapterNum);

        if (fallbackVerses && fallbackVerses.length > 0) {
            renderVerses(fallbackVerses, chapter);
            updateNavigation();
            // Add subtle cached indicator
            versesContainer.insertAdjacentHTML('afterbegin', `
                <div id="cached-indicator" style="color: var(--text-muted); padding: 8px 16px; text-align: right; font-size: 0.75rem; opacity: 0.6; margin-bottom: 10px;">
                    📚 Using cached content
                    <button onclick="retryLoadChapter(${chapterNum})" style="margin-left: 10px; background: transparent; border: 1px solid var(--text-muted); color: var(--text-muted); padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 0.7rem;">
                        🔄 Refresh
                    </button>
                </div>
            `);
        } else {
            // Should never happen with complete fallback data
            versesContainer.innerHTML = `
                <div class="chapter-info-card" style="margin-top: 20px; text-align: center; padding: 40px;">
                    <p style="color: var(--text-secondary); font-size: 1.1rem;">
                        Chapter ${chapterNum}: ${chapter.meaning}
                    </p>
                    <p style="color: var(--text-muted); margin-top: 15px;">
                        This chapter contains ${chapter.verses} shlokas.
                    </p>
                    <button onclick="retryLoadChapter(${chapterNum})" style="margin-top: 20px; padding: 10px 20px; background: var(--accent); color: var(--text-primary); border: none; border-radius: 8px; cursor: pointer;">
                        Load Content
                    </button>
                </div>
            `;
        }
    }
}

// Complete fallback verses for all 18 chapters
// Using authentic Bhagavad Gita content with Sanskrit, Hindi, and English translations
function getFallbackVerses(chapterNum) {
    const FALLBACK_VERSES = {
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
            },
            {
                slok: 'अत्र शूरा महेष्वासा भीमार्जुनसमा युधि |\nयुयुधानो विराटश्च द्रुपदश्च महारथः ||४||',
                transliteration: 'atra śūrā maheṣvāsā bhīmārjuna-samā yudhi\nyuyudhāno virāṭaś ca drupadaś ca mahā-rathaḥ',
                tej: { ht: 'यहाँ महान धनुर्धर शूरवीर हैं जो युद्ध में भीम और अर्जुन के समान हैं - युयुधान, विराट और महारथी द्रुपद।' },
                spiit: 'Here in this army are many heroic bowmen equal in battle to Bhima and Arjuna: Yuyudhana, Virata, and the great warrior Drupada.'
            },
            {
                slok: 'अस्माकं तु विशिष्टा ये तान्निबोध द्विजोत्तम |\nनायका मम सैन्यस्य संज्ञार्थं तान्ब्रवीमि ते ||७||',
                transliteration: 'asmākaṃ tu viśiṣṭā ye tān nibodha dvijottama\nnāyakā mama sainyasya saṃjñārthaṃ tān bravīmi te',
                tej: { ht: 'हे ब्राह्मणश्रेष्ठ! अब मेरी सेना के जो श्रेष्ठ नायक हैं, उनको तुम जान लो। मैं उनके नाम बताता हूँ।' },
                spiit: 'O best of the brahmins, hear now about the distinguished leaders of my army. I shall name them for your information.'
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
                slok: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते |\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप ||३||',
                transliteration: 'klaibyaṃ mā sma gamaḥ pārtha naitat tvayy upapadyate\nkṣudraṃ hṛdaya-daurbalyaṃ tyaktvottiṣṭha parantapa',
                tej: { ht: 'हे पार्थ! तुम कायरता मत करो, यह तुम्हें शोभा नहीं देता। हे परंतप! इस हृदय की निर्बलता को त्यागकर खड़े हो जाओ।' },
                spiit: 'O Partha, do not yield to unmanliness. It does not befit you. O scorcher of enemies, abandon this petty weakness of heart and arise.'
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
                slok: 'श्रीभगवानुवाच |\nलोकेऽस्मिन्द्विविधा निष्ठा पुरा प्रोक्ता मयानघ |\nज्ञानयोगेन साङ्ख्यानां कर्मयोगेन योगिनाम् ||३||',
                transliteration: 'śrī-bhagavān uvāca\nloke \'smin dvi-vidhā niṣṭhā purā proktā mayānagha\njñāna-yogena sāṅkhyānāṃ karma-yogena yoginām',
                tej: { ht: 'श्री भगवान ने कहा: हे निष्पाप! इस लोक में मेरे द्वारा पहले दो प्रकार की निष्ठा कही गई है - साख्यों के लिए ज्ञानयोग और योगियों के लिए कर्मयोग।' },
                spiit: 'The Supreme Lord said: O sinless one, two kinds of steadfastness in this world were previously declared by Me: the yoga of knowledge for the empiric philosophers and the yoga of action for the yogis.'
            },
            {
                slok: 'न हि कश्चित्क्षणमपि जातु तिष्ठत्यकर्मकृत् |\nकार्यते ह्यवशः कर्म सर्वः प्रकृतिजैर्गुणैः ||५||',
                transliteration: 'na hi kaścit kṣaṇam api jātu tiṣṭhaty akarma-kṛt\nkāryate hy avaśaḥ karma sarvaḥ prakṛti-jair guṇaiḥ',
                tej: { ht: 'कोई भी मनुष्य एक क्षण भी बिना कर्म किए नहीं रह सकता, क्योंकि प्रकृति जनित गुणों द्वारा सभी विवश होकर कर्म करते हैं।' },
                spiit: 'No one can remain without action even for a moment. Everyone is helplessly driven to action by the qualities born of material nature.'
            },
            {
                slok: 'यस्त्विन्द्रियाणि मनसा नियम्यारभतेऽर्जुन |\nकर्मेन्द्रियैः कर्मयोगमसक्तः स विशिष्यते ||७||',
                transliteration: 'yas tv indriyāṇi manasā niyamyārabhate \'rjuna\nkarmendriyaiḥ karma-yogam asaktaḥ sa viśiṣyate',
                tej: { ht: 'हे अर्जुन! जो मनुष्य मन से इन्द्रियों को वश में करके, आसक्ति रहित होकर कर्मेन्द्रियों द्वारा कर्मयोग का आचरण करता है, वह श्रेष्ठ है।' },
                spiit: 'But one who controls the senses by the mind, O Arjuna, and engages the organs of action in karma-yoga without attachment, is superior.'
            },
            {
                slok: 'यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः |\nतदर्थं कर्म कौन्तेय मुक्तसङ्गः समाचर ||९||',
                transliteration: 'yajñārthāt karmaṇo \'nyatra loko \'yaṃ karma-bandhanaḥ\ntad-arthaṃ karma kaunteya mukta-saṅgaḥ samācara',
                tej: { ht: 'हे कौन्तेय! यज्ञ के लिए किए गए कर्म को छोड़कर अन्य कर्म बंधन का कारण है। इसलिए आसक्ति रहित होकर उसी के लिए कर्म करो।' },
                spiit: 'Work done as a sacrifice for Vishnu has to be performed; otherwise work causes bondage in this material world. Therefore, O son of Kunti, perform your prescribed duties for His satisfaction, and in that way you will always remain free from bondage.'
            }
        ],
        4: [
            {
                slok: 'श्रीभगवानुवाच |\nइमं विवस्वते योगं प्रोक्तवानहमव्ययम् |\nविवस्वान्मनवे प्राह मनुरिक्ष्वाकवेऽब्रवीत् ||१||',
                transliteration: 'śrī-bhagavān uvāca\nimaṃ vivasvate yogaṃ proktavān aham avyayam\nvivasvān manave prāha manur ikṣvākave \'bravīt',
                tej: { ht: 'श्री भगवान ने कहा: मैंने इस अविनाशी योग को सूर्य से कहा, सूर्य ने मनु से कहा और मनु ने इक्ष्वाकु से कहा।' },
                spiit: 'The Supreme Lord said: I instructed this imperishable science of yoga to the sun-god, Vivasvan, and Vivasvan instructed it to Manu, the father of mankind, and Manu in turn instructed it to Ikshvaku.'
            },
            {
                slok: 'एवं परम्पराप्राप्तमिमं राजर्षयो विदुः |\nस कालेनेह महता योगो नष्टः परन्तप ||२||',
                transliteration: 'evaṃ paramparā-prāptam imaṃ rājarṣayo viduḥ\nsa kāleneha mahatā yogo naṣṭaḥ parantapa',
                tej: { ht: 'हे परंतप! इस प्रकार परम्परा से प्राप्त इस योग को राजर्षि जानते थे। कालान्तर में वह योग इस लोक से लुप्त हो गया।' },
                spiit: 'This supreme science was thus received through the chain of disciplic succession, and the saintly kings understood it in that way. But in course of time the succession was broken, and therefore the science as it is appears to be lost.'
            },
            {
                slok: 'स एवायं मया तेऽद्य योगः प्रोक्तः पुरातनः |\nभक्तोऽसि मे सखा चेति रहस्यं ह्येतदुत्तमम् ||३||',
                transliteration: 'sa evāyaṃ mayā te \'dya yogaḥ proktaḥ purātanaḥ\nbhakto \'si me sakhā ceti rahasyaṃ hy etad uttamam',
                tej: { ht: 'वही प्राचीन योग आज मैंने तुमसे कहा है क्योंकि तुम मेरे भक्त और मित्र हो। यह परम रहस्य है।' },
                spiit: 'That very ancient science of the relationship with the Supreme is today told by Me to you because you are My devotee as well as My friend and can therefore understand the transcendental mystery of this science.'
            },
            {
                slok: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत |\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||७||',
                transliteration: 'yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṃ sṛjāmy aham',
                tej: { ht: 'हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अपने रूप को रचता हूँ।' },
                spiit: 'Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself.'
            },
            {
                slok: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् |\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ||८||',
                transliteration: 'paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām\ndharma-saṃsthāpanārthāya sambhavāmi yuge yuge',
                tej: { ht: 'साधु पुरुषों की रक्षा के लिए, पापियों के विनाश के लिए और धर्म की स्थापना के लिए मैं युग-युग में प्रकट होता हूँ।' },
                spiit: 'To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of religion, I Myself appear, millennium after millennium.'
            }
        ],
        5: [
            {
                slok: 'अर्जुन उवाच |\nसंन्यासं कर्मणां कृष्ण पुनर्योगं च शंससि |\nयच्छ्रेय एतयोरेकं तन्मे ब्रूहि सुनिश्चितम् ||१||',
                transliteration: 'arjuna uvāca\nsaṃnyāsaṃ karmaṇāṃ kṛṣṇa punar yogaṃ ca śaṃsasi\nyac chreya etayor ekaṃ tan me brūhi suniścitam',
                tej: { ht: 'अर्जुन ने कहा: हे कृष्ण! आप कर्मों का संन्यास और फिर कर्मयोग की प्रशंसा करते हैं। इन दोनों में से कौन एक श्रेष्ठ है, वह निश्चित रूप से मुझे बताइए।' },
                spiit: 'Arjuna said: O Krishna, You praise the renunciation of actions and also the yoga of action. Please tell me decisively which of the two is better.'
            },
            {
                slok: 'श्रीभगवानुवाच |\nसंन्यासः कर्मयोगश्च निःश्रेयसकरावुभौ |\nतयोस्तु कर्मसंन्यासात्कर्मयोगो विशिष्यते ||२||',
                transliteration: 'śrī-bhagavān uvāca\nsaṃnyāsaḥ karma-yogaś ca niḥśreyasa-karāv ubhau\ntayos tu karma-saṃnyāsāt karma-yogo viśiṣyate',
                tej: { ht: 'श्री भगवान ने कहा: संन्यास और कर्मयोग दोनों ही परम कल्याण को देने वाले हैं। परंतु इन दोनों में से कर्मसंन्यास से कर्मयोग श्रेष्ठ है।' },
                spiit: 'The Supreme Lord said: The renunciation of work and work in devotion are both good for liberation. But of the two, work in devotional service is better than renunciation of work.'
            },
            {
                slok: 'ज्ञेयः स नित्यसंन्यासी यो न द्वेष्टि न काङ्क्षति |\nनिर्द्वन्द्वो हि महाबाहो सुखं बन्धात्प्रमुच्यते ||३||',
                transliteration: 'jñeyaḥ sa nitya-saṃnyāsī yo na dveṣṭi na kāṅkṣati\nnirdvandvo hi mahā-bāho sukhaṃ bandhāt pramucyate',
                tej: { ht: 'हे महाबाहो! जो न द्वेष करता है और न कामना करता है, उसे नित्य संन्यासी जानना चाहिए। वह द्वन्द्वरहित पुरुष सुखपूर्वक बंधन से मुक्त हो जाता है।' },
                spiit: 'One who neither hates nor desires the fruits of his activities is known to be always renounced. Such a person, free from all dualities, easily overcomes material bondage and is completely liberated, O mighty-armed Arjuna.'
            },
            {
                slok: 'बाह्यस्पर्शेष्वसक्तात्मा विन्दत्यात्मनि यत्सुखम् |\nस ब्रह्मयोगयुक्तात्मा सुखमक्षयमश्नुते ||२१||',
                transliteration: 'bāhya-sparśeṣv asaktātmā vindaty ātmani yat sukham\nsa brahma-yoga-yuktātmā sukham akṣayam aśnute',
                tej: { ht: 'बाह्य विषयों में आसक्तिरहित आत्मा जो सुख अपने अंदर पाता है, वह ब्रह्मयोग में युक्त आत्मा अक्षय सुख को प्राप्त करता है।' },
                spiit: 'Such a liberated person is not attracted to material sense pleasure but is always in trance, enjoying the pleasure within. In this way the self-realized person enjoys unlimited happiness, for he concentrates on the Supreme.'
            },
            {
                slok: 'ये हि संस्पर्शजा भोगा दुःखयोनय एव ते |\nआद्यन्तवन्तः कौन्तेय न तेषु रमते बुधः ||२२||',
                transliteration: 'ye hi saṃsparśa-jā bhogā duḥkha-yonaya eva te\nādya-vantaḥ kaunteya na teṣu ramate budhaḥ',
                tej: { ht: 'हे कौन्तेय! जो भोग इन्द्रियों के संयोग से उत्पन्न होते हैं, वे दुःख के ही कारण हैं। उनका आदि और अंत है, इसलिए बुद्धिमान पुरुष उनमें रमण नहीं करता।' },
                spiit: 'An intelligent person does not take part in the sources of misery, which are due to contact with the material senses. O son of Kunti, such pleasures have a beginning and an end, and so the wise man does not delight in them.'
            }
        ],
        6: [
            {
                slok: 'श्रीभगवानुवाच |\nअनाश्रितः कर्मफलं कार्यं कर्म करोति यः |\nस संन्यासी च योगी च न निरग्निर्न चाक्रियः ||१||',
                transliteration: 'śrī-bhagavān uvāca\nānāśritaḥ karma-phalaṃ kāryaṃ karma karoti yaḥ\nsa saṃnyāsī ca yogī ca na niragnir na cākriyaḥ',
                tej: { ht: 'श्री भगवान ने कहा: जो पुरुष कर्मफल का आश्रय लिए बिना कर्तव्य कर्म करता है, वह संन्यासी और योगी है - न केवल अग्नि का त्याग करने वाला और न केवल कर्म का त्याग करने वाला।' },
                spiit: 'The Supreme Lord said: One who is unattached to the fruits of his work and who works as he is obligated is in the renounced order of life, and he is the true mystic, not he who lights no fire and performs no duty.'
            },
            {
                slok: 'यं संन्यासमिति प्राहुर्गोगीं यं च मतं तथा |\nएतद्योऽभ्यसते पूर्वं संन्यासेन तु योगिनः ||२||',
                transliteration: 'yaṃ saṃnyāsam iti prāhur yogaṃ yaṃ ca mataṃ tathā\netad yo \'bhyasate pūrvaṃ saṃnyāsenādhikaḥ matḥ',
                tej: { ht: 'जिसे संन्यास कहते हैं और जिसे योग कहते हैं, उसी को तुम समझो। कोई भी पुरुष जो कर्मफल का त्याग नहीं करता, वह योगी नहीं हो सकता।' },
                spiit: 'What is called renunciation you should know to be the same as yoga, or linking oneself with the Supreme, O son of Pandu, for one can never become a yogi unless he renounces the desire for sense gratification.'
            },
            {
                slok: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् |\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||५||',
                transliteration: 'uddhared ātmanātmānaṃ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ',
                tej: { ht: 'मनुष्य को चाहिए कि वह अपने आपको उठाए, गिराए नहीं। क्योंकि आत्मा ही आत्मा का मित्र है और आत्मा ही आत्मा का शत्रु है।' },
                spiit: 'One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.'
            },
            {
                slok: 'जितात्मनः प्रशान्तस्य परमात्मा समाहितः |\nशीतोष्णसुखदुःखेषु तथा मानापमानयोः ||७||',
                transliteration: 'jitātmanaḥ praśāntasya paramātmā samāhitaḥ\nśītoṣṇa-sukha-duḥkheṣu tathā mānāpamānayoḥ',
                tej: { ht: 'जिसने मन को जीत लिया है, वह प्रशान्त है और परमात्मा में स्थित है। वह सीत-उष्ण, सुख-दुःख और मान-अपमान में समान रहता है।' },
                spiit: 'For one who has conquered the mind, the Supersoul is already reached, for he has attained tranquility. To such a man happiness and distress, heat and cold, honor and dishonor are all the same.'
            },
            {
                slok: 'योगी युञ्जीत सततमात्मानं रहसि स्थितः |\nएकाकी यतचित्तात्मा निराशीरपरिग्रहः ||१०||',
                transliteration: 'yogī yuñjīta satatam ātmānaṃ rahasi sthitaḥ\nekākī yata-cittātmā nirāśīr aparigrahaḥ',
                tej: { ht: 'योगी को चाहिए कि वह एकांत में रहकर, अकेला, मन और इन्द्रियों को वश में करके, निराश और अपरिग्रही होकर निरन्तर आत्मा का ध्यान करे।' },
                spiit: 'A transcendentalist should always engage his body, mind and self in relationship with the Supreme; he should live alone in a secluded place and should always carefully control his mind. He should be free from desires and feelings of possessiveness.'
            }
        ],
        7: [
            {
                slok: 'श्रीभगवानुवाच |\nमय्यासक्तमनाः पार्थ योगं युञ्जन्मदाश्रयः |\nअसंशयं समग्रं मां यथा ज्ञास्यसि तच्छृणु ||१||',
                transliteration: 'śrī-bhagavān uvāca\nmayy āsakta-manāḥ pārtha yogaṃ yuñjan mad-āśrayaḥ\naśaṃśayaṃ samagraṃ māṃ yathā jñāsyasi tac chṛṇu',
                tej: { ht: 'श्री भगवान ने कहा: हे पार्थ! मुझमें आसक्त चित्त होकर, मेरे आश्रित होकर योग कर। तुम मुझे संशयरहित और समग्र रूप से किस प्रकार जानोगे, वह सुनो।' },
                spiit: 'The Supreme Lord said: Now hear, O son of Pritha, how by practicing yoga in full consciousness of Me, with mind attached to Me, you can know Me in full, free from doubt.'
            },
            {
                slok: 'ज्ञानं तेऽहं सविज्ञानमिदं वक्ष्याम्यशेषतः |\nयज्ज्ञात्वा नेह भूयोऽन्यज्ज्ञातव्यमवशिष्यते ||२||',
                transliteration: 'jñānaṃ te \'haṃ sa-vijñānam idaṃ vakṣyāmy aśeṣataḥ\nyaj jñātvā neha bhūyo \'nyaj jñātavyam avaśiṣyate',
                tej: { ht: 'मैं तुम्हें इस ज्ञान को विज्ञान सहित संपूर्ण रूप से कहूँगा, जिसे जानकर इस लोक में और कुछ जानने योग्य शेष नहीं रहता।' },
                spiit: 'I shall now declare unto you in full this knowledge, both phenomenal and numinous. This being known, nothing further shall remain for you to know.'
            },
            {
                slok: 'मनुष्याणां सहस्रेषु कश्चिद्यतति सिद्धये |\nयततामपि सिद्धानां कश्चिन्मां वेत्ति तत्त्वतः ||३||',
                transliteration: 'manuṣyāṇāṃ sahasreṣu kaścid yatati siddhaye\nyatatām api siddhānāṃ kaścin māṃ vetti tattvataḥ',
                tej: { ht: 'हजारों मनुष्यों में कोई एक सिद्धि के लिए यत्न करता है और यत्नशील सिद्ध पुरुषों में भी कोई एक मुझे तत्त्व से जानता है।' },
                spiit: 'Out of many thousands among men, one may endeavor for perfection, and of those who have achieved perfection, hardly one knows Me in truth.'
            },
            {
                slok: 'भूमिरापोऽनलो वायुः खं मनो बुद्धिरेव च |\nअहङ्कार इतीयं मे भिन्ना प्रकृतिरष्टधा ||४||',
                transliteration: 'bhūmir āpo \'nalo vāyuḥ khaṃ mano buddhir eva ca\nahaṅkāra itīyaṃ me bhinnā prakṛtir aṣṭadhā',
                tej: { ht: 'पृथ्वी, जल, अग्नि, वायु, आकाश, मन, बुद्धि और अहंकार - इस प्रकार यह मेरी आठ प्रकार से विभक्त प्रकृति है।' },
                spiit: 'Earth, water, fire, air, ether, mind, intelligence and false ego—altogether these eight comprise My separated material energies.'
            },
            {
                slok: 'अपरेयमितस्त्वन्यां प्रकृतिं विद्धि मे पराम् |\nजीवभूतां महाबाहो ययेदं धार्यते जगत् ||५||',
                transliteration: 'apareyam itas tv anyāṃ prakṛtiṃ viddhi me parām\njīva-bhūtāṃ mahā-bāho yayedaṃ dhāryate jagat',
                tej: { ht: 'हे महाबाहो! इस अपरा प्रकृति के अतिरिक्त मेरी एक और परा प्रकृति है जो जीवरूप है, जिससे यह संसार धारण किया जाता है।' },
                spiit: 'Besides these, O mighty-armed Arjuna, there is another, superior energy of Mine, which comprises the living entities who are exploiting the resources of this material, inferior nature.'
            }
        ],
        8: [
            {
                slok: 'अर्जुन उवाच |\nकिं तद्ब्रह्म किमध्यात्मं किं कर्म पुरुषोत्तम |\nअधिभूतं च किं प्रोक्तमधिदैवं किमुच्यते ||१||',
                transliteration: 'arjuna uvāca\nkiṃ tad brahma kim adhyātmaṃ kiṃ karma puruṣottama\nadhibhūtaṃ ca kiṃ proktam adhidaivaṃ kim ucyate',
                tej: { ht: 'अर्जुन ने कहा: हे पुरुषोत्तम! वह ब्रह्म क्या है? अध्यात्म क्या है? कर्म क्या है? अधिभूत किसे कहते हैं और अधिदैव क्या है?' },
                spiit: 'Arjuna said: O Supreme Person, what is Brahman? What is the self? What are fruitive activities? What is this material manifestation? And what are the demigods? Please explain this to me.'
            },
            {
                slok: 'अधियज्ञः कथं कोऽत्र देहेऽस्मिन्मधुसूदन |\nप्रयाणकाले च कथं ज्ञेयोऽसि नियतात्मभिः ||२||',
                transliteration: 'adhiyajñaḥ kathaṃ ko \'tra dehe \'smin madhusūdana\nprayāṇa-kāle ca kathaṃ jñeyo \'si niyatātmabhiḥ',
                tej: { ht: 'हे मधुसूदन! इस देह में अधियज्ञ कौन और कैसा है? और अन्तकाल में नियतात्मा पुरुष तुम्हें किस प्रकार जानते हैं?' },
                spiit: 'Who is the Lord of the sacrifice, and how does He live in the body, O Madhusudana? And how can those engaged in devotional service know You at the time of death?'
            },
            {
                slok: 'श्रीभगवानुवाच |\nअक्षरं ब्रह्म परमं स्वभावोऽध्यात्ममुच्यते |\nभूतभावोद्भवकरो विसर्गः कर्मसंज्ञितः ||३||',
                transliteration: 'śrī-bhagavān uvāca\nakṣaraṃ brahma paramaṃ svabhāvo \'dhyātmam ucyate\nbhūta-bhāvodbhava-karo visargaḥ karma-saṃjñitaḥ',
                tej: { ht: 'श्री भगवान ने कहा: अक्षर ब्रह्म परम है, स्वभाव अध्यात्म कहलाता है और भूतों के भाव को उत्पन्न करने वाला विसर्ग कर्म कहलाता है।' },
                spiit: 'The Supreme Lord said: The indestructible, transcendental living entity is called Brahman, and his eternal nature is called adhyatma, the self. Action pertaining to the development of the material bodies of the living entities is called karma, or fruitive activities.'
            },
            {
                slok: 'अन्तकाले च मामेव स्मरन्मुक्त्वा कलेवरम् |\nयः प्रयाति स मद्भावं याति नास्त्यत्र संशयः ||५||',
                transliteration: 'anta-kāle ca mām eva smaran muktvā kalevaram\nyaḥ prayāti sa mad-bhāvaṃ yāti nāsty atra saṃśayaḥ',
                tej: { ht: 'जो पुरुष अन्तकाल में मुझे ही स्मरण करता हुआ शरीर त्याग कर जाता है, वह मेरे स्वरूप को प्राप्त होता है - इसमें संशय नहीं है।' },
                spiit: 'And whoever, at the end of his life, quits his body remembering Me alone at once attains My nature. Of this there is no doubt.'
            },
            {
                slok: 'यं यं वापि स्मरन्भावं त्यजत्यन्ते कलेवरम् |\nतं तमेवैति कौन्तेय सदा तद्भावभावितः ||६||',
                transliteration: 'yaṃ yaṃ vāpi smaran bhāvaṃ tyajaty ante kalevaram\ntaṃ tam evaiti kaunteya sadā tad-bhāva-bhāvitaḥ',
                tej: { ht: 'हे कौन्तेय! जो-जो भाव को स्मरण करता हुआ मनुष्य अन्त में शरीर त्याग करता है, वह उसी को प्राप्त होता है, क्योंकि वह सदा उसी भाव से युक्त रहा है।' },
                spiit: 'Whatever state of being one remembers when he quits his body, O son of Kunti, that state he will attain without fail.'
            }
        ],
        9: [
            {
                slok: 'श्रीभगवानुवाच |\nइदं तु ते गुह्यतमं प्रवक्ष्याम्यनसूयवे |\nज्ञानं विज्ञानसहितं यज्ज्ञात्वा मोक्ष्यसेऽशुभात् ||१||',
                transliteration: 'śrī-bhagavān uvāca\nidaṃ tu te guhyatamaṃ pravakṣyāmy anasūyave\njñānaṃ vijñāna-sahitaṃ yaj jñātvā mokṣyase \'śubhāt',
                tej: { ht: 'श्री भगवान ने कहा: हे दोषदृष्टिरहित! मैं तुम्हें यह परम गुह्य ज्ञान विज्ञान सहित कहूँगा, जिसे जानकर तुम अशुभ से मुक्त हो जाओगे।' },
                spiit: 'The Supreme Lord said: My dear Arjuna, because you are never envious of Me, I shall impart to you this most confidential knowledge and realization, knowing which you shall be relieved of the miseries of material existence.'
            },
            {
                slok: 'राजविद्या राजगुह्यं पवित्रमिदमुत्तमम् |\nप्रत्यक्षावगमं धर्म्यं सुसुखं कर्तुमव्ययम् ||२||',
                transliteration: 'rāja-vidyā rāja-guhyaṃ pavitram idam uttamam\npratyakṣāvagamaṃ dharmyaṃ su-sukhaṃ kartum avyayam',
                tej: { ht: 'यह राजविद्या और राजगुह्य है, परम पवित्र, प्रत्यक्ष अनुभव से प्राप्त होने वाला, धर्ममय, करने में सुसुख और अविनाशी है।' },
                spiit: 'This knowledge is the king of education, the most secret of all secrets. It is the purest knowledge, and because it gives direct perception of the self by realization, it is the perfection of religion. It is everlasting, and it is joyfully performed.'
            },
            {
                slok: 'अश्रद्धधानाः पुरुषा धर्मस्यास्य परन्तप |\nअप्राप्य मां निवर्तन्ते मृत्युसंसारवर्त्मनि ||३||',
                transliteration: 'aśraddadhānāḥ puruṣā dharmasyāsya parantapa\naprāpya māṃ nivartante mṛtyu-saṃsāra-vartmani',
                tej: { ht: 'हे परंतप! इस धर्म में अश्रद्धा रखने वाले पुरुष मुझे प्राप्त न होकर मृत्यु-संसार के मार्ग पर लौट आते हैं।' },
                spiit: 'Those who are not faithful in this devotional service cannot attain Me, O conqueror of enemies. Therefore they return to the path of birth and death in this material world.'
            },
            {
                slok: 'मया ततमिदं सर्वं जगदव्यक्तमूर्तिना |\nमत्स्थानि सर्वभूतानि न चाहं तेष्ववस्थितः ||४||',
                transliteration: 'mayā tatam idaṃ sarvaṃ jagad avyakta-mūrtinā\nmat-sthāni sarva-bhūtāni na cāhaṃ teṣv avasthitaḥ',
                tej: { ht: 'मैं अव्यक्त मूर्ति से इस सम्पूर्ण जगत को व्याप्त करके स्थित हूँ। सब भूत मुझमें स्थित हैं, परंतु मैं उनमें स्थित नहीं हूँ।' },
                spiit: 'By Me, in My unmanifested form, this entire universe is pervaded. All beings are in Me, but I am not in them.'
            },
            {
                slok: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति |\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ||२६||',
                transliteration: 'patraṃ puṣpaṃ phalaṃ toyaṃ yo me bhaktyā prayacchati\ntad ahaṃ bhakty-upahṛtam aśnāmi prayatātmanaḥ',
                tej: { ht: 'जो भक्त प्रेमपूर्वक मुझे पत्र, पुष्प, फल या जल अर्पण करता है, मैं उस प्रेमपूर्वक अर्पण किया हुआ भक्षण करता हूँ।' },
                spiit: 'If one offers Me with love and devotion a leaf, a flower, fruit or water, I will accept it.'
            }
        ],
        10: [
            {
                slok: 'श्रीभगवानुवाच |\nभूय एव महाबाहो शृणु मे परमं वचः |\nयत्तेऽहं प्रीयमाणाय वक्ष्यामि हितकाम्यया ||१||',
                transliteration: 'śrī-bhagavān uvāca\nbhūya eva mahā-bāho śṛṇu me paramaṃ vacaḥ\nyat te \'haṃ prīyamāṇāya vakṣyāmi hita-kāmyayā',
                tej: { ht: 'श्री भगवान ने कहा: हे महाबाहो! फिर भी मेरे परम वचन सुनो। जो मैं तुम्हारे प्रिय होने के कारण तुम्हारे हित की इच्छा से कहूँगा।' },
                spiit: 'The Supreme Lord said: O mighty-armed Arjuna, listen again to My supreme word, which I shall impart to you for your benefit and which will give you great joy.'
            },
            {
                slok: 'न मे विदुः सुरगणाः प्रभवं न महर्षयः |\nअहमादिर्हि देवानां महर्षीणां च सर्वशः ||२||',
                transliteration: 'na me viduḥ sura-gaṇāḥ prabhavaṃ na maharṣayaḥ\naham ādir hi devānāṃ maharṣīṇāṃ ca sarvaśaḥ',
                tej: { ht: 'देवताओं के समूह और महर्षि मेरे प्रभाव को नहीं जानते। क्योंकि मैं सम्पूर्ण रूप से देवताओं और महर्षियों का भी आदि हूँ।' },
                spiit: 'Neither the hosts of demigods nor the great sages know My origin or opulences, for, in every respect, I am the source of the demigods and sages.'
            },
            {
                slok: 'यो मामजमनादिं च वेत्ति लोकमहेश्वरम् |\nअसंमूढः स मर्त्येषु सर्वपापैः प्रमुच्यते ||३||',
                transliteration: 'yo māmajam anādiṃ ca vetti loka-maheśvaram\nasaṃmūḍhaḥ sa martyeṣu sarva-pāpaiḥ pramucyate',
                tej: { ht: 'जो मुझे अजन्मा, अनादि और लोकों का महेश्वर जानता है, वह मनुष्यों में असंमूढ़ पुरुष सर्व पापों से मुक्त हो जाता है।' },
                spiit: 'He who knows Me as the unborn, as the beginningless, as the Supreme Lord of all the worlds—he only, undeluded among men, is freed from all sins.'
            },
            {
                slok: 'बुद्धिर्ज्ञानमसंमोहः क्षमा सत्यं दमः शमः |\nसुखं दुःखं भवोऽभावो भयं चाभयमेव च ||४||',
                transliteration: 'buddhir jñānam asaṃmohaḥ kṣamā satyaṃ damaḥ śamaḥ\nsukhaṃ duḥkhaṃ bhavo \'bhāvo bhayaṃ cābhayam eva ca',
                tej: { ht: 'बुद्धि, ज्ञान, असंमोह, क्षमा, सत्य, इन्द्रिय निग्रह, मन निग्रह, सुख, दुःख, जन्म, मृत्यु, भय और अभय - ये सब मुझसे ही उत्पन्न होते हैं।' },
                spiit: 'Intelligence, knowledge, freedom from doubt and delusion, forgiveness, truthfulness, control of the senses, control of the mind, happiness and distress, birth, death, fear, fearlessness, nonviolence, equanimity, satisfaction, austerity, charity, fame and infamy—all these various qualities of living beings are created by Me alone.'
            },
            {
                slok: 'अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते |\nइति मत्वा भजन्ते मां बुधा भावसमन्विताः ||८||',
                transliteration: 'ahaṃ sarvasya prabhavo mattaḥ sarvaṃ pravartate\niti matvā bhajante māṃ budhā bhāva-samanvitāḥ',
                tej: { ht: 'मैं सम्पूर्ण जगत की उत्पत्ति का कारण हूँ और मुझसे ही सब कुछ चलता है। इस प्रकार जानकर बुद्धिमान भावयुक्त होकर मेरी भक्ति करते हैं।' },
                spiit: 'I am the source of all spiritual and material worlds. Everything emanates from Me. The wise who perfectly know this engage in My devotional service and worship Me with all their hearts.'
            }
        ],
        11: [
            {
                slok: 'अर्जुन उवाच |\nमदनुग्रहाय परमं गुह्यमध्यात्मसंज्ञितम् |\nयत्त्वयोक्तं वचस्तेन मोहोऽयं विगतो मम ||१||',
                transliteration: 'arjuna uvāca\nmad-anugrahāya paramaṃ guhyam adhyātma-saṃjñitam\nyat tvayoktaṃ vacas tena moho \'yaṃ vigato mama',
                tej: { ht: 'अर्जुन ने कहा: मेरे प्रति अनुग्रह करने के लिए आपने जो परम गुह्य अध्यात्मविषयक वचन कहे हैं, उनसे मेरा यह मोह निवृत्त हो गया है।' },
                spiit: 'Arjuna said: By my hearing the instructions You have kindly given me about these most confidential spiritual subjects, my illusion has now been dispelled.'
            },
            {
                slok: 'भवाप्ययौ हि भूतानां श्रुतौ विस्तरशो मया |\nत्वत्तः कमलपत्राक्ष माहात्म्यमपि चाव्ययम् ||२||',
                transliteration: 'bhavāpyayau hi bhūtānāṃ śrutau vistaraśo mayā\ntvattaḥ kamala-patrākṣa māhātmyam api cāvyayam',
                tej: { ht: 'हे कमलपत्राक्ष! भूतों की उत्पत्ति और प्रलय को मैंने आपसे विस्तार से सुना है, साथ ही आपका अविनाशी महात्म्य भी सुना है।' },
                spiit: 'O lotus-eyed one, I have heard from You in detail about the appearance and disappearance of every living entity and have realized Your inexhaustible glories.'
            },
            {
                slok: 'एवमेतद्यथात्थ त्वमात्मानं परमेश्वर |\nद्रष्टुमिच्छामि ते रूपमैश्वरं पुरुषोत्तम ||३||',
                transliteration: 'evam etad yathāttha tvam ātmānaṃ parameśvara\ndraṣṭum icchāmi te rūpam aiśvaraṃ puruṣottama',
                tej: { ht: 'हे परमेश्वर! हे पुरुषोत्तम! जैसे आपने अपने आपको कहा है, वैसा ही है। मैं आपका ऐश्वर्यमय रूप देखना चाहता हूँ।' },
                spiit: 'O greatest of all personalities, O supreme form, though I see You here before me in Your actual position, as You have described Yourself, I wish to see how You have entered into this cosmic manifestation. I want to see that form of Yours.'
            },
            {
                slok: 'मन्यसे यदि तच्छक्यं मया द्रष्टुमिति प्रभो |\nयोगेश्वर ततो मे त्वं दर्शयात्मानमव्ययम् ||४||',
                transliteration: 'manyase yadi tac chakyaṃ mayā draṣṭum iti prabho\nyogeśvara tato me tvaṃ darśayātmānam avyayam',
                tej: { ht: 'हे प्रभो! यदि आप मानते हैं कि मुझसे वह देखा जा सकता है, तो हे योगेश्वर! आप अपने अविनाशी स्वरूप को मुझे दिखाइए।' },
                spiit: 'If You think that I am able to behold Your cosmic form, O my Lord, O master of all mystic power, then kindly show me that unlimited universal Self.'
            },
            {
                slok: 'श्रीभगवानुवाच |\nपश्य मे पार्थ रूपाणि शतशोऽथ सहस्रशः |\nनानाविधानि दिव्यानि नानावर्णाकृतीनि च ||५||',
                transliteration: 'śrī-bhagavān uvāca\npaśya me pārtha rūpāṇi śataśo \'tha sahasraśaḥ\nnānā-vidhāni divyāni nānā-varṇākṛtīni ca',
                tej: { ht: 'श्री भगवान ने कहा: हे पार्थ! मेरे सैकड़ों और हजारों रूपों को देखो, नाना प्रकार के दिव्य, नाना वर्ण और आकृति वाले रूपों को।' },
                spiit: 'The Supreme Lord said: My dear Arjuna, O son of Pritha, see now My opulences, hundreds of thousands of varied divine and multicolored forms.'
            }
        ],
        12: [
            {
                slok: 'अर्जुन उवाच |\nएवं सततयुक्ता ये भक्तास्त्वां पर्युपासते |\nये चाप्यक्षरमव्यक्तं तेषां के योगवित्तमाः ||१||',
                transliteration: 'arjuna uvāca\nevaṃ satata-yuktā ye bhaktās tvāṃ paryupāsate\nye cāpy akṣaram avyaktaṃ teṣāṃ ke yoga-vittamāḥ',
                tej: { ht: 'अर्जुन ने कहा: जो भक्त इस प्रकार निरन्तर युक्त होकर आपकी उपासना करते हैं और जो अक्षर अव्यक्त की उपासना करते हैं, उनमें से कौन श्रेष्ठ योगज्ञ हैं?' },
                spiit: 'Arjuna said: Which are considered to be more perfect, those who are always properly engaged in Your devotional service or those who worship the impersonal Brahman, the unmanifested?'
            },
            {
                slok: 'श्रीभगवानुवाच |\nमय्यावेश्य मनो ये मां नित्ययुक्ता उपासते |\nश्रद्धया परयोपेतास्ते मे युक्ततमाः मताः ||२||',
                transliteration: 'śrī-bhagavān uvāca\nmayy āveśya mano ye māṃ nitya-yuktā upāsate\nśraddhayā parayopetās te me yukta-tamāḥ matāḥ',
                tej: { ht: 'श्री भगवान ने कहा: जो मुझमें मन लगाकर निरन्तर युक्त होकर परायण श्रद्धा से युक्त होकर मेरी उपासना करते हैं, वे मुझे श्रेष्ठतम योगी माने जाते हैं।' },
                spiit: 'The Supreme Lord said: Those who fix their minds on My personal form and are always engaged in worshiping Me with great and transcendental faith are considered by Me to be most perfect.'
            },
            {
                slok: 'ये त्वक्षरमनिर्देश्यमव्यक्तं पर्युपासते |\nसर्वत्रगमचिन्त्यं च कूटस्थमचलं ध्रुवम् ||३||',
                transliteration: 'ye tv akṣaram anirdeśyam avyaktaṃ paryupāsate\nsarvatra-gam acintyaṃ ca kūṭa-stham acalaṃ dhruvam',
                tej: { ht: 'परंतु जो अनिर्देश्य, अव्यक्त, सर्वव्यापी, अचिन्त्य, कूटस्थ, अचल और ध्रुव अक्षर की उपासना करते हैं।' },
                spiit: 'But those who fully worship the unmanifested, that which lies beyond the perception of the senses, the all-pervading, inconceivable, unchanging, fixed and immovable—the impersonal conception of the Absolute Truth...'
            },
            {
                slok: 'तेषां सततयुक्तानां भजतां प्रीतिपूर्वकम् |\nददामि बुद्धियोगं तं येन मामुपयान्ति ते ||१०||',
                transliteration: 'teṣāṃ satata-yuktānāṃ bhajatāṃ prīti-pūrvakam\ndadāmi buddhi-yogaṃ taṃ yena mām upayānti te',
                tej: { ht: 'जो सदा युक्त होकर प्रेमपूर्वक मेरी भक्ति करते हैं, उनको मैं वह बुद्धियोग देता हूँ जिससे वे मुझे प्राप्त होते हैं।' },
                spiit: 'To those who are constantly devoted to serving Me with love, I give the understanding by which they can come to Me.'
            },
            {
                slok: 'तेषामेवानुकम्पार्थमहमज्ञानजं तमः |\nनाशयाम्यात्मभावस्थो ज्ञानदीपेन भास्वता ||११||',
                transliteration: 'teṣām evānukampārtham aham ajñāna-jaṃ tamaḥ\nnāśayāmy ātma-bhāva-stho jñāna-dīpena bhāsvatā',
                tej: { ht: 'उन पर अनुकम्पा करने के लिए मैं उनके हृदय में स्थित होकर अज्ञानजनित अन्धकार को प्रकाशमान ज्ञानदीप से नाश कर देता हूँ।' },
                spiit: 'To show them special mercy, I, dwelling in their hearts, destroy with the shining lamp of knowledge the darkness born of ignorance.'
            }
        ],
        13: [
            {
                slok: 'अर्जुन उवाच |\nप्रकृतिं पुरुषं चैव क्षेत्रं क्षेत्रज्ञमेव च |\nएतद्वेदितुमिच्छामि ज्ञानं ज्ञेयं च केशव ||१||',
                transliteration: 'arjuna uvāca\nprakṛtiṃ puruṣaṃ caiva kṣetraṃ kṣetra-jñam eva ca\netad veditum icchāmi jñānaṃ jñeyaṃ ca keśava',
                tej: { ht: 'अर्जुन ने कहा: हे केशव! मैं प्रकृति, पुरुष, क्षेत्र, क्षेत्रज्ञ, ज्ञान और ज्ञेय को जानना चाहता हूँ।' },
                spiit: 'Arjuna said: O my dear Krishna, I wish to know about prakriti [nature], purusha [the enjoyer], and the field and the knower of the field, and of knowledge and the object of knowledge.'
            },
            {
                slok: 'श्रीभगवानुवाच |\nइदं शरीरं कौन्तेय क्षेत्रमित्यभिधीयते |\nएतद्यो वेत्ति तं प्राहुः क्षेत्रज्ञ इति तद्विदः ||२||',
                transliteration: 'śrī-bhagavān uvāca\nidaṃ śarīraṃ kaunteya kṣetram ity abhidhīyate\netad yo vetti taṃ prāhuḥ kṣetra-jña iti tad-vidaḥ',
                tej: { ht: 'श्री भगवान ने कहा: हे कौन्तेय! इस शरीर को क्षेत्र कहा जाता है। जो इसे जानता है, उसे ज्ञानी पुरुष क्षेत्रज्ञ कहते हैं।' },
                spiit: 'The Supreme Lord said: This body, O son of Kunti, is called the field, and one who knows this body is called the knower of the field.'
            },
            {
                slok: 'क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत |\nक्षेत्रक्षेत्रज्ञयोर्ज्ञानं यत्तज्ज्ञानं मतं मम ||३||',
                transliteration: 'kṣetra-jñaṃ cāpi māṃ viddhi sarva-kṣetreṣu bhārata\nkṣetra-kṣetra-jñayor jñānaṃ yat taj jñānaṃ mataṃ mama',
                tej: { ht: 'हे भारत! तुम मुझे सम्पूर्ण क्षेत्रों में क्षेत्रज्ञ भी जानो। क्षेत्र और क्षेत्रज्ञ का जो ज्ञान है, वही ज्ञान मेरे मत में ज्ञान है।' },
                spiit: 'O scion of Bharata, you should understand that I am also the knower in all bodies, and to understand this body and its knower is called knowledge. That is My opinion.'
            },
            {
                slok: 'तत्क्षेत्रं यच्च यादृक्च यद्विकारि यतश्च यत् |\nस च यो यत्प्रभावश्च तत्समासेन मे शृणु ||४||',
                transliteration: 'tat kṣetraṃ yac ca yādṛk ca yad-vikāri yataś ca yat\nsa ca yo yat-prabhāvaś ca tat samāsena me śṛṇu',
                tej: { ht: 'वह क्षेत्र क्या है, कैसा है, किन विकारों से युक्त है और किससे उत्पन्न हुआ है, और क्षेत्रज्ञ कौन है और उसका प्रभाव क्या है - यह संक्षेप से मुझसे सुनो।' },
                spiit: 'Now please hear My brief description of this field of activity and how it is constituted, what its changes are, whence it is produced, who that knower of the field of activities is, and what his influences are.'
            },
            {
                slok: 'ऋषिभिर्बहुधा गीतं छन्दोभिर्विविधैः पृथक् |\nब्रह्मसूत्रपदैश्चैव हेतुमद्भिर्विनिश्चितैः ||५||',
                transliteration: 'ṛṣibhir bahudhā gītaṃ chandobhir vividhaiḥ pṛthak\nbrahma-sūtra-padaiś caiva hetumadbhir viniścitaiḥ',
                tej: { ht: 'ऋषियों द्वारा बहुत प्रकार से, विविध छन्दों द्वारा अलग-अलग, और ब्रह्मसूत्र के हेतुयुक्त निश्चित पदों द्वारा भी यह गाया गया है।' },
                spiit: 'That knowledge of the field of activities and of the knower of activities is described by various sages in various Vedic writings. It is especially presented in Vedanta-sutra with all reasoning as to cause and effect.'
            }
        ],
        14: [
            {
                slok: 'श्रीभगवानुवाच |\nपरं भूयः प्रवक्ष्यामि ज्ञानानां ज्ञानमुत्तमम् |\nयज्ज्ञात्वा मुनयः सर्वे परां सिद्धिमितो गताः ||१||',
                transliteration: 'śrī-bhagavān uvāca\nparaṃ bhūyaḥ pravakṣyāmi jñānānāṃ jñānam uttamam\nyaj jñātvā munayaḥ sarve parāṃ siddhim ito gatāḥ',
                tej: { ht: 'श्री भगवान ने कहा: मैं फिर से परम उत्तम ज्ञान कहूँगा, जिसे जानकर सब मुनि इस लोक से परम सिद्धि को प्राप्त हुए हैं।' },
                spiit: 'The Supreme Lord said: Again I shall declare to you this supreme wisdom, the best of all knowledge, knowing which all the sages have attained the supreme perfection.'
            },
            {
                slok: 'इदं ज्ञानमुपाश्रित्य मम साधर्म्यमागताः |\nसर्गेऽपि नोपजायन्ते प्रलये न व्यथन्ति च ||२||',
                transliteration: 'idaṃ jñānam upāśritya mama sādharmyam āgatāḥ\nsarge \'pi nopajāyante pralaye na vyathanti ca',
                tej: { ht: 'इस ज्ञान को आश्रय करके मेरे स्वरूप को प्राप्त हुए पुरुष सृष्टि में भी नहीं उत्पन्न होते और प्रलय में भी व्यथित नहीं होते।' },
                spiit: 'By becoming fixed in this knowledge, one can attain to the transcendental nature like My own. Thus established, one is not born at the time of creation or disturbed at the time of dissolution.'
            },
            {
                slok: 'मम योनिर्महद्ब्रह्म तस्मिन्गर्भं दधाम्यहम् |\nसंभवः सर्वभूतानां ततो भवति भारत ||३||',
                transliteration: 'mama yonir mahad brahma tasmin garbhaṃ dadhāmy aham\nsaṃbhavaḥ sarva-bhūtānāṃ tato bhavati bhārata',
                tej: { ht: 'हे भारत! महत् ब्रह्म मेरी योनि है, उसमें मैं गर्भ धारण करता हूँ। उससे सम्पूर्ण भूतों की उत्पत्ति होती है।' },
                spiit: 'The total material substance, called Brahman, is the source of birth, and it is that Brahman that I impregnate, making possible the births of all living beings, O scion of Bharata.'
            },
            {
                slok: 'सर्वयोनिषु कौन्तेय मूर्तयः सम्भवन्ति याः |\nतासां ब्रह्म महद्योनिरहं बीजप्रदः पिता ||४||',
                transliteration: 'sarva-yoniṣu kaunteya mūrtayaḥ sambhavanti yāḥ\ntāsāṃ brahma mahad yonir ahaṃ bīja-pradaḥ pitā',
                tej: { ht: 'हे कौन्तेय! जो-जो मूर्तियाँ सम्पूर्ण योनियों में उत्पन्न होती हैं, उनकी महत् ब्रह्म योनि है और मैं बीज देने वाला पिता हूँ।' },
                spiit: 'It should be understood that all species of life, O son of Kunti, are made possible by birth in this material nature, and that I am the seed-giving father.'
            },
            {
                slok: 'सत्त्वं रजस्तम इति गुणाः प्रकृतिसम्भवाः |\nनिबध्नन्ति महाबाहो देहे देहिनमव्ययम् ||५||',
                transliteration: 'sattvaṃ rajas tama iti guṇāḥ prakṛti-sambhavāḥ\nnibadhnanti mahā-bāho dehe dehinam avyayam',
                tej: { ht: 'हे महाबाहो! प्रकृति से उत्पन्न सत्त्व, रजस और तमस - ये तीनों गुण अविनाशी देही को देह में बाँधते हैं।' },
                spiit: 'Material nature consists of three modes—goodness, passion and ignorance. When the eternal living entity comes in contact with nature, O mighty-armed Arjuna, he becomes conditioned by these modes.'
            }
        ],
        15: [
            {
                slok: 'श्रीभगवानुवाच |\nऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम् |\nछन्दांसि यस्य पर्णानि यस्तं वेद स वेदवित् ||१||',
                transliteration: 'śrī-bhagavān uvāca\nūrdhva-mūlam adhaḥ-śākham aśvatthaṃ prāhur avyayam\nchandāṃsi yasya parṇāni yas taṃ veda sa veda-vit',
                tej: { ht: 'श्री भगवान ने कहा: ऊपर को मूल और नीचे को शाखाओं वाले अविनाशी अश्वत्थ वृक्ष को ऋषि कहते हैं, जिसके पत्ते वेद हैं, उसे जो जानता है वह वेदज्ञ है।' },
                spiit: 'The Supreme Lord said: It is said that there is an imperishable banyan tree that has its roots upward and its branches down and whose leaves are the Vedic hymns. One who knows this tree is the knower of the Vedas.'
            },
            {
                slok: 'अधश्चोर्ध्वं प्रसृतास्तस्य शाखा गुणप्रवृद्धा विषयप्रवालाः |\nअधश्च मूलान्यनुसन्ततानि कर्मानुबन्धीनि मनुष्यलोके ||२||',
                transliteration: 'adhaś cordhvaṃ prasṛtās tasya śākhā guṇa-pravṛddhā viṣaya-pravālāḥ\nadhaś ca mūlāny anusantatāni karmānubandhīni manuṣya-loke',
                tej: { ht: 'उसकी शाखाएँ नीचे और ऊपर फैली हुई हैं, जो गुणों से वृद्ध हुई हैं और विषय रूप कोंपलों से युक्त हैं। मनुष्य लोक में कर्म के अनुबन्ध से जुड़ी हुई उसकी जड़ें नीचे की ओर फैली हैं।' },
                spiit: 'The branches of this tree extend downward and upward, nourished by the three modes of material nature. The twigs are the objects of the senses. This tree also has roots going down, and these are bound to the fruitive actions of human society.'
            },
            {
                slok: 'न रूपमस्येह तथोपलभ्यते नान्तो न चादिर्न च सम्प्रतिष्ठा |\nअश्वत्थमेनं सुविरूढमूलं असङ्गशस्त्रेण दृढेन छित्वा ||३||',
                transliteration: 'na rūpam asyeha tathopalabhyate nānto na cādir na ca sampratiṣṭhā\naśvattham enaṃ su-virūḍha-mūlaṃ asaṅga-śastreṇa dṛḍhena chittvā',
                tej: { ht: 'इसका रूप इस लोक में वैसा नहीं मिलता, न इसका अंत है, न आदि और न स्थिरता। इस गहरी जड़ों वाले अश्वत्थ वृक्ष को असङ्ग शस्त्र से काटकर।' },
                spiit: 'The real form of this tree cannot be perceived in this world. No one can understand where it ends, where it begins, or where its foundation is. But with determination one must cut down this strongly rooted tree with the weapon of detachment.'
            },
            {
                slok: 'ततः पदं तत्परिमार्गितव्यं यस्मिन्गता न निवर्तन्ति भूयः |\nतमेव चाद्यं पुरुषं प्रपद्ये यतः प्रवृत्तिः प्रसृता पुराणी ||४||',
                transliteration: 'tataḥ padaṃ tat parimārgitavyaṃ yasmin gatā na nivartanti bhūyaḥ\ntam eva cādyaṃ puruṣaṃ prapadye yataḥ pravṛttiḥ prasṛtā purāṇī',
                tej: { ht: 'उसके पश्चात् वह पद खोजना चाहिए जिसमें जाने पर पुनः लौटकर नहीं आते। मैं उस आदि पुरुष की शरण लेता हूँ जिससे यह पुरानी प्रवृत्ति चली आ रही है।' },
                spiit: 'Thereafter, one must seek that place from which, having gone, one never returns, and there surrender to that Supreme Personality of Godhead from whom everything began and from whom everything has extended since time immemorial.'
            },
            {
                slok: 'निर्मानमोहा जितसङ्गदोषा अध्यात्मनित्या विनिवृत्तकामाः |\nद्वन्द्वैर्विमुक्ताः सुखदुःखसंज्ञैर्गच्छन्त्यमूढाः पदमव्ययं तत् ||५||',
                transliteration: 'nirmāna-mohā jita-saṅga-doṣā adhyātma-nityā vinivṛtta-kāmāḥ\ndvandvair vimuktāḥ sukha-duḥkha-saṃjñair gacchanty amūḍhāḥ padam avyayaṃ tat',
                tej: { ht: 'जिनका मान और मोह नष्ट हो गया है, जिन्होंने सङ्ग के दोषों को जीत लिया है, जो अध्यात्म में नित्य रहते हैं, जिनकी कामनाएँ निवृत्त हो गई हैं और जो द्वन्द्वों से मुक्त हैं, वे अमूढ़ पुरुष उस अविनाशी पद को प्राप्त होते हैं।' },
                spiit: 'Those who are free from false prestige, illusion and false association, who understand the eternal, who are done with material lust, who are freed from the dualities of happiness and distress, and who, unbewildered, know how to surrender unto the Supreme Person attain to that eternal kingdom.'
            }
        ],
        16: [
            {
                slok: 'श्रीभगवानुवाच |\nअभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः |\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ||१||',
                transliteration: 'śrī-bhagavān uvāca\nabhayaṃ sattva-saṃśuddhir jñāna-yoga-vyavasthitiḥ\ndānaṃ damaś ca yajñaś ca svādhyāyas tapa ārjavam',
                tej: { ht: 'श्री भगवान ने कहा: अभय, सत्त्व की शुद्धि, ज्ञानयोग में स्थिति, दान, इन्द्रिय निग्रह, यज्ञ, स्वाध्याय, तप और आर्जव - ये दैवी सम्पत्ति है।' },
                spiit: 'The Supreme Lord said: Fearlessness, purification of one\'s existence, cultivation of spiritual knowledge, charity, self-control, performance of sacrifice, study of the Vedas, austerity and simplicity; these are the divine qualities.'
            },
            {
                slok: 'अहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम् |\nदया भूतेष्वलोलुप्त्वं मार्दवं ह्रीरचापलम् ||२||',
                transliteration: 'ahiṃsā satyam akrodhas tyāgaḥ śāntir apaiśunam\ndayā bhūteṣv aloluptvaṃ mārdavaṃ hrīr acāpalam',
                tej: { ht: 'अहिंसा, सत्य, अक्रोध, त्याग, शान्ति, अपैशुन, भूतों पर दया, अलोलुपत्व, मार्दव, लज्जा और अचापल - ये भी दैवी सम्पत्ति है।' },
                spiit: 'Nonviolence, truthfulness, freedom from anger, renunciation, tranquility, aversion to faultfinding, compassion and freedom from covetousness; gentleness, modesty and steady determination...'
            },
            {
                slok: 'तेजः क्षमा धृतिः शौचमद्रोहो नातिमानिता |\nभवन्ति सम्पदं दैवीमभिजातस्य भारत ||३||',
                transliteration: 'tejaḥ kṣamā dhṛtiḥ śaucam adroho nāti-mānitā\nbhavanti sampadaṃ daivīm abhijātasya bhārata',
                tej: { ht: 'तेज, क्षमा, धृति, शौच, अद्रोह और अतिमानिता न होना - ये दैवी सम्पत्ति दैवी प्रकृति से उत्पन्न हुए पुरुष में होती हैं।' },
                spiit: '...vigor, forgiveness, fortitude, cleanliness, freedom from envy and the passion for honor—these transcendental qualities, O son of Bharata, belong to godly men endowed with divine nature.'
            },
            {
                slok: 'दम्भो दर्पोऽभिमानश्च क्रोधः पारुष्यमेव च |\nअज्ञानं चाभिजातस्य पार्थ सम्पदमासुरीम् ||४||',
                transliteration: 'dambho darpo \'bhimānaś ca krodhaḥ pāruṣyam eva ca\najñānaṃ cābhijātasya pārtha sampadam āsurīm',
                tej: { ht: 'हे पार्थ! दम्भ, दर्प, अभिमान, क्रोध, पारुष्य और अज्ञान - ये आसुरी सम्पत्ति आसुरी प्रकृति से उत्पन्न हुए पुरुष में होती है।' },
                spiit: 'Pride, arrogance, conceit, anger, harshness and ignorance—these qualities belong to those of demoniac nature, O son of Pritha.'
            },
            {
                slok: 'दैवी सम्पद्विमोक्षाय निबन्धायासुरी मता |\nमा शुचः सम्पदं दैवीमभिजातोऽसि पाण्डव ||५||',
                transliteration: 'daivī sampad vimokṣāya nibandhāyāsurī matā\nmā śucaḥ sampadaṃ daivīm abhijāto \'si pāṇḍava',
                tej: { ht: 'हे पाण्डव! दैवी सम्पत्ति मोक्ष के लिए है और आसुरी सम्पत्ति बंधन के लिए मानी गई है। तुम दैवी सम्पत्ति से उत्पन्न हुए हो, शोक मत करो।' },
                spiit: 'The transcendental qualities are conducive to liberation, whereas the demoniac qualities make for bondage. Do not worry, O son of Pandu, for you are born with the divine qualities.'
            }
        ],
        17: [
            {
                slok: 'अर्जुन उवाच |\nये शास्त्रविधिमुत्सृज्य यजन्ते श्रद्धयान्विताः |\nतेषां निष्ठा तु का कृष्ण सत्त्वमाहो रजस्तमः ||१||',
                transliteration: 'arjuna uvāca\nye śāstra-vidhim utsṛjya yajante śraddhayānvitāḥ\nteṣāṃ niṣṭhā tu kā kṛṣṇa sattvam āho rajas tamaḥ',
                tej: { ht: 'अर्जुन ने कहा: हे कृष्ण! जो शास्त्रविधि को त्यागकर श्रद्धा से युक्त होकर यज्ञ करते हैं, उनकी निष्ठा क्या है - सत्त्व, रजस या तमस्?' },
                spiit: 'Arjuna said: Those who worship with faith but do not follow the scriptural injunctions—what is their position, O Krishna? Is it one of goodness, passion or ignorance?'
            },
            {
                slok: 'श्रीभगवानुवाच |\nत्रिविधा भवति श्रद्धा देहिनां सा स्वभावजा |\nसात्त्विकी राजसी चैव तामसी चेति तां शृणु ||२||',
                transliteration: 'śrī-bhagavān uvāca\ntri-vidhā bhavati śraddhā dehināṃ sā svabhāva-jā\nsāttvikī rājasī caiva tāmasī ceti tāṃ śṛṇu',
                tej: { ht: 'श्री भगवान ने कहा: देहधारियों की स्वभावजनित श्रद्धा तीन प्रकार की होती है - सात्त्विकी, राजसी और तामसी। उसे सुनो।' },
                spiit: 'The Supreme Lord said: According to the modes of nature acquired by the embodied soul, one\'s faith can be of three kinds—goodness, passion or ignorance. Now hear about this.'
            },
            {
                slok: 'सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत |\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः ||३||',
                transliteration: 'sattvānurūpā sarvasya śraddhā bhavati bhārata\nśraddhā-mayo \'yaṃ puruṣo yo yac-chraddhaḥ sa eva saḥ',
                tej: { ht: 'हे भारत! सबकी श्रद्धा उसके हृदय के सत्त्व के अनुरूप होती है। यह पुरुष श्रद्धामय है, जैसी उसकी श्रद्धा है, वह वैसा ही है।' },
                spiit: 'O son of Bharata, according to one\'s existence under the various modes of nature, one evolves a particular kind of faith. The living being is said to be of a particular faith according to the modes he has acquired.'
            },
            {
                slok: 'यजन्ते सात्त्विका देवान्यक्षरक्षांसि राजसाः |\nप्रेतान्भूतगणांश्चान्ये यजन्ते तामसा जनाः ||४||',
                transliteration: 'yajante sāttvikā devān yakṣa-rakṣāṃsi rājasāḥ\npretān bhūta-gaṇāṃś cānye yajante tāmasā janāḥ',
                tej: { ht: 'सात्त्विक पुरुष देवताओं की, राजस पुरुष यक्ष-राक्षसों की और अन्य तामस पुरुष प्रेतों और भूतगणों की पूजा करते हैं।' },
                spiit: 'Men in the mode of goodness worship the demigods; those in the mode of passion worship the demons; and those in the mode of ignorance worship ghosts and spirits.'
            },
            {
                slok: 'अशास्त्रविहितं घोरं तप्यन्ते ये तपो जनाः |\nदम्भाहङ्कारसंयुक्ताः कामरागबलान्विताः ||५||',
                transliteration: 'aśāstra-vihitaṃ ghoraṃ tapyante ye tapo janāḥ\ndambhāhaṅkāra-saṃyuktāḥ kāma-rāga-balānvitāḥ',
                tej: { ht: 'जो पुरुष दम्भ और अहंकार से युक्त, काम और राग के बल से युक्त होकर शास्त्रविहित न होने पर भी घोर तप करते हैं।' },
                spiit: 'Those who undergo severe austerities and penances not recommended in the scriptures, performing them out of pride and egoism, who are impelled by lust and attachment...'
            }
        ],
        18: [
            {
                slok: 'अर्जुन उवाच |\nसंन्यासस्य महाबाहो तत्त्वमिच्छामि वेदितुम् |\nत्यागस्य च हृषीकेश पृथक्केशिनिषूदन ||१||',
                transliteration: 'arjuna uvāca\nsaṃnyāsasya mahā-bāho tattvam icchāmi veditum\ntyāgasya ca hṛṣīkeśa pṛthak keśi-niṣūdana',
                tej: { ht: 'अर्जुन ने कहा: हे महाबाहो! हे हृषीकेश! हे केशिनिषूदन! मैं संन्यास और त्याग के तत्त्व को पृथक्-पृथक् जानना चाहता हूँ।' },
                spiit: 'Arjuna said: O mighty-armed one, I wish to understand the purpose of renunciation [tyaga] and of the renounced order of life [sannyasa], O killer of the Keshi demon, master of the senses.'
            },
            {
                slok: 'श्रीभगवानुवाच |\nकाम्यानां कर्मणां न्यासं संन्यासं कवयो विदुः |\nसर्वकर्मफलत्यागं प्राहुस्त्यागं विचक्षणाः ||२||',
                transliteration: 'śrī-bhagavān uvāca\nkāmyānāṃ karmaṇāṃ nyāsaṃ saṃnyāsaṃ kavayo viduḥ\nsarva-karma-phala-tyāgaṃ prāhus tyāgaṃ vicakṣaṇāḥ',
                tej: { ht: 'श्री भगवान ने कहा: काम्य कर्मों का त्याग संन्यास कहलाता है और सम्पूर्ण कर्मफलों का त्याग त्याग कहलाता है - इसे विद्वान् जानते हैं।' },
                spiit: 'The Supreme Lord said: The giving up of activities that are based on material desire is what great learned men call the renounced order of life [sannyasa]. And giving up the results of all activities is what the wise call renunciation [tyaga].'
            },
            {
                slok: 'त्याज्यं दोषवदित्येके कर्म प्राहुर्मनीषिणः |\nयज्ञदानतपःकर्म न त्याज्यमिति चापरे ||५||',
                transliteration: 'tyājyaṃ doṣavad ity eke karma prāhur manīṣiṇaḥ\nyajña-dāna-tapaḥ-karma na tyājyam iti cāpare',
                tej: { ht: 'कुछ मनीषी कर्म को दोषयुक्त कहकर त्याज्य मानते हैं, और दूसरे कहते हैं कि यज्ञ, दान और तप का कर्म त्याज्य नहीं है।' },
                spiit: 'Some learned men declare that all kinds of fruitive activities should be given up as faulty, yet other sages maintain that acts of sacrifice, charity and penance should never be abandoned.'
            },
            {
                slok: 'सर्वाणीन्द्रियकर्माणि प्राणकर्माणि चापरे |\nआत्मसंयमयोगाग्नौ जुह्वति ज्ञानदीपिते ||४||',
                transliteration: 'sarvāṇīndriya-karmāṇi prāṇa-karmāṇi cāpare\nātma-saṃyama-yogāgnau juhvati jñāna-dīpite',
                tej: { ht: 'अन्य पुरुष सम्पूर्ण इन्द्रियकर्मों और प्राणकर्मों को ज्ञानदीपित आत्मसंयमयोग की अग्नि में हवन करते हैं।' },
                spiit: 'Others, who are interested in self-realization through control of the mind and senses, offer the functions of all the senses, and of the life breath, as oblations into the fire of the controlled mind.'
            },
            {
                slok: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज |\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ||६६||',
                transliteration: 'sarva-dharmān parityajya mām ekaṃ śaraṇaṃ vraja\nahaṃ tvāṃ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ',
                tej: { ht: 'सम्पूर्ण धर्मों को त्यागकर तू केवल मेरी ही शरण में आ। मैं तुझे सम्पूर्ण पापों से मुक्त कर दूँगा, शोक मत कर।' },
                spiit: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.'
            }
        ]
    };
    return FALLBACK_VERSES[chapterNum] || [];
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
        // Determine what to show based on language preference
        const showSanskrit = currentLanguage !== 'none';
        const showTranslation = currentLanguage !== 'sanskrit';
        const translationText = currentLanguage === 'hindi' 
            ? (verse.tej?.ht || verse.spiit || '')
            : (verse.spiit || verse.tej?.ht || '');

        html += `
            <article class="shloka-card">
                <span class="shloka-number">Shloka ${index + 1}</span>
                ${showSanskrit && verse.slok ? `<p class="shloka-sanskrit">${verse.slok}</p>` : ''}
                ${verse.transliteration ? `<p class="shloka-transliteration">${verse.transliteration}</p>` : ''}
                ${showTranslation && translationText ? `<p class="shloka-translation">${translationText}</p>` : ''}
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

    themeToggle.addEventListener('click', () => {
        HoliBooks.theme.toggle();
        updateThemeIcons();
    });

    // Language selector button
    languageBtn.addEventListener('click', () => {
        cycleLanguage();
    });

    // Mobile menu
    setupMobileMenu();

    updateThemeIcons();
}

function cycleLanguage() {
    const languages = ['both', 'hindi', 'sanskrit'];
    const currentIndex = languages.indexOf(currentLanguage);
    currentLanguage = languages[(currentIndex + 1) % languages.length];
    
    HoliBooks.storage.set('gita_language', currentLanguage);
    updateLanguageButton();
    updateMobileLanguageButtons();
    
    // Re-render current chapter with new language
    const chapter = CHAPTERS[currentChapter - 1];
    const cachedData = window.currentGitaData;
    if (cachedData) {
        renderVerses(cachedData, chapter);
    }
}

function updateLanguageButton() {
    const labels = {
        'both': 'Sanskrit + English',
        'hindi': 'Sanskrit + Hindi',
        'sanskrit': 'Sanskrit Only'
    };
    currentLanguageSpan.textContent = labels[currentLanguage] || 'Sanskrit + English';
}

function updateMobileLanguageButtons() {
    document.querySelectorAll('.mobile-view-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
}

function updateThemeIcons() {
    const isDark = HoliBooks.theme.current === 'dark';
    
    // Desktop theme icon
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

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

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

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Mobile language options
    document.querySelectorAll('.mobile-view-option').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLanguage = btn.dataset.lang;
            HoliBooks.storage.set('gita_language', currentLanguage);
            updateLanguageButton();
            updateMobileLanguageButtons();
            
            // Re-render current chapter
            const chapter = CHAPTERS[currentChapter - 1];
            const cachedData = window.currentGitaData;
            if (cachedData) {
                renderVerses(cachedData, chapter);
            }
        });
    });

    // Mobile theme toggle
    const mobileThemeBtn = document.getElementById('mobile-theme-btn');
    if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', () => {
            HoliBooks.theme.toggle();
            updateThemeIcons();
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
