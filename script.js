const STORAGE_KEY = 'chat_messages_v1';

const messagesEl = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const displayNameInput = document.getElementById('displayName');
const clearBtn = document.getElementById('clearBtn');

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isMe(message) {
  const name = (displayNameInput.value || 'Me').trim();
  return message.name === name;
}

function renderMessages() {
  const messages = loadMessages();
  messagesEl.innerHTML = '';

  if (messages.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'hint';
    empty.style.padding = '24px 0';
    empty.textContent = 'No messages yet. Send one below!';
    messagesEl.appendChild(empty);
    return;
  }

  for (const msg of messages) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${isMe(msg) ? 'me' : 'them'}`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `
      <div class="meta">${escapeHtml(msg.name)} · ${escapeHtml(formatTime(msg.ts))}</div>
      <div class="text">${escapeHtml(msg.text)}</div>
    `;

    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
  }

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addMessage({ name, text }) {
  const messages = loadMessages();
  messages.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    text,
    ts: Date.now(),
  });
  saveMessages(messages);
  renderMessages();
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = (displayNameInput.value || 'Me').trim().slice(0, 30);
  const text = (messageInput.value || '').trim();
  if (!text) return;

  addMessage({ name, text });
  messageInput.value = '';
  messageInput.focus();
});

clearBtn.addEventListener('click', () => {
  if (!confirm('Clear all messages?')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderMessages();
});

document.addEventListener('DOMContentLoaded', () => {
  if (!displayNameInput.value) {
    displayNameInput.value = 'Me';
  }
  renderMessages();

  // Support Shift+Enter newlines by switching to contenteditable behavior would be overkill.
  // Instead, let Enter submit and keep input as single-line.
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) return;
  });
});
