

function displayCards() {
    const cardsDiv = document.getElementById('cards-in-play');
    cardsDiv.innerHTML = '';
    cards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.index = index; // Ajouter data-index pour chaque carte
        let shipIndicator = card.iaShip ? " <span style='color: red;'>🚀</span> " : "";
        div.innerHTML = `
            <strong>${card.name}${shipIndicator}</strong><br>
            Type: ${card.type}<br>
            Colonization: ${card.colonizationType}<br>
            Points: ${card.points}<br>
            Progress: ${card.progress}/${card.maxProgress}
            <div class="progress-bar">
                <div class="progress" style="width:${(card.progress / card.maxProgress) * 100}%">${card.progress}/${card.maxProgress}</div>
            </div>
            <button onclick="takeCard(${index})" ${cards.length < maxCardsOnBoard ? 'disabled' : ''}>Prendre Carte</button>
            <button onclick="decreaseProgress(${index})">-1</button>
        `;
        cardsDiv.appendChild(div);
    });

    updatePlayTurnButton();
}




function takeCard(index) {
    const takenCard = cards[index]; // Enregistrer la carte prise
    const cardElement = document.querySelector(`[data-index="${index}"]`);

    if (takenCard.iaShip) {
        iaShips++; // Retourner le vaisseau au plateau de l'IA
    }

    if (cardElement) {
        // Ajouter la classe d'animation
        cardElement.classList.add('shrink-and-fade');

        // Attendre la fin de l'animation avant de supprimer la carte
        setTimeout(() => {
            cards.splice(index, 1); // Enlever la carte
            displayCards(); // Mettre à jour l'affichage après avoir pris une carte
            replaceCardAt(index); // Afficher les options pour la carte suivante à la même position
            updateIaShipsOnBoard(); // Mettre à jour l'affichage des vaisseaux IA sur le plateau
            updatePlayTurnButton(); // Mettre à jour le bouton "Jouer le tour"
        }, 700); // Durée de l'animation en millisecondes
    } else {
        console.log("Élément de carte non trouvé pour index:", index);
    }
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
            Type: ${card.type}/Col.: ${card.colonizationType}<br>  
            Points: ${card.points}<br>
            Progress: ${card.progress}/${card.maxProgress}
            <div class="progress-bar">
                <div class="progress" style="width:${(card.progress / card.maxProgress) * 100}%">${card.progress}/${card.maxProgress}</div>
            </div>
            <button onclick="selectNextCard(${index}, ${initial})">Select. carte</button>
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

function selectNextCard(index, initial = false) {
    if (initial) {
        cards.push(availableCards[index]);
        availableCards.splice(index, 1); // Enlever la carte sélectionnée des cartes disponibles
        displayCards(); // Mettre à jour l'affichage avec la nouvelle carte
        if (cards.length < maxCardsOnBoard) {
            displayNextCardOptions(true);
        } else {
            document.getElementById('next-card-selection').style.display = 'none'; // Cacher la sélection de cartes
        }
    } else {
        const newCard = availableCards.splice(index, 1)[0]; // Enlever la carte sélectionnée des cartes disponibles
        cards.push(newCard); // Ajouter la nouvelle carte
        displayCards(); // Mettre à jour l'affichage avec la nouvelle carte

        if (cards.length < maxCardsOnBoard) {
            displayNextCardOptions(); // Afficher les options pour les cartes suivantes
        } else {
            document.getElementById('next-card-selection').style.display = 'none'; // Cacher la sélection de cartes
        }
    }

    updatePlayTurnButton(); // Mettre à jour le bouton "Jouer le tour"
}

function replaceCardAt(position) {
    const nextCardsDiv = document.getElementById('next-cards');
    nextCardsDiv.innerHTML = '';
    availableCards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        let shipIndicator = card.iaShip ? " <span style='color: red;'>🚀</span> " : "";
        div.innerHTML = `
            <strong>${card.name}${shipIndicator}</strong><br>
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
    updatePlayTurnButton(); // Mettre à jour le bouton "Jouer le tour"
}


function selectReplacementCard(index, position) {
    const newCard = availableCards.splice(index, 1)[0]; // Enlever la carte sélectionnée des cartes disponibles
    cards.splice(position, 0, newCard); // Insérer la nouvelle carte à la position spécifique
    displayCards(); // Mettre à jour l'affichage avec la nouvelle carte

    // Vider la barre de recherche et réinitialiser les cartes affichées
    document.getElementById('search-bar').value = '';
    filterCards();

    document.getElementById('next-card-selection').style.display = 'none'; // Cacher la sélection de cartes
    updatePlayTurnButton(); // Mettre à jour le bouton "Jouer le tour"
}


function updatePlayTurnButton() {
    const playTurnButton = document.getElementById('play-turn');
    playTurnButton.disabled = (cards.length < maxCardsOnBoard);
}

// Ajoutez cette ligne après la définition de toutes les fonctions pour initialiser le bouton
document.addEventListener("DOMContentLoaded", () => {
    updatePlayTurnButton();
});
