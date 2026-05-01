// =============== DATA STRUCTURES ===============

const flashcardsData = [
    {
        term: "EVM",
        hint: "Electronic Voting Machine",
        definition: "A secure electronic device used to record votes. It replaces paper ballots and makes counting faster and more accurate."
    },
    {
        term: "VVPAT",
        hint: "Voter Verifiable Paper Audit Trail",
        definition: "An independent verification system attached to EVMs that allows voters to verify that their vote was cast correctly via a paper slip."
    },
    {
        term: "NOTA",
        hint: "None Of The Above",
        definition: "A ballot option that allows voters to officially register a vote of rejection for all candidates contesting in the election."
    },
    {
        term: "MCC",
        hint: "Model Code of Conduct",
        definition: "A set of guidelines issued by the ECI to regulate political parties and candidates prior to elections, ensuring fair play."
    },
    {
        term: "EPIC",
        hint: "Electoral Photo Identity Card",
        definition: "Commonly known as the Voter ID card. It is an identity document issued by the ECI to adult domiciles of India."
    }
];

const quizData = [
    {
        question: "Who conducts the Lok Sabha elections in India?",
        options: [
            "Supreme Court of India",
            "President of India",
            "Election Commission of India",
            "Parliament"
        ],
        answer: 2
    },
    {
        question: "What is the minimum voting age in India?",
        options: [
            "16 years",
            "18 years",
            "21 years",
            "25 years"
        ],
        answer: 1
    },
    {
        question: "Which option allows a voter to reject all candidates?",
        options: [
            "VVPAT",
            "NOTA",
            "EVM",
            "EPIC"
        ],
        answer: 1
    },
    {
        question: "How long before polling does the campaign silence period begin?",
        options: [
            "24 hours",
            "48 hours",
            "72 hours",
            "1 week"
        ],
        answer: 1
    },
    {
        question: "What does VVPAT stand for?",
        options: [
            "Voter Validated Paper Audit Trail",
            "Voting Verification Paper Audit Trail",
            "Voter Verifiable Paper Audit Trail",
            "Valid Vote Paper Audit Trail"
        ],
        answer: 2
    }
];

// =============== NAVIGATION LOGIC ===============
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.view-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all buttons and sections
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.add('hidden'));
            
            // Add active to clicked button and target section
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
            
            // Initialize components if needed
            if (targetId === 'flashcards' && !flashcardInitialized) {
                initFlashcards();
            }
        });
    });
});

// =============== FLASHCARDS LOGIC ===============
let currentCardIndex = 0;
let flashcardInitialized = false;
const flashcardContainer = document.getElementById('flashcard-container');
const cardCounter = document.getElementById('card-counter');

function initFlashcards() {
    renderCard(currentCardIndex);
    flashcardInitialized = true;

    document.getElementById('prev-card').addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            renderCard(currentCardIndex);
        }
    });

    document.getElementById('next-card').addEventListener('click', () => {
        if (currentCardIndex < flashcardsData.length - 1) {
            currentCardIndex++;
            renderCard(currentCardIndex);
        }
    });
}

function renderCard(index) {
    const data = flashcardsData[index];
    flashcardContainer.innerHTML = `
        <div class="flashcard" onclick="this.classList.toggle('flipped')">
            <div class="card-face card-front">
                <h3>${data.term}</h3>
                <p class="hint">Tap to flip &middot; ${data.hint}</p>
            </div>
            <div class="card-face card-back">
                <p>${data.definition}</p>
            </div>
        </div>
    `;
    cardCounter.textContent = `${index + 1} / ${flashcardsData.length}`;
}

// =============== QUIZ LOGIC ===============
let currentQuizIndex = 0;
let score = 0;

const startBtn = document.getElementById('start-quiz-btn');
const restartBtn = document.getElementById('restart-quiz-btn');
const quizStartView = document.getElementById('quiz-start');
const quizQuestionView = document.getElementById('quiz-question');
const quizResultView = document.getElementById('quiz-result');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const qNumSpan = document.getElementById('q-num');
const progressDiv = document.getElementById('quiz-progress');

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);

function startQuiz() {
    currentQuizIndex = 0;
    score = 0;
    quizStartView.classList.add('hidden');
    quizResultView.classList.add('hidden');
    quizQuestionView.classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const q = quizData[currentQuizIndex];
    questionText.textContent = q.question;
    qNumSpan.textContent = currentQuizIndex + 1;
    progressDiv.style.width = \`\${((currentQuizIndex) / quizData.length) * 100}%\`;
    
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = opt;
        btn.onclick = () => selectAnswer(index, btn, q.answer);
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex, btnNode, correctIndex) {
    const allButtons = optionsContainer.querySelectorAll('.option-btn');
    
    // Disable all buttons
    allButtons.forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = 'none';
    });
    
    if (selectedIndex === correctIndex) {
        btnNode.classList.add('correct');
        score++;
    } else {
        btnNode.classList.add('wrong');
        allButtons[correctIndex].classList.add('correct');
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    quizQuestionView.classList.add('hidden');
    quizResultView.classList.remove('hidden');
    
    const percentage = Math.round((score / quizData.length) * 100);
    document.getElementById('final-score').textContent = \`\${percentage}%\`;
    
    const msg = document.getElementById('result-message');
    if (percentage === 100) msg.textContent = "Perfect! You're an expert on Indian elections.";
    else if (percentage >= 60) msg.textContent = "Great job! You know your democracy well.";
    else msg.textContent = "Good try! Review the Process section to learn more.";
}

// =============== CHATBOT LOGIC ===============
const chatToggleBtn = document.getElementById('chat-toggle');
const chatbotContainer = document.getElementById('chatbot');
const closeChatBtn = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat');

const botResponses = {
    "register": "To register to vote, you need to be an Indian citizen above 18 years of age. You can fill out Form 6 online on the Voter Service Portal (voters.eci.gov.in) or offline via a Booth Level Officer.",
    "vote": "To register to vote, you need to be an Indian citizen above 18 years of age. You can fill out Form 6 online on the Voter Service Portal (voters.eci.gov.in) or offline via a Booth Level Officer.",
    "evm": "An EVM (Electronic Voting Machine) is a secure device used to record votes electronically, making the process faster and more accurate than paper ballots.",
    "vvpat": "VVPAT stands for Voter Verifiable Paper Audit Trail. It prints a slip with the candidate's name and symbol you voted for, allowing you to verify your vote.",
    "nota": "NOTA means 'None Of The Above'. It allows you to officially register a vote of rejection for all candidates contesting in your constituency.",
    "mcc": "The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI for political parties and candidates to ensure free and fair elections.",
    "eci": "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India.",
    "age": "The minimum age to vote in India is 18 years.",
    "process": "The election process includes: Delimitation, Voter Rolls Update, Notification (MCC begins), Nomination, Campaigning, Polling Day, Counting, and Results.",
    "default": "I'm your Election Assistant. I can help with terms like EVM, VVPAT, NOTA, or guide you on how to register to vote. Could you please rephrase your question?"
};

chatToggleBtn.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
});

closeChatBtn.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

sendChatBtn.addEventListener('click', handleChatSubmit);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSubmit();
});

function handleChatSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    addMessage(text, 'user-message');
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Process Response (Simulated Delay)
    setTimeout(() => {
        let response = botResponses["default"];
        const lowerText = text.toLowerCase();
        
        for (const key in botResponses) {
            if (lowerText.includes(key)) {
                response = botResponses[key];
                break;
            }
        }
        
        addMessage(response, 'bot-message');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}

function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', className);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
}
