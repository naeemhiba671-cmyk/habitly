'use strict';

const STORAGE_KEY = 'habitly-week2-habits';
const DEFAULT_HABITS = [
  { id: 'habit-water', name: 'Drink more water', emoji: '💧', subtitle: 'Take care of your body' },
  { id: 'habit-reading', name: 'Read 10 pages', emoji: '📚', subtitle: 'A little learning every day' },
  { id: 'habit-meditate', name: 'Meditate', emoji: '🧘', subtitle: 'Make room for calm' },
  { id: 'habit-walk', name: 'Go for a walk', emoji: '🏃', subtitle: 'Get moving, feel refreshed' },
  { id: 'habit-sleep', name: 'Sleep by 11 PM', emoji: '🌙', subtitle: 'Give tomorrow a fresh start' }
];
const FALLBACK_QUOTES = [
  { quote: 'Great things are done by a series of small things brought together.', author: 'Vincent van Gogh' },
  { quote: 'It always seems impossible until it is done.', author: 'Nelson Mandela' },
  { quote: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { quote: 'Small daily improvements are the key to staggering long-term results.', author: 'Unknown' }
];

const todayDate = document.getElementById('todayDate');
const overviewDate = document.getElementById('overviewDate');
const habitForm = document.getElementById('habitForm');
const habitNameInput = document.getElementById('habitName');
const emojiPicker = document.getElementById('emojiPicker');
const formMessage = document.getElementById('formMessage');
const habitsGrid = document.getElementById('habitsGrid');
const emptyState = document.getElementById('emptyState');
const dailyQuote = document.getElementById('dailyQuote');
const quoteAuthor = document.getElementById('quoteAuthor');

let selectedEmoji = '🌱';
let habits = loadHabits();

function getTodayDate() {
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadHabits() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      const today = getTodayDate();
      return DEFAULT_HABITS.map((habit, index) => ({
        ...habit,
        completedDates: index < 3 ? [today] : []
      }));
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(item => item && typeof item.id === 'string' &&
        typeof item.name === 'string' && typeof item.emoji === 'string')
      .map(item => ({
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        subtitle: typeof item.subtitle === 'string' ? item.subtitle : '',
        completedDates: Array.isArray(item.completedDates)
          ? item.completedDates.filter(date => typeof date === 'string')
          : []
      }));
  } catch (error) {
    console.warn('Habitly could not read saved habits. Starting with sample habits.', error);
    return DEFAULT_HABITS.map((habit, index) => ({
      ...habit,
      completedDates: index < 3 ? [getTodayDate()] : []
    }));
  }
}

function saveHabits() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    return true;
  } catch (error) {
    console.error('Habitly could not save your habits.', error);
    showMessage('Your browser could not save changes. Check your storage settings.', true);
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
}

function createHabitCard(habit) {
  const completed = habit.completedDates.includes(getTodayDate());
  const safeName = escapeHTML(habit.name);
  const safeEmoji = escapeHTML(habit.emoji);
  const safeId = escapeHTML(habit.id);

  return `
    <article class="habit-card ${completed ? 'completed' : ''}" data-habit-id="${safeId}">
      <div class="habit-card-top">
        <span class="habit-emoji" aria-hidden="true">${safeEmoji}</span>
        <span class="status-pill ${completed ? 'done' : ''}">
          <span></span>${completed ? 'Done today' : 'Up next'}
        </span>
      </div>
      <h3>${safeName}</h3>
      <p class="habit-subtitle">${habit.subtitle ? escapeHTML(habit.subtitle) : 'A little progress every day'}</p>
      <div class="habit-bottom">
        <span class="habit-tag">${completed ? 'You showed up today ✨' : 'Ready when you are'}</span>
        <div class="card-actions">
          <button class="complete-button" type="button" data-action="toggle" aria-pressed="${completed}">
            ${completed ? 'Completed ✓' : 'Complete ＋'}
          </button>
          <button class="delete-button" type="button" data-action="delete" aria-label="Delete ${safeName}" title="Delete habit">×</button>
        </div>
      </div>
    </article>`;
}

