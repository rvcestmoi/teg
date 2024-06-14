function getNumDice() {
    if (colonizationLevel >= 5) return 7;
    if (colonizationLevel >= 3) return 6;
    return 5;
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

function updateVictoryPoints() {
    const victoryPoints = calculateVictoryPoints();
    document.getElementById('victory-points').textContent = victoryPoints;
}


function updateColonizationLevel() {
    document.getElementById('colonization-level').textContent = colonizationLevel;
}

function calculateVictoryPoints() {
    let totalPoints = 0;

    // Points de victoire des cartes colonisées
    totalPoints += colonizedCardsPoints.reduce((sum, points) => sum + points, 0);

    // Points de victoire bonus en fonction du niveau de colonisation
    if (colonizationLevel >= 2) {
        totalPoints += 2; // Bonus pour le niveau 2
    }
    if (colonizationLevel >= 3) {
        totalPoints += 2; // Bonus supplémentaire pour le niveau 3
    }
    if (colonizationLevel >= 4) {
        totalPoints += 2; // Bonus supplémentaire pour le niveau 4
    }
    if (colonizationLevel >= 5) {
        totalPoints += 3; // Bonus supplémentaire pour le niveau 5
    }

    return totalPoints;
}


