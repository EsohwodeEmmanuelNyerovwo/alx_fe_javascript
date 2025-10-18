const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuote = document.getElementById('newQuote');

const quoteArr = [
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
    const rnd = quoteArr[index];
    quoteDisplay.innerHTML = `${rnd.text} --- ${rnd.category}`;
    // quoteArr.forEach(quote => {
    //     quoteDisplay.innerHTML += `
    //         ${quote.text} --- ${quote.category};
    //     `
    // })
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
    }
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');

    p1.textContent = txtValue;
    p2.textContent = catogoryValue;

    quoteDisplay.appendChild(p1);
    quoteDisplay.appendChild(p2);

    showRandomQuote();
}