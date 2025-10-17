const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuote = document.getElementById('newQuote');
const quoteArr = [
    {
        text: 'I think, therefore I am',
        catogory: 'Motivation'
    },
    {
        text: 'There are no regrets in life. Just lessons',
        catogory: 'Reflection'
    }
]

// newQuote.addEventListener('click', createAddQuoteForm);
function addQuote() {
    createAddQuoteForm();
}
function showRandomQuote() {
    quoteArr.forEach(quote => {
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        p1.textContent = quote.text;
        p2.textContent = quote.catogory;
        quoteDisplay.append(p1, p2);
    })
}
function createAddQuoteForm() {
    const txtValue = newQuoteText.value;
    const catogoryValue = newQuoteCategory.value;

    if (txtValue !== '' || catogoryValue !== '') {
        quoteArr.push({
            text: txtValue,
            catogory: catogoryValue
        });
    }
    showRandomQuote();
}