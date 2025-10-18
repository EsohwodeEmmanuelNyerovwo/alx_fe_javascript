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