class AudioController {
    constructor() {
        this.bgMusic = new Audio('assets/Audio/229 Staff Credit.mp3')
        this.flipSound = new Audio('assets/Audio/Card-flip-sound-effect.mp3');
        this.matchSound = new Audio('assets/Audio/905 Job Level Up S.mp3');
        this.victorySound = new Audio('assets/Audio/113 Mission Complete.mp3');
        this.gameOverSound = new Audio('Assets/Audio/133 Game Over.mp3');
        this.bgMusic.volume = 0.6;
        this.flipSound.volume = 0.6;
        this.matchSound.volume = 0.6;
        this.victorySound.volume = 0.6;
        this.gameOverSound.volume = 0.6;
        this.bgMusic.loop = true;
    };
    startMusic() {
        this.victorySound.pause();
        this.victorySound.currentTime = 0;
        this.gameOverSound.pause();
        this.gameOverSound.currentTime = 0;

        this.bgMusic.play();
    };
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    };
    flipCard() {
        this.flipSound.play();
    };
    match() {
        this.matchSound.pause();
        this.matchSound.currentTime = 0;
        setTimeout(()=>{
            this.matchSound.play();
        },100)
    };
    victory() {
        this.stopMusic();
        this.victorySound.play();
    };
    gameOver() {
        clearInterval(this.countdown);
        this.bgMusic.pause();
        this.gameOverSound.play();
    }
}

class CardGame {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    };
    startGame(){
        this.totalClicks = 0
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500);
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
        this.hideCards();
    };
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0;i --){
            let random = Math.floor(Math.random() * (i + 1));
            this.cardsArray[random].style.order = i;
            this.cardsArray[i].style.order = random;
        }
    };
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        setTimeout(()=>{
            this.audioController.match();
        },500)
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    };
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    };
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    };
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flipCard();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    };
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck)){
            this.cardMatch(card, this.cardToCheck);
        }else {
            this.cardMismatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    };
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    };
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    };
    gameOver(){
        clearInterval(this.countdown);
        document.getElementsByClassName('card-container')[0].style.display = 'none'
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
        this.busy = true;
        setTimeout(()=>{
            this.busy = false
        }, 4000);
    };
    victory() {
        clearInterval(this.countdown);
        setTimeout(()=>{
            document.getElementsByClassName('card-container')[0].style.display = 'none'
            this.audioController.victory();
            document.getElementById('victory-text').classList.add('visible');
        },500)
    };
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
}

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready());
}else{
    ready();
}

function ready() {
    let text = Array.from(document.getElementsByClassName('overlay-text'));
    let cardContainer = document.getElementsByClassName('card-container');
    let card = Array.from(document.getElementsByClassName('card'));
    let game = new CardGame(100, card);

    text.forEach((e, i) => {
        e.addEventListener('click', ()=>{
            if(!game.busy){
                e.classList.remove('visible');
                cardContainer[0].style.display = "grid";
                game.startGame();
            }
        })
    })

    card.forEach((e) => {
        e.addEventListener('click', ()=>{
           game.flipCard(e);
        })
    })
}
