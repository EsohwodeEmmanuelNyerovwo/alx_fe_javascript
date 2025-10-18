const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuote = document.getElementById('newQuote');

let quoteArr = [
    {
        text: "I think, therefore I am",
        category: "Motivation",
    },
    {
        text: "There are no regrets in life. Just lessons",
        category: "Reflection",
    }
]
let index = 0;

newQuote.addEventListener('click', showRandomQuote);

function addQuote() {
    createAddQuoteForm();
}
function showRandomQuote() {
    index = Math.floor(Math.random() * quoteArr.length);
    let storedItem = JSON.parse(localStorage.getItem('quoteAlx'))
    quoteArr = storedItem;
    const rnd = quoteArr[index];
    quoteDisplay.innerHTML = `${rnd.text} --- ${rnd.category}`;
    // quoteArr.forEach(quote => {
    //     quoteDisplay.innerHTML += `
    //         ${quote.text} --- ${quote.category};
    //     `
    // })
}
const quotes = [
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" }
];

document.getElementById('exportBtn').addEventListener('click', () => {
    // Step 1: Convert array to JSON
    const jsonData = JSON.stringify(quotes, null, 2);

    // Step 2: Create a Blob (represents the data as a file)
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Step 3: Create a temporary download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // file name for download
    document.body.appendChild(a);

    // Step 4: Trigger download and clean up
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}
// function showRandomQuote() {
//     quoteArr.forEach(quote => {

//         const p1 = document.createElement('p');
//         const p2 = document.createElement('p');
//         p1.textContent = quote.text;
//         p2.textContent = quote.catogory;
//         quoteDisplay.append(p1, p2);
//     })
// }
function createAddQuoteForm() {
    const txtValue = newQuoteText.value;
    const catogoryValue = newQuoteCategory.value;

    if (txtValue !== '' || catogoryValue !== '') {
        quoteArr.push({
            text: txtValue,
            category: catogoryValue
        });
        localStorage.setItem('quoteAlx', JSON.stringify(quoteArr));
    }
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');

    p1.textContent = txtValue;
    p2.textContent = catogoryValue;

    quoteDisplay.appendChild(p1);
    quoteDisplay.appendChild(p2);

    showRandomQuote();
}

// Add this near your other constants
const FILTER_KEY = 'dq_lastFilter';

// Update your quote structure to include a category when adding a new quote
function addQuote() {
    const text = quoteText.value.trim();
    const author = quoteAuthor.value.trim();
    const category = prompt("Enter category for this quote (e.g., 'Motivation', 'Life', 'Humor')") || 'Uncategorized';

    if (!text) {
        alert('Please enter a quote.');
        return;
    }

    const quoteObj = { id: Date.now(), text, author, category };
    quotes.push(quoteObj);
    saveQuotes();
    populateCategories();  // update dropdown with new category
    renderQuotes();
    quoteText.value = '';
    quoteAuthor.value = '';
}

function populateCategories() {
    const filterSelect = document.getElementById('categoryFilter');
    const categories = ['all', ...new Set(quotes.map(q => q.category || 'Uncategorized'))];

    // Clear existing options
    filterSelect.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        filterSelect.appendChild(option);
    });

    // Restore last filter from localStorage
    const lastFilter = localStorage.getItem(FILTER_KEY) || 'all';
    filterSelect.value = lastFilter;
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem(FILTER_KEY, selectedCategory); // remember user choice
    renderQuotes(selectedCategory);
}
function renderQuotes(filter = 'all') {
    const container = document.getElementById('quotesContainer');
    container.innerHTML = '';

    let filteredQuotes = quotes;
    if (filter !== 'all') {
        filteredQuotes = quotes.filter(q => q.category === filter);
    }

    if (filteredQuotes.length === 0) {
        container.innerHTML = '<div class="small muted">No quotes in this category.</div>';
        return;
    }

    const ul = document.createElement('ul');
    filteredQuotes.forEach(q => {
        const li = document.createElement('li');
        li.innerHTML = `
      <div><strong>${q.text}</strong><br><span class="meta">${q.author || 'Unknown'} — ${q.category}</span></div>
      <button onclick="handleView(${q.id})">View</button>
    `;
        ul.appendChild(li);
    });

    container.appendChild(ul);
}

