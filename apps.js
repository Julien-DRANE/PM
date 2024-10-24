// Initialisation de la scène
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa); // Définir un fond clair

// Ajout d'une lumière directionnelle
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Initialisation de la caméra
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20); // Position de la caméra pour voir le cylindre
camera.lookAt(0, 0, 0);

// Initialisation du rendu
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Nombre de segments (facettes) correspondant au nombre d'images
const segments = 7;
let radius = 5;
let height = 10;

// Crée un tableau de matériaux et charge les textures
const materials = [];
const textureLoader = new THREE.TextureLoader();
let totalWidth = 0; // Largeur totale des facettes

// Charge les textures et ajuste la taille du cylindre
for (let i = 0; i < segments; i++) {
    const texturePath = `textures/facet${i + 1}.png`; // Chemin des images PNG
    const texture = textureLoader.load(
        texturePath,
        () => console.log(`Texture ${i + 1} chargée`),
        undefined,
        (err) => console.error(`Erreur de chargement de la texture ${texturePath}`, err)
    );

    // Crée un matériau pour chaque facette avec une texture unique
    materials.push(new THREE.MeshBasicMaterial({ map: texture }));
}

// Création de la géométrie du cylindre avec 7 segments
const geometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);

// Divise la géométrie en groupes pour chaque facette
geometry.clearGroups();
for (let i = 0; i < segments; i++) {
    geometry.addGroup(i * 6, 6, i);
}

// Crée le cylindre avec les matériaux multiples
const cylinder = new THREE.Mesh(geometry, materials);
scene.add(cylinder);

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
