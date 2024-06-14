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
                colonizedCardsPoints.push(card.points); // Enregistrer les points de la carte colonisée
                card.iaShip = false;
                iaShips++;
                const cardIndex = cards.indexOf(card);
                replaceCardAt(cardIndex); // Remplacer la carte à la position colonisée
                cards.splice(cardIndex, 1);
            }
        }
    }
    updateVictoryPoints(); // Recalculer les points de victoire
    displayCards();
}

function advanceEconomy() {
    for (const card of cards) {
        if (card.iaShip && card.colonizationType === 'Économie') {
            card.progress = Math.min(card.progress + 1, card.maxProgress);
            if (card.progress >= card.maxProgress) {
                colonizedCardsPoints.push(card.points); // Enregistrer les points de la carte colonisée
                card.iaShip = false;
                iaShips++;
                const cardIndex = cards.indexOf(card);
                replaceCardAt(cardIndex); // Remplacer la carte à la position colonisée
                cards.splice(cardIndex, 1);
            }
        }
    }
    updateVictoryPoints(); // Recalculer les points de victoire
    displayCards();
}


function attack() {
    const attackMessageDiv = document.getElementById('attack-message');
    let message = '';

    if (colonizationLevel === 1) {
        message = "Attaquer : Enlever 1 Énergie";
    } else if (colonizationLevel === 2) {
        // Ajout direct de 2 points de culture à l'IA sans afficher un message
        culture = Math.min(maxResources, culture + 2);
		message = "L'automa gagne 2 Cultures";
    } else if (colonizationLevel === 3) {
        message = "Attaquer : Reculer un vaisseau d'une case";
        movePlayerShipBack(1);
    } else if (colonizationLevel === 4) {
        message = "Attaquer : Vous perdez un dé pour 1 tour";
        playerDice = Math.max(1, playerDice - 1);
        setTimeout(() => {
            playerDice = 5; // Réinitialiser le nombre de dés du joueur après un tour
        }, 5000); // Ajuster le délai si nécessaire
    } else if (colonizationLevel === 5) {
        message = "Attaquer : Reculer tous vos vaisseaux d'une case";
    }

    if (message) {
        attackMessageDiv.textContent = message;
        attackMessageDiv.style.display = 'block';

        // Masquer le message après un certain délai, si souhaité
        setTimeout(() => {
            attackMessageDiv.style.display = 'none';
        }, 5000); // 5 secondes par exemple
    }

    updateResources();
}

function movePlayerShipBack(spaces) {
    // Logique pour reculer les vaisseaux du joueur d'un certain nombre de cases
    // Implémentez la logique selon les règles de votre jeu et la structure du plateau
}


function movePlayerShipBack(spaces) {
    // Logique pour reculer les vaisseaux du joueur d'un certain nombre de cases
    // Implémentez la logique selon les règles de votre jeu et la structure du plateau
}


function endIaTurn() {
    if (energy >= maxResources) {
        colonizationLevel++;
        energy = 0;
        updateColonizationLevel();
    }
    if (culture >= maxResources && !extraRollsUsed) {
        alert("L'IA gagne 3 lancers de dés supplémentaires grâce à au moins 5 points de culture !");
        extraRollsUsed = true;
        extraRollsRemaining = 3;
        playExtraDice();
    } else {
        askPlayerToPlayTurn();
    }
    updateVictoryPoints(); // Recalculer les points de victoire
}



function askPlayerToPlayTurn() {
    alert("Tous les dés sont lancés, à votre tour !");
    // Réinitialiser diceResults et currentDie pour permettre le tour suivant
    diceResults = [];
    currentDie = 0;
    
    if (extraRollsRemaining === 0 && extraRollsUsed) {
        culture = 0; // Réinitialiser la culture seulement après avoir utilisé tous les lancers supplémentaires        
    }
	extraRollsUsed = false; // Réinitialiser l'utilisation des lancers supplémentaires pour le tour suivant
	updateResources();
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

function decreaseProgress(index) {
    if (cards[index].progress > 0) {
        cards[index].progress--;
        displayCards();
    }
}

function decreaseEnergy() {
    if (energy > 0) {
        energy--;
        updateResources();
    }
}

function decreaseCulture() {
    if (culture > 0) {
        culture--;
        updateResources();
    }
}

function decreaseColonizationLevel() {
    if (colonizationLevel > 1) {
        colonizationLevel--;
        updateColonizationLevel();
        updateVictoryPoints(); // Recalculer les points de victoire
    }
}