// Restore filter and render accordingly
const lastFilter = localStorage.getItem(FILTER_KEY) || 'all';
renderQuotes(lastFilter);
document.getElementById('categoryFilter').value = lastFilter;

populateCategories();

const LOCAL_KEY = 'dq_quotes';
const LAST_SYNC_KEY = 'dq_lastSync';
const MOCK_SERVER_KEY = 'mock_server_quotes';
let POLL_INTERVAL_MS = 8000; // default poll interval
let pollTimer = null;

// In-memory state
// let quotes = []; // {id, text, author, category, updatedAt}
let conflicts = [];

// DOM refs
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const quoteCategory = document.getElementById('quoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const pushBtn = document.getElementById('pushBtn');
const forcePullBtn = document.getElementById('forcePullBtn');
const clearBtn = document.getElementById('clearBtn');
const quotesContainer = document.getElementById('quotesContainer');
const notifications = document.getElementById('notifications');
const lastSyncEl = document.getElementById('lastSync');
const conflictsContainer = document.getElementById('conflictsContainer');
const serverModeSelect = document.getElementById('serverMode');
const pollIntervalInput = document.getElementById('pollInterval');
const applySettings = document.getElementById('applySettings');

// ---------- Local storage helpers ----------
function saveQuotesLocal() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
}

function loadQuotesLocal() {
    const raw = localStorage.getItem(LOCAL_KEY);
    quotes = [];
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) quotes = parsed;
        } catch (err) {
            console.error('Could not parse local quotes', err);
        }
    }
}

// ---------- Mock server (in-browser) ----------
/*
  We store server data in localStorage under MOCK_SERVER_KEY to simulate a remote server.
  Each server function returns a Promise that resolves after a small delay to mimic network.
*/
function ensureMockServerInitialized() {
    if (!localStorage.getItem(MOCK_SERVER_KEY)) {
        const initial = [
            { id: 1, text: 'Server quote: Hello from server', author: 'Server', category: 'Intro', updatedAt: new Date().toISOString() }
        ];
        localStorage.setItem(MOCK_SERVER_KEY, JSON.stringify(initial));
    }
}
function mockServerFetchAll() {
    ensureMockServerInitialized();
    return new Promise((resolve) => {
        setTimeout(() => {
            const raw = localStorage.getItem(MOCK_SERVER_KEY) || '[]';
            resolve(JSON.parse(raw));
        }, 400 + Math.random() * 300);
    });
}
function mockServerReplaceAll(newData) {
    // Replace entire server dataset (for simplicity)
    return new Promise((resolve) => {
        setTimeout(() => {
            localStorage.setItem(MOCK_SERVER_KEY, JSON.stringify(newData));
            resolve({ success: true });
        }, 300 + Math.random() * 200);
    });
}
function mockServerUpdateItem(item) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const raw = localStorage.getItem(MOCK_SERVER_KEY) || '[]';
            const arr = JSON.parse(raw);
            const idx = arr.findIndex(x => x.id === item.id);
            if (idx >= 0) arr[idx] = item; else arr.push(item);
            localStorage.setItem(MOCK_SERVER_KEY, JSON.stringify(arr));
            resolve(item);
        }, 250 + Math.random() * 300);
    });
}

