let newBtn = document.querySelector('#js-new-quote');
newBtn.addEventListener('click', getQuote);

const endpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

let answertn = document.querySelector('#js-tweet').addEventListener('click', showAnswer)

const answerText = document.querySelector('#js-answer-text');

let current = {
    question: "",
    answer: ""
}

async function getQuote(){
    try{
        const response = await fetch(endpoint);
        if (!response.ok){
            throw Error(response.statusText);
        }

        const json = await response.json();
        console.log(json);
        displayQuote(json['question']);
        current.question = json["question"];
        current.answer = json["answer"];
        console.log(current.answer)

        answerText.textContent = "";

    } catch (err){
        console.log(err);
        alert('Failed to fetch the new quote');
    }

}

function displayQuote(quote){
    const quoteText = document.querySelector
    ('#js-quote-text');
    quoteText.textContent = quote;
}

function showAnswer(){
    const answerText = document.querySelector('#js-answer-text');
    answerText.textContent = current.answer;
}

getQuote();