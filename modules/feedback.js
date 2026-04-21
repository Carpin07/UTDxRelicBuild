// ============================================================================
// FEEDBACK.JS - Handling Suggestions & Bug Reports
// ============================================================================

const WORKER_URL = "https://suggestion-bugreport.wavebound.workers.dev"; // User to replace this

const openFeedbackModal = () => {
    if (typeof showUniversalModal === 'function') {
        showUniversalModal({
            title: '<span style="color: var(--text-color, #fff); font-size: 1.1rem; letter-spacing: 1px; font-weight: 600;">Feature Disabled</span>',
            content: `
                <div style="text-align: center; padding: 25px 20px 10px; color: #e0e0e0; font-family: var(--font-main);">
                    <div style="margin-bottom: 24px; color: #fff;">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto; filter: drop-shadow(0 0 12px rgba(255,255,255,0.15)); opacity: 0.9;">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <h3 style="font-size: 1.35rem; font-weight: 700; font-family: var(--font-header); margin-bottom: 16px; color: #ffffff;">This Feature is Disabled</h3>
                    <p style="font-size: 0.95rem; color: #a0a0a5; margin: 0 auto 16px auto; line-height: 1.6;">
                        If you want to report a bug or suggestion, just DM me (<b>NotAlvich</b>) directly.<br><br>
                        Thank you for your understanding!
                    </p>
                </div>
            `,
            footerButtons: `
                <div style="display: flex; gap: 12px; width: 100%; margin-top: 10px;">
                    <button class="action-btn" style="flex: 1.25; border-radius: 8px; font-weight: 600;" onclick="closeModal('universalModal')">OK</button>
                </div>
            `,
            size: 'modal-sm'
        });
    }
};

async function sendFeedback() {
    const type = document.getElementById('feedbackType').value;
    const contact = document.getElementById('feedbackContact').value.trim(); // Get value
    const message = document.getElementById('feedbackText').value.trim();
    const statusEl = document.getElementById('feedbackStatus');
    const btn = document.getElementById('feedbackSendBtn');

    // VALIDATION CHANGE: Check both Contact and Message
    if (!contact || !message) {
        statusEl.innerHTML = '<span class="text-error">Please enter your Discord and a message.</span>';
        return;
    }

    btn.disabled = true;
    statusEl.innerHTML = '<span class="text-gold">Sending...</span>';

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: type,
                contact: contact,
                message: message,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            statusEl.innerHTML = '<span class="text-success">Sent successfully! Thank you.</span>';
            setTimeout(() => closeModal('feedbackModal'), 2000);
        } else {
            throw new Error('Server error');
        }
    } catch (e) {
        console.error(e);
        statusEl.innerHTML = '<span class="text-error">Failed to send. Please try again.</span>';
        btn.disabled = false;
    }
}