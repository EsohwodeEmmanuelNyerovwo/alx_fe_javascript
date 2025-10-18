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