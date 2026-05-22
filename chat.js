const toggle = document.getElementById('chat-toggle');
const panel = document.getElementById('chat-panel');
const iconOpen = document.getElementById('chat-icon-open');
const iconClose = document.getElementById('chat-icon-close');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messagesEl = document.getElementById('chat-messages');

const history = [];

toggle.addEventListener('click', () => {
  const isOpen = !panel.hidden;
  panel.hidden = isOpen;
  iconOpen.hidden = !isOpen;
  iconClose.hidden = isOpen;
  if (!isOpen) input.focus();
});

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg--' + (role === 'user' ? 'user' : 'ai');
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

document.querySelectorAll('.ai-chat-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    panel.hidden = false;
    iconOpen.hidden = true;
    iconClose.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setTimeout(() => input.focus(), 300);
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.disabled = true;
  form.querySelector('button').disabled = true;

  addMessage(text, 'user');
  history.push({ role: 'user', content: text });

  const thinking = addMessage('...', 'ai');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    const reply = data.reply || data.error || 'Something went wrong.';
    thinking.textContent = reply;
    if (data.reply) history.push({ role: 'assistant', content: reply });
  } catch {
    thinking.textContent = 'Network error — please try again.';
  }

  input.disabled = false;
  form.querySelector('button').disabled = false;
  input.focus();
});
