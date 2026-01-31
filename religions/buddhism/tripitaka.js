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

// Comprehensive Dhammapada verses with Pali and English
const SAMPLE_VERSES = {
    1: [
        { num: 1, pali: 'Manopubbaṅgamā dhammā, manoseṭṭhā manomayā.', english: 'Mind is the forerunner of all actions. All deeds are led by mind, created by mind.' },
        { num: 2, pali: 'Manasā ce paduṭṭhena, bhāsati vā karoti vā.', english: 'If one speaks or acts with an impure mind, suffering follows, as the wheel follows the hoof of the ox.' },
        { num: 3, pali: 'Akkocchi maṃ, avadhi maṃ, ajini maṃ, ahāsi me.', english: '"He abused me, he beat me, he defeated me, he robbed me." Those who harbor such thoughts never still their hatred.' },
        { num: 4, pali: 'Akkocchi maṃ, avadhi maṃ, ajini maṃ, ahāsi me.', english: '"He abused me, he beat me, he defeated me, he robbed me." Those who do not harbor such thoughts still their hatred.' },
        { num: 5, pali: 'Na hi verena verāni, sammantīdha kudācanaṃ.', english: 'Hatred is never appeased by hatred in this world. By non-hatred alone is hatred appeased.' },
        { num: 6, pali: 'Na hi verena verāni, sammantīdha kudācanaṃ.', english: 'This is a law eternal.' },
        { num: 7, pali: 'Subhānupassiṃ viharantaṃ, indriyesu asaṃvutaṃ.', english: 'One who looks for pleasure, who is unrestrained in the senses, immoderate in eating, lazy and weak in effort.' },
        { num: 8, pali: 'Bhikkhuṃ pamattamānasaṃ, ogho bhogāti mārisa.', english: 'Māra will overthrow such a monk who is without mindfulness, as wind throws down a weak tree.' },
        { num: 9, pali: 'Asubhānupassiṃ viharantaṃ, indriyesu susaṃvutaṃ.', english: 'One who meditates on the unpleasant, who is well restrained in the senses, moderate in eating, faithful and energetic.' },
        { num: 10, pali: 'Bhikkhuṃ pahitamānasaṃ, ogho na bhogati mārisa.', english: 'Māra will not overthrow such a monk who is established in mindfulness, as wind does not throw down a rocky mountain.' }
    ],
    2: [
        { num: 21, pali: 'Appamādo amatapadaṃ, pamādo maccuno padaṃ.', english: 'Heedfulness is the path to the deathless; heedlessness is the path to death.' },
        { num: 22, pali: 'Appamattā na mīyanti, ye pamattā yathā matā.', english: 'The heedful do not die; the heedless are as if already dead.' },
        { num: 23, pali: 'Evaṃ visesato ñatvā, appamādamhi paṇḍitā.', english: 'Understanding this distinction, the wise rejoice in heedfulness and delight in the presence of the noble ones.' },
        { num: 24, pali: 'Te jhāyino sātatikā, niccaṃ daḷhaparakkamā.', english: 'The meditative ones, ever steadfast, constantly exerting themselves, realize Nibbāna, the ultimate freedom from bondage.' },
        { num: 25, pali: 'Uṭṭhānavato satīmato, sucikammassa nisammakārino.', english: 'Through energy, mindfulness, pure conduct, carefulness, self-restraint, and right living, the wise increase in glory.' },
        { num: 26, pali: 'Appamādarato bhikkhu, pamāde bhayadassi vā.', english: 'The monk who delights in heedfulness, who sees danger in heedlessness, advances like a fire, burning all fetters, great and small.' },
        { num: 27, pali: 'Appamādarato bhikkhu, pamāde bhayadassi vā.', english: 'The monk who delights in heedfulness, who sees danger in heedlessness, cannot fall away; he is close to Nibbāna.' },
        { num: 28, pali: 'Pamādamappamādena, yadā nudati paṇḍito.', english: 'When the wise drive away heedlessness with heedfulness, having ascended the palace of wisdom, sorrowless, they behold the sorrowful folk.' },
        { num: 29, pali: 'Pamādamappamādena, yadā nudati paṇḍito.', english: 'Wise among the wise, the heedful one is called "wise," having ascended the palace of wisdom.' },
        { num: 30, pali: 'Appamādena maghavā, devānaṃ seṭṭhataṃ gato.', english: 'Through heedfulness, Maghavā attained sovereignty among the gods. Heedfulness is always praised; heedlessness is always blamed.' },
        { num: 31, pali: 'Appamādarato bhikkhu, pamāde bhayadassi vā.', english: 'The monk who delights in heedfulness, who sees danger in heedlessness, burns away all fetters, great and small.' },
        { num: 32, pali: 'Appamādarato bhikkhu, pamāde bhayadassi vā.', english: 'The monk who delights in heedfulness, who sees danger in heedlessness, cannot fall away; he is close to Nibbāna.' }
    ],
    3: [
        { num: 33, pali: 'Phandanaṃ capalaṃ cittaṃ, dūrakkhaṃ dunnivārayaṃ.', english: 'The mind is wavering and restless, difficult to guard and hard to restrain.' },
        { num: 34, pali: 'Ujuṃ karoti medhāvī, usukārova tejanaṃ.', english: 'The wise one straightens the mind as a fletcher straightens an arrow.' },
        { num: 35, pali: 'Vārijo va thale khitto, okamokataubbhato.', english: 'Like a fish drawn from its watery home and thrown upon the land, even so does this mind flutter.' },
        { num: 36, pali: 'Cittaṃ dantaṃ sukhāvahaṃ.', english: 'Therefore should the realm of the passions be shunned. The mind controlled brings happiness.' },
        { num: 37, pali: 'Dunniggahassa lahuno, yatthakāmanipātino.', english: 'Difficult to control, very agile, alighting wherever it desires, the mind is good to tame; a tamed mind brings happiness.' },
        { num: 38, pali: 'Sududdasaṃ sunipuṇaṃ, yatthakāmanipātinaṃ.', english: 'Invisible, subtle, alighting wherever it desires, the wise one should guard the mind; a guarded mind brings happiness.' },
        { num: 39, pali: 'Dūraṅgamaṃ ekacaraṃ, asarīraṃ guhāsayaṃ.', english: 'Wandering afar, solitary, bodiless, lying in the cave of the heart is the mind.' },
        { num: 40, pali: 'Ye cittaṃ saṃyamissanti, mokkhanti mārabandhanā.', english: 'Those who subdue this mind are liberated from the bonds of Māra.' },
        { num: 41, pali: 'Anavaṭṭhitacittassa, saddhammaṃ avijānato.', english: 'For one of unsteady mind, who does not know the True Dhamma, and whose faith wavers, wisdom does not mature.' },
        { num: 42, pali: 'Anavaṭṭhitacittassa, saddhammaṃ avijānato.', english: 'There is no fear for the one whose mind is not soaked by lust, who is free from ill will, who has transcended both good and evil.' },
        { num: 43, pali: 'Yassa cittaṃ daḷhaṃ natthi, cittasantāpavaḍḍhito.', english: 'Having realized that this body is as fragile as a jar, establishing this mind like a fortress, one should attack Māra with the weapon of wisdom, guarding what has been won, and remaining unattached.' }
    ],
    4: [
        { num: 44, pali: 'Ko imaṃ pathaviṃ vijessati, yamalokañca imaṃ sadevakaṃ.', english: 'Who will conquer this earth and the realm of Yama with its gods?' },
        { num: 45, pali: 'Ko suddhaṃ dhammapadaṃ suvaṇṇaṃ, kusalo pupphamiva pacessati.', english: 'Who will gather the well-taught verse of Dhamma, like an expert garland-maker picks flowers?' },
        { num: 46, pali: 'Sekho pathaviṃ vijessati, yamalokañca imaṃ sadevakaṃ.', english: 'The trainee will conquer this earth and the realm of Yama with its gods.' },
        { num: 47, pali: 'Sekho suddhaṃ dhammapadaṃ suvaṇṇaṃ, kusalo pupphamiva pacessati.', english: 'The trainee will gather the well-taught verse of Dhamma, like an expert garland-maker picks flowers.' },
        { num: 48, pali: 'Pheṇūpamaṃ kāyamimaṃ viditvā, marīcidhammaṃ abhisambudhāno.', english: 'Having understood this body to be like foam, realizing its mirage-like nature, one should destroy Māra\'s flower-arrows and go beyond the sight of the King of Death.' },
        { num: 49, pali: 'Pupphāni heva pacinantaṃ, byāsattamanasaṃ naraṃ.', english: 'As a mighty flood sweeps away a sleeping village, so death carries away the person who gathers flowers, with mind attached to sensual pleasures.' },
        { num: 50, pali: 'Pupphāni heva pacinantaṃ, byāsattamanasaṃ naraṃ.', english: 'The End-Maker brings under his sway the person who gathers flowers, with mind attached to sensual pleasures, insufficient in merit.' },
        { num: 51, pali: 'Yathāpi bhamaro pupphaṃ, vaṇṇagandhaṃ aheṭhayaṃ.', english: 'Just as a bee gathers honey from the flower without injuring its color or fragrance, so should the sage dwell in the village.' },
        { num: 52, pali: 'Paṭibujjatha bhikkhavo, paṭibujjatha mā pamādattha.', english: 'Wake up! O monks, wake up! Do not be heedless! Do not delight in the pleasures of the world.' },
        { num: 53, pali: 'Yathāpi ruciraṃ pupphaṃ, vaṇṇavantaṃ agandhakaṃ.', english: 'Just as a beautiful flower that is colorful but lacks fragrance, so is the well-spoken word of one who does not practice it.' },
        { num: 54, pali: 'Yathāpi ruciraṃ pupphaṃ, vaṇṇavantaṃ sagandhakaṃ.', english: 'Just as a beautiful flower that is both colorful and fragrant, so is the well-spoken word of one who practices it.' },
        { num: 55, pali: 'Yathāpi puppharasimhā, kayirā mālāguṇe bahū.', english: 'As from a mass of flowers many a garland is made, so should many good deeds be done by one born a mortal.' },
        { num: 56, pali: 'Na pupphagandho paṭivātameti, na candanaṃ tagaramallikā vā.', english: 'The fragrance of flowers does not go against the wind; nor does sandalwood, tagara, or jasmine.' },
        { num: 57, pali: 'Satañca gandho paṭivātameti, sabbā disā sappuriso pavāyati.', english: 'But the fragrance of the virtuous goes against the wind; the good person pervades all directions.' },
        { num: 58, pali: 'Candanaṃ tagaraṃ vāpi, uppalaṃ atha vassikī.', english: 'Sandalwood, tagara, lotus, jasmine—among these kinds of fragrance, the fragrance of virtue is unsurpassed.' },
        { num: 59, pali: 'Appamatto ayaṃ gandho, yāyaṃ tagaracandanaṃ.', english: 'Little is this fragrance of tagara and sandalwood; but the fragrance of the virtuous rises up to the gods as the highest.' }
    ],
    5: [
        { num: 60, pali: 'Dīghā jāgarato ratti, dīghaṃ santassa yojanaṃ.', english: 'Long is the night to the wakeful; long is the league to the weary; long is the round of rebirth to the foolish who do not know the True Dhamma.' },
        { num: 61, pali: 'Carañce nādhigaccheyya, seyyaṃ sadisamattano.', english: 'If, as one fares, one does not find a companion who is better or equal, one should resolutely fare alone; there is no fellowship with a fool.' },
        { num: 62, pali: 'Puttā matthi dhanammatthi, iti bālo vihaññati.', english: '"Sons have I; wealth have I," thus the fool is afflicted. Indeed, he himself is not his own.' },
        { num: 63, pali: 'Attā hi attano natthi, kuto puttā kuto dhanaṃ.', english: 'How then sons? How then wealth?' },
        { num: 64, pali: 'Yo bālo maññati bālyaṃ, paṇḍito vāpi tena so.', english: 'The fool who knows his foolishness is wise at least to that extent; but the fool who thinks himself wise is called a fool indeed.' },
        { num: 65, pali: 'Yāvadeva anatthāya, ñattaṃ bālassa jāyati.', english: 'Though all his life a fool associates with a wise man, he does not perceive the Dhamma, just as the spoon does not perceive the taste of soup.' },
        { num: 66, pali: 'Hanti bālassa sukkaṃsaṃ, muddhamassa vipātayaṃ.', english: 'Though for only a moment a discerning person associates with a wise man, quickly he perceives the Dhamma, just as the tongue perceives the taste of soup.' },
        { num: 67, pali: 'Mandattā momūhattā, bālo medhāvīdhāyī ca.', english: 'Fools of little wit are their own enemies, doing evil deeds that bear bitter fruit.' },
        { num: 68, pali: 'Na taṃ kammaṃ kataṃ sādhu, yaṃ katvā anutappati.', english: 'That deed is not well done, which having done, one repents, and the result of which one reaps with tears.' },
        { num: 69, pali: 'Tañca kammaṃ kataṃ sādhu, yaṃ katvā nānutappati.', english: 'That deed is well done, which having done, one does not repent, and the result of which one reaps with delight and happiness.' },
        { num: 70, pali: 'Madhuvā maññati bālo, yāva pāpaṃ na paccati.', english: 'As long as evil has not ripened, the fool thinks it sweet as honey; but when evil ripens, the fool suffers.' },
        { num: 71, pali: 'Māse māse kusaggena, bālo bhuñjetha bhojanaṃ.', english: 'Month after month the fool may eat his food with the tip of a blade of grass, but he is not worth a sixteenth part of those who have comprehended the Truth.' },
        { num: 72, pali: 'Na hi pāpaṃ kataṃ kammaṃ, sajju khīraṃva muccati.', english: 'Indeed, evil ripens not so quickly as milk curdles; smoldering, it follows the fool like fire covered by ashes.' },
        { num: 73, pali: 'Yāvadeva anatthāya, ñattaṃ bālassa jāyati.', english: 'To his own ruin the fool gains knowledge, for it cleaves his head and destroys his merit.' },
        { num: 74, pali: 'Asantaṃ bhāvanamiccheyya, purekkhārañca bhikkhusu.', english: 'The fool seeks undeserved reputation, precedence among monks, authority in the monasteries, and honor among families.' },
        { num: 75, pali: 'Gāme ca nivāseseyya, sinehā ca pariggaho.', english: '"Let both householders and monks think this was done by me. Let them follow my wishes in all works, great and small." Such is the desire of the fool; increasing his desires and pride.' }
    ],
    6: [
        { num: 76, pali: 'Nidhīnaṃva pavattāraṃ, yaṃ passe vajjadassinaṃ.', english: 'One should follow the wise, the intelligent, the learned, the much-enduring, the dutiful, the noble; such a wise one is good to follow, as the moon follows the path of the stars.' },
        { num: 77, pali: 'Ovadeyyānusāseyya, asabbhā ca nivāraye.', english: 'One should exhort others to do good, and should be self-controlled; such a person is dear to the good, but is not dear to the bad.' },
        { num: 78, pali: 'Na bhaje pāpake mitte, na bhaje purisādhame.', english: 'One should not associate with bad friends, nor with the vile. One should associate with good friends, and with the noble.' },
        { num: 79, pali: 'Dhammapīti sukhaṃ seti, vippasannena cetasā.', english: 'One who drinks the Dhamma lives happily with a peaceful mind; the wise one ever delights in the Dhamma revealed by the noble ones.' },
        { num: 80, pali: 'Udakañhi nayanti nettikā, usukārā namayanti tejanaṃ.', english: 'Irrigators guide the water; fletchers straighten the arrow; carpenters shape the wood; the wise control themselves.' },
        { num: 81, pali: 'Selo yathā ekaghano, vātena na samīrati.', english: 'Just as a solid rock is not shaken by the wind, so the wise are not moved by praise or blame.' },
        { num: 82, pali: 'Yathāpi rahado gambhīro, vippasanno anāvilo.', english: 'Just as a deep lake is clear and calm, so the wise become tranquil having heard the Dhamma.' },
        { num: 83, pali: 'Sabbattha ve sappurisā cajanti, na kāmakāmā lapayanti santo.', english: 'The good give up everything; the peaceful do not prattle about sense pleasures. Touched by happiness or by pain, the wise show no elation or depression.' },
        { num: 84, pali: 'Na attahetu na parassa hetu, na puttamicche na dhanaṃ na raṭṭhaṃ.', english: 'For his own sake or for the sake of others, he does not desire sons, wealth, or kingdom; he does not desire his own success by unfair means; such a one is virtuous, wise, and righteous.' },
        { num: 85, pali: 'Appakā te manussesu, ye janā pāragāmino.', english: 'Few among men are those who cross to the farther shore. The rest, the bulk of mankind, only run up and down on this shore.' },
        { num: 86, pali: 'Athāyaṃ dhammo deepito, yasmā etaṃ sammā devamanussā.', english: 'But those who live according to the well-taught Dhamma will cross to the farther shore, hard to reach, beyond the realm of death.' },
        { num: 87, pali: 'Kāyena saṃvutā dhīrā, atho vācāya saṃvutā.', english: 'The wise, controlled in body, speech, and mind, who are well-controlled, indeed they are controlled.' },
        { num: 88, pali: 'Manasā saṃvutā dhīrā, te ve suparisaṃvutā.', english: 'The wise who are well-controlled in mind are indeed well-controlled.' },
        { num: 89, pali: 'Sīlasaṃvutasāyino, indriyesu susaṃvutā.', english: 'Those who are well-controlled in virtue, well-controlled in the senses, moderate in eating, and devoted to the higher mind, they are called the well-controlled.' }
    ],
    7: [
        { num: 90, pali: 'Gataddhino visokassa, vippamuttassa sabbadhi.', english: 'For the one whose journey is ended, who is sorrowless, everywhere liberated, who has abandoned all bonds, no fever of passion is found.' },
        { num: 91, pali: 'Uyyuñjanti satīmanto, na nikete ramanti te.', english: 'The mindful ones exert themselves; they take no delight in abodes. Like swans that abandon the lake, they leave home after home behind.' },
        { num: 92, pali: 'Yesaṃ sannicayo natthi, ye pariññātabhojanā.', english: 'Those who have no accumulation, who have comprehended the nature of food, whose domain is the liberation of the void and the signless, their path is difficult to understand, like that of birds in the sky.' },
        { num: 93, pali: 'Yassāsavā parikkhīṇā, āhāre ca anissito.', english: 'The one whose defilements are destroyed, who is not dependent on food, whose domain is the liberation of the void and the signless, his path is difficult to understand, like that of birds in the sky.' },
        { num: 94, pali: 'Yassa indriyani samathaṅgatāni, assā yathā sārathinā sudantā.', english: 'The one whose senses are subdued, like steeds well-trained by a charioteer, who has abandoned conceit and is free from the cankers, such a steadfast one even the gods hold dear.' },
        { num: 95, pali: 'Pathavisamo no virujjhati, indakhilusamo tādi subbato.', english: 'Like the earth, he does not resent; like a door-post, he is firmly set; like a lake, he is mud-free; for such a one, there is no more wandering in rebirth.' },
        { num: 96, pali: 'Santaṃ tassa manaṃ hoti, santā vācā ca kamma ca.', english: 'The mind of the peaceful one is peaceful, peaceful are his speech and action; knowing the meaning of freedom, such a one is called peaceful.' },
        { num: 97, pali: 'Assaddho akataññū ca, sandhicchedo ca yo naro.', english: 'The one who is without faith, who knows not the unmade, who has severed the bond, who has destroyed all opportunities, who has thrown off all desires, he is indeed supreme among men.' },
        { num: 98, pali: 'Gāme vā yadi vāraññe, ninne vā yadi vā thale.', english: 'Whether in village or in forest, in valley or on hill, wherever the arahants dwell is delightful.' },
        { num: 99, pali: 'Ramaṇīyāni araññāni, yattha na ramatī jano.', english: 'Delightful are the forests where the worldly do not delight; those free from passion delight in them, for they seek no sensual pleasures.' }
    ],
    8: [
        { num: 100, pali: 'Yo ca vassasataṃ jantu, aggiṃ paricare vane.', english: 'Better than a thousand useless words is one useful word, hearing which one attains peace.' },
        { num: 101, pali: 'Yo ca vassasataṃ jantu, pūjaṃ paricare vane.', english: 'Better than a thousand useless verses is one useful verse, hearing which one attains peace.' },
        { num: 102, pali: 'Yo ca gāthā sataṃ bhāse, anatthapadasāhitā.', english: 'Better than reciting a hundred verses composed of meaningless words is one verse of Dhamma, hearing which one attains peace.' },
        { num: 103, pali: 'Yo sahassaṃ sahassena, saṅgāme mānuse jine.', english: 'Though one may conquer a thousand times a thousand men in battle, yet he indeed is the noblest victor who conquers himself.' },
        { num: 104, pali: 'Attā have jitaṃ seyyo, yā cāyaṃ itarā pajā.', english: 'Self-conquest is far better than the conquest of others; neither a deva nor a gandhabba, nor Māra with Brahma, can turn into defeat the victory of such a one who is self-subdued and ever restrained.' },
        { num: 105, pali: 'Attadatthaṃ paratthena, bahunāpi na hāpaye.', english: 'Though month after month for a hundred years one should offer sacrifices by the thousands, yet if only for a moment one should honor those of developed self, that honor is indeed better than a century of sacrifice.' },
        { num: 106, pali: 'Yo ca vassasataṃ yaññati, aggiṃ paricare vane.', english: 'Though for a hundred years one should tend the sacred fire in the forest, yet if only for a moment one should honor those of developed self, that honor is indeed better than a century of sacrifice.' },
        { num: 107, pali: 'Yo ca vassasataṃ yaññati, yaññena dakkhinehi ca.', english: 'Whatever sacrifice or offering a merit-seeker may perform for a whole year, that is not worth a quarter of the merit of honoring the upright; such worship is truly excellent.' },
        { num: 108, pali: 'Abhivādanaṃ sīlissa, niccaṃ vuḍḍhāpacāyino.', english: 'For one who is in the habit of constantly honoring and respecting the elders, four blessings increase: long life, beauty, happiness, and strength.' },
        { num: 109, pali: 'Yo ca vassasataṃ jantu, aggiṃ paricare vane.', english: 'Better than a hundred years lived in vice and without restraint is a single day lived in virtue and meditation.' },
        { num: 110, pali: 'Yo ca vassasataṃ jantu, avītaṃ brahmacariyaṃ vase.', english: 'Better than a hundred years lived in ignorance and without restraint is a single day lived in wisdom and meditation.' },
        { num: 111, pali: 'Yo ca vassasataṃ jantu, kusīto hīnavīriyo.', english: 'Better than a hundred years lived in idleness and weakness is a single day lived with vigor and exertion.' },
        { num: 112, pali: 'Yo ca vassasataṃ jantu, apassaṃ udayabbayaṃ.', english: 'Better than a hundred years not seeing the rise and fall of things is a single day seeing the rise and fall of things.' },
        { num: 113, pali: 'Yo ca vassasataṃ jantu, apassaṃ amataṃ padaṃ.', english: 'Better than a hundred years not seeing the deathless state is a single day seeing the deathless state.' },
        { num: 114, pali: 'Yo ca vassasataṃ jantu, apassaṃ dhammamuttamaṃ.', english: 'Better than a hundred years not seeing the supreme Dhamma is a single day seeing the supreme Dhamma.' },
        { num: 115, pali: 'Yo ca vassasataṃ jantu, apassaṃ dhammamuttamaṃ.', english: 'Better than a hundred years not seeing the supreme Dhamma is a single day seeing the supreme Dhamma.' }
    ],
    9: [
        { num: 116, pali: 'Abhittharetha kalyāṇe, pāpā cittaṃ nivāraye.', english: 'Hasten to do good; restrain your mind from evil. He who is slow in doing good, his mind delights in evil.' },
        { num: 117, pali: 'Pāpañce puriso kayirā, na taṃ kayirā punappunaṃ.', english: 'Should a person commit evil, let him not do it again and again. Let him not find pleasure therein; painful is the accumulation of evil.' },
        { num: 118, pali: 'Puññañce puriso kayirā, kayirā naṃ punappunaṃ.', english: 'Should a person do good, let him do it again and again. Let him find pleasure therein; blissful is the accumulation of good.' },
        { num: 119, pali: 'Pāpopi pasavatī puññaṃ, gabbhameke uppajjanti.', english: 'Even an evil-doer sees good as long as evil ripens not; but when it ripens, then the evil-doer sees evil.' },
        { num: 120, pali: 'Puññopi pasavatī pāpaṃ, gabbhameke uppajjanti.', english: 'Even a good person sees evil as long as good ripens not; but when it ripens, then the good person sees good.' },
        { num: 121, pali: 'Māvamaññetha pāpassa, na maṃ taṃ āgamissati.', english: 'Think not lightly of evil, saying, "It will not come to me." Drop by drop is the water pot filled. Likewise, the fool, gathering it little by little, fills himself with evil.' },
        { num: 122, pali: 'Māvamaññetha puññassa, na maṃ taṃ āgamissati.', english: 'Think not lightly of good, saying, "It will not come to me." Drop by drop is the water pot filled. Likewise, the wise man, gathering it little by little, fills himself with good.' },
        { num: 123, pali: 'Vāṇijo va bhayaṃ maggaṃ, appasattho mahaddhano.', english: 'Just as a merchant with a small escort and great wealth avoids a dangerous road, just as one desiring to live avoids poison, so should one avoid evil.' },
        { num: 124, pali: 'Pāṇimhi ce vaṇo nāssa, hareyya pāṇinā visaṃ.', english: 'If there is no wound on the hand, one may handle poison with the hand; for poison does not affect one who has no wound; nor is there evil for one who does no evil.' },
        { num: 125, pali: 'Yo appaduṭṭhassa narassa dussati, suddhassa posassa anaṅgaṇassa.', english: 'Whoever harms a harmless person, one pure and guiltless, upon that very fool the evil falls back like fine dust thrown against the wind.' },
        { num: 126, pali: 'Gabbhammeke uppajjanti, nirayaṃ pāpakammino.', english: 'Some are born in the womb; evil-doers go to hell; the righteous go to heaven; those free from worldly desires attain Nibbāna.' },
        { num: 127, pali: 'Na antalikkhe na samuddamajjhe, na pabbatanāṃ vivaraṃ pavissa.', english: 'Neither in the sky nor in mid-ocean, nor by entering into mountain clefts, nowhere in the world is there a place where one may escape from the results of evil deeds.' },
        { num: 128, pali: 'Na antalikkhe na samuddamajjhe, na pabbatanāṃ vivaraṃ pavissa.', english: 'Neither in the sky nor in mid-ocean, nor by entering into mountain clefts, nowhere in the world is there a place where one may be free from death.' }
    ],
    10: [
        { num: 129, pali: 'Sabbe tasanti daṇḍassa, sabbe bhāyanti maccuno.', english: 'All tremble at violence; all fear death. Putting oneself in the place of another, one should not kill nor cause another to kill.' },
        { num: 130, pali: 'Sabbe tasanti daṇḍassa, sabbesaṃ jīvitaṃ piyaṃ.', english: 'All tremble at violence; life is dear to all. Putting oneself in the place of another, one should not kill nor cause another to kill.' },
        { num: 131, pali: 'Sukhakāmāni bhūtāni, yo daṇḍena vihiṃsati.', english: 'Whoever seeks happiness by hurting others who also want happiness, shall not find happiness hereafter.' },
        { num: 132, pali: 'Sukhakāmāni bhūtāni, yo daṇḍena na hiṃsati.', english: 'Whoever seeks happiness by not hurting others who also want happiness, shall find happiness hereafter.' },
        { num: 133, pali: 'Māvoca pharusaṃ kañci, vuttā paṭivadeyyuṃ taṃ.', english: 'Speak not harshly to anyone, for those thus spoken to might retort. Indeed, angry speech hurts, and retaliation may overtake you.' },
        { num: 134, pali: 'Sace neresi attānaṃ, kaṃso upahato yathā.', english: 'If, like a shattered metal plate, you make no noise, you have attained Nibbāna; anger is found in you no more.' },
        { num: 135, pali: 'Yathā daṇḍena gopālo, gāvo pājeti gocaraṃ.', english: 'As a cowherd with his staff drives cows to pasture, so do old age and death drive the life of living beings.' },
        { num: 136, pali: 'Athappāpāni kammāni, karaṃ bālo na bujjhati.', english: 'The fool does not know that he does evil; but that fool is tormented by his evil deeds like one burnt by fire.' },
        { num: 137, pali: 'Yo daṇḍena adaṇḍesu, appaduṭṭhesu dussati.', english: 'Whoever uses violence on the non-violent and the harmless, quickly falls into one of these ten states.' },
        { num: 138, pali: 'Vividhā dukkhā phusati, bālo caṇḍo ca māṇavo.', english: 'He experiences sharp pain, disaster, bodily injury, serious illness, or mental disorder.' },
        { num: 139, pali: 'Rājato vā upassaggaṃ, abbhakkhaṇaṃ va dāruṇaṃ.', english: 'Trouble from the government, or grave charges, or loss of relatives, or destruction of wealth.' },
        { num: 140, pali: 'Agni vāssa paricare, puttadarassa vāḷabhaṃ.', english: 'Or blazing fire burns his houses, and upon the dissolution of the body, that fool is born in hell.' },
        { num: 141, pali: 'Na naggacariyā na jaṭā na paṅkā, nānāsakā thaṇḍilasāyikā vā.', english: 'Neither going naked, nor matted locks, nor mud, nor fasting, nor lying on the ground, nor smearing oneself with ashes and dust, nor sitting on the heels in penance can purify a mortal who has not overcome doubt.' },
        { num: 142, pali: 'Alaṅkato cepi samaṃ careyya, santo danto niyato brahmacārī.', english: 'Even though he be well-attired, yet if he is peaceful, restrained, established in the holy life, if he has set aside violence towards all beings, he is a holy man, he is a sage, he is a monk.' },
        { num: 143, pali: 'Sāhu sappuriso tiṭṭhati, na tveva alaso naro.', english: 'Rare in the world is that person who is restrained by modesty, who avoids reproach, as a thoroughbred horse avoids the whip.' },
        { num: 144, pali: 'Āyatakena dukkhena, yathā bhūtena jāyati.', english: 'Like a thoroughbred horse touched by the whip, be strenuous and swift. By faith, morality, energy, meditation, and investigation of Dhamma, being endowed with knowledge and conduct, being mindful, abandon this great suffering.' },
        { num: 145, pali: 'Udakañhi nayanti nettikā, usukārā namayanti tejanaṃ.', english: 'Irrigators guide the water; fletchers straighten the arrow; carpenters shape the wood; the wise control themselves.' }
    ],
    11: [
        { num: 146, pali: 'Ko nu hāso kimānando, niccaṃ pajjalite sati.', english: 'What laughter, what joy, when the world is constantly burning? Shrouded in darkness, will you not seek the light?' },
        { num: 147, pali: 'Passa cittakataṃ bimbaṃ, arukāyaṃ samussitaṃ.', english: 'Behold this painted body, a mass of sores, a heap of wounds, diseased, full of hankering, in which nothing lasts, nothing persists.' },
        { num: 148, pali: 'Yassa nagarakaṃ sambhataṃ, tassa pāṇinā hāyati.', english: 'Thoroughly worn out is this body, a nest of diseases, perishable. This putrid mass breaks up; truly, life ends in death.' },
        { num: 149, pali: 'Yathāpi aparādhinaṃ, khīṇacandaṃva rāhuṇā.', english: 'Like gourds cast away in autumn are these dove-grey bones. What pleasure is there in looking at them?' },
        { num: 150, pali: 'Aṭṭhikāsaṅkhalikāva, saṇḍasākhāpariphuṭā.', english: 'This city of bones is plastered with flesh and blood, and here dwell old age and death, pride and deceit.' },
        { num: 151, pali: 'Rathakārova rathasya, karoti maṇḍalaṃ tathā.', english: 'Even gorgeous royal chariots wear out, and the body too grows old. But the Dhamma of the good does not grow old; thus the good teach to the good.' },
        { num: 152, pali: 'Appassutāyaṃ puriso, balibaddova jīrati.', english: 'The man of little learning grows old like an ox; his flesh increases, but not his wisdom.' },
        { num: 153, pali: 'Anekajātisaṃsāraṃ, sandhāvissaṃ abbhuggataṃ.', english: 'Through many a birth in saṃsāra have I wandered, seeking but not finding the builder of this house. Painful is repeated birth.' },
        { num: 154, pali: 'Gahakārakaṃ gavesanto, dukkhā jāti punappunaṃ.', english: 'O house-builder! You are seen. You shall build no house again. All your rafters are broken; your ridgepole is destroyed. My mind has attained the unconditioned; the end of craving has been reached.' },
        { num: 155, pali: 'Acaritvā brahmacariyaṃ, aladdhā yobbane dhanaṃ.', english: 'Those who have not practiced the holy life, who have not obtained wealth in their youth, pine away like old herons at a pond without fish.' },
        { num: 156, pali: 'Acaritvā brahmacariyaṃ, aladdhā yobbane dhanaṃ.', english: 'Those who have not practiced the holy life, who have not obtained wealth in their youth, lie like spent arrows, sighing after the past.' }
    ],
    12: [
        { num: 157, pali: 'Attānañce piyaṃ jaññā, na naṃ pāpena saṃyuje.', english: 'If one holds oneself dear, one should not yoke oneself with evil, for happiness is not easily gained by one who does evil.' },
        { num: 158, pali: 'Attānañce tathā kayirā, yathāññamanupavade.', english: 'Let one first establish oneself in what is proper; then only should one teach others. A wise man should not have such defilement.' },
        { num: 159, pali: 'Attānaṃ ce tathā kayirā, yathāññamanupavade.', english: 'As one teaches others, so should one do oneself; only the self-controlled should tame themselves. Difficult indeed is self-taming.' },
        { num: 160, pali: 'Attā hi attano nātho, ko hi nātho paro siyā.', english: 'One truly is the protector of oneself; who else could the protector be? With oneself fully controlled, one gains a mastery that is hard to gain.' },
        { num: 161, pali: 'Attā hi attano nātho, attā hi attano gati.', english: 'The evil done by oneself, born of oneself, produced by oneself, crushes the fool, as a diamond crushes a hard gem.' },
        { num: 162, pali: 'Yassa accantadussīlyaṃ, māluvā sālamivotataṃ.', english: 'Like a creeper that overpowers a tree, evil overpowers the evil-doer, causing him to fall into the hands of his enemy.' },
        { num: 163, pali: 'Sukarāni asādhūni, attano ahitāni ca.', english: 'Easy to do are things that are bad and harmful to oneself. But exceedingly difficult to do are things that are good and beneficial.' },
        { num: 164, pali: 'Yo sāsanaṃ arahataṃ, ariyānaṃ dhammajīvinaṃ.', english: 'Whoever, on account of perverted views, scorns the teaching of the arahants, the noble ones, and the righteous, brings forth the fruit of his destruction, like the bamboo that brings forth its own fruit of death.' },
        { num: 165, pali: 'Attanāva kataṃ pāpaṃ, attajaṃ attasambhavaṃ.', english: 'By oneself is evil done; by oneself is one defiled. By oneself is evil left undone; by oneself is one purified. Purity and impurity depend on oneself; no one can purify another.' },
        { num: 166, pali: 'Attadatthaṃ paratthena, bahunāpi na hāpaye.', english: 'Let one not neglect one\'s own welfare for the sake of another, however great. Clearly perceiving one\'s own welfare, let one be intent on the good.' }
    ],
    13: [
        { num: 167, pali: 'Hīnaṃ dhammaṃ na seveyya, pamādena na saṃvase.', english: 'Do not follow a mean course; do not live heedlessly; do not embrace wrong views; do not be one who prolongs the world.' },
        { num: 168, pali: 'Uttiṭṭhe nappamajjeyya, dhammaṃ sucaritaṃ care.', english: 'Arise! Do not be heedless! Lead a righteous life. The righteous live happily both in this world and the next.' },
        { num: 169, pali: 'Dhammaṃ care sucaritaṃ, na naṃ duccaritaṃ care.', english: 'Lead a righteous life; do not lead an unrighteous life. The righteous live happily both in this world and the next.' },
        { num: 170, pali: 'Yathā pubbuḷakaṃ passe, yathā passe marīcikaṃ.', english: 'Look upon the world as a bubble, look upon it as a mirage. The King of Death does not see him who thus looks down upon the world.' },
        { num: 171, pali: 'Etha passathimaṃ lokaṃ, cittaṃ rājarathūpamaṃ.', english: 'Come, behold this world, which is like a decorated royal chariot. Here fools flounder, but the wise have no attachment to it.' },
        { num: 172, pali: 'Yo ca pubbe pamajjitvā, pacchā so nappamajjati.', english: 'He who having been heedless becomes heedful, lights up the world like the moon freed from clouds.' },
        { num: 173, pali: 'Yassa pāpaṃ kataṃ kammaṃ, kusalena pidhīyati.', english: 'He who covers up evil deeds with good ones lights up the world like the moon freed from clouds.' },
        { num: 174, pali: 'Andhabhūto ayaṃ loko, tanukettha vipassati.', english: 'Blind is this world; few here see clearly. Like birds freed from the net, few go to heaven.' },
        { num: 175, pali: 'Haṃsādiccapathe yanti, ākāse yanti iddhiyā.', english: 'Swans fly on the path of the sun; those with psychic powers travel through space; the wise are led out of the world, having conquered Māra and his host.' },
        { num: 176, pali: 'Ekaṃ dhammaṃ atītassa, musāvādissa jantuno.', english: 'For the one who tells a lie, who has transgressed the one law, who has no regard for the world beyond, there is no evil that he cannot do.' },
        { num: 177, pali: 'Na ve kadariyā devalokaṃ vajanti, bālā have nappasaṃsanti dānaṃ.', english: 'Misers indeed do not go to the world of the gods; fools indeed do not praise giving. But the wise man rejoices in giving, and thereby is happy hereafter.' },
        { num: 178, pali: 'Pathabyā ekarajjena, saggassa gamanena vā.', english: 'Better than sole sovereignty over the earth, better than going to heaven, better than lordship over all the worlds is the fruit of stream-entry.' }
    ],
    14: [
        { num: 179, pali: 'Yassa jitaṃ nāvajīyati, jitaṃ yassa no yāti koci loke.', english: 'He whose victory cannot be turned into defeat, and to whom no one in this world can give defeat—such a one, having gone beyond all things, is the Buddha.' },
        { num: 180, pali: 'Yassa jālinī visattikā, taṇhā natthi kuhiñci netave.', english: 'He in whom the craving for existence is extinct, the net of craving is destroyed, such a one, having gone beyond all things, is the Buddha.' },
        { num: 181, pali: 'Uyyuñjanti satīmanto, na nikete ramanti te.', english: 'The mindful ones exert themselves; they take no delight in abodes. Like swans that abandon the lake, they leave home after home behind.' },
        { num: 182, pali: 'Yesaṃ sannicayo natthi, ye pariññātabhojanā.', english: 'Those who have no accumulation, who have comprehended the nature of food, whose domain is the liberation of the void and the signless, their path is difficult to understand, like that of birds in the sky.' },
        { num: 183, pali: 'Sabbapāpassa akaraṇaṃ, kusalassa upasampadā.', english: 'Not to do any evil, to cultivate good, to purify one\'s mind—this is the teaching of the Buddhas.' },
        { num: 184, pali: 'Khantī paramaṃ tapo titikkhā, nibbānaṃ paramaṃ vadanti buddhā.', english: 'Patience is the highest austerity; Nibbāna is supreme, say the Buddhas. One who harms others is not a monk, nor is one who troubles others.' },
        { num: 185, pali: 'Anūpavādo anūpaghāto, pāṭimokkhe ca saṃvaro.', english: 'Not to revile, not to do any harm, to practice restraint according to the fundamental precepts, to be moderate in eating, to dwell in seclusion, to devote oneself to higher concentration—this is the teaching of the Buddhas.' },
        { num: 186, pali: 'Na kahāpaṇavassena, titti kāmesu vijjati.', english: 'Not by a shower of coins can sensual desires be satiated; sensual desires bring little pleasure and much pain.' },
        { num: 187, pali: 'Appassādā dukhā kāmā, iti viññāya paṇḍito.', english: 'Knowing this, the wise man finds no delight even in heavenly pleasures. The disciple of the Fully Enlightened One delights in the destruction of craving.' },
        { num: 188, pali: 'Bahuṃ ve saraṇaṃ yanti, pabbatāni vanāni ca.', english: 'Men go for refuge to many places—to hills, woods, groves, trees, and shrines.' },
        { num: 189, pali: 'Netaṃ kho saraṇaṃ khemaṃ, netaṃ saraṇamuttamaṃ.', english: 'Such refuge is not safe; such refuge is not supreme. One does not become free from suffering by taking such refuge.' },
        { num: 190, pali: 'Yo ca buddhañca dhammañca, saṅghañca saraṇaṃ gato.', english: 'But whoever goes for refuge to the Buddha, the Dhamma, and the Saṅgha, sees with right wisdom the Four Noble Truths.' },
        { num: 191, pali: 'Dukkhaṃ dukkhasamuppādaṃ, dukkhassa ca atikkamaṃ.', english: 'Suffering, the origin of suffering, the overcoming of suffering, and the Noble Eightfold Path leading to the cessation of suffering.' },
        { num: 192, pali: 'Etaṃ kho saraṇaṃ khemaṃ, etaṃ saraṇamuttamaṃ.', english: 'Such refuge is safe; such refuge is supreme. By taking such refuge one is released from all suffering.' },
        { num: 193, pali: 'Dullabho purisājañño, na so sabbattha jāyati.', english: 'Hard to find is the thoroughbred man; he is not born everywhere. Where such a wise man is born, that clan thrives happily.' },
        { num: 194, pali: 'Sukho buddhānaṃ uppādo, sukhā saddhammadesanā.', english: 'Happy is the arising of the Buddhas; happy is the teaching of the True Dhamma; happy is the harmony of the Saṅgha; happy is the practice of those in harmony.' },
        { num: 195, pali: 'Pūjārahe pūjayato, buddhe yadi va sāvake.', english: 'He who worships those worthy of worship, the Buddhas and their disciples, who have transcended all obstacles and passed beyond sorrow and lamentation—he who worships such arahants, the peaceful and fearless, his merit cannot be measured by anyone.' },
        { num: 196, pali: 'Pūjārahe pūjayato, buddhe yadi va sāvake.', english: 'He who worships those worthy of worship, the Buddhas and their disciples, who have transcended all obstacles and passed beyond sorrow and lamentation—he who worships such arahants, the peaceful and fearless, his merit cannot be measured by anyone.' }
    ],
    15: [
        { num: 197, pali: 'Sukhamānaṃ pavassānaṃ, vītacchinnasirā viya.', english: 'We indeed live happily, not hating anyone among those who hate. Among men who hate, we live without hatred.' },
        { num: 198, pali: 'Sukhamānaṃ vassānaṃ, vītacchinnasirā viya.', english: 'We indeed live happily, in good health among the ailing. Among men who are ailing, we live in good health.' },
        { num: 199, pali: 'Uttitthe nappamajjeyya, dhammaṃ sucaritaṃ care.', english: 'We indeed live happily, not yearning for sensual pleasures. Like the householders who yearn for sensual pleasures, we live without yearning.' },
        { num: 200, pali: 'Yathāpi bhaddo ājañño, naṅgalāvattanī sikhī.', english: 'Victory breeds hatred; the defeated live in pain. The peaceful live happily, having abandoned both victory and defeat.' },
        { num: 201, pali: 'Appamatto pamattesu, suttesu bahujāgaro.', english: 'There is no fire like lust, no grip like hate, no net like delusion, no river like craving.' },
        { num: 202, pali: 'Duppabbajjaṃ durabhiramaṃ, durāvāsā gharā dukhā.', english: 'Easy to see are the faults of others, but difficult to see are one\'s own. Like chaff, one winnows others\' faults, but hides one\'s own, like a cheat hides a losing throw.' },
        { num: 203, pali: 'Saddho sīlena sampanno, yasobhogasamappito.', english: 'If one sees a man who shows you your faults, who censures you as though pointing out treasure, associate with such a wise man who speaks the truth.' },
        { num: 204, pali: 'Yo ca vassasataṃ jantu, aggiṃ paricare vane.', english: 'Let him admonish, instruct, and dissuade you from the mean; he is to be loved by the good, not by the bad.' },
        { num: 205, pali: 'Na ve kadariyā devalokaṃ vajanti, bālā have nappasaṃsanti dānaṃ.', english: 'Teach the Dhamma that is good at the beginning, good in the middle, and good at the end, with meaning and with letter; explain the holy life that is fully complete and purified.' },
        { num: 206, pali: 'Pathabyā ekarajjena, saggassa gamanena vā.', english: 'There are those who do not realize that one day we all must die. But those who do realize this settle their quarrels.' },
        { num: 207, pali: 'Yathāpi bhaddo ājañño, naṅgalāvattanī sikhī.', english: 'He who seeks his own happiness by hurting others who also want happiness, shall not find happiness hereafter.' },
        { num: 208, pali: 'Na taṃ kammaṃ kataṃ sādhu, yaṃ katvā anutappati.', english: 'That deed is not well done, which having done, one repents, and the result of which one reaps with tears.' }
    ],
    16: [
        { num: 209, pali: 'Ayoge yuñjamattānaṃ, yogasmiñca ayojayaṃ.', english: 'He who applies himself to what is not his task, and does not apply himself to what is his task, neglecting what he should do and doing what he should not do, such a one increases his defilements.' },
        { num: 210, pali: 'Na taṃ kammaṃ kataṃ sādhu, yaṃ katvā anutappati.', english: 'That deed is not well done, which having done, one repents, and the result of which one reaps with tears.' },
        { num: 211, pali: 'Tañca kammaṃ kataṃ sādhu, yaṃ katvā nānutappati.', english: 'That deed is well done, which having done, one does not repent, and the result of which one reaps with delight and happiness.' },
        { num: 212, pali: 'Pāmojjabahulo bhikkhu, dhammasuddhaparivāro.', english: 'As a solid rock is not shaken by the wind, so the wise are not moved by praise or blame.' },
        { num: 213, pali: 'Tanhakkhayo aho nando, tanhakkhayo sukhaṃ nando.', english: 'The destruction of craving is indeed Nanda; the destruction of craving is indeed happiness.' },
        { num: 214, pali: 'Bahumpi ce saṃhita bhāsaṃ, dhammassa hoti anudhammacārī.', english: 'Though much he recites the sacred texts, but acts not accordingly, that heedless man is like a cowherd who counts others\' cattle. He has no share in the fruits of the holy life.' },
        { num: 215, pali: 'Appampi ce saṃhita bhāsaṃ, dhammassa hoti anudhammacārī.', english: 'Though little he recites the sacred texts, but acts in accordance with the Dhamma, having abandoned lust, hatred, and delusion, having truly known what is good, with mind well-freed, clinging to nothing here or hereafter, he shares the fruits of the holy life.' },
        { num: 216, pali: 'Yo ca vassasataṃ jantu, aggiṃ paricare vane.', english: 'He who lives a hundred years, immoral and unrestrained, lives not as well as one day of the life of a virtuous person who is meditative.' },
        { num: 217, pali: 'Yo ca vassasataṃ jantu, pūjaṃ paricare vane.', english: 'He who lives a hundred years, ignorant and unrestrained, lives not as well as one day of the life of a wise person who is meditative.' },
        { num: 218, pali: 'Yo ca vassasataṃ jantu, kusīto hīnavīriyo.', english: 'He who lives a hundred years, idle and weak, lives not as well as one day of the life of a person who makes an energetic effort.' },
        { num: 219, pali: 'Yo ca vassasataṃ jantu, apassaṃ udayabbayaṃ.', english: 'He who lives a hundred years, not seeing the rise and fall of things, lives not as well as one day of the life of a person who sees the rise and fall of things.' },
        { num: 220, pali: 'Yo ca vassasataṃ jantu, apassaṃ amataṃ padaṃ.', english: 'He who lives a hundred years, not seeing the deathless state, lives not as well as one day of the life of a person who sees the deathless state.' }
    ],
    17: [
        { num: 221, pali: 'Kodhaṃ jahe vippajaheyya mānaṃ, saṃyojanaṃ sabbamatikkameyya.', english: 'One should give up anger, renounce pride, and overcome all fetters. Suffering befalls him who is attached to name and form, and possesses nothing.' },
        { num: 222, pali: 'Yo ve uppatitaṃ kodhaṃ, rathaṃ bhantaṃva vāraye.', english: 'He who checks the anger that has arisen as though checking a swerving chariot—him I call a charioteer; others merely hold the reins.' },
        { num: 223, pali: 'Akkodhena jine kodhaṃ, asādhuṃ sādhunā jine.', english: 'Conquer anger by non-anger; conquer evil by good; conquer the stingy by giving; conquer the liar by truth.' },
        { num: 224, pali: 'Saccaṃ bhaṇe na kujjheyya, dajjā appampi yācito.', english: 'Speak the truth; do not get angry; when asked, give even if you have only a little. By these three means one may go to the presence of the gods.' },
        { num: 225, pali: 'Te hi arahanto khemaṭṭhānaṃ pattā, yesaṃ divā ca ratto ca, niccaṃ bhagavā pūjitā.', english: 'Those sages who are harmless, ever restrained in body, go to the deathless state, where gone they grieve no more.' },
        { num: 226, pali: 'Sadā jāgaramānānaṃ, ahorattānusikkhinaṃ.', english: 'For those who are ever vigilant, who discipline themselves day and night, who are wholly intent on Nibbāna, the defilements come to an end.' },
        { num: 227, pali: 'Porāṇametaṃ atula, netaṃ ajjatanāmiva.', english: 'This is an old saying, O Atula, not just of today: "They blame him who sits silent, they blame him who speaks much, they blame him who speaks in moderation." There is no one in this world who is not blamed.' },
        { num: 228, pali: 'Na cāhu na ca bhavissati, na cetarahi vijjati.', english: 'There never was, there never will be, nor is there now, a person who is wholly blamed or wholly praised.' },
        { num: 229, pali: 'Yaṃ ce viññū pasaṃsanti, anuvicca suve suve.', english: 'But he whom the wise praise, after observing him day by day, him who is of flawless life, wise, and endowed with knowledge and virtue—him do I call a brahmin.' },
        { num: 230, pali: 'Niccaṃ daḷhaparakkamo, thāmavā dhīrā nivātavutti.', english: 'Like fine gold, who is there to blame him? Even the gods praise him; even by Brahma he is praised.' },
        { num: 231, pali: 'Kāyappakopaṃ rakkheyya, kāyena saṃvuto siyā.', english: 'Guard against bodily anger; be restrained in body. Abandoning bodily misconduct, practice good conduct with the body.' },
        { num: 232, pali: 'Vacīpakopaṃ rakkheyya, vācāya saṃvuto siyā.', english: 'Guard against verbal anger; be restrained in speech. Abandoning verbal misconduct, practice good conduct in speech.' },
        { num: 233, pali: 'Manopakopaṃ rakkheyya, manasā saṃvuto siyā.', english: 'Guard against mental anger; be restrained in mind. Abandoning mental misconduct, practice good conduct in mind.' },
        { num: 234, pali: 'Kāyena saṃvutā dhīrā, atho vācāya saṃvutā.', english: 'The wise are restrained in body, restrained in speech, and restrained in mind. They are indeed well-restrained.' }
    ],
    18: [
        { num: 235, pali: 'Paṇḍupalāsova dāni si, yamapurisāpi ca taṃ upaṭṭhitā.', english: 'You are now like a withered leaf; the messengers of death have come near you. You stand at the threshold of departure, yet you have no provisions for the journey.' },
        { num: 236, pali: 'So karohi dīpamattano, khippaṃ vāyama paṇḍito bhava.', english: 'Make an island for yourself; strive quickly; become wise. Purged of impurities and blemishless, you shall go to the divine abode of the noble ones.' },
        { num: 237, pali: 'Upanītavayo ca dāni si, sampayātosi yamassa santikaṃ.', english: 'Your life has now come to an end; you are approaching the presence of Yama. There is no resting place on the way, yet you have no provisions for the journey.' },
        { num: 238, pali: 'So karohi dīpamattano, khippaṃ vāyama paṇḍito bhava.', english: 'Make an island for yourself; strive quickly; become wise. Purged of impurities and blemishless, you shall not come again to birth and decay.' },
        { num: 239, pali: 'Anupubbena medhāvī, thokathokaṃ khane khane.', english: 'Little by little, moment by moment, a wise man should remove his own impurities, as a smith removes the dross from silver.' },
        { num: 240, pali: 'Ayasāva malaṃ samuṭṭhitaṃ, taduṭṭhāya tameva khādati.', english: 'As rust arising from iron eats away the iron itself, so the deeds of the transgressor lead him to a state of woe.' },
        { num: 241, pali: 'Asajjhāyamalā mantā, anuṭṭhānamalā gharā.', english: 'Non-recitation is the stain of sacred texts; non-maintenance is the stain of houses; indolence is the stain of beauty; heedlessness is the stain of the watchful.' },
        { num: 242, pali: 'Malitthiyā duccaritaṃ, maccheraṃ dadato malaṃ.', english: 'Misconduct is the stain of a woman; stinginess is the stain of a giver; evil deeds are stains in this world and the next.' },
        { num: 243, pali: 'Tato malā malataraṃ, avijjā paramaṃ malaṃ.', english: 'But greater than these is ignorance, the greatest stain. Destroy this one stain and become stainless, O monks!' },
        { num: 244, pali: 'Sujīvaṃ ahirikena, kākasūrena dhaṃsinā.', english: 'Easy is the life of the shameless, who is as impudent as a crow, who is a backbiter, presumptuous, arrogant, and corrupt.' },
        { num: 245, pali: 'Hirīmatā ca dujjīvaṃ, niccaṃ sucigavesinā.', english: 'Difficult is the life of the modest, who ever seeks purity, who is detached, humble, clean in life, and discerning.' },
        { num: 246, pali: 'Yo pāṇamatipāteti, musāvādañca bhāsati.', english: 'Whoever kills living beings, speaks falsehood, takes what is not given, goes to another man\'s wife, and is addicted to intoxicating drinks.' },
        { num: 247, pali: 'Surāmerayapānañca, yo naro anuyuñjati.', english: 'Such a man digs up his own root even in this very world.' },
        { num: 248, pali: 'Evaṃ bho purisa jānāhi, pāpadhammā asaññatā.', english: 'Know this, O good man: evil things are difficult to control. Do not let greed and wickedness drag you to suffering for a long time.' },
        { num: 249, pali: 'Dadāti ve yathāsakkhaṃ, yathāpasādanāyako.', english: 'People give according to their faith and as they are pleased. If one becomes discontented with the food and drink given by others, one does not attain meditative concentration, either by day or by night.' },
        { num: 250, pali: 'Yassa cetaṃ samucchinnaṃ, mūlaghaccaṃ samūhataṃ.', english: 'But he in whom this is cut off, uprooted, and destroyed, attains meditative concentration, both by day and by night.' },
        { num: 251, pali: 'Natthi rāgasamo aggi, natthi dosasamo gaho.', english: 'There is no fire like lust, no grip like hate, no net like delusion, no river like craving.' },
        { num: 252, pali: 'Natthi taṇhāsamaṃ jaḷaṃ, natthi khandhasamā nadī.', english: 'The faults of others are easily seen; one\'s own faults are difficult to see. Like chaff, one winnows others\' faults, but hides one\'s own, like a cheat hides a losing throw.' },
        { num: 253, pali: 'Paravajjānupassissa, niccaṃ ujjhānasaññino.', english: 'If one sees a man who shows you your faults, who censures you as though pointing out treasure, associate with such a wise man who speaks the truth.' },
        { num: 254, pali: 'Asāhasena dhammena, samena nayatī pare.', english: 'Let him admonish, instruct, and dissuade you from the mean; he is to be loved by the good, not by the bad.' },
        { num: 255, pali: 'Na tena ariyo hoti, yena pāṇāni hiṃsati.', english: 'One is not noble who injures living beings. One is called noble because one is harmless towards all living beings.' }
    ],
    19: [
        { num: 256, pali: 'Na tena paṇḍito hoti, yāvatā bahu bhāsati.', english: 'One is not wise merely because one speaks much. He who is peaceful, fearless, and free from hatred is called wise.' },
        { num: 257, pali: 'Na tāvatā dhammadharo, yāvatā bahu bhāsati.', english: 'One is not an upholder of the Dhamma merely because one speaks much. He who, having heard even a little, sees the Dhamma with his body, and is not negligent of the Dhamma, is an upholder of the Dhamma.' },
        { num: 258, pali: 'Na tena thero so hoti, yenassa palitaṃ siro.', english: 'One is not an elder merely because one\'s head is grey. One who is ripe in years is called "grown old in vain."' },
        { num: 259, pali: 'Yo ca dhammena cināti, ahiṃsā sabbapāṇinaṃ.', english: 'But he in whom dwell truth, harmlessness, restraint, and self-control, that wise man who is purged of impurities is indeed called an elder.' },
        { num: 260, pali: 'Na vākkaraṇamattena, vaṇṇapokkharatāya vā.', english: 'Not by mere eloquence, nor by beauty of form, does a man become holy, if he is envious, selfish, and deceitful.' },
        { num: 261, pali: 'Yassa cetaṃ samucchinnaṃ, mūlaghaccaṃ samūhataṃ.', english: 'But he in whom these are cut off, uprooted, and destroyed, that wise man who is purged of hatred is indeed called holy.' },
        { num: 262, pali: 'Na muṇḍakena samaṇo, abbato alikaṃ bhaṇaṃ.', english: 'Not by a shaven head does one become a monk, if one lacks restraint and speaks falsehood. How can one who is full of desire and greed be a monk?' },
        { num: 263, pali: 'Yo ca sameti pāpāni, aṇuṃ thūlāni sabbaso.', english: 'But he who always quiets the evil, small or great, is called a monk because he has quieted all evil.' },
        { num: 264, pali: 'Na tena bhikkhu so hoti, yāvatā bhikkhate pare.', english: 'One is not a monk merely because one begs from others. By following the whole code, one becomes a monk, not by a mere outward show.' },
        { num: 265, pali: 'Yo ca sameti pāpāni, aṇuṃ thūlāni sabbaso.', english: 'But he who has set aside both merit and demerit, who leads a holy life, who goes about the world with discrimination, he is indeed called a monk.' },
        { num: 266, pali: 'Na monena muni hoti, mūḷharūpo aviddasu.', english: 'One is not a sage merely because one keeps silent. One may be foolish and ignorant. But the wise man who, as if holding a pair of scales, takes what is good and rejects what is evil, is a sage for that reason.' },
        { num: 267, pali: 'Yo ca sameti pāpāni, aṇuṃ thūlāni sabbaso.', english: 'He who weighs both good and evil that a man does, and thereby harms no living being, is indeed called a sage.' },
        { num: 268, pali: 'Na tena ariyo hoti, yena pāṇāni hiṃsati.', english: 'One is not noble who injures living beings. One is called noble because one is harmless towards all living beings.' },
        { num: 269, pali: 'Na sīlabbatamattena, bāhusaccena vā pana.', english: 'Not by mere morality and austerity, nor by much learning, nor by developing concentration, nor by secluded dwelling, do I attain the bliss of liberation, which no worldling can enjoy.' },
        { num: 270, pali: 'Na monena muni hoti, mūḷharūpo aviddasu.', english: 'Let him not despise what he has received, nor should he live envying others. The monk who envies others does not attain meditative concentration.' },
        { num: 271, pali: 'Na tena ariyo hoti, yena pāṇāni hiṃsati.', english: 'Though receiving little, if a monk does not despise what he has received, the gods praise him as pure of life and energetic.' },
        { num: 272, pali: 'Sabbaso nāmarūpasmiṃ, yassa natthi mamāyitaṃ.', english: 'He who has no attachment whatsoever for name and form, who does not grieve for what is not, he is indeed called a sage.' }
    ],
    20: [
        { num: 273, pali: 'Maggaññāya matassa jantuno, netā sammānavakamā hi jantūnaṃ.', english: 'Of all the paths, the Eightfold Path is the best; of all the truths, the Four Noble Truths are the best; of all things, passionlessness is the best; of all men, the Seeing One is the best.' },
        { num: 274, pali: 'Maggaññāya matassa jantuno, netā sammānavakamā hi jantūnaṃ.', english: 'This is the path; there is no other that leads to the purification of insight. Enter upon this path, and you will make an end of suffering.' },
        { num: 275, pali: 'Maggaññāya matassa jantuno, netā sammānavakamā hi jantūnaṃ.', english: 'Having entered upon this path, you will make an end of suffering. I have made known to you the path for the removal of the thorns.' },
        { num: 276, pali: 'Tumhehi kiccaṃ ātappaṃ, akkhātāro tathāgatā.', english: 'You yourselves must strive; the Buddhas only point the way. Those meditative ones who enter the path are released from the bondage of Māra.' },
        { num: 277, pali: 'Sabbe saṅkhārā aniccāti, yadā paññāya passati.', english: 'When one sees with wisdom that all conditioned things are impermanent, one turns away from suffering; this is the path to purification.' },
        { num: 278, pali: 'Sabbe saṅkhārā dukkhāti, yadā paññāya passati.', english: 'When one sees with wisdom that all conditioned things are suffering, one turns away from suffering; this is the path to purification.' },
        { num: 279, pali: 'Sabbe dhammā anattāti, yadā paññāya passati.', english: 'When one sees with wisdom that all things are without self, one turns away from suffering; this is the path to purification.' },
        { num: 280, pali: 'Uṭṭhānakālamhi anuṭṭhahāno, yuvā balī ālasiyaṃ upeto.', english: 'He who does not exert himself when he should, who though young and strong is full of sloth, with a mind full of vain thoughts—such an indolent man does not find the path to wisdom.' },
        { num: 281, pali: 'Vācānurakkhī manasā susaṃvuto, kāyena ca akusalaṃ na kayirā.', english: 'Guarded in speech, well-restrained in mind, one should do no evil with the body. Purify these three ways of action, and fulfill the path taught by the sages.' },
        { num: 282, pali: 'Yogā ve jāyatī bhūri, ayogā bhūrisaṅkhayo.', english: 'From meditation springs wisdom; from lack of meditation, loss of wisdom. Recognizing these two paths of progress and decline, let one so conduct oneself that wisdom may increase.' },
        { num: 283, pali: 'Vanaṃ chindatha mā rukkhaṃ, vanato jāyatī bhayaṃ.', english: 'Cut down the forest of desire, not the tree. From the forest springs fear. Having cut down both forest and undergrowth, be free from the forest, O monks!' },
        { num: 284, pali: 'Yāva hi vanatho na chijjati, aṇumattopi narassa nārisu.', english: 'As long as the undergrowth of desire, even the least, of man for women is not cut down, so long is his mind in bondage, like the sucking calf to its mother.' },
        { num: 285, pali: 'Ucchinda sinehamattano, kumudaṃ sāradikaṃva.', english: 'Cut off your affection for oneself, as one plucks with the hand an autumn lotus. Develop only the path to peace, to Nibbāna, as taught by the Well-Farer.' },
        { num: 286, pali: 'Idha vassaṃ vasissāmi, idha hemantaṃ gimhaṃ vasissāmi.', english: '"Here I shall dwell in the rain; here in winter and summer." Thus the fool thinks, not realizing the danger of death.' },
        { num: 287, pali: 'Taṃ puttapasusammattaṃ, byāsattamanasaṃ naraṃ.', english: 'The man who is absorbed in his children and cattle, whose mind is attached to them, is carried away by death, like a sleeping village by a great flood.' },
        { num: 288, pali: 'Na santi puttā tāṇāya, na pitā na pi bandhavā.', english: 'Sons are no protection, nor father, nor relatives, when one is seized by death. There is no refuge in kinsmen for one held by the End-Maker.' },
        { num: 289, pali: 'Etamatthavasaṃ ñatvā, paṇḍito sīlasaṃvuto.', english: 'Knowing this, the wise and virtuous man should quickly clear the path that leads to Nibbāna.' }
    ],
    21: [
        { num: 290, pali: 'Mattāsukhapariccāgā, passe ce vipulaṃ sukhaṃ.', english: 'If by giving up a lesser happiness one may behold a greater happiness, let the wise give up the lesser happiness and look to the greater.' },
        { num: 291, pali: 'Paradukkhūpadhānena, yo attano sukhamicchati.', english: 'He who seeks his own happiness by hurting others who also want happiness, shall not find happiness hereafter.' },
        { num: 292, pali: 'Paradukkhūpadhānena, yo attano sukhamicchati.', english: 'He who seeks his own happiness by not hurting others who also want happiness, shall find happiness hereafter.' },
        { num: 293, pali: 'Māvoca pharusaṃ kañci, vuttā paṭivadeyyuṃ taṃ.', english: 'Speak not harshly to anyone, for those thus spoken to might retort. Indeed, angry speech hurts, and retaliation may overtake you.' },
        { num: 294, pali: 'Sace neresi attānaṃ, kaṃso upahato yathā.', english: 'If, like a shattered metal plate, you make no noise, you have attained Nibbāna; anger is found in you no more.' },
        { num: 295, pali: 'Yathā daṇḍena gopālo, gāvo pājeti gocaraṃ.', english: 'As a cowherd with his staff drives cows to pasture, so do old age and death drive the life of living beings.' },
        { num: 296, pali: 'Athappāpāni kammāni, karaṃ bālo na bujjhati.', english: 'The fool does not know that he does evil; but that fool is tormented by his evil deeds like one burnt by fire.' },
        { num: 297, pali: 'Yo daṇḍena adaṇḍesu, appaduṭṭhesu dussati.', english: 'Whoever uses violence on the non-violent and the harmless, quickly falls into one of these ten states.' },
        { num: 298, pali: 'Vividhā dukkhā phusati, bālo caṇḍo ca māṇavo.', english: 'He experiences sharp pain, disaster, bodily injury, serious illness, or mental disorder.' },
        { num: 299, pali: 'Rājato vā upassaggaṃ, abbhakkhaṇaṃ va dāruṇaṃ.', english: 'Trouble from the government, or grave charges, or loss of relatives, or destruction of wealth.' },
        { num: 300, pali: 'Agni vāssa paricare, puttadarassa vāḷabhaṃ.', english: 'Or blazing fire burns his houses, and upon the dissolution of the body, that fool is born in hell.' },
        { num: 301, pali: 'Na naggacariyā na jaṭā na paṅkā, nānāsakā thaṇḍilasāyikā vā.', english: 'Neither going naked, nor matted locks, nor mud, nor fasting, nor lying on the ground, nor smearing oneself with ashes and dust, nor sitting on the heels in penance can purify a mortal who has not overcome doubt.' },
        { num: 302, pali: 'Alaṅkato cepi samaṃ careyya, santo danto niyato brahmacārī.', english: 'Even though he be well-attired, yet if he is peaceful, restrained, established in the holy life, if he has set aside violence towards all beings, he is a holy man, he is a sage, he is a monk.' },
        { num: 303, pali: 'Sāhu sappuriso tiṭṭhati, na tveva alaso naro.', english: 'Rare in the world is that person who is restrained by modesty, who avoids reproach, as a thoroughbred horse avoids the whip.' },
        { num: 304, pali: 'Āyatakena dukkhena, yathā bhūtena jāyati.', english: 'Like a thoroughbred horse touched by the whip, be strenuous and swift. By faith, morality, energy, meditation, and investigation of Dhamma, being endowed with knowledge and conduct, being mindful, abandon this great suffering.' },
        { num: 305, pali: 'Udakañhi nayanti nettikā, usukārā namayanti tejanaṃ.', english: 'Irrigators guide the water; fletchers straighten the arrow; carpenters shape the wood; the wise control themselves.' }
    ],
    22: [
        { num: 306, pali: 'Abhūtavādī nirayaṃ upeti, yo vāpi katvā na karomi cāha.', english: 'The liar goes to hell; also he who, having done something, says, "I did not do it." Both these persons become equal after death, men of base deeds in the hereafter.' },
        { num: 307, pali: 'Kāsāvakaṇṭhā bahavo, pāpadhammā asaññatā.', english: 'Many who wear the yellow robe up to their necks are of evil disposition and unrestrained. Such evil-doers by their evil deeds are born in hell.' },
        { num: 308, pali: 'Seyyo ayoguḷo bhutto, tatto aggisikhūpamo.', english: 'Better to swallow a red-hot iron ball, blazing like fire, than to be an immoral and unrestrained person feeding on the alms of the people.' },
        { num: 309, pali: 'Cattāri ṭhānāni naro pamatto, āpajjati paradārūpasevī.', english: 'Four misfortunes befall the heedless man who consorts with another\'s wife: acquisition of demerit, disturbed sleep, ill-repute, and birth in hell.' },
        { num: 310, pali: 'Acchaṃ vata maṃ yācanaṃ, alābhā vata me vata.', english: 'There is acquisition of demerit as well as evil destiny; brief is the pleasure of the frightened man and woman; the king imposes heavy punishment; therefore a man should not consort with another\'s wife.' },
        { num: 311, pali: 'Yathā sādhāraṇo nāgo, yathā sādhāraṇo vāṇijo.', english: 'As kusa grass, wrongly grasped, cuts the hand, so the monkhood, wrongly handled, drags one to hell.' },
        { num: 312, pali: 'Yathā sādhāraṇo nāgo, yathā sādhāraṇo vāṇijo.', english: 'Any loose act, any corrupt practice, a life of doubt—this does not bear great fruit.' },
        { num: 313, pali: 'Kayirā ce kayirāthenaṃ, daḷhamenaṃ parakkame.', english: 'If something is to be done, let one do it firmly. A monk who is lax only scatters more dust.' },
        { num: 314, pali: 'Sabbapāpassa akaraṇaṃ, kusalassa upasampadā.', english: 'Better left undone is a bad deed, for it will later bring torment. Better done is a good deed, for having done it, one does not repent.' },
        { num: 315, pali: 'Yathāpi selā vipulā, nabhaṃ āhacca pabbatā.', english: 'Like a frontier city, guarded within and without, so guard yourself. Do not let slip this opportunity, for they who let the opportunity slip grieve when consigned to hell.' },
        { num: 316, pali: 'Asaññatā dhīrā na taṃ bujjhanti, ye dhammaṃ parivajjayanti.', english: 'Those who are ashamed of what they should not be ashamed of, and are not ashamed of what they should be ashamed of—such men, embracing false views, enter the evil path.' },
        { num: 317, pali: 'Abhaye bhayadassino, bhaye cābhayadassino.', english: 'Those who fear what they should not fear, and do not fear what they should fear—such men, embracing false views, enter the evil path.' },
        { num: 318, pali: 'Avajje vajjamatino, vajje cāvajjadassino.', english: 'Those who see fault in what is not faulty, and do not see fault in what is faulty—such men, embracing false views, enter the evil path.' },
        { num: 319, pali: 'Vajjañca vajjato ñatvā, avajjañca avajjato.', english: 'But those who know fault as fault and non-fault as non-fault—such men, embracing right views, enter the good path.' }
    ],
    23: [
        { num: 320, pali: 'Yathā nāgo va pūgāyhaṃ, mālāgulaparikkhito.', english: 'Like an elephant in battle endures the arrow shot from the bow, so shall I endure abuse; for many people are ill-behaved.' },
        { num: 321, pali: 'Dantinaṃ nāgavaraṃ, saṅgāme susahanti maṃ.', english: 'The tamed elephant is led to the assembly; the king mounts the tamed elephant. Best among men is the tamed one who endures abuse patiently.' },
        { num: 322, pali: 'Dantā nāgā susīlā, dantā rañño pavaraṃ gajā.', english: 'Excellent are tamed mules, tamed horses of Sindh, and the great elephants of war; but far better is he who has tamed himself.' },
        { num: 323, pali: 'Na hi etehi yānehi, gaccheyya agataṃ disaṃ.', english: 'Not by these vehicles would one go to the untrodden region, as one who is self-tamed goes by his own tamed and well-controlled self.' },
        { num: 324, pali: 'Dhanapālo nāma kuñjaro, kaṭukappabhedano dunnivārayo.', english: 'The elephant called Dhanapāla, in rut and hard to control, does not eat a morsel when bound; the elephant longs for the elephant grove.' },
        { num: 325, pali: 'Middhī yadā hoti mahagghaso ca, niddāyitā samparivattasāyī.', english: 'When a man is sluggish and gluttonous, sleeping and rolling about like a fat hog fed on pig-wash, that fool is reborn again and again.' },
        { num: 326, pali: 'Idaṃ pure cittamācāri cārikaṃ, yenicchakaṃ yatthakāmaṃ yathāsukhaṃ.', english: 'Formerly this mind wandered about as it liked, wherever it desired, at its own pleasure. Now I shall control it thoroughly, as a mahout controls an elephant in rut.' },
        { num: 327, pali: 'Appamādarataṃ hotha, sacittamanurakkhatha.', english: 'Delight in heedfulness! Guard your mind well! Draw yourselves out of the evil way, as an elephant sunk in mud draws himself out.' },
        { num: 328, pali: 'Sace labhetha nipakaṃ sahāyaṃ, saddhiṃ caraṃ sādhuvihāridhīraṃ.', english: 'If you find a wise companion, a virtuous and steadfast friend, then overcome all obstacles and walk with him, glad and mindful.' },
        { num: 329, pali: 'No ce labhetha nipakaṃ sahāyaṃ, saddhiṃ caraṃ sādhuvihāridhīraṃ.', english: 'If you find no wise companion, no virtuous and steadfast friend, then walk alone, like a king who has left his conquered kingdom behind, or like an elephant in the elephant forest.' },
        { num: 330, pali: 'Ekassa caritaṃ seyyo, natthi bāle sahāyatā.', english: 'Better it is to live alone; there is no fellowship with a fool. Live alone and do no evil; be carefree like an elephant in the elephant forest.' },
        { num: 331, pali: 'Atthamhi jātamhi sukhā sahāyā, tuṭṭhī sukhā yā itarītarena.', english: 'A friend in need is a blessing; contentment with whatever is is a blessing; merit at the end of life is a blessing; the abandoning of all suffering is a blessing.' },
        { num: 332, pali: 'Sukhā matteyyatā loke, atho petteyyatā sukhā.', english: 'In this world, it is a blessing to serve one\'s mother; it is a blessing to serve one\'s father; it is a blessing to serve the monks; it is a blessing to serve the holy men.' },
        { num: 333, pali: 'Sukhaṃ yāva jarā sīlaṃ, sukhā saddhā patiṭṭhitā.', english: 'Blessed is virtue till old age; blessed is faith that is steadfast; blessed is the attainment of wisdom; blessed is the avoidance of evil.' }
    ],
    24: [
        { num: 334, pali: 'Manujassa pamattacārino, taṇhā vaḍḍhati mālūriva.', english: 'The craving of the man who lives carelessly increases like a creeping vine. He runs from birth to birth, like a monkey seeking fruit in the forest.' },
        { num: 335, pali: 'Yaṃ esā sahate jammiṃ, taṇhā loke visattikā.', english: 'Whomsoever this miserable craving, this entanglement in the world, overcomes, his sorrows grow like grass after rain.' },
        { num: 336, pali: 'Yo cetaṃ sahati jammiṃ, taṇhaṃ loke duraccayaṃ.', english: 'But whosoever overcomes this miserable craving, so difficult to overcome in this world, his sorrows fall away from him, like water-drops from a lotus leaf.' },
        { num: 337, pali: 'Taṃ vo vadāmi bhaddaṃ vo, yāvantettha samāgatā.', english: 'This I say to you: Good luck to all assembled here! Dig up the root of craving, as one digs up the grass in search of the root. Do not let Māra break you again and again, as the flood breaks the reed.' },
        { num: 338, pali: 'Yathāpi mūle anupaddave daḷhe, chinnopi rukkho punareva rūhati.', english: 'As a tree, even if it has been cut down, grows again if its root is undamaged and strong, so if latent craving is not rooted out, this suffering arises again and again.' },
        { num: 339, pali: 'Yassa chattiṃsatī sotā, manāpasavaṇā bhusā.', english: 'The currents flow everywhere; the creeper of craving sprouts and stands. Seeing this creeper, cut the root with wisdom.' },
        { num: 340, pali: 'Savanti sabbadhi sotā, latā uppajja tiṭṭhati.', english: 'The currents flow everywhere; the creeper of craving sprouts and stands. Seeing this creeper, cut the root with wisdom.' },
        { num: 341, pali: 'Tañca disvāna lābhena, alābhena ca yo siyā.', english: 'Happiness flows to the person who is satisfied; the dissatisfied person is not happy. The wise man who has cut the stream of craving goes to happiness.' },
        { num: 342, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 343, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 344, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 345, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 346, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 347, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 348, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 349, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 350, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 351, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 352, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 353, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 354, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 355, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 356, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 357, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 358, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' },
        { num: 359, pali: 'Taṇhāya jāyatī soko, taṇhāya jāyatī bhayaṃ.', english: 'From craving springs grief; from craving springs fear. For one who is wholly free from craving, there is no grief, much less fear.' }
    ],
    25: [
        { num: 360, pali: 'Cakkhunā saṃvaro sādhu, cakkhunā saṃvaro sukho.', english: 'Good is restraint of the eye; good is restraint of the ear; good is restraint of the nose; good is restraint of the tongue.' },
        { num: 361, pali: 'Kāyena saṃvaro sādhu, kāyena saṃvaro sukho.', english: 'Good is restraint of the body; good is restraint of speech; good is restraint of the mind; good is restraint in everything. The monk who is restrained in everything is freed from all suffering.' },
        { num: 362, pali: 'Hatthasaññato pādasaññato, vācāya saññato saññatuttamo.', english: 'He who controls his hands, controls his feet, controls his speech, and has complete control of himself; who finds delight in insight development and is calm—him do I call a monk.' },
        { num: 363, pali: 'Yo mukhasaññato bhikkhu, mantabhāṇī anuddhato.', english: 'The monk who is controlled in speech, who speaks wisely and calmly, who teaches the meaning and the Dhamma—his word is sweet.' },
        { num: 364, pali: 'Dhammārāmo dhammarato, dhammaṃ anuvicintayaṃ.', english: 'He who dwells in the Dhamma, delights in the Dhamma, meditates on the Dhamma, and recollects the Dhamma—such a monk does not fall away from the Dhamma.' },
        { num: 365, pali: 'Sāhu dassanamariyānaṃ, sannivāso sadā sukho.', english: 'Good is the sight of the noble ones; good is their company always. By not seeing fools, one would be happy always.' },
        { num: 366, pali: 'Bālasaṅgatacārī hi, dīghamaddhāna socati.', english: 'For he who consorts with fools grieves for a long time. Association with fools is ever painful, like association with enemies; association with the wise is happy, like meeting with kinsfolk.' },
        { num: 367, pali: 'Dhiratthu mā purisaṃ jaññā, bhajamānaṃ bahubbhi ca.', english: 'Therefore, follow the noble one, the wise, the learned, the much-enduring, the dutiful, the noble; follow such a good and wise man, as the moon follows the path of the stars.' },
        { num: 368, pali: 'Ovadeyyānusāseyya, asabbhā ca nivāraye.', english: 'One should exhort others to do good, and should be self-controlled; such a person is dear to the good, but is not dear to the bad.' },
        { num: 369, pali: 'Na bhaje pāpake mitte, na bhaje purisādhame.', english: 'One should not associate with bad friends, nor with the vile. One should associate with good friends, and with the noble.' },
        { num: 370, pali: 'Dhammapīti sukhaṃ seti, vippasannena cetasā.', english: 'One who drinks the Dhamma lives happily with a peaceful mind; the wise one ever delights in the Dhamma revealed by the noble ones.' },
        { num: 371, pali: 'Udakañhi nayanti nettikā, usukārā namayanti tejanaṃ.', english: 'Irrigators guide the water; fletchers straighten the arrow; carpenters shape the wood; the wise control themselves.' },
        { num: 372, pali: 'Selo yathā ekaghano, vātena na samīrati.', english: 'Just as a solid rock is not shaken by the wind, so the wise are not moved by praise or blame.' },
        { num: 373, pali: 'Yathāpi rahado gambhīro, vippasanno anāvilo.', english: 'Just as a deep lake is clear and calm, so the wise become tranquil having heard the Dhamma.' },
        { num: 374, pali: 'Sabbattha ve sappurisā cajanti, na kāmakāmā lapayanti santo.', english: 'The good give up everything; the peaceful do not prattle about sense pleasures. Touched by happiness or by pain, the wise show no elation or depression.' },
        { num: 375, pali: 'Na attahetu na parassa hetu, na puttamicche na dhanaṃ na raṭṭhaṃ.', english: 'For his own sake or for the sake of others, he does not desire sons, wealth, or kingdom; he does not desire his own success by unfair means; such a one is virtuous, wise, and righteous.' },
        { num: 376, pali: 'Appakā te manussesu, ye janā pāragāmino.', english: 'Few among men are those who cross to the farther shore. The rest, the bulk of mankind, only run up and down on this shore.' },
        { num: 377, pali: 'Athāyaṃ dhammo deepito, yasmā etaṃ sammā devamanussā.', english: 'But those who live according to the well-taught Dhamma will cross to the farther shore, hard to reach, beyond the realm of death.' },
        { num: 378, pali: 'Kāyena saṃvutā dhīrā, atho vācāya saṃvutā.', english: 'The wise, controlled in body, speech, and mind, who are well-controlled, indeed they are controlled.' },
        { num: 379, pali: 'Manasā saṃvutā dhīrā, te ve suparisaṃvutā.', english: 'The wise who are well-controlled in mind are indeed well-controlled.' },
        { num: 380, pali: 'Sīlasaṃvutasāyino, indriyesu susaṃvutā.', english: 'Those who are well-controlled in virtue, well-controlled in the senses, moderate in eating, and devoted to the higher mind, they are called the well-controlled.' },
        { num: 381, pali: 'Uyyuñjanti satīmanto, na nikete ramanti te.', english: 'The mindful ones exert themselves; they take no delight in abodes. Like swans that abandon the lake, they leave home after home behind.' },
        { num: 382, pali: 'Yesaṃ sannicayo natthi, ye pariññātabhojanā.', english: 'Those who have no accumulation, who have comprehended the nature of food, whose domain is the liberation of the void and the signless, their path is difficult to understand, like that of birds in the sky.' }
    ],
    26: [
        { num: 383, pali: 'Chinda sotaṃ parakkamma, kāme panūda brāhmaṇa.', english: 'Cut off the stream; be energetic, O brahmin. Having known the destruction of conditioned things, be knower of the unmade.' },
        { num: 384, pali: 'Yadā dvayesu dhammesu, pāragū hoti brāhmaṇo.', english: 'When the brahmin has reached the farther shore of both states of being, then all the fetters of that knowing one fall away.' },
        { num: 385, pali: 'Yassa pāraṃ apāraṃ vā, pārāpāraṃ na vijjati.', english: 'For whom there exists neither the hither nor the farther shore, nor both the hither and the farther shore—him, free from sorrow and dust, do I call a brahmin.' },
        { num: 386, pali: 'Jhāyiṃ virajamāsīnaṃ, kiccakiccena brāhmaṇaṃ.', english: 'The meditative one, sitting in solitude, who has done what should be done, who is free from defilements, who has attained the highest goal—him do I call a brahmin.' },
        { num: 387, pali: 'Divā tapati ādicco, rattimābhāti candimā.', english: 'By day shines the sun; by night shines the moon; shines the warrior in his armor; shines the brahmin in meditation. But the Buddha shines resplendent all day and all night.' },
        { num: 388, pali: 'Bāhitapāpoti brāhmaṇo, samacariyā samaṇoti vuccati.', english: 'Because he has discarded evil, he is called a brahmin; because he lives in peace, he is called a samaṇa; because he gives up the impurities, he is called a pabbajita.' },
        { num: 389, pali: 'Na brāhmaṇassa pahareyya, nāssa muñcetha brāhmaṇo.', english: 'One should not strike a brahmin; a brahmin should not vent his anger on the striker. Shame on him who strikes a brahmin! More shame on him who gives vent to his anger!' },
        { num: 390, pali: 'Na brāhmaṇassetadakiñci, seyyo yadā nisedhako.', english: 'Nothing is better for a brahmin than the mind that is held back from what is dear and not dear.' },
        { num: 391, pali: 'Yassa kāyena vācāya, manasā natthi dukkaṭaṃ.', english: 'He who does no evil by body, speech, or mind, who is restrained in these three respects—him do I call a brahmin.' },
        { num: 392, pali: 'Yamhā dhammaṃ vijāneyya, sammāsambuddhadesitaṃ.', english: 'From whom one should learn the Dhamma taught by the Fully Enlightened One—worship that worthy one, as a brahmin worships the sacrificial fire.' },
        { num: 393, pali: 'Na jaṭāhi na gottena, na jaccā hoti brāhmaṇo.', english: 'Not by matted hair, not by lineage, not by birth is one a brahmin. He in whom there is truth and righteousness, he is pure; he is a brahmin.' },
        { num: 394, pali: 'Kiṃ te jaṭāhi dummedha, kiṃ te ajinasāṭiyā.', english: 'What is the use of your matted hair, O fool? What is the use of your garment of skin? Within you there is a jungle; outwardly you clean yourself.' },
        { num: 395, pali: 'Paṃsukūladharaṃ jantuṃ, kisakaṃ dhammasandharaṃ.', english: 'The man who wears dust-heap robes, who is lean, whose veins stand out, who meditates alone in the forest—him do I call a brahmin.' },
        { num: 396, pali: 'Na cāhaṃ brāhmaṇaṃ brūmi, yonijaṃ mattisambhavaṃ.', english: 'I do not call him a brahmin merely because he is born of a brahmin mother. He is merely a brahmin by address if he is full of attachments. He who is free from attachments and clinging—him do I call a brahmin.' },
        { num: 397, pali: 'Sabbasaṃyojanaṃ chetvā, yo ve na paritassati.', english: 'He who has cut off all fetters, who trembles not, who has gone beyond all attachments, who is unbound—him do I call a brahmin.' },
        { num: 398, pali: 'Chetvā naddhiṃ varattañca, sandānaṃ sahanukkamaṃ.', english: 'He who has cut the strap, the thong, the cord, and the bridle, who has thrown off the bar, who is awakened—him do I call a brahmin.' },
        { num: 399, pali: 'Akkosaṃ vadhabandhañca, aduṭṭho yo titikkhati.', english: 'He who, though abused, beaten, and bound, bears no ill will, who has forbearance as his power and strength—him do I call a brahmin.' },
        { num: 400, pali: 'Akkodhanaṃ vatavantaṃ, sīlavantaṃ anussadaṃ.', english: 'He who is free from anger, who is dutiful, virtuous, without craving, self-subdued, bearing his final body—him do I call a brahmin.' },
        { num: 401, pali: 'Viraṃ mālāva muttaṃsaṃ, dhārentaṃ antimadehinaṃ.', english: 'Like water on a lotus leaf, like a mustard seed on the point of a needle, he who clings not to sensual pleasures—him do I call a brahmin.' },
        { num: 402, pali: 'Yo dukkhassa pajānāti, idheva khayamattano.', english: 'He who, even here, realizes the extinction of his suffering, who has laid down the burden, who is unbound—him do I call a brahmin.' },
        { num: 403, pali: 'Gambhīrapaññaṃ medhāviṃ, maggāmaggassa kovidaṃ.', english: 'He of profound wisdom, intelligent, skilled in distinguishing the right path from the wrong path, who has attained the highest goal—him do I call a brahmin.' },
        { num: 404, pali: 'Asaṃsaṭṭhaṃ gahaṭṭhehi, anāgārehi cūbhayaṃ.', english: 'He who is not intimate with householders or with the homeless, who wanders without abode, who is without desires—him do I call a brahmin.' },
        { num: 405, pali: 'Nidhāya daṇḍaṃ bhūtesu, tasesu thāvaresu ca.', english: 'He who has laid aside the rod in regard to all beings, whether feeble or strong, who neither kills nor causes to kill—him do I call a brahmin.' },
        { num: 406, pali: 'Aviruddhaṃ viruddhesu, attadaṇḍesu nibbutaṃ.', english: 'He who is friendly among the hostile, peaceful among the violent, unattached among the attached—him do I call a brahmin.' },
        { num: 407, pali: 'Yassa rāgo ca doso ca, māno makkho ca ohito.', english: 'He in whom lust, hatred, pride, and envy have fallen away, like a mustard seed from the point of a needle—him do I call a brahmin.' },
        { num: 408, pali: 'Akakkasaṃ viññāpaniṃ, giraṃ saccaṃ udīraye.', english: 'He who speaks words that are gentle, instructive, and true, by which he offends no one—him do I call a brahmin.' },
        { num: 409, pali: 'Yādihaṃ labhati nikkhepaṃ, na taṃ bālo labhati nikkhepaṃ.', english: 'He who takes nothing in this world that is not given to him, be it long or short, small or large, good or bad—him do I call a brahmin.' },
        { num: 410, pali: 'Āsā yassa na vijjanti, asmiṃ loke paramhi ca.', english: 'He who has no desires, either for this world or for the next—him do I call a brahmin.' },
        { num: 411, pali: 'Yassālayā na vijjanti, aññāṇā ca na vijjanti.', english: 'He who has no clinging, who through knowledge is free from doubt, who has plunged into the deathless—him do I call a brahmin.' },
        { num: 412, pali: 'Yo ca puññañca pāpañca, ubho saṅgaṃ upaccagā.', english: 'He who has transcended both merit and demerit here, who is sorrowless, stainless, and pure—him do I call a brahmin.' },
        { num: 413, pali: 'Candaṃ va vimalaṃ suddhaṃ, vippasannamanāvilaṃ.', english: 'He who, like the moon, is stainless, pure, serene, and undisturbed—him do I call a brahmin.' },
        { num: 414, pali: 'Yassa maggaṃ na jānanti, devā gandhabbamānusā.', english: 'He whose track is unknown to gods, spirits, and men, who has destroyed all defilements, who is an arahant—him do I call a brahmin.' },
        { num: 415, pali: 'Yassa pure ca pacchā ca, majjhe ca natthi kiñcanaṃ.', english: 'He for whom there is nothing before, after, or in between, who owns nothing and grasps at nothing—him do I call a brahmin.' },
        { num: 416, pali: 'Usabhaṃ pavaraṃ vīraṃ, mahesiṃ vijitāvinaṃ.', english: 'The bull, the excellent hero, the great sage, the conqueror, the desireless, the cleansed, the awakened—him do I call a brahmin.' },
        { num: 417, pali: 'Pubbenivāsaṃ yo vedī, saggāpāyañca passati.', english: 'He who knows his former lives, who sees heaven and hell, who has reached the end of births, who is a sage perfect in knowledge—him do I call a brahmin.' },
        { num: 418, pali: 'Samaññā hesā lokasmiṃ, nāmagottaṃ pakappitaṃ.', english: 'This is merely a designation in the world; the name and clan are assigned. Originating in convention, they are assigned here and there.' },
        { num: 419, pali: 'Samaññā hesā lokasmiṃ, nāmagottaṃ pakappitaṃ.', english: 'Those who do not know this are ignorant; those who know it are wise.' },
        { num: 420, pali: 'Samaññā hesā lokasmiṃ, nāmagottaṃ pakappitaṃ.', english: 'Those who do not know this are ignorant; those who know it are wise.' },
        { num: 421, pali: 'Samaññā hesā lokasmiṃ, nāmagottaṃ pakappitaṃ.', english: 'Those who do not know this are ignorant; those who know it are wise.' },
        { num: 422, pali: 'Samaññā hesā lokasmiṃ, nāmagottaṃ pakappitaṃ.', english: 'Those who do not know this are ignorant; those who know it are wise.' },
        { num: 423, pali: 'Samaññā hesā lokasmiṃ, nāmagottaṃ pakappitaṃ.', english: 'Those who do not know this are ignorant; those who know it are wise.' }
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
        // Show informative placeholder with subtle cached indicator
        const verseRange = chapter.verses;
        const count = verseRange[1] - verseRange[0] + 1;

        let html = `
            <div style="color: var(--text-muted); padding: 12px 20px; text-align: center; font-size: 0.85rem; border-radius: 8px; background: var(--bg-card); margin-bottom: 20px; opacity: 0.8;">
                <small>📖 Cached content</small>
            </div>
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
