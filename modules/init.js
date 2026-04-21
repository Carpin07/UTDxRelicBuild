// ============================================================================
// INIT.JS - Application Initialization
// ============================================================================

function initApp() { 
    // 1. SYNC CSS CLASSES IMMEDIATELY
    // Check state of checkboxes and apply classes to body before rendering
    const globalHead = document.getElementById('globalHeadPiece');
    const globalSubs = document.getElementById('globalSubStats');
    if(globalHead && globalHead.checked) document.body.classList.add('show-head');
    if(globalSubs && globalSubs.checked) document.body.classList.add('show-subs');

    // 2. Setup Guide Dropdowns
    if(typeof populateGuideDropdowns === 'function') {
        populateGuideDropdowns(); 
    }

    // Inject Buff Buttons Efficiently via DocumentFragment batching
    injectBuffButtons();
    
    setGuideMode('current'); 

    // 3. Render Content
    if(typeof renderCredits === 'function') {
        renderCredits();
    }
    
    // 4. Initialize Database
    renderDatabase(); 
    
    // 5. Initialize Inventory
    if (typeof initInventory === 'function') {
        initInventory();
    }

    // Update Guide Toolbar Labels to match Unit Database
    // Runs immediately to catch elements if they exist
    const updateGuideLabel = (id, text) => {
        const input = document.getElementById(id);
        if (input && input.parentElement) {
            // Try finding a span first
            const span = input.parentElement.querySelector('span');
            if (span) span.textContent = text;
            // Fallback: If text is a direct child node
            else input.parentElement.childNodes.forEach(n => { if(n.nodeType===3 && n.textContent.trim()) n.textContent = " " + text; });
        }
    };
    updateGuideLabel('guideHeadPiece', '+ Head Relic');
    updateGuideLabel('guideSubStats', '+ Sub Stats');

    // 6. End of Life Notice
    if (!localStorage.getItem('eol_notice_hidden_v2')) {
        setTimeout(() => {
            if (typeof showUniversalModal === 'function') {
                showUniversalModal({
                    title: '<span style="color: var(--text-color, #fff); font-size: 1.1rem; letter-spacing: 1px; font-weight: 600;">Development Update</span>',
                    content: `
                        <div style="text-align: center; padding: 25px 20px 10px; color: #e0e0e0; font-family: var(--font-main);">
                            <div style="margin-bottom: 24px; color: #fff;">
                                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto; filter: drop-shadow(0 0 12px rgba(255,255,255,0.15)); opacity: 0.9;">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            
                            <h3 style="font-size: 1.35rem; font-weight: 700; font-family: var(--font-header); margin-bottom: 16px; color: #ffffff;">Development Paused</h3>
                            
                                <p style="font-size: 0.95rem; color: #a0a0a5; margin: 0 auto 16px auto; line-height: 1.6;">
                                    Special thanks to the developers of the previous website. I, Alvich, am resuming this project with the hope of doing things right and making the former developers proud.<br><br>
                                    My goal is to provide this community with the latest units, their relics, and the most meta sets. Thank you very much for your trust and support.
                                </p>
                        </div>
                    `,
                    footerButtons: `
                        <div style="display: flex; gap: 12px; width: 100%; margin-top: 10px;">
                            <button class="action-btn" style="flex: 1.25; border-radius: 8px; font-weight: 600;" onclick="localStorage.setItem('eol_notice_hidden_v2', 'true'); closeModal('universalModal')">OK</button>
                        </div>
                    `,
                    size: 'modal-sm'
                });
            }
        }, 1200);
    }
}

// Ensure the app initializes immediately when the DOM is ready, rather than waiting for all images/resources to load (onload)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Batch DOM operations to avoid layout thrashing and unnecessary reflows
function injectBuffButtons() {
    if (!document.getElementById('buff-btn-style')) {
        const style = document.createElement('style');
        style.id = 'buff-btn-style';
        style.innerHTML = `
            .miku-btn-label:hover span {
                color: #fff;
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
                transition: all 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }

    const buffs = [
        { id: 'MikuBuff', text: 'Miku Buff', title: "Apply Miku's +100% Damage Buff", fn: 'toggleMikuBuff' },
        { id: 'EnlightenedBuff', text: 'Enlightened God', title: "Apply Enlightened God's +20% Dmg, -20% SPA, +20% Range Buff", fn: 'toggleEnlightenedGodBuff' },
        { id: 'BijuuBuff', text: 'Bijuu Link', title: "Apply Bijuu Link: +25% Dmg, +25% Range, -15% SPA", fn: 'toggleBijuuLink' },
        { id: 'AMSupport', text: 'Ancient Mage', title: "Apply Ancient Mage Buff: +20% Crit Rate/Dmg, 30s Follow-up", fn: 'toggleAncientMageSupport' },
        { id: 'KSBuff', text: 'King Sailor', title: "Apply King Sailor Buff: +10% Crit Rate, +20% Crit Damage", fn: 'toggleKingSailorBuff' }
    ];

    const createBtn = (buff, isGlobal) => {
        const fullId = (isGlobal ? 'global' : 'guide') + buff.id;
        const label = document.createElement('label');
        label.className = 'nav-toggle-label miku-btn-label';
        label.setAttribute('for', fullId);
        label.title = buff.title;
        
        // Preserve original styling
        label.innerHTML = `<div class="toggle-wrapper" style="gap: 6px;"><input type="checkbox" id="${fullId}" style="cursor: pointer;"><div class="mini-switch"></div><span${buff.id === 'MikuBuff' ? '' : ' style="white-space: nowrap;"'}>${buff.text}</span></div>`;
        
        const input = label.querySelector('input');
        input.addEventListener('change', function() { if(typeof window[buff.fn] === 'function') window[buff.fn](this); });
        
        return label;
    };

    const insertBatch = (containerId, targetId, isGlobal) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const frag = document.createDocumentFragment();
        buffs.forEach(buff => frag.appendChild(createBtn(buff, isGlobal)));

        const target = document.getElementById(targetId);
        if (target) {
            const label = target.closest('label') || target.parentElement;
            if (label && container.contains(label)) {
                label.after(frag);
                return;
            }
        }
        container.appendChild(frag);
    };

    insertBatch('dbInjector', 'invModeToggle', true);
    insertBatch('guidesToolbar', 'guideInventoryMode', false);
}