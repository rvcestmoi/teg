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

function takeCard(index) {
    const takenCard = cards[index]; // Enregistrer la carte prise
    if (takenCard.iaShip) {
        iaShips++; // Retourner le vaisseau au plateau de l'IA
    }
    cards.splice(index, 1); // Enlever la carte
    displayCards(); // Mettre à jour l'affichage après avoir pris une carte
    displayNextCardOptions(); // Afficher les options pour la carte suivante
    replaceCardAt(index); // Remplacer la carte à la position prise
    updateIaShipsOnBoard(); // Mettre à jour l'affichage des vaisseaux IA sur le plateau
}

function selectNextCard(index, initial = false) {
    // Cette fonction est utilisée pour la sélection initiale des cartes et pour remplacer une carte prise
    if (initial) {
        cards.push(availableCards[index]);
        availableCards.splice(index, 1); // Enlever la carte sélectionnée des cartes disponibles
        displayCards(); // Mettre à jour l'affichage avec la nouvelle carte
        if (cards.length < 4) {
            displayNextCardOptions(true);
        } else {
            document.getElementById('next-card-selection').style.display = 'none'; // Cacher la sélection de cartes
            document.getElementById('start-game').style.display = 'block'; // Afficher le bouton de démarrage du jeu
        }
    } else {
        replaceCardAt(index); // Remplacer la carte à la position prise
    }
}

function replaceCardAt(position) {
    // Afficher la sélection de cartes pour remplacer la carte prise à une position spécifique
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
    // Remplacer la carte à la position spécifique
    const newCard = availableCards.splice(index, 1)[0]; // Enlever la carte sélectionnée des cartes disponibles
    cards.splice(position, 0, newCard); // Insérer la nouvelle carte à la position spécifique
    displayCards(); // Mettre à jour l'affichage avec la nouvelle carte

    // Vider la barre de recherche et réinitialiser les cartes affichées
    document.getElementById('search-bar').value = '';
    filterCards();

    document.getElementById('next-card-selection').style.display = 'none'; // Cacher la sélection de cartes
}
