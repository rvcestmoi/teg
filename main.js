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
    { name: 'Andellouxian6', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 2 Culture', points: 5, progress: 0, maxProgress: 5, iaShip: false },
    { name: 'Aughmoore', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Gain 2 Energy', points: 7, progress: 0, maxProgress: 6, iaShip: false },
    { name: 'Birkomius', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Move a ship 2 spaces', points: 1, progress: 0, maxProgress: 2, iaShip: false },
    { name: 'Bisschop', type: 'Énergie', colonizationType: 'Économie', effect: 'Increase influence by 2', points: 1, progress: 0, maxProgress: 2, iaShip: false },
    { name: 'Brumbaugh', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Gain 1 Culture and 1 Energy', points: 3, progress: 0, maxProgress: 4, iaShip: false },
    { name: 'Bsw101', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Move a ship 3 spaces', points: 5, progress: 0, maxProgress: 5, iaShip: false },
    { name: 'Clj0517', type: 'Énergie', colonizationType: 'Économie', effect: 'Colonize a planet for free', points: 2, progress: 0, maxProgress: 3, iaShip: false },
    { name: 'Drewkaiden', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 1, progress: 0, maxProgress: 2, iaShip: false },
	{ name: 'Gleamzanier', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 5, progress: 0, maxProgress: 5, iaShip: false },
	{ name: 'Gort', type: 'Énergie', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 7, progress: 0, maxProgress: 6, iaShip: false },
	{ name: 'Gyore', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 7, progress: 0, maxProgress: 6, iaShip: false },
	{ name: 'Helios', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 2, progress: 0, maxProgress: 3, iaShip: false },
	{ name: 'Hoefker', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 2, progress: 0, maxProgress: 3, iaShip: false },
	{ name: 'Jac110912', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 5, progress: 0, maxProgress: 5, iaShip: false },
	{ name: 'Jakks', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 1, progress: 0, maxProgress: 2, iaShip: false },
	{ name: 'Jorg', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 3, progress: 0, maxProgress: 4, iaShip: false },
	{ name: 'Kwidow', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 7, progress: 0, maxProgress: 6, iaShip: false },
	{ name: 'LaTorres', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 2, progress: 0, maxProgress: 3, iaShip: false },
	{ name: 'Leandra', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 1, progress: 0, maxProgress: 2, iaShip: false },
	{ name: 'Lureena', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 2, progress: 0, maxProgress: 3, iaShip: false },
	{ name: 'Maia', type: 'Culture', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 5, progress: 0, maxProgress: 5, iaShip: false },
	{ name: 'Mared', type: 'Énergie', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 2, progress: 0, maxProgress: 3, iaShip: false },
	{ name: 'Mj123210', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 2, progress: 0, maxProgress: 3, iaShip: false },
	{ name: 'Kwidow', type: 'Culture', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 7, progress: 0, maxProgress: 6, iaShip: false },
	{ name: 'Nagato', type: 'Énergie', colonizationType: 'Économie', effect: 'Gain 3 Victory Points', points: 3, progress: 0, maxProgress: 4, iaShip: false },
	{ name: 'Nakagawakozi', type: 'Énergie', colonizationType: 'Diplomatie', effect: 'Gain 3 Victory Points', points: 3, progress: 0, maxProgress: 4, iaShip: false }
	
	
];
