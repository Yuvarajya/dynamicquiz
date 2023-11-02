// Elements
const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");
const screens = document.querySelectorAll(".screen");

const startBtn = document.querySelector(".start");
const numQuestions = document.querySelector("#num-questions");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quizScreen = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");

let questions = [];
let time = 30;
let score = 0;
let currentQuestion;
let timer;

// Start the quiz
const startQuiz = () => {
    const num = numQuestions.value;
    const cat = category.value;
    const diff = difficulty.value;
    loadingAnimation();

    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
            setTimeout(() => {
                startScreen.classList.add("hide");
                quizScreen.classList.remove("hide");
                currentQuestion = 1;
                showQuestion(questions[0]);
            }, 1000);
        });
};

startBtn.addEventListener("click", startQuiz);

// Show a question
const showQuestion = (question) => {
    const questionText = document.querySelector(".question");
    const answersWrapper = document.querySelector(".answer-wrapper");
    const questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;

    const answers = [...question.incorrect_answers, question.correct_answer.toString()];
    answersWrapper.innerHTML = "";
    answers.sort(() => Math.random() - 0.5);

    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
            <div class="answer">
                <span class="text">${answer}</span>
                <span class="checkbox">
                    <i class="fas fa-check"></i>
                </span>
            </div>
        `;
    });

    questionNumber.innerHTML = `Question <span class="current">${questions.indexOf(question) + 1}</span><span class="total">/${questions.length}</span>`;

    const answersDiv = document.querySelectorAll(".answer");

    answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!answer.classList.contains("checked")) {
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });

                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });

    time = timePerQuestion.value;
    startTimer(time);
};

// Start timer
const startTimer = (time) => {
    timer = setInterval(() => {
        if (time === 3) {
            playAudio("countdown.mp3");
        }

        if (time >= 0) {
            progress(time);
            time--;
        } else {
            checkAnswer();
        }
    }, 1000);
};

// Loading animation
const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
        if (startBtn.innerHTML.length === 10) {
            startBtn.innerHTML = "Loading";
        } else {
            startBtn.innerHTML += ".";
        }
    }, 500);
};

// Submit and Next buttons
const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
});

// Check the answer
const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");

    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").innerHTML;

        if (answer === questions[currentQuestion - 1].correct_answer) {
            score++;
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");

            const correctAnswer = document.querySelectorAll(".answer");

            correctAnswer.forEach((answer) => {
                if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
                    answer.classList.add("correct");
                }
            });
        }
    } else {
        const correctAnswer = document.querySelectorAll(".answer");

        correctAnswer.forEach((answer) => {
            if (answer.querySelector(".text").innerHTML === questions[currentQuestion - 1].correct_answer) {
                answer.classList.add("correct");
            }
        });
    }

    const answersDiv = document.querySelectorAll(".answer");

    answersDiv.forEach((answer) => {
        answer.classList.add("checked");
    });

    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

// Next question
const nextQuestion = () => {
    if (currentQuestion < questions.length) {
        currentQuestion++;
        showQuestion(questions[currentQuestion - 1]);
    } else {
        showScore();
    }
};

// Show final score
const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide");
    quizScreen.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/${questions.length}`;
};

// Restart quiz
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});

// Play audio
const playAudio = (src) => {
    const audio = new Audio(src);
    audio.play();
};
