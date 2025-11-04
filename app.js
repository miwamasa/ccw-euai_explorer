// EU AI Act Article Explorer & Editor
// Application State
let appData = {
    schema_version: "1.0",
    description: "欧州AI法 P23～P70の全条文データ",
    created_at: new Date().toISOString(),
    articles: []
};

let currentArticle = null;
let editMode = false;
let filteredArticles = [];

// DOM Elements
const articleList = document.getElementById('articleList');
const articleDetail = document.getElementById('articleDetail');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const riskFilter = document.getElementById('riskFilter');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadDefaultData();
});

function initializeEventListeners() {
    document.getElementById('loadDataBtn').addEventListener('click', loadData);
    document.getElementById('saveDataBtn').addEventListener('click', saveData);
    document.getElementById('addArticleBtn').addEventListener('click', addNewArticle);
    document.getElementById('generateSlidesBtn').addEventListener('click', generateSlides);

    searchInput.addEventListener('input', filterArticles);
    categoryFilter.addEventListener('change', filterArticles);
    riskFilter.addEventListener('change', filterArticles);

    // Modal controls
    const modal = document.getElementById('slideModal');
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    document.getElementById('prevSlide').addEventListener('click', () => navigateSlide(-1));
    document.getElementById('nextSlide').addEventListener('click', () => navigateSlide(1));
    document.getElementById('downloadSlides').addEventListener('click', downloadSlides);
}

// Load default data from JSON file
async function loadDefaultData() {
    try {
        const response = await fetch('data/eu_ai_act_articles_complete.json');
        if (response.ok) {
            appData = await response.json();
            filteredArticles = appData.articles;
            renderArticleList();
            showNotification('データを読み込みました', 'success');
        }
    } catch (error) {
        console.log('デフォルトデータの読み込みに失敗しました。空のデータセットで開始します。');
        filteredArticles = [];
        renderArticleList();
    }
}

