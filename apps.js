// Nombre total de tenues
const TOTAL_UPPER = 7;
const TOTAL_LOWER = 7;

// Indices actuels des tenues
let currentUpper = 1;
let currentLower = 1;

// Sélection des éléments DOM
const upperImg = document.getElementById('upper-part');
const lowerImg = document.getElementById('lower-part');

const prevUpperBtn = document.getElementById('prev-upper');
const nextUpperBtn = document.getElementById('next-upper');
const prevLowerBtn = document.getElementById('prev-lower');
const nextLowerBtn = document.getElementById('next-lower');

// Fonction pour mettre à jour l'image supérieure
function updateUpperImage() {
    upperImg.src = `textures/facet_upper_${currentUpper}.png`;
}

// Fonction pour mettre à jour l'image inférieure
function updateLowerImage() {
    lowerImg.src = `textures/facet_lower_${currentLower}.png`;
}

// Gestion des clics sur les boutons de la partie supérieure
prevUpperBtn.addEventListener('click', () => {
    currentUpper = currentUpper === 1 ? TOTAL_UPPER : currentUpper - 1;
    updateUpperImage();
});

nextUpperBtn.addEventListener('click', () => {
    currentUpper = currentUpper === TOTAL_UPPER ? 1 : currentUpper + 1;
    updateUpperImage();
});

// Gestion des clics sur les boutons de la partie inférieure
prevLowerBtn.addEventListener('click', () => {
    currentLower = currentLower === 1 ? TOTAL_LOWER : currentLower - 1;
    updateLowerImage();
});

nextLowerBtn.addEventListener('click', () => {
    currentLower = currentLower === TOTAL_LOWER ? 1 : currentLower + 1;
    updateLowerImage();
});

// Préchargement des images pour une meilleure performance
function preloadImages() {
    for (let i = 1; i <= TOTAL_UPPER; i++) {
        const img = new Image();
        img.src = `textures/facet_upper_${i}.png`;
    }
    for (let i = 1; i <= TOTAL_LOWER; i++) {
        const img = new Image();
        img.src = `textures/facet_lower_${i}.png`;
    }
}

// Initialisation
window.onload = () => {
    preloadImages();
    updateUpperImage();
    updateLowerImage();
};

// Gestion du plein écran sur mobile
document.addEventListener('DOMContentLoaded', () => {
    function enterFullScreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
            document.documentElement.msRequestFullscreen();
        }
    }

    // Entrer en plein écran au clic sur l'écran
    document.body.addEventListener('click', () => {
        enterFullScreen();
    }, { once: true });
});
