const diceFaces = ['Déplacer un vaisseau', 'Énergie', 'Culture', 'Diplomatie', 'Économie', 'Attaquer'];

let cards = [];
let victoryPoints = 0;
let diceResults = [];
let currentDie = 0;
let colonizationLevel = 1;
let iaShips = 4; // Number of IA ships available to move
let energy = 0;
let culture = 0;
let extraRollsUsed = false; // To track if extra rolls have been used this turn
let extraRollsRemaining = 0; // To track the number of extra rolls remaining
let playerDice = 5; // Number of dice the player can roll

const maxResources = 5;

const availableCards = [
    { name: 'Arcalon Majoris', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Gain 2 Culture', points: 2, progress: 0, maxProgress: 5, iaShip: false },
    { name: 'Zantos-6', type: 'Énergie', colonizationType: 'Économie', effect: 'Gain 2 Energy', points: 3, progress: 0, maxProgress: 4, iaShip: false },
    { name: 'Voltan-Prime', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Move a ship 2 spaces', points: 1, progress: 0, maxProgress: 6, iaShip: false },
    { name: 'Xyler-9', type: 'Culture', colonizationType: 'Économie', effect: 'Increase influence by 2', points: 4, progress: 0, maxProgress: 3, iaShip: false },
    { name: 'Raxxon', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Gain 1 Culture and 1 Energy', points: 3, progress: 0, maxProgress: 4, iaShip: false },
    { name: 'Dercyllius', type: 'Énergie', colonizationType: 'Économie', effect: 'Move a ship 3 spaces', points: 2, progress: 0, maxProgress: 6, iaShip: false },
    { name: 'Medea', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Colonize a planet for free', points: 5, progress: 0, maxProgress: 3, iaShip: false },
    { name: 'Nyx-14', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 4, progress: 0, maxProgress: 5, iaShip: false }
];

document.addEventListener("DOMContentLoaded", () => {
    displayNextCardOptions(true);
    updateColonizationLevel();
    updateResources();
    updateIaShipsOnBoard();
});

function getNumDice() {
    if (colonizationLevel >= 5) return 7;
    if (colonizationLevel >= 3) return 6;
    return 5;
}

function rollDie() {
    const roll = Math.floor(Math.random() * diceFaces.length);
    const result = diceFaces[roll];
    diceResults.push(result);
    displayDiceResults();
    processDieResult(result);
    currentDie++;
    if (currentDie === getNumDice() && extraRollsRemaining === 0) {
        setTimeout(() => {
            endIaTurn();
        }, 500); // Delay to show the last die before the message
    }
}

function rollExtraDie() {
    const roll = Math.floor(Math.random() * diceFaces.length);
    const result = diceFaces[roll];
    diceResults.push(result);
    displayDiceResults();
    processDieResult(result);
    extraRollsRemaining--;
    if (extraRollsRemaining === 0) {
        setTimeout(askPlayerToPlayTurn, 500); // Delay before asking the player to play their turn
    }
}

function displayDiceResults() {
    const diceResultsDiv = document.getElementById('dice-results');
    diceResultsDiv.innerHTML = '<h3>Dice Results:</h3>';
    diceResults.forEach(result => {
        const div = document.createElement('div');
        div.textContent = result;
        diceResultsDiv.appendChild(div);
    });
}

function processDieResult(result) {
    if (result === 'Déplacer un vaisseau') {
        moveIaShip();
    } else if (result === 'Énergie') {
        gainEnergy();
    } else if (result === 'Culture') {
        gainCulture();
    } else if (result === 'Diplomatie') {
        advanceDiplomacy();
    } else if (result === 'Économie') {
        advanceEconomy();
    } else if (result === 'Attaquer') {
        attack();
    }
    displayCards(); // Update the display after processing the die result
}

function moveIaShip() {
    for (let i = 0; i < cards.length; i++) {
        if (!cards[i].iaShip) {
            cards[i].iaShip = true;
            iaShips--;
            updateIaShipsOnBoard();
            break;
        }
    }
}

function gainEnergy() {
    let energyGained = 0;
    for (const card of cards) {
        if (card.iaShip && card.type === 'Énergie') {
            energyGained++;
        }
    }
    energyGained += iaShips; // Add energy for ships on the board
    energy = Math.min(energy + energyGained, maxResources);
    updateResources();
}

function gainCulture() {
    let cultureGained = 0;
    for (const card of cards) {
        if (card.iaShip && card.type === 'Culture') {
            cultureGained++;
        }
    }
    cultureGained += iaShips; // Add culture for ships on the board
    culture = Math.min(culture + cultureGained, maxResources);
    updateResources();
}

function advanceDiplomacy() {
    for (const card of cards) {
        if (card.iaShip && card.colonizationType === 'Diplomatie') {
            card.progress = Math.min(card.progress + 1, card.maxProgress);
            if (card.progress >= card.maxProgress) {
                victoryPoints += card.points;
                updateVictoryPoints();
                card.iaShip = false;
                iaShips++;
                replaceCardAt(cards.indexOf(card)); // Replace the card at the colonized position
                cards.splice(cards.indexOf(card), 1);
            }
        }
    }
    displayCards();
}

function advanceEconomy() {
    for (const card of cards) {
        if (card.iaShip && card.colonizationType === 'Économie') {
            card.progress = Math.min(card.progress + 1, card.maxProgress);
            if (card.progress >= card.maxProgress) {
                victoryPoints += card.points;
                updateVictoryPoints();
                card.iaShip = false;
                iaShips++;
                replaceCardAt(cards.indexOf(card)); // Replace the card at the colonized position
                cards.splice(cards.indexOf(card), 1);
            }
        }
    }
    displayCards();
}

function attack() {
    if (colonizationLevel === 1) {
        alert("Attaquer : Enlever 1 Énergie");
        energy = Math.max(0, energy - 1);
    } else if (colonizationLevel === 2) {
        alert("Attaquer : Ajouter 2 Culture à l'IA");
        culture = Math.min(maxResources, culture + 2);
    } else if (colonizationLevel === 3) {
        alert("Attaquer : Reculer un vaisseau d'une case");
        movePlayerShipBack(1);
    } else if (colonizationLevel === 4) {
        alert("Attaquer : Vous perdez un dé pour 1 tour");
        playerDice = Math.max(1, playerDice - 1);
        setTimeout(() => {
            playerDice = 5; // Reset the player's dice count after one turn
        }, 5000); // Adjust the time as needed
    } else if (colonizationLevel === 5) {
        alert("Attaquer : Reculer tous vos vaisseaux d'une case");
        movePlayerShipBack(iaShips);
    }
    updateResources();
}

function movePlayerShipBack(spaces) {
    // Logic to move player's ships back by the specified number of spaces
    // Implement the logic according to your game's rules and board structure
}

function gainResource(type) {
    if (type === 'Énergie' && energy < maxResources) {
        energy++;
    } else if (type === 'Culture' && culture < maxResources) {
        culture++;
    }
    updateResources();
}

function updateResources() {
    const energyProgress = document.getElementById('energy-progress');
    const cultureProgress = document.getElementById('culture-progress');
    energyProgress.style.width = `${(energy / maxResources) * 100}%`;
    energyProgress.textContent = energy;
    cultureProgress.style.width = `${(culture / maxResources) * 100}%`;
    cultureProgress.textContent = culture;
}

function updateIaShipsOnBoard() {
    document.getElementById('ia-ships-on-board').textContent = iaShips;
}

function endIaTurn() {
    if (energy >= maxResources) {
        colonizationLevel++;
        energy = 0;
        updateColonizationLevel();
    }
    if (culture >= maxResources && !extraRollsUsed) {
        alert("The IA gains 3 extra dice rolls due to having at least 5 culture!");
        extraRollsUsed = true;
        extraRollsRemaining = 3;
    } else {
        askPlayerToPlayTurn();
    }
}

function askPlayerToPlayTurn() {
    alert("All dice have been rolled. It's your turn to play!");
    // Reset diceResults and currentDie to allow for the next turn
    diceResults = [];
    currentDie = 0;
    extraRollsUsed = false; // Reset extra rolls usage for the next turn
    if (extraRollsRemaining === 0) {
        culture = 0; // Reset culture only after all extra rolls are used
        updateResources();
    }
}

function displayCards() {
    const cardsDiv = document.getElementById('cards-in-play');
    cardsDiv.innerHTML = '<h3>Cards in Play:</h3>';
    cards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        let shipIndicator = card.iaShip ? " <span style='color: red;'>🚀</span> " : "";
        div.innerHTML = `
            <strong>${card.name}${shipIndicator}</strong><br>
            ${card.effect}<br>
            Type: ${card.type}<br>
            Colonization: ${card.colonizationType}<br>
            Points: ${card.points}<br>
            Progress: ${card.progress}/${card.maxProgress}
            <div class="progress-bar">
                <div class="progress" style="width:${(card.progress / card.maxProgress) * 100}%">${card.progress}/${card.maxProgress}</div>
            </div>
            <button onclick="takeCard(${index})">Take Card</button>
        `;
        div.dataset.index = index;
        cardsDiv.appendChild(div);
    });
}

function displayNextCardOptions(initial = false) {
    const nextCardsDiv = document.getElementById('next-cards');
    nextCardsDiv.innerHTML = '';
    availableCards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        let shipIndicator = card.iaShip ? " <span style='color: red;'>🚀</span> " : "";
        div.innerHTML = `
            <strong>${card.name}${shipIndicator}</strong><br>
            ${card.effect}<br>
            Type: ${card.type}<br>
            Colonization: ${card.colonizationType}<br>
            Points: ${card.points}<br>
            Progress: ${card.progress}/${card.maxProgress}
            <div class="progress-bar">
                <div class="progress" style="width:${(card.progress / card.maxProgress) * 100}%">${card.progress}/${card.maxProgress}</div>
            </div>
            <button onclick="selectNextCard(${index}, ${initial})">Select Card</button>
        `;
        div.dataset.index = index;
        nextCardsDiv.appendChild(div);
    });

    document.getElementById('next-card-selection').style.display = 'block';
}