// Load data from file
function loadData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                appData = JSON.parse(event.target.result);
                filteredArticles = appData.articles;
                renderArticleList();
                showNotification('JSONデータを読み込みました', 'success');
            } catch (error) {
                showNotification('JSONの解析に失敗しました', 'error');
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

// Save data to JSON file
function saveData() {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `eu_ai_act_articles_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotification('JSONデータを保存しました', 'success');
}

// Filter articles based on search and filters
function filterArticles() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const risk = riskFilter.value;

    filteredArticles = appData.articles.filter(article => {
        const matchesSearch = !searchTerm ||
            article.article_number.toLowerCase().includes(searchTerm) ||
            article.title_ja.toLowerCase().includes(searchTerm) ||
            article.title_en.toLowerCase().includes(searchTerm);

        const matchesCategory = !category || article.category === category;
        const matchesRisk = !risk || article.risk_level === risk;

        return matchesSearch && matchesCategory && matchesRisk;
    });

    renderArticleList();
}

// Render article list in left pane
function renderArticleList() {
    articleList.innerHTML = '';

    if (filteredArticles.length === 0) {
        articleList.innerHTML = '<div style="padding: 1rem; text-align: center; color: #999;">条目が見つかりません</div>';
        return;
    }

    filteredArticles.forEach(article => {
        const item = document.createElement('div');
        item.className = 'article-item';
        if (currentArticle && currentArticle.article_id === article.article_id) {
            item.classList.add('active');
        }

        item.innerHTML = `
            <div class="article-item-number">${article.article_number}</div>
            <div class="article-item-title">${article.title_ja}</div>
            <div class="article-item-meta">
                ${article.category} | ${article.risk_level}
            </div>
        `;

        item.addEventListener('click', () => selectArticle(article));
        articleList.appendChild(item);
    });
}

// Select and display article
function selectArticle(article) {
    currentArticle = article;
    editMode = false;
    renderArticleDetail();
    renderArticleList(); // Update active state
}

// Render article detail in right pane
function renderArticleDetail() {
    if (!currentArticle) {
        articleDetail.innerHTML = `
            <div class="welcome-message">
                <h2>欢迎使用欧州AI法条目エクスプローラー</h2>
                <p>左側のリストから条目を選択してください。</p>
            </div>
        `;
        return;
    }

    const article = currentArticle;

    articleDetail.innerHTML = `
        <div class="detail-header ${editMode ? 'edit-mode' : ''}">
            <h2>${article.article_number}: ${article.title_ja}</h2>
            <p style="color: #7f8c8d; font-style: italic;">${article.title_en}</p>
            <div class="detail-meta">
                <span class="meta-badge category">${getCategoryLabel(article.category)}</span>
                <span class="meta-badge risk">${getRiskLabel(article.risk_level)}</span>
                <span class="meta-badge section">セクション: ${article.section_id}</span>
                <span class="meta-badge">スライド: ${article.slide_pages.join(', ')}</span>
            </div>
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="toggleEditMode()">${editMode ? '表示モード' : '編集モード'}</button>
                <button class="btn btn-danger" onclick="deleteArticle()">削除</button>
            </div>
        </div>

        <div class="detail-section">
            <h3>条文本文</h3>
            <div class="text-content ${editMode ? 'editable' : ''}">
                <strong>日本語:</strong><br>
                ${editMode ?
                    `<textarea id="text_ja" rows="3">${article.article_text.ja}</textarea>` :
                    `<p>${article.article_text.ja}</p>`
                }
            </div>
            <div class="text-content ${editMode ? 'editable' : ''}">
                <strong>English:</strong><br>
                ${editMode ?
                    `<textarea id="text_en" rows="3">${article.article_text.en}</textarea>` :
                    `<p>${article.article_text.en}</p>`
                }
            </div>
        </div>

        <div class="detail-section">
            <h3>要件 (${article.requirements.length}件)</h3>
            ${renderRequirements(article.requirements)}
        </div>

        ${article.related_articles.length > 0 ? `
            <div class="detail-section">
                <h3>関連条文</h3>
                <div>
                    ${article.related_articles.map(rel => `
                        <span class="related-item" onclick="navigateToArticle('${rel.article_id}')">
                            ${rel.article_number}: ${rel.description}
                        </span>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        ${article.related_recitals.length > 0 ? `
            <div class="detail-section">
                <h3>関連前文</h3>
                <div>
                    ${article.related_recitals.map(rec => `
                        <div style="padding: 0.5rem; background: #f9f9f9; margin-bottom: 0.5rem; border-radius: 4px;">
                            <strong>${rec.recital_number}:</strong> ${rec.summary_ja}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        ${article.related_annexes.length > 0 ? `
            <div class="detail-section">
                <h3>関連付属書</h3>
                <div>
                    ${article.related_annexes.map(ann => `
                        <div style="padding: 0.5rem; background: #f9f9f9; margin-bottom: 0.5rem; border-radius: 4px;">
                            <strong>${ann.annex_id}:</strong> ${ann.title_ja}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        ${article.notes.length > 0 ? `
            <div class="detail-section">
                <h3>注釈</h3>
                <div>
                    ${article.notes.map(note => `
                        <div style="padding: 0.5rem; background: #fffef7; margin-bottom: 0.5rem; border-radius: 4px; border-left: 3px solid #f39c12;">
                            <strong>[${note.type}]</strong> ${note.content_ja}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <div class="detail-section">
            <h3>メタデータ</h3>
            <div style="padding: 1rem; background: #f9f9f9; border-radius: 4px;">
                <p><strong>ステータス:</strong> ${article.metadata.status}</p>
                <p><strong>作成日:</strong> ${new Date(article.metadata.created_at).toLocaleString('ja-JP')}</p>
                <p><strong>更新日:</strong> ${new Date(article.metadata.updated_at).toLocaleString('ja-JP')}</p>
                <p><strong>バージョン:</strong> ${article.metadata.version}</p>
                <p><strong>作成者:</strong> ${article.metadata.author}</p>
                ${article.metadata.tags.length > 0 ? `
                    <p><strong>タグ:</strong> ${article.metadata.tags.join(', ')}</p>
                ` : ''}
            </div>
        </div>
    `;
}

function renderRequirements(requirements) {
    if (requirements.length === 0) {
        return '<p style="color: #999;">要件なし</p>';
    }

    return requirements.map(req => `
        <div class="requirement-item">
            <div class="requirement-header">${req.req_id}: ${req.type}</div>
            <div class="requirement-description">
                <strong>日本語:</strong> ${req.description_ja}<br>
                <strong>English:</strong> ${req.description_en}
            </div>
            ${req.sub_items && req.sub_items.length > 0 ? `
                <div style="margin-left: 1rem; margin-top: 0.5rem;">
                    <strong>サブ項目:</strong>
                    <ul style="margin-top: 0.3rem;">
                        ${req.sub_items.map(sub => `
                            <li>${sub.description_ja}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="requirement-meta">
                ${req.conditions ? `条件: ${req.conditions} | ` : ''}
                ${req.verification_method ? `検証方法: ${req.verification_method} | ` : ''}
                ${req.responsible_party ? `責任者: ${req.responsible_party}` : ''}
            </div>
        </div>
    `).join('');
}

function toggleEditMode() {
    editMode = !editMode;

    if (!editMode && currentArticle) {
        // Save changes
        const textJa = document.getElementById('text_ja');
        const textEn = document.getElementById('text_en');

        if (textJa && textEn) {
            currentArticle.article_text.ja = textJa.value;
            currentArticle.article_text.en = textEn.value;
            currentArticle.metadata.updated_at = new Date().toISOString();
            showNotification('変更を保存しました', 'success');
        }
    }

    renderArticleDetail();
}

function deleteArticle() {
    if (!currentArticle) return;

    if (confirm(`${currentArticle.article_number}を削除してもよろしいですか?`)) {
        const index = appData.articles.findIndex(a => a.article_id === currentArticle.article_id);
        if (index > -1) {
            appData.articles.splice(index, 1);
            currentArticle = null;
            filterArticles();
            renderArticleDetail();
            showNotification('条目を削除しました', 'success');
        }
    }
}

function navigateToArticle(articleId) {
    const article = appData.articles.find(a => a.article_id === articleId);
    if (article) {
        selectArticle(article);
        // Scroll to top
        articleDetail.scrollTop = 0;
    }
}

// Add new article
function addNewArticle() {
    const newArticleNumber = prompt('新しい条目番号を入力してください（例: 24条）:');
    if (!newArticleNumber) return;

    const newArticleId = `article_${newArticleNumber.replace(/[^0-9]/g, '')}`;

    // Check if article already exists
    if (appData.articles.find(a => a.article_id === newArticleId)) {
        showNotification('この条目IDは既に存在します', 'error');
        return;
    }

    const newArticle = {
        article_id: newArticleId,
        article_number: newArticleNumber,
        section_id: "3-x",
        title_ja: "新しい条目",
        title_en: "New Article",
        slide_pages: [],
        category: "general",
        risk_level: "general",
        article_text: {
            ja: "条文本文（日本語）",
            en: "Article text (English)"
        },
        requirements: [],
        related_articles: [],
        related_recitals: [],
        related_annexes: [],
        notes: [],
        visual_elements: {
            has_flowchart: false,
            has_diagram: false,
            has_table: false,
            elements: []
        },
        metadata: {
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: "1.0",
            author: "エディタユーザー",
            status: "draft",
            tags: [],
            comments: []
        }
    };

    appData.articles.push(newArticle);
    filterArticles();
    selectArticle(newArticle);
    showNotification('新しい条目を追加しました', 'success');
}

// Generate slides
let currentSlideIndex = 0;
let slides = [];

function generateSlides() {
    slides = [];

    // Generate slides for each article
    appData.articles.forEach(article => {
        // Title slide
        slides.push({
            title: `${article.article_number}: ${article.title_ja}`,
            content: `
                <h2>${article.article_number}: ${article.title_ja}</h2>
                <h3 style="color: #7f8c8d; font-style: italic;">${article.title_en}</h3>
                <div style="margin-top: 2rem;">
                    <p><strong>カテゴリ:</strong> ${getCategoryLabel(article.category)}</p>
                    <p><strong>リスクレベル:</strong> ${getRiskLabel(article.risk_level)}</p>
                    <p><strong>スライドページ:</strong> ${article.slide_pages.join(', ')}</p>
                </div>
            `
        });

        // Content slide
        slides.push({
            title: `${article.article_number}: 条文本文`,
            content: `
                <h2>${article.article_number}: 条文本文</h2>
                <div style="margin-top: 2rem;">
                    <h3>日本語</h3>
                    <p style="padding: 1rem; background: #f9f9f9; border-radius: 4px;">${article.article_text.ja}</p>
                    <h3 style="margin-top: 1rem;">English</h3>
                    <p style="padding: 1rem; background: #f9f9f9; border-radius: 4px;">${article.article_text.en}</p>
                </div>
            `
        });

        // Requirements slide
        if (article.requirements.length > 0) {
            slides.push({
                title: `${article.article_number}: 要件`,
                content: `
                    <h2>${article.article_number}: 要件 (${article.requirements.length}件)</h2>
                    <div style="margin-top: 1rem;">
                        ${article.requirements.slice(0, 3).map(req => `
                            <div style="padding: 1rem; background: #fafafa; margin-bottom: 1rem; border-left: 4px solid #9b59b6; border-radius: 4px;">
                                <strong>${req.req_id}:</strong> ${req.description_ja}
                            </div>
                        `).join('')}
                        ${article.requirements.length > 3 ? `<p style="color: #999; text-align: center;">... 他 ${article.requirements.length - 3}件</p>` : ''}
                    </div>
                `
            });
        }
    });

    if (slides.length === 0) {
        showNotification('スライドを生成できませんでした', 'error');
        return;
    }

    currentSlideIndex = 0;
    displaySlide(currentSlideIndex);
    document.getElementById('slideModal').style.display = 'block';
    showNotification(`${slides.length}枚のスライドを生成しました`, 'success');
}

function displaySlide(index) {
    const slideContainer = document.getElementById('slideContainer');
    const counter = document.getElementById('slideCounter');

    if (index < 0 || index >= slides.length) return;

    slideContainer.innerHTML = `
        <div class="slide active">
            ${slides[index].content}
        </div>
    `;

    counter.textContent = `${index + 1} / ${slides.length}`;

    // Update button states
    document.getElementById('prevSlide').disabled = index === 0;
    document.getElementById('nextSlide').disabled = index === slides.length - 1;
}

function navigateSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex < 0) currentSlideIndex = 0;
    if (currentSlideIndex >= slides.length) currentSlideIndex = slides.length - 1;
    displaySlide(currentSlideIndex);
}

function downloadSlides() {
    const slidesHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>欧州AI法 スライド</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
        }
        .slide {
            width: 100%;
            min-height: 100vh;
            padding: 4rem;
            box-sizing: border-box;
            page-break-after: always;
            border-bottom: 2px solid #ddd;
        }
        h2 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5rem;
        }
        h3 {
            color: #34495e;
        }
        @media print {
            .slide {
                page-break-after: always;
                border: none;
            }
        }
    </style>
</head>
<body>
    ${slides.map(slide => `
        <div class="slide">
            ${slide.content}
        </div>
    `).join('')}
</body>
</html>
    `;

    const blob = new Blob([slidesHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eu_ai_act_slides_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);

    showNotification('スライドをHTMLファイルとしてダウンロードしました', 'success');
}

// Helper functions
function getCategoryLabel(category) {
    const labels = {
        'definition': '定義',
        'scope': '範囲・目的',
        'prohibition': '禁止事項',
        'classification': '分類',
        'obligation_provider': '提供者の義務',
        'obligation_deployer': '配備者の義務',
        'quality_management': '品質管理',
        'conformity_assessment': '適合性評価',
        'transparency': '透明性',
        'testing': 'テスト',
        'monitoring': 'モニタリング',
        'gpai': '汎用AI関連'
    };
    return labels[category] || category;
}

function getRiskLabel(risk) {
    const labels = {
        'prohibited': '禁止',
        'high-risk': '高リスク',
        'gpai': '汎用AI',
        'gpai_systemic': 'システミックリスクGPAI',
        'limited-risk': '限定的リスク',
        'minimal-risk': '最小リスク',
        'general': '一般'
    };
    return labels[risk] || risk;
}

function showNotification(message, type = 'info') {
    // Simple notification (can be enhanced with a toast library)
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${colors[type] || colors.info};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
