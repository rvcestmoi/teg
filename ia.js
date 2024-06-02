function gainResource(type) {
    if (type === 'Énergie' && energy < maxResources) {
        energy++;
    } else if (type === 'Culture' && culture < maxResources) {
        culture++;
    }
    updateResources();
}

function gainEnergy() {
    let energyGained = 0;
    for (const card of cards) {
        if (card.iaShip && card.type === 'Énergie') {
            energyGained++;
        }
    }
    energyGained += iaShips; // Ajouter de l'énergie pour les vaisseaux sur le plateau
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
    cultureGained += iaShips; // Ajouter de la culture pour les vaisseaux sur le plateau
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
                replaceCardAt(cards.indexOf(card)); // Remplacer la carte à la position colonisée
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
                replaceCardAt(cards.indexOf(card)); // Remplacer la carte à la position colonisée
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
            playerDice = 5; // Réinitialiser le nombre de dés du joueur après un tour
        }, 5000); // Ajuster le temps si nécessaire
    } else if (colonizationLevel === 5) {
        alert("Attaquer : Reculer tous vos vaisseaux d'une case");
        movePlayerShipBack(iaShips);
    }
    updateResources();
}

function movePlayerShipBack(spaces) {
    // Logique pour reculer les vaisseaux du joueur du nombre de cases spécifié
    // Implémenter la logique selon les règles et la structure du plateau de votre jeu
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
    // Réinitialiser diceResults et currentDie pour permettre le tour suivant
    diceResults = [];
    currentDie = 0;
    extraRollsUsed = false; // Réinitialiser l'utilisation des lancers supplémentaires pour le tour suivant
    if (extraRollsRemaining === 0) {
        culture = 0; // Réinitialiser la culture seulement après avoir utilisé tous les lancers supplémentaires
        updateResources();
    }
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

