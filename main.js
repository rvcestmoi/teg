// Variables globales
const diceFaces = ['Déplacer un vaisseau', 'Énergie', 'Culture', 'Diplomatie', 'Économie', 'Attaquer'];

let cards = [];
let victoryPoints = 0;
let diceResults = [];
let currentDie = 0;
let colonizationLevel = 1;
let iaShips = 4; // Nombre de vaisseaux IA disponibles pour se déplacer
let energy = 0;
let culture = 0;
let extraRollsUsed = false; // Pour suivre si des lancers supplémentaires ont été utilisés ce tour
let extraRollsRemaining = 0; // Pour suivre le nombre de lancers supplémentaires restants
let playerDice = 5; // Nombre de dés que le joueur peut lancer
// Ajouter une variable pour suivre si le dé a été relancé
let rerollUsed = false;

const maxCardsOnBoard = 4;


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