// ---------- "Real" server placeholders ----------
/*
  If you connect to a real server, implement functions:
    fetchServerAll() -> fetch to GET /quotes
    pushToServer(changes) -> POST/PUT
  For this demo we default to mockServer* functions above.
*/
// async function fetchServerAll() {
//     if (serverModeSelect.value === 'mock') {
//         return await mockServerFetchAll();
//     } else {
//         // Placeholder: when integrating a real API, replace below with fetch() calls:
//         // return fetch('/api/quotes').then(r => r.json())
//         // For safety in this demo, just fall back to mock.
//         return await mockServerFetchAll();
//     }
// }
// Fetch all quotes from the server (mock or real)
async function fetchQuotesFromServer() {
    if (serverModeSelect.value === 'mock') {
        // Simulated server fetch (uses localStorage as backend)
        return await mockServerFetchAll();
    } else {
        // Placeholder for a real API call (replace with your actual endpoint)
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const data = await response.json();
            // Transform data to fit your quote format if needed
            return data.map(post => ({
                id: post.id,
                text: post.title,
                author: 'ServerUser',
                category: 'Imported',
                updatedAt: new Date().toISOString(),
            }));
        } catch (err) {
            console.error('Error fetching from real server:', err);
            notify('Failed to fetch from real server, using mock fallback.');
            return await mockServerFetchAll();
        }
    }
}
async function pushToServer(quote) {
    if (serverModeSelect.value === 'mock') {
        // Simulate a network delay
        await new Promise(res => setTimeout(res, 200));
        // Mock storage simulation
        let serverData = JSON.parse(localStorage.getItem('mockServer') || '[]');
        serverData.push(quote);
        localStorage.setItem('mockServer', JSON.stringify(serverData));
        return { status: 200, message: 'Mock upload successful' };
    } else {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST', // ✅ Explicit HTTP method
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8', // ✅ Proper header
                },
                body: JSON.stringify(quote), // ✅ Send quote data as JSON
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            return { status: response.status, message: 'Posted successfully', data };
        } catch (error) {
            console.error('Error posting to server:', error);
            notify('Failed to post quote to server.');
            throw error;
        }
    }
}

// ---------- UI rendering ----------
function renderQuotes() {
    quotesContainer.innerHTML = '';
    if (quotes.length === 0) {
        quotesContainer.innerHTML = '<div class="small muted">No local quotes.</div>';
        return;
    }
    const ul = document.createElement('ul');
    quotes.slice().reverse().forEach(q => {
        const li = document.createElement('li');
        const left = document.createElement('div');
        left.style.maxWidth = '70%';
        left.innerHTML = `<div style="font-weight:600">${escapeHtml(q.text)}</div><div class="meta">${escapeHtml(q.author || '—')} — ${escapeHtml(q.category || 'Uncategorized')}</div><div class="small">updated: ${new Date(q.updatedAt).toLocaleString()}</div>`;
        const actions = document.createElement('div');
        actions.className = 'actions';
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => openEditDialog(q.id));
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            if (!confirm('Delete this quote locally?')) return;
            quotes = quotes.filter(x => x.id !== q.id);
            saveQuotesLocal();
            renderQuotes();
            notify(`Deleted local quote id ${q.id}`);
        });
        actions.appendChild(editBtn);
        actions.appendChild(delBtn);
        li.appendChild(left);
        li.appendChild(actions);
        ul.appendChild(li);
    });
    quotesContainer.appendChild(ul);
}

function renderConflicts() {
    conflictsContainer.innerHTML = '';
    if (conflicts.length === 0) {
        conflictsContainer.innerHTML = '<div class="small muted">No unresolved conflicts.</div>';
        return;
    }
    const frag = document.createDocumentFragment();
    conflicts.forEach((c, i) => {
        const d = document.createElement('div');
        d.className = 'notif conflict';
        d.style.marginBottom = '8px';
        d.innerHTML = `
      <div><strong>Conflict #${i + 1}</strong> — id ${c.local.id}</div>
      <div class="small">Local updated: ${new Date(c.local.updatedAt).toLocaleString()}</div>
      <div class="small">Server updated: ${new Date(c.server.updatedAt).toLocaleString()}</div>
      <div style="margin-top:6px">
        <button data-idx="${i}" class="btn-keep-local">Keep Local</button>
        <button data-idx="${i}" class="btn-accept-server">Accept Server</button>
      </div>
      <div style="margin-top:6px" class="small">Local: "${escapeHtml(c.local.text)}" — ${escapeHtml(c.local.author || '')}</div>
      <div class="small">Server: "${escapeHtml(c.server.text)}" — ${escapeHtml(c.server.author || '')}</div>
    `;
        frag.appendChild(d);
    });
    conflictsContainer.appendChild(frag);

    // Attach listeners
    document.querySelectorAll('.btn-keep-local').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.getAttribute('data-idx'));
            resolveConflictKeepLocal(idx);
        });
    });
    document.querySelectorAll('.btn-accept-server').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = Number(e.currentTarget.getAttribute('data-idx'));
            resolveConflictAcceptServer(idx);
        });
    });
}

