// Nombre de segments (facettes) correspondant au nombre d'images
const segments = 7;

// Initialisation de la scène
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// Ajout d'une lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Initialisation de la caméra
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);

// Initialisation du rendu
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajustement de la taille du rendu pour occuper tout l'écran
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Crée un tableau de matériaux et charge les textures pour le haut et le bas
const upperMaterials = [];
const lowerMaterials = [];
const textureLoader = new THREE.TextureLoader();

for (let i = 0; i < segments; i++) {
    const upperTexturePath = `textures/facet_upper_${i + 1}.png`; // Chemin des images PNG pour le haut
    const lowerTexturePath = `textures/facet_lower_${i + 1}.png`; // Chemin des images PNG pour le bas

    // Charger la texture pour le haut
    const upperTexture = textureLoader.load(upperTexturePath, (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping; // Évite l'étirement horizontal
        texture.wrapT = THREE.ClampToEdgeWrapping; // Évite l'étirement vertical
    });
    upperMaterials.push(new THREE.MeshBasicMaterial({ map: upperTexture }));

    // Charger la texture pour le bas
    const lowerTexture = textureLoader.load(lowerTexturePath, (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping; // Évite l'étirement horizontal
        texture.wrapT = THREE.ClampToEdgeWrapping; // Évite l'étirement vertical
    });
    lowerMaterials.push(new THREE.MeshBasicMaterial({ map: lowerTexture }));
}

// Création de la géométrie du cylindre
const radius = 5; // Rayon du cylindre
const height = 10; // Hauteur du cylindre
const geometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true); // Cylindre

// Ajustement des coordonnées UV
const uvs = geometry.attributes.uv.array;

for (let i = 0; i < segments; i++) {
    const startIdx = i * 4 * 2;
    // Définir les UVs pour chaque face
    uvs[startIdx] = i / segments;         // u1
    uvs[startIdx + 1] = 0;                // v1 (en bas)
    uvs[startIdx + 2] = (i + 1) / segments; // u2
    uvs[startIdx + 3] = 0;                // v2 (en bas)
    uvs[startIdx + 4] = i / segments;         // u3
    uvs[startIdx + 5] = 1;                // v3 (en haut)
    uvs[startIdx + 6] = (i + 1) / segments; // u4
    uvs[startIdx + 7] = 1;                // v4 (en haut)
}

// Met à jour les attributs UV de la géométrie
geometry.attributes.uv.needsUpdate = true;

// Création de la partie supérieure
const upperCylinder = new THREE.Mesh(geometry, upperMaterials);
upperCylinder.position.y = height / 4; // Positionner en haut

// Création de la partie inférieure
const lowerCylinder = new THREE.Mesh(geometry, lowerMaterials);
lowerCylinder.position.y = -height / 4; // Positionner en bas

// Ajouter les cylindres à la scène
scene.add(upperCylinder);
scene.add(lowerCylinder);

// Variables de contrôle pour les interactions
let upperRotationSpeed = 0;
let lowerRotationSpeed = 0;
let isUpperDragging = false;
let isLowerDragging = false;
let previousUpperMousePosition = { x: 0, y: 0 };
let previousLowerMousePosition = { x: 0, y: 0 };
let segmentAngle = (2 * Math.PI) / segments; // Calculer l'angle de chaque facette

// Fonction d'alignement sur les facettes
function alignOnFace(cylinder) {
    let currentRotation = cylinder.rotation.y;
    let closestAngle = Math.round(currentRotation / segmentAngle) * segmentAngle; // Aligner sur la facette la plus proche
    cylinder.rotation.y = closestAngle; // Réinitialiser la rotation au plus proche angle de facette
}

// Gestion du clic de la souris pour faire pivoter le cylindre supérieur
renderer.domElement.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // S'assurer que seul le bouton gauche de la souris est utilisé
        isUpperDragging = true;
        previousUpperMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

// Gestion du mouvement de la souris pour faire pivoter le cylindre supérieur
renderer.domElement.addEventListener('mousemove', (event) => {
    if (isUpperDragging) {
        const deltaX = event.clientX - previousUpperMousePosition.x;
        upperRotationSpeed = deltaX * 0.002; // Applique une petite variation de rotation par mouvement de souris
        previousUpperMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

// Gestion de la fin du clic pour le cylindre supérieur
renderer.domElement.addEventListener('mouseup', () => {
    isUpperDragging = false;
    alignOnFace(upperCylinder); // Aligner sur la facette après rotation
});

// Gestion du clic de la souris pour faire pivoter le cylindre inférieur
renderer.domElement.addEventListener('mousedown', (event) => {
    if (event.button === 2) { // S'assurer que seul le bouton droit de la souris est utilisé
        isLowerDragging = true;
        previousLowerMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

// Gestion du mouvement de la souris pour faire pivoter le cylindre inférieur
renderer.domElement.addEventListener('mousemove', (event) => {
    if (isLowerDragging) {
        const deltaX = event.clientX - previousLowerMousePosition.x;
        lowerRotationSpeed = deltaX * 0.002; // Applique une petite variation de rotation par mouvement de souris
        previousLowerMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

// Gestion de la fin du clic pour le cylindre inférieur
renderer.domElement.addEventListener('mouseup', () => {
    isLowerDragging = false;
    alignOnFace(lowerCylinder); // Aligner sur la facette après rotation
});

// Animation avec alignement
function animate() {
    requestAnimationFrame(animate);
    
    // Appliquer la vitesse de rotation
    upperCylinder.rotation.y += upperRotationSpeed; 
    lowerCylinder.rotation.y += lowerRotationSpeed; 

    renderer.render(scene, camera);
}

animate();
