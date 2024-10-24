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

// Initialisation au chargement de la fenêtre
window.onload = () => {
    preloadImages();
    updateUpperImage();
    updateLowerImage();
};

// Variables pour la gestion des gestes de glissement
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Seuil de détection pour considérer un swipe
const SWIPE_THRESHOLD = 50; // en pixels

const character = document.getElementById('character');

// Événement touchstart pour capturer le début du geste
character.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) { // Assure qu'un seul doigt est utilisé
        touchStartX = e.touches[0].screenX;
        touchStartY = e.touches[0].screenY;
    }
}, false);

// Événement touchend pour capturer la fin du geste
character.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) { // Assure qu'un seul doigt a été utilisé
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    }
}, false);

// Fonction pour gérer le geste détecté
function handleGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Détermination si le geste est horizontal ou vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Geste horizontal
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
            if (deltaX > 0) {
                // Swipe vers la droite - Changer la partie inférieure vers la tenue précédente
                currentLower = currentLower === 1 ? TOTAL_LOWER : currentLower - 1;
                updateLowerImage();
            } else {
                // Swipe vers la gauche - Changer la partie inférieure vers la tenue suivante
                currentLower = currentLower === TOTAL_LOWER ? 1 : currentLower + 1;
                updateLowerImage();
            }
        }
    } else {
        // Geste vertical
        if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
            if (deltaY > 0) {
                // Swipe vers le bas - Changer la partie supérieure vers la tenue précédente
                currentUpper = currentUpper === 1 ? TOTAL_UPPER : currentUpper - 1;
                updateUpperImage();
            } else {
                // Swipe vers le haut - Changer la partie supérieure vers la tenue suivante
                currentUpper = currentUpper === TOTAL_UPPER ? 1 : currentUpper + 1;
                updateUpperImage();
            }
        }
    }
}

// Gestion du plein écran sur mobile
document.addEventListener('DOMContentLoaded', () => {
    function enterFullScreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    // Entrer en plein écran au premier clic/tap sur l'écran
    document.body.addEventListener('click', () => {
        enterFullScreen();
    }, { once: true });
});
