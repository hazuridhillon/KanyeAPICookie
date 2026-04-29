const bg1       = document.getElementById('bg-1');
const bg2       = document.getElementById('bg-2');
const bg3       = document.getElementById('bg-3');
const quoteText = document.getElementById('quote-text');
const clickHint = document.getElementById('click-hint');
const title     = document.getElementById('title');

let state  = 1;
let isBusy = false;

function setBackground(n) {
  [bg1, bg2, bg3].forEach((bg, i) => bg.classList.toggle('active', i + 1 === n));
}

async function fetchQuote() {
  try {
    const res  = await fetch('https://api.kanye.rest');
    const data = await res.json();
    return data.quote;
  } catch {
    return 'I am not a human. I am a god.';
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleClick() {
  if (isBusy) return;

  if (state === 1) {
    isBusy = true;
    state  = 2;
    setBackground(2);

    // Fetch and wait in parallel — whichever finishes last wins
    const [quote] = await Promise.all([fetchQuote(), wait(800)]);

    setBackground(3);
    quoteText.textContent = quote;
    quoteText.classList.add('visible');
    clickHint.style.opacity = '0';
    title.style.opacity     = '0';
    state  = 3;
    isBusy = false;

  } else if (state === 3) {
    state = 1;
    quoteText.classList.remove('visible');
    quoteText.textContent   = '';
    clickHint.style.opacity = '1';
    title.style.opacity     = '1';
    setBackground(1);
  }
}

setBackground(1);
document.getElementById('content').addEventListener('click', handleClick);
