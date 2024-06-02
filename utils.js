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
    document.getElementById('victory-points').textContent = victoryPoints;
}

function updateColonizationLevel() {
    document.getElementById('colonization-level').textContent = colonizationLevel;
}
