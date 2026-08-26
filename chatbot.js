// Aapki API Key 
const apiKey = AQ.Ab8RN6L0ruz2wn7G-eO-LHMgcMDFl0OLctTrKL4K2TgQjd-YBw; 

// HTML Elements ko select karna
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMessages = document.getElementById('chat-messages');

// Chat box ko kholne aur band karne ka function
chatToggleBtn.addEventListener('click', () => chatBox.classList.toggle('hidden'));
chatCloseBtn.addEventListener('click', () => chatBox.classList.add('hidden'));

// Button click ya 'Enter' dabane par message bhejna
chatSendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Message bhejney ka asal function
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // User ka message screen par dikhayein
    appendMessage(text, 'user');
    chatInput.value = '';

    // Loading indicator dikhayein
    const loadingId = appendMessage('Soch raha hai...', 'ai');

    try {
        // Gemini API ko request bhejna
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{
                        text: "You are the official AI customer support assistant for AL-SHABEER INTERNATIONAL, a premier export enterprise founded in 1957 by Mr. Shabeer Bhutta and currently owned by Mr. Pervaiz Bhutta. The company specializes exclusively in the processing and export of high-quality natural sheep casings.\n\nYour primary goal is to assist European mid-market buyers and international clients with professional, accurate, and concise information.\n\nKey Business Facts to Remember:\n* Products: Natural sheep casings available in various calibers and quality grades.\n* Certifications & Accreditation: The company holds the European Commission veterinary accreditation, registration number AQD-118-ASI, and also proudly holds a Halal Certificate.\n\nRules for Answering:\n1. Maintain a highly professional, respectful, and corporate tone.\n2. Do NOT mention any third-party inspections.\n3. If a client asks about payment terms, conditions, prices, or quotations, you MUST NOT answer them directly. Instead, immediately share our direct contact details by saying: 'For pricing, payment terms, and detailed trade conditions, please contact our management directly at WhatsApp: +923072431135 or Email: al.shabeercasings@gmail.com.'\n4. For all other questions related to our products, history, calibers, or certifications (like our EU accreditation AQD-118-ASI and Halal Certificate), provide accurate, helpful, and professional answers.\n5. 100% factual accuracy is required. Never invent or guess information."
                    }]
                },
                contents: [{
                    parts: [{ text: text }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("API Error:", data.error);
            document.getElementById(loadingId).remove();
            appendMessage("For pricing and inquiries, please contact management directly at WhatsApp: +923072431135 or Email: al.shabeercasings@gmail.com.", 'ai');
            return;
        }

        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "For pricing and inquiries, please contact management directly at WhatsApp: +923072431135 or Email: al.shabeercasings@gmail.com.";

        // Loading message hata kar asal jawab dikhayein
        document.getElementById(loadingId).remove();
        appendMessage(aiReply, 'ai');

    } catch (error) {
        document.getElementById(loadingId).remove();
        appendMessage('Connection error. Please contact us directly at WhatsApp: +923072431135', 'ai');
    }
}

// Messages ko design karke chat box mein add karne ka function
function appendMessage(text, sender) {
    const msgId = 'msg-' + Date.now();
    const isUser = sender === 'user';
    
    const messageHTML = `
        <div id="${msgId}" class="flex ${isUser ? 'justify-end' : 'justify-start'}">
            <div class="${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-100'} p-3 rounded-xl shadow-sm max-w-[80%] text-sm">
                ${text}
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgId;
}
