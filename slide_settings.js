// ===================================
// Slide Layout Settings
// ===================================

// Default slide settings
const defaultSlideSettings = {
    overviewBoxWidth: 78,  // 60% × 1.3 = 78% (概要ボックスを右に1.3倍延ばす)
    overviewBoxTop: 140,
    overviewBoxFontSize: 28,
    requirementsTop: 300,  // 360px → 300px (概要と要件の間を4行程度詰める)
    requirementsFontSize: 16,
    requirementsLineHeight: 1.4,
    relatedArticlesBottom: 50,
    slideScale: 1.0
};

// Load settings from localStorage or use defaults
function loadSlideSettings() {
    const saved = localStorage.getItem('slideSettings');
    if (saved) {
        try {
            return { ...defaultSlideSettings, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Failed to load slide settings:', e);
            return { ...defaultSlideSettings };
        }
    }
    return { ...defaultSlideSettings };
}

// Save settings to localStorage
function saveSlideSettings(settings) {
    localStorage.setItem('slideSettings', JSON.stringify(settings));
}

// Get current settings from UI
function getCurrentSlideSettings() {
    return {
        overviewBoxWidth: parseFloat(document.getElementById('overviewBoxWidth').value),
        overviewBoxTop: parseInt(document.getElementById('overviewBoxTop').value),
        overviewBoxFontSize: parseInt(document.getElementById('overviewBoxFontSize').value),
        requirementsTop: parseInt(document.getElementById('requirementsTop').value),
        requirementsFontSize: parseInt(document.getElementById('requirementsFontSize').value),
        requirementsLineHeight: parseFloat(document.getElementById('requirementsLineHeight').value),
        relatedArticlesBottom: parseInt(document.getElementById('relatedArticlesBottom').value),
        slideScale: parseFloat(document.getElementById('slideScale').value)
    };
}

// Apply settings to UI inputs
function applySettingsToUI(settings) {
    document.getElementById('overviewBoxWidth').value = settings.overviewBoxWidth;
    document.getElementById('overviewBoxWidthValue').textContent = settings.overviewBoxWidth;

    document.getElementById('overviewBoxTop').value = settings.overviewBoxTop;
    document.getElementById('overviewBoxTopValue').textContent = settings.overviewBoxTop;

    document.getElementById('overviewBoxFontSize').value = settings.overviewBoxFontSize;
    document.getElementById('overviewBoxFontSizeValue').textContent = settings.overviewBoxFontSize;

    document.getElementById('requirementsTop').value = settings.requirementsTop;
    document.getElementById('requirementsTopValue').textContent = settings.requirementsTop;

    document.getElementById('requirementsFontSize').value = settings.requirementsFontSize;
    document.getElementById('requirementsFontSizeValue').textContent = settings.requirementsFontSize;

    document.getElementById('requirementsLineHeight').value = settings.requirementsLineHeight;
    document.getElementById('requirementsLineHeightValue').textContent = settings.requirementsLineHeight;

    document.getElementById('relatedArticlesBottom').value = settings.relatedArticlesBottom;
    document.getElementById('relatedArticlesBottomValue').textContent = settings.relatedArticlesBottom;

    document.getElementById('slideScale').value = settings.slideScale;
    document.getElementById('slideScaleValue').textContent = settings.slideScale;
}

// Apply custom CSS styles based on settings
function applySlideSettingStyles(settings) {
    // Remove existing custom style if any
    const existingStyle = document.getElementById('customSlideStyles');
    if (existingStyle) {
        existingStyle.remove();
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'customSlideStyles';
    styleElement.textContent = `
        .slide-16-9 {
            transform: scale(${settings.slideScale});
            transform-origin: top center;
        }
        .overview-box {
            top: ${settings.overviewBoxTop}px !important;
            max-width: ${settings.overviewBoxWidth}% !important;
            font-size: ${settings.overviewBoxFontSize}px !important;
        }
        .requirements-section {
            top: ${settings.requirementsTop}px !important;
        }
        .requirements-list-full {
            top: ${settings.requirementsTop - 80}px !important;
        }
        .req-item {
            font-size: ${settings.requirementsFontSize}px !important;
            line-height: ${settings.requirementsLineHeight} !important;
        }
        .related-articles-bar {
            bottom: ${settings.relatedArticlesBottom}px !important;
        }
    `;
    document.head.appendChild(styleElement);
}

// Initialize slide settings modal
document.addEventListener('DOMContentLoaded', function() {
    const slideSettingsBtn = document.getElementById('slideSettingsBtn');
    const slideSettingsModal = document.getElementById('slideSettingsModal');
    const closeSlideSettings = document.getElementById('closeSlideSettings');
    const applySlideSettings = document.getElementById('applySlideSettings');
    const resetSlideSettings = document.getElementById('resetSlideSettings');
    const previewSlideSettings = document.getElementById('previewSlideSettings');

    // Load saved settings on page load
    const savedSettings = loadSlideSettings();
    applySlideSettingStyles(savedSettings);

    // Open settings modal
    slideSettingsBtn.addEventListener('click', () => {
        const settings = loadSlideSettings();
        applySettingsToUI(settings);
        slideSettingsModal.style.display = 'block';
    });

    // Close settings modal
    closeSlideSettings.addEventListener('click', () => {
        slideSettingsModal.style.display = 'none';
    });

    // Update value displays when sliders change
    const sliders = slideSettingsModal.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const valueSpan = document.getElementById(e.target.id + 'Value');
            if (valueSpan) {
                valueSpan.textContent = e.target.value;
            }
        });
    });

    // Apply settings
    applySlideSettings.addEventListener('click', () => {
        const settings = getCurrentSlideSettings();
        saveSlideSettings(settings);
        applySlideSettingStyles(settings);
        slideSettingsModal.style.display = 'none';
        showNotification('スライド設定を保存しました', 'success');
    });

    // Reset to defaults
    resetSlideSettings.addEventListener('click', () => {
        applySettingsToUI(defaultSlideSettings);
        showNotification('デフォルト設定に戻しました', 'info');
    });

    // Preview settings (apply temporarily without saving)
    previewSlideSettings.addEventListener('click', () => {
        const settings = getCurrentSlideSettings();
        applySlideSettingStyles(settings);
        showNotification('プレビューを適用しました（保存されていません）', 'info');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === slideSettingsModal) {
            slideSettingsModal.style.display = 'none';
        }
    });
});
