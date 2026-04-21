// ============================================================================
// FEEDBACK.JS - Handling Suggestions & Bug Reports
// ============================================================================



const openFeedbackModal = () => {
    if (typeof showUniversalModal === 'function') {
        showUniversalModal({
            title: '<span style="color: var(--text-color, #fff); font-size: 1.1rem; letter-spacing: 1px; font-weight: 600;">Suggestions & Feedback</span>',
            content: `
                <div style="text-align: center; padding: 25px 20px 10px; color: #e0e0e0; font-family: var(--font-main);">
                    <div style="margin-bottom: 24px; color: #fff;">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto; filter: drop-shadow(0 0 12px rgba(90,127,255,0.15)); opacity: 0.9;">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <h3 style="font-size: 1.35rem; font-weight: 700; font-family: var(--font-header); margin-bottom: 16px; color: #ffffff;">Want to make a suggestion or report a bug?</h3>
                    <p style="font-size: 0.95rem; color: #a0a0a5; margin: 0 auto 16px auto; line-height: 1.6;">
                        Just click the button below and fill out the Google Form. I appreciate your feedback!
                    </p>
                </div>
            `,
            footerButtons: `
                <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; margin-top: 10px;">
                    <a href="https://forms.gle/KgAxNuP7fNCpB3gt6" id="feedbackGoogleFormBtn" target="_blank" rel="noopener" class="action-btn" style="flex: 1.25; border-radius: 8px; font-weight: 600; font-size: 1.1rem; text-align: center; display: block; background: linear-gradient(90deg, #5a7fff 0%, #a259ff 100%); color: #fff; margin-bottom: 8px;">Open Suggestion Form</a>
                    <button class="action-btn secondary" style="flex: 1.25; border-radius: 8px; font-weight: 600;" onclick="closeModal('universalModal')">Close</button>
                </div>
            `,
            size: 'modal-sm'
        });
        // Cuando tengas el link, reemplaza '#' por el enlace real del Google Form en el href de feedbackGoogleFormBtn
    }
};

