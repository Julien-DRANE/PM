console.log("Script démarré");

// Initialisation de la scène
const scene = new THREE.Scene();
console.log("Scène créée");

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
console.log("Caméra créée");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
console.log("Renderer ajouté au document");

// Nombre de segments (facettes)
const segments = 7;
const radius = 5;
const height = 10;

const materials = [];
for (let i = 0; i < segments; i++) {
    const textureLoader = new THREE.TextureLoader();
    const texturePath = `textures/facet${i + 1}.png`;
    console.log(`Chargement de la texture : ${texturePath}`);

    const texture = textureLoader.load(texturePath, 
        () => console.log(`Texture ${i + 1} chargée`), 
        undefined, 
        (err) => console.error(`Erreur lors du chargement de la texture : ${texturePath}`, err)
    );

    materials.push(new THREE.MeshBasicMaterial({ map: texture }));
}

const geometry = new THREE.CylinderGeometry(radius, radius, height, segments, 1, true);
const multiMaterial = new THREE.MeshFaceMaterial(materials);
const cylinder = new THREE.Mesh(geometry, multiMaterial);
scene.add(cylinder);
console.log("Cylindre ajouté à la scène");

camera.position.z = 20;

function animate() {
    requestAnimationFrame(animate);
    cylinder.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
console.log("Animation démarrée");