function filterCards() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredCards = availableCards.filter(card => card.name.toLowerCase().includes(searchTerm));
    const nextCardsDiv = document.getElementById('next-cards');
    nextCardsDiv.innerHTML = '';
    filteredCards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        let shipIndicator = card.iaShip ? " <span style='color: red;'>🚀</span> " : "";
        div.innerHTML = `
            <strong>${card.name}${shipIndicator}</strong><br>
            ${card.effect}<br>
            Type: ${card.type}<br>
            Colonization: ${card.colonizationType}<br>
            Points: ${card.points}<br>
            Progress: ${card.progress}/${card.maxProgress}
            <div class="progress-bar">
                <div class="progress" style="width:${(card.progress / card.maxProgress) * 100}%">${card.progress}/${card.maxProgress}</div>
            </div>
            <button onclick="selectNextCard(${availableCards.indexOf(card)}, true)">Select Card</button>
        `;
        div.dataset.index = index;
        nextCardsDiv.appendChild(div);
    });
}

function updateVictoryPoints() {
    document.getElementById('victory-points').textContent = victoryPoints;
}

function playTurn() {
    if (extraRollsRemaining > 0) {
        rollExtraDie();
    } else if (currentDie < getNumDice()) {
        rollDie();
    }
}

function takeCard(index) {
    const takenCard = cards[index]; // Save the card being taken
    if (takenCard.iaShip) {
        iaShips++; // Return the ship to the IA board
    }
    cards.splice(index, 1); // Remove the card
    displayCards(); // Update the display after taking a card
    displayNextCardOptions(); // Show options for the next card
    replaceCardAt(index); // Replace the card at the taken position
    updateIaShipsOnBoard(); // Update the display of IA ships on the board
}