function notify(msg) {
    const div = document.createElement('div');
    div.className = 'notif';
    div.textContent = `${new Date().toLocaleTimeString()}: ${msg}`;
    notifications.prepend(div);
    // keep only last 8 notifications
    Array.from(notifications.children).slice(8).forEach(n => n.remove());
}

// ---------- Edit flow ----------
function openEditDialog(id) {
    const q = quotes.find(x => x.id === id);
    if (!q) return;
    const newText = prompt('Edit quote text:', q.text);
    if (newText === null) return;
    const newAuthor = prompt('Edit author:', q.author || '') || '';
    q.text = newText.trim();
    q.author = newAuthor.trim();
    q.updatedAt = new Date().toISOString();
    saveQuotesLocal();
    renderQuotes();
    notify(`Edited local quote id ${q.id}`);
}

// ---------- Add & push ----------
function addQuote() {
    const text = quoteText.value.trim();
    const author = quoteAuthor.value.trim();
    const category = quoteCategory.value.trim() || 'Uncategorized';
    if (!text) { alert('Enter a quote'); return; }
    const id = Date.now() + Math.floor(Math.random() * 999);
    const q = { id, text, author, category, updatedAt: new Date().toISOString() };
    quotes.push(q);
    saveQuotesLocal();
    renderQuotes();
    notify(`Added local quote id ${q.id}`);
    // Optionally push immediately
    // pushToServer(q).then(() => notify('Pushed to server'));
}

addQuoteBtn.addEventListener('click', addQuote);

// Push all local quotes to server one-by-one (simulate)
async function pushLocalChanges() {
    // For simplicity we push every local item to server (id-based update).
    notify('Pushing local changes to server...');
    for (const item of quotes) {
        try {
            await pushToServer(item);
        } catch (err) {
            console.error('Failed to push', err);
            notify('Failed to push some items to server.');
        }
    }
    // Optionally refresh server data view
    notify('Push complete.');
}

pushBtn.addEventListener('click', pushLocalChanges);

// Force pull
forcePullBtn.addEventListener('click', () => {
    notify('Manual fetch from server started...');
    syncWithServer();
});

// Clear local
clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all local quotes?')) return;
    quotes = [];
    saveQuotesLocal();
    renderQuotes();
    notify('Local quotes cleared.');
});

// ---------- Conflict resolution helpers ----------
function findConflicts(localArr, serverArr) {
    const serverMap = new Map(serverArr.map(s => [s.id, s]));
    const localMap = new Map(localArr.map(l => [l.id, l]));
    const detected = [];

    // For each id present in either
    const allIds = new Set([...serverArr.map(s => s.id), ...localArr.map(l => l.id)]);
    for (const id of allIds) {
        const local = localMap.get(id);
        const server = serverMap.get(id);
        if (local && server) {
            // If both exist, check timestamps
            if (local.updatedAt !== server.updatedAt) {
                // Conflict if both updated after last sync in different ways
                detected.push({ local, server });
            }
        }
        // else: insertion or deletion - treated below by server precedence rules
    }
    return detected;
}