function renderHabits() {
  const today = getTodayDate();
  const done = habits.filter(habit => habit.completedDates.includes(today)).length;
  const total = habits.length;
  const remaining = total - done;
  const percentage = total ? Math.round((done / total) * 100) : 0;

  habitsGrid.innerHTML = habits.map(createHabitCard).join('');
  emptyState.hidden = total !== 0;
  habitsGrid.hidden = total === 0;

  document.getElementById('doneCount').innerHTML = `${done}<span>/${total}</span>`;
  document.getElementById('totalCount').textContent = total;
  document.getElementById('remainingCount').textContent = remaining;
  document.getElementById('progressBar').style.width = `${percentage}%`;
  document.getElementById('progressMessage').textContent =
    total === 0 ? 'Add a habit to begin' :
    done === total ? 'Wonderful — all habits completed!' :
    done > 0 ? 'You are building a rhythm' : 'Every small step counts';
  document.getElementById('habitCount').textContent = `${total} ${total === 1 ? 'habit' : 'habits'}`;
}

function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle('error', isError);
}

function addHabit(event) {
  event.preventDefault();
  const name = habitNameInput.value.trim();

  if (!name) {
    showMessage('Please enter a habit name before adding it.', true);
    habitNameInput.focus();
    return;
  }
  const duplicate = habits.some(habit => habit.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  if (duplicate) {
    showMessage('You already have this habit. Try a different name.', true);
    habitNameInput.focus();
    return;
  }

  habits.unshift({
    id: createId(),
    name,
    emoji: selectedEmoji,
    subtitle: '',
    completedDates: []
  });
  saveHabits();
  renderHabits();
  habitForm.reset();
  habitNameInput.focus();
  showMessage(`"${name}" has been added. You've got this!`);
}

function toggleHabit(id) {
  const habit = habits.find(item => item.id === id);
  if (!habit) return;

  const today = getTodayDate();
  if (habit.completedDates.includes(today)) {
    habit.completedDates = habit.completedDates.filter(date => date !== today);
  } else {
    habit.completedDates.push(today);
  }
  saveHabits();
  renderHabits();
}

function deleteHabit(id) {
  const habit = habits.find(item => item.id === id);
  if (!habit) return;

  const shouldDelete = window.confirm(`Delete "${habit.name}"? This habit will be removed from your list.`);
  if (!shouldDelete) return;

  habits = habits.filter(item => item.id !== id);
  saveHabits();
  renderHabits();
  showMessage(`"${habit.name}" was deleted.`);
}

function handleHabitGridClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const card = button.closest('[data-habit-id]');
  if (!card) return;

  const id = card.dataset.habitId;
  if (button.dataset.action === 'toggle') toggleHabit(id);
  if (button.dataset.action === 'delete') deleteHabit(id);
}

function handleEmojiSelection(event) {
  const button = event.target.closest('.emoji-option');
  if (!button) return;

  selectedEmoji = button.dataset.emoji;
  emojiPicker.querySelectorAll('.emoji-option').forEach(option => {
    const isSelected = option === button;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', String(isSelected));
  });
}

async function loadDailyQuote() {
  dailyQuote.textContent = 'Loading your daily inspiration...';
  quoteAuthor.textContent = '';
  try {
    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) throw new Error(`Quote request failed: ${response.status}`);
    const data = await response.json();
    if (!data || typeof data.quote !== 'string' || !data.quote.trim()) {
      throw new Error('The quote service returned an unexpected response.');
    }
    dailyQuote.textContent = `“${data.quote}”`;
    quoteAuthor.textContent = data.author ? `— ${data.author}` : '';
  } catch (error) {
    console.warn('Could not load the daily quote. Showing a saved quote instead.', error);
    const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    dailyQuote.textContent = `“${fallback.quote}”`;
    quoteAuthor.textContent = `— ${fallback.author}`;
  }
}

function initializeApp() {
  todayDate.textContent = formatToday();
  overviewDate.textContent = `TODAY · ${formatToday().toUpperCase()}`;
  habitForm.addEventListener('submit', addHabit);
  habitsGrid.addEventListener('click', handleHabitGridClick);
  emojiPicker.addEventListener('click', handleEmojiSelection);
  renderHabits();
  loadDailyQuote();
}

initializeApp();