function selectNextCard(index, initial = false) {
    // This function is used for initial card selection and replacing a taken card
    if (initial) {
        cards.push(availableCards[index]);
        availableCards.splice(index, 1); // Remove the selected card from available cards
        displayCards(); // Update the display with the new card
        if (cards.length < 4) {
            displayNextCardOptions(true);
        } else {
            document.getElementById('next-card-selection').style.display = 'none'; // Hide the card selection
            document.getElementById('start-game').style.display = 'block'; // Show the start game button
        }
    } else {
        replaceCardAt(index); // Replace the card at the taken position
    }
}

function replaceCardAt(position) {
    // Show card selection for replacing the taken card at a specific position
    const nextCardsDiv = document.getElementById('next-cards');
    nextCardsDiv.innerHTML = '';
    availableCards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        let shipIndicator = card.iaShip ? " <span style='color: red;'>🚀</span> " : "";
        div.innerHTML = `
            <strong>${card.name}${shipIndicator}</strong><br>
            ${card.effect}<br>
            Type: ${card.type}<br>
            Colonization: ${card.colonizationType}<br>
            Points: ${card.points}<br>
            Progress: ${card.progress}/${card.maxProgress}
            <div class="progress-bar">
                <div class="progress" style="width:${(card.progress / card.maxProgress) * 100}%">${card.progress}/${card.maxProgress}</div>
            </div>
            <button onclick="selectReplacementCard(${index}, ${position})">Select Card</button>
        `;
        div.dataset.index = index;
        nextCardsDiv.appendChild(div);
    });

    document.getElementById('next-card-selection').style.display = 'block';
}

function selectReplacementCard(index, position) {
    // Replace the card at the specific position
    const newCard = availableCards.splice(index, 1)[0]; // Remove the selected card from available cards
    cards.splice(position, 0, newCard); // Insert the new card at the specific position
    displayCards(); // Update the display with the new card

    // Clear the search bar and reset the displayed cards
    document.getElementById('search-bar').value = '';
    filterCards();

    document.getElementById('next-card-selection').style.display = 'none'; // Hide the card selection
}

function increaseColonizationLevel() {
    if (colonizationLevel < 5) {
        colonizationLevel++;
        updateColonizationLevel();
    }
}

function decreaseColonizationLevel() {
    if (colonizationLevel > 1) {
        colonizationLevel--;
        updateColonizationLevel();
    }
}

function updateColonizationLevel() {
    document.getElementById('colonization-level').textContent = colonizationLevel;
}

function startGame() {
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('play-turn').style.display = 'block';
    displayCards();
}
