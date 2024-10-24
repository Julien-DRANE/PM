// Variables de contrôle pour les interactions et l'inertie
let rotationSpeed = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = 0;
let segmentAngle = (2 * Math.PI) / segments;

// Gestion des touches du clavier pour la rotation (avec inertie)
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        rotationSpeed = 0.05;
    } else if (event.key === 'ArrowRight') {
        rotationSpeed = -0.05;
    }
});

// Arrêter la rotation lors du relâchement des touches
window.addEventListener('keyup', () => {
    rotationSpeed *= 0.9; // Appliquer une légère réduction de vitesse (inertie)
});

// Gestion du clic de la souris pour faire pivoter le cylindre
renderer.domElement.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

renderer.domElement.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        targetRotation = deltaX * 0.002; // Applique une petite variation de rotation par mouvement de souris
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
    rotationSpeed = targetRotation; // Applique la rotation finale comme vitesse initiale pour l'inertie
    targetRotation = 0; // Réinitialise la cible de rotation
});

// Gestion du swipe sur mobile
renderer.domElement.addEventListener('touchstart', (event) => {
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
});

renderer.domElement.addEventListener('touchmove', (event) => {
    const deltaX = event.touches[0].clientX - previousMousePosition.x;
    targetRotation = deltaX * 0.002;
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
});

// Alignement automatique sur les facettes
function alignToFacets() {
    let currentRotation = cylinder.rotation.y;
    let closestAngle = Math.round(currentRotation / segmentAngle) * segmentAngle;
    cylinder.rotation.y += (closestAngle - currentRotation) * 0.1;
}

// Animation avec inertie et alignement
function animate() {
    requestAnimationFrame(animate);
    
    if (!isDragging) {
        rotationSpeed *= 0.95; // Réduction progressive de la vitesse pour l'inertie
        cylinder.rotation.y += rotationSpeed; // Appliquer la vitesse de rotation
        alignToFacets(); // Caler automatiquement sur les facettes
    } else {
        cylinder.rotation.y += targetRotation; // Appliquer la rotation pendant le glissement
    }

    renderer.render(scene, camera);
}

animate();
