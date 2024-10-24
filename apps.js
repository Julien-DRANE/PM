// Nombre de segments (facettes) correspondant au nombre d'images
const segments = 7; // Assure-toi que cette ligne est bien présente

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

// Ajustement de la taille du rendu pour occuper tout l'écran
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Crée un tableau de matériaux et charge les textures
const materials = [];
const textureLoader = new THREE.TextureLoader();
for (let i = 0; i < segments; i++) {
    const texturePath = `textures/facet${i + 1}.png`; // Chemin des images PNG
    const texture = textureLoader.load(
        texturePath,
        (texture) => {
            // Améliorer la qualité de la texture
            texture.minFilter = THREE.LinearMipMapLinearFilter; // Meilleur filtrage
            texture.magFilter = THREE.LinearFilter; // Meilleur filtrage pour le zoom
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            console.log(`Texture ${i + 1} chargée`);
        },
        undefined,
        (err) => console.error(`Erreur de chargement de la texture ${texturePath}`, err)
    );

    // Crée un matériau pour chaque facette avec une texture unique
    materials.push(new THREE.MeshBasicMaterial({ map: texture }));
}

// Création de la géométrie du cylindre avec des dimensions fixes
const radius = 5; // Rayon fixe pour simplifier
const height = 10; // Hauteur fixe pour simplifier
const geometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);

// Ajuste les coordonnées UV de manière simple pour chaque segment
const uvs = geometry.attributes.uv.array;
for (let i = 0; i < segments; i++) {
    const startIdx = i * 4 * 2;
    // Les UV sont ajustés pour centrer les textures sur chaque segment
    uvs[startIdx] = 0;        // u1
    uvs[startIdx + 2] = 1;    // u2
    uvs[startIdx + 4] = 0;    // u3
    uvs[startIdx + 6] = 1;    // u4
}

// Met à jour les attributs UV de la géométrie
geometry.attributes.uv.needsUpdate = true;

// Divise la géométrie en groupes pour chaque facette
geometry.clearGroups();
for (let i = 0; i < segments; i++) {
    geometry.addGroup(i * 6, 6, i); // Chaque facette a 6 indices de triangles
}

// Crée le cylindre avec les matériaux multiples
const cylinder = new THREE.Mesh(geometry, materials);
scene.add(cylinder);

// Variables de contrôle pour les interactions et l'inertie
let rotationSpeed = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = 0;
let segmentAngle = (2 * Math.PI) / segments;

// Gestion des touches du clavier pour la rotation
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        rotationSpeed = 0.05;
    } else if (event.key === 'ArrowRight') {
        rotationSpeed = -0.05;
    }
});

// Arrêter la rotation lors du relâchement des touches
window.addEventListener('keyup', () => {
    rotationSpeed *= 0.9; // Applique une légère réduction de vitesse (inertie)
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
    cylinder.rotation.y += (closestAngle - currentRotation) * 0.1; // Lissage
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
