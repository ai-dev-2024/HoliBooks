/**
 * HoliBooks - Guru Granth Sahib Module
 * Using GurbaniNow API
 */

const API_BASE = 'https://api.gurbaninow.com/v2';
const TOTAL_ANGS = 1430;

let currentAng = 1;

const angInput = document.getElementById('ang-input');
const goBtn = document.getElementById('go-ang');
const prevBtn = document.getElementById('prev-ang');
const nextBtn = document.getElementById('next-ang');
const angTitle = document.getElementById('ang-title');
const versesContainer = document.getElementById('verses-container');
const themeToggle = document.getElementById('theme-toggle');

async function init() {
    const saved = HoliBooks.storage.get('gurbani_ang');
    if (saved) currentAng = saved;

    angInput.value = currentAng;
    await loadAng(currentAng);
    setupEventListeners();
}

async function loadAng(angNum) {
    if (angNum < 1 || angNum > TOTAL_ANGS) return;

    currentAng = angNum;
    HoliBooks.showLoading(versesContainer, 'Loading Gurbani...');

    try {
        const response = await HoliBooks.fetchWithRetry(`${API_BASE}/ang/${angNum}`, {}, 2);

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
                    line: { gurmukhi: { unicode: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥' } },
                    translation: { en: { bdb: 'One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred. Image Of The Undying, Beyond Birth, Self-Existent. By Guru\'s Grace.' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                },
                {
                    line: { gurmukhi: { unicode: '॥ ਜਪੁ ॥' } },
                    translation: { en: { bdb: 'Chant And Meditate:' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                },
                {
                    line: { gurmukhi: { unicode: 'ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥' } },
                    translation: { en: { bdb: 'True In The Primal Beginning. True Throughout The Ages.' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                },
                {
                    line: { gurmukhi: { unicode: 'ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥੧॥' } },
                    translation: { en: { bdb: 'True Here And Now. O Nanak, Forever And Ever True. ||1||' } },
                    shabad: { writer: { english: 'Guru Nanak Dev Ji' } }
                }
            ]
        };
    }
    return null;
}

function renderVerses(data) {
    const page = data.page || [];

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
        html += `
            <article class="shabad-card">
                ${line.line?.gurmukhi ? `<p class="shabad-gurmukhi">${line.line.gurmukhi.unicode}</p>` : ''}
                ${line.line?.transliteration ? `<p class="shabad-transliteration">${line.line.transliteration.english}</p>` : ''}
                ${line.line?.translation ? `<p class="shabad-translation">${line.line.translation.english.default}</p>` : ''}
            </article>
        `;
    });

    versesContainer.innerHTML = html || '<p class="loading">No content found for this Ang</p>';
}

function updateNavigation() {
    prevBtn.disabled = currentAng <= 1;
    nextBtn.disabled = currentAng >= TOTAL_ANGS;
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

    themeToggle.addEventListener('click', () => HoliBooks.theme.toggle());
}

document.addEventListener('DOMContentLoaded', init);
