class Deck {
  constructor() {
    this.baseCards = [{
      card: 'A',
      value: 1
    }];
    for (let i = 2; i <= 10; i++) {
      this.baseCards.push({
        card: String(i),
        value: i
      });
    }
    this.baseCards.push({
      card: 'J',
      value: 10
    }, {
      card: 'Q',
      value: 10
    }, {
      card: 'K',
      value: 10
    });

  }

  initCards() {

    this.cards = [];
    let cardTypes = ['diamonds', 'clubs', 'hearts', 'spades'];

    for (let j = 0; j < cardTypes.length; j++) {
      let cardType = cardTypes[j];
      for (let i = 0; i < this.baseCards.length; i++) {

        let cardx = this.baseCards[i];
        cardx.type = cardType;
        cardx.image = `${cardType.charAt(0)}${i+1}.png`;
        cardx = JSON.stringify(cardx);

        let card = JSON.parse(cardx);
        this.cards.push(card);
      }
    }

  }

  getCards() {
    console.log(this.cards);
    return this.cards;
  }

}

class Blackjack {

  constructor() {

    this.deck = new Deck();

    this.gameStarted = false;

    this.usersCards = this.dealersCards = [];

    this.startGameBtn = document.getElementById('new-game');
    this.hitBtn = document.getElementById('hit');
    this.stayBtn = document.getElementById('stay');

    this.usersContainer = document.getElementById('players-cards');
    this.dealersContainer = document.getElementById('dealers-cards');

    this.status = document.getElementById('game-status');

    this.registerClickEvents();

  }

  registerClickEvents() {
    this.startGameBtn.addEventListener('click', (e) => {
      this.startGame();
    });
    this.hitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.hit();
    });

    this.stayBtn.addEventListener('click', () => {
      this.stay();
    });
  }

  initCards() {
    this.deck.initCards();
    this.cards = this.deck.getCards();
  }

  startGame() {
    this.initCards();

    this.clearCards(this.usersContainer);
    this.clearCards(this.dealersContainer);
    this.clearStatus();

    this.usersCards = {
      type: 'user',
      cards: [],
      total: 0,
      image: ''
    };
    this.dealersCards = {
      type: 'dealer',
      cards: [],
      total: 0,
      image: ''
    };

    this.shuffle(this.cards);

    this.drawCard(this.usersCards);
    this.drawCard(this.usersCards);

    this.drawCard(this.dealersCards);

    let status = `Your current score is ${this.usersCards.total}, would you like to hit or stay?`;
    this.updateStatus(status);

    this.startGameBtn.setAttribute('disabled', true);
    this.hitBtn.removeAttribute('disabled');
    this.stayBtn.removeAttribute('disabled');

    this.gameStarted = true;
  }

  stopGame() {

    this.startGameBtn.removeAttribute('disabled');
    this.hitBtn.setAttribute('disabled', true);
    this.stayBtn.setAttribute('disabled', true);

    this.gameStarted = false;
  }

  hit() {
    if (!this.gameStarted) {
      return false;
    }
    let card = this.drawCard();
    if (card.card === "A") {
      // prompt user to choose 1 or 10
      let x = confirm('You drew an Ace, would you like to change its value to 10 instead of 1?');
      card.value = x ? 10 : 1;
    }
    this.usersCards.cards.push(card);
    this.usersCards.total += card.value;

    this.appendCard(card, 'user');

    if (this.usersCards.total === 21) {
      this.updateStatus('You are currently at 21.');
      this.updateStatus('Dealer is drawing now..');
      this.stay();
      return;
    }

    let status = '';
    if (this.usersCards.total > 21) {
      // output error here.
      this.stopGame();
      status = `Your score is ${this.usersCards.total}, you have lost.`;
    } else {
      status = `Your current score is ${this.usersCards.total}, would you like to hit or stay?`;
    }
    this.updateStatus(status);
  }

  stay() {
    if (!this.gameStarted) {
      return;
    }
    this.dealerHit();
  }

  dealerHit() {
    // check here if dealer is above user and also below or equal to 21
    while ((this.dealersCards.total < this.usersCards.total)) {
      this.drawCard(this.dealersCards);
    }

    this.stopGame();

    let status = '';

    if (this.dealersCards.total === this.usersCards.total) {
      // draw
      status = `You have drawn with the dealer with a score of: ${this.usersCards.total}.`;
    } else if (this.dealersCards.total <= 21) {
      // dealer has <= 21 and user has less than dealer. 
      status = `You have lost as the dealer has beaten you. Dealers score: ${this.dealersCards.total}.`;
    } else {
      status = `You have won the game as the dealer has bust. Dealers score: ${this.dealersCards.total}.`;
    }
    this.updateStatus(status);
  }

  drawCard(user) {
    let card = this.cards[0];
    this.cards.splice(0, 1);
    if (user) {
      user.cards.push(card);
      user.total += card.value;
      this.appendCard(card, user.type);
    }
    return card;
  }

  getPlayersTotal() {
    if (this.gameStarted) {
      return this.usersCards.total;
    }
  }

  appendCard(card, userDealer) {
    const slot = document.createElement('img');
    slot.setAttribute('src', `images/cards/${card.image}`);
    setTimeout(() => {
      slot.setAttribute('style', 'opacity: 1');
    }, 100);

    if (userDealer === 'user') {
      this.usersContainer.appendChild(slot)
    } else {
      this.dealersContainer.appendChild(slot);
    }

  }

  clearCards(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  shuffle(array) {
    /* Taken from: https://stackoverflow.com/a/2450976/1543278 */
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  updateStatus(x) {
    this.status.innerHTML += '<br>' + x;
  }

  clearStatus() {
    this.status.innerHTML = '';
  }

}

// and away we go
new Blackjack;