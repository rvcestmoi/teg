// Fonctions de Gestion des Dés
function rollDie() {
    const roll = Math.floor(Math.random() * diceFaces.length);
    const result = diceFaces[roll];

    if (canPlayDie(result)) {
        diceResults.push(result);
        displayDiceResults();
        processDieResult(result);
        currentDie++;
        rerollUsed = false; // Réinitialiser la relance pour le prochain dé
    } else {
        if (!rerollUsed) {
            rerollUsed = true;
            rollDie(); // Relancer le dé une seule fois
        } else {
            diceResults.push(result); // Ajouter le résultat même s'il ne peut pas être joué
            displayDiceResults();
            currentDie++;
            rerollUsed = false; // Réinitialiser la relance pour le prochain dé
        }
    }

    if (currentDie === getNumDice() && extraRollsRemaining === 0) {
        setTimeout(() => {
            endIaTurn();
        }, 500); // Délai pour afficher le dernier dé avant le message
    }
}

function rollExtraDie() {
    const roll = Math.floor(Math.random() * diceFaces.length);
    const result = diceFaces[roll];

    if (canPlayDie(result)) {
        diceResults.push(result);
        displayDiceResults();
        processDieResult(result);
        extraRollsRemaining--;
        rerollUsed = false; // Réinitialiser la relance pour le prochain dé
    } else {
        if (!rerollUsed) {
            rerollUsed = true;
            rollExtraDie(); // Relancer le dé une seule fois
        } else {
            diceResults.push(result); // Ajouter le résultat même s'il ne peut pas être joué
            displayDiceResults();
            extraRollsRemaining--;
            rerollUsed = false; // Réinitialiser la relance pour le prochain dé
        }
    }

    if (extraRollsRemaining === 0) {
        setTimeout(askPlayerToPlayTurn, 500); // Délai avant de demander au joueur de jouer son tour
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
    displayCards(); // Mettre à jour l'affichage après le traitement du résultat du dé
}

function playTurn() {
    if (extraRollsRemaining > 0) {
        rollExtraDie();
    } else if (currentDie < getNumDice()) {
        rollDie();
    }
}

function canPlayDie(result) {
    if (result === 'Déplacer un vaisseau' && iaShips === 0) return false;
    if (result === 'Énergie' && iaShips === 0 && !cards.some(card => card.iaShip && card.type === 'Énergie')) return false;
    if (result === 'Culture' && iaShips === 0 && !cards.some(card => card.iaShip && card.type === 'Culture')) return false;
    if (result === 'Diplomatie' && !cards.some(card => card.iaShip && card.colonizationType === 'Diplomatie')) return false;
    if (result === 'Économie' && !cards.some(card => card.iaShip && card.colonizationType === 'Économie')) return false;
    return true;
}