async function resolveConflictKeepLocal(idx) {
    const c = conflicts[idx];
    if (!c) return;
    // Write local version to server (overwrite server)
    const updated = { ...c.local, updatedAt: new Date().toISOString() };
    try {
        await pushToServer(updated);
        notify(`Conflict #${idx + 1}: kept local and pushed to server (id ${updated.id})`);
    } catch (err) {
        console.error('Error pushing local during conflict keep', err);
        notify('Error pushing local change to server.');
    }
    // remove conflict and refresh
    conflicts.splice(idx, 1);
    renderConflicts();
    // After resolution, perform a sync so local list updated as server now has this local data
    await syncWithServer();
}

async function resolveConflictAcceptServer(idx) {
    const c = conflicts[idx];
    if (!c) return;
    // Accept server: overwrite local with server version
    const serverItem = { ...c.server }; // server updatedAt remains
    // replace or add
    const idxLocal = quotes.findIndex(x => x.id === serverItem.id);
    if (idxLocal >= 0) quotes[idxLocal] = serverItem;
    else quotes.push(serverItem);
    saveQuotesLocal();
    notify(`Conflict #${idx + 1}: accepted server version (id ${serverItem.id})`);
    conflicts.splice(idx, 1);
    renderConflicts();
    renderQuotes();
}

// ---------- Sync algorithm ----------
/*
  Strategy:
  - Fetch all server items
  - Compare local and server:
    - If server has an item not local -> add to local
    - If local has an item not on server -> push local to server
    - If both exist and updatedAt differ -> conflict
  - For conflicts: by default, server wins (overwrite local) but we also record conflict and notify the user, allowing manual keep-local
*/
async function syncQuotes() {
    notify('Starting sync process...');
    try {
        // 1️⃣ Fetch local and server quotes
        const localQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
        const serverQuotes = await fetchQuotesFromServer();

        // 2️⃣ Compare and find missing or updated quotes
        const mergedQuotes = [...localQuotes];
        let conflicts = [];

        serverQuotes.forEach(serverQuote => {
            const localIndex = mergedQuotes.findIndex(q => q.id === serverQuote.id);
            if (localIndex === -1) {
                // New server quote — add it
                mergedQuotes.push(serverQuote);
            } else if (new Date(serverQuote.updatedAt) > new Date(mergedQuotes[localIndex].updatedAt)) {
                // Conflict — server takes precedence
                conflicts.push({
                    type: 'conflict',
                    local: mergedQuotes[localIndex],
                    server: serverQuote,
                });
                mergedQuotes[localIndex] = serverQuote;
            }
        });

        // 3️⃣ Push new local quotes to the server (mock or real)
        for (const localQuote of localQuotes) {
            if (!serverQuotes.some(sq => sq.id === localQuote.id)) {
                await pushToServer(localQuote);
            }
        }

        // 4️⃣ Update local storage
        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));

        // 5️⃣ Notify user
        if (conflicts.length > 0) {
            notify(`Sync complete with ${conflicts.length} conflict(s) resolved (server data used).`);
        } else {
            notify('Sync complete — no conflicts detected.');
        }
    } catch (error) {
        console.error('Sync error:', error);
        notify('Sync failed. Please try again later.');
    }
}

// ---------- Utilities ----------
function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---------- Initialization & Polling ----------
function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(() => {
        syncWithServer();
    }, POLL_INTERVAL_MS);
}

function stopPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
}

// Apply settings when user changes poll interval or server mode
applySettings.addEventListener('click', () => {
    const val = Number(pollIntervalInput.value);
    if (!isNaN(val) && val >= 3) {
        POLL_INTERVAL_MS = val * 1000;
        startPolling();
        notify(`Poll interval set to ${val}s`);
    } else {
        alert('Enter a valid number (>=3 seconds)');
    }
});

// Load initial
function init() {
    loadQuotesLocal();
    renderQuotes();
    renderConflicts();
    // Initialize mock server storage for demo
    ensureMockServerInitialized();

    // Start polling with configured interval
    const startVal = Number(pollIntervalInput.value) || 8;
    POLL_INTERVAL_MS = Math.max(3000, startVal * 1000);
    startPolling();

    // Initial sync
    syncWithServer();
}

init();