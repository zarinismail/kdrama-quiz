// Get quiz form
const form = document.querySelector("#myForm");
// Get quiz area
const quiz = document.querySelector('#quiz');
// Get all options
const options = document.querySelectorAll('.form-check-input');
// Get result divs
const results = document.querySelectorAll('.result');
// Get reset button above quiz
const topResetBtn = document.querySelector('#topreset');
// Get submit button
const submitBtn = document.querySelector("input[type='submit']");
// Get retake quiz button
const retakeBtn = document.querySelector('#retake');
// Get questions and answers from info section
const questions = document.querySelectorAll('.question');
const answers = document.querySelectorAll('.answer');

// Title, description and buttons fade in when page loads
window.onload = fadeIn(document.querySelector('#intro'));

// Hide top reset button
topResetBtn.style.display = 'none';
options.forEach(function(el) {
    el.onclick = () => {
        // Top reset quiz button appears once user clicks an option
        topResetBtn.style.display = 'block';
        // Every time user clicks option, we check if all questions have been answered
        checkIfComplete();
    };
});

// If user clicks either reset button, the top reset button disappears and submit button is disabled
let resets = document.querySelectorAll("input[type='reset']");
resets.forEach(function(el) {
    el.onclick = () => {
        topResetBtn.style.display = 'none';
        submitBtn.disabled = true;
    };
});

// Tutorial on showing and hiding divs by Mindy McAdams: https://www.youtube.com/watch?v=1d2fPMnYBf8
// Set all answer divs to hidden initially
answers.forEach(function(el) {
    el.style.display = 'none';
});

// If a question is clicked, the answer below it will appear. If clicked again, answer will be hidden
questions.forEach(function(el) {
    el.onclick = () => {
        if (el.nextElementSibling.style.display === 'none') {
            el.nextElementSibling.style.display = 'block';
        } else {
            el.nextElementSibling.style.display = 'none';
        }
    };
});

// Set all results to hidden
results.forEach(function(el) {
    el.style.display = 'none';
});

// After form is processed, function runs without the default action
form.onsubmit = (e) => {
    e.preventDefault();
    calculateResults();
    // Scroll to result (more apparent for mobile devices)
    const resultArea = document.querySelector('#results');
    resultArea.scrollIntoView();
};

// Set retake button to hidden
retakeBtn.style.display = 'none';

// If user wants to retake quiz, page reloads (quiz will restart, result will disappear)
retakeBtn.onclick = () => {
    location.reload();
    quiz.scrollIntoView();
};

/* ALL FUNCTIONS BELOW */

// Tutorial on creating a fade in function for an element: https://www.tutorialspoint.com/how-to-add-fade-in-effect-using-pure-javascript
function fadeIn(el) {
    let opacity = 0;
    
    let fade = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(fade);
        }
        el.style.opacity = opacity;
        opacity += 0.045;
    }, 30); 
}

// If user answered every question, submit button is active
function checkIfComplete() {
    let selectedOptions = document.querySelectorAll('.form-check-input:checked');
    // Every question has FIVE options, so required number of options to include is the total number of options in the quiz divided by 5
    let numQuestionsRequired = options.length / 5;
    if (selectedOptions.length == numQuestionsRequired) {
        submitBtn.disabled = false;
    }
}

// Function shown in a video by KC Katalbas about making a personality quiz: https://www.youtube.com/watch?v=ZA4WpyVzafQ (revised to match structure of my webpage)
function calculateResults() {
    let selectedOptions = document.querySelectorAll('.form-check-input:checked');
    let resultsAsNums = convertResultNameToNum(selectedOptions);
    let score = getMostChosen(resultsAsNums);

    let result = '';
    switch (score) {
        case 1:
            result = '#drama1';
            break;
        case 2:
            result = '#drama2';
            break;
        case 3:
            result = '#drama3';
            break;
        case 4:
            result = '#drama4';
            break;
        case 5:
            result = '#drama5';
            break;
    }

    // Log result to console
    console.log('Final result: ' + result);
    
    const finalResult = document.querySelector(result);
    finalResult.style.display = 'block';
    quiz.style.display = 'none';
    retakeBtn.style.display = 'block';

    // If user clicks "Take quiz" button at the top of the page, page reloads rather than scrolling down to quiz
    let quizBtn = document.querySelector('#quizbtn');
    quizBtn.onclick = () => {
        location.reload();
        quiz.scrollIntoView();
    }
}

// Picks most chosen "number" (indicator of a specific result) from user's answers; if there are ties for most chosen, one is randomly returned
// Function shown in a video by KC Katalbas about making a personality quiz (https://www.youtube.com/watch?v=ZA4WpyVzafQ) and revised to handle ties
// Looked at this tutorial to learn how to find ties: https://www.geeksforgeeks.org/find-mode-of-an-array-using-javascript/#
function getMostChosen(arr) {
    // Object that stores each num and its occurrences
    let counts = {};
    let maxCount = 0;
    // Stores most chosen num (or multiple most chosen nums)
    let mostChosen = [];

    arr.forEach(function(el) {
        // Tracks each number in array and its occurrences in counts object (counts[el] is the occurrences)
        counts[el] = (counts[el] || 0) + 1;
        // If the # of occurrences for a number is the greatest...
        if (counts[el] > maxCount) {
            // Store its occurrences in maxCount
            maxCount = counts[el];
            // Store number in mostChosen (and update mostChosen if that number changes)
            mostChosen = [el];
        // If another number's occurrences match maxCount, add that number into mostChosen
        } else if (counts[el] === maxCount) {
            mostChosen.push(el);
        }
    });

    // Log original array
    console.log(arr);
    // Log occurrences of each number to console
    console.log(counts);
    // Log numbers that are tied for most chosen
    console.log('Most chosen num(s): ' + mostChosen);

    // Out of most chosen nums, choose one randomly (if there's no ties, the sole num will be chosen)
    // Tutorial on choosing a random number in an array: https://www.geeksforgeeks.org/how-to-select-a-random-element-from-array-in-javascript/
    let i = Math.floor(Math.random() * mostChosen.length);
    let finalScore = mostChosen[i];
    // Log most chosen number to console
    console.log('Final chosen: ' + finalScore);
    
    return finalScore;
}

// Takes result names found as values in each radio button's classes and converts them into numbers to calculate results
function convertResultNameToNum(NodeList) {
    let results = [];
    let resultNum = 0;

    NodeList.forEach(function(el) {
        let resultName = el.getAttribute('class');
        
        if (resultName.includes('result1')) {
            resultNum = 1;
        } else if (resultName.includes('result2')) {
            resultNum = 2;
        } else if (resultName.includes('result3')) {
            resultNum = 3;
        } else if (resultName.includes('result4')) {
            resultNum = 4;
        } else {
            resultNum = 5;
        }

        results.push(resultNum);
    });

    return results;
}