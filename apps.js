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
    const texture = textureLoader.load(texturePath, (texture) => {
        // Redimensionne les UV de la texture pour chaque facette
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
    });
    
    // Crée un matériau pour chaque facette avec une texture unique
    const material = new THREE.MeshBasicMaterial({ map: texture });
    materials.push(material);
}

// Création de la géométrie du cylindre avec 7 segments
const geometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);

// Associe chaque matériau aux segments (facettes) du cylindre
for (let i = 0; i < segments; i++) {
    geometry.groups[i].materialIndex = i;
}

// Crée le cylindre avec les matériaux multiples
const cylinder = new THREE.Mesh(geometry, materials);
scene.add(cylinder);

// Position de la caméra
camera.position.z = 20;

// Animation pour faire tourner le cylindre
function animate() {
    requestAnimationFrame(animate);
    cylinder.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
