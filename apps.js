// Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Nombre de segments (facettes)
const segments = 7;
const radius = 5;
const height = 10;

// Crée un tableau de matériaux (un pour chaque facette)
const materials = [];
const textureLoader = new THREE.TextureLoader();
for (let i = 0; i < segments; i++) {
    const texturePath = `textures/facet${i + 1}.png`; // Chemin des images PNG
    const texture = textureLoader.load(texturePath);
    materials.push(new THREE.MeshBasicMaterial({ map: texture }));
}

// Création de la géométrie du cylindre avec 7 segments
const geometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);

// Divise la géométrie en groupes pour chaque facette
geometry.clearGroups();
const faceCount = segments * 4; // Chaque segment a 4 faces (deux triangles par face latérale)
for (let i = 0; i < segments; i++) {
    geometry.addGroup(i * 6, 6, i); // Chaque facette a 6 indices de triangles
}

// Crée le cylindre avec les matériaux multiples
const cylinder = new THREE.Mesh(geometry, materials);
scene.add(cylinder);

// Position de la caméra
camera.position.z = 20;

// Variables de contrôle pour les interactions
let rotationSpeed = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Gestion des touches du clavier
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        rotationSpeed = 0.05;
    } else if (event.key === 'ArrowRight') {
        rotationSpeed = -0.05;
    }
});

// Arrêter la rotation lors du relâchement des touches
window.addEventListener('keyup', () => {
    rotationSpeed = 0;
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
        cylinder.rotation.y += deltaX * 0.005;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
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
    cylinder.rotation.y += deltaX * 0.005;
    previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
});

// Animation pour faire tourner le cylindre selon les interactions
function animate() {
    requestAnimationFrame(animate);
    cylinder.rotation.y += rotationSpeed;
    renderer.render(scene, camera);
}

animate();
