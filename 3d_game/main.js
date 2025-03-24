import * as THREE from './node_modules/three/build/three.module.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Position the camera slightly above and behind the character

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Create field
const fieldGeometry = new THREE.PlaneGeometry(50, 50);
const fieldMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7cfc00, // Lawn green
    side: THREE.DoubleSide 
});
const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
field.rotation.x = -Math.PI / 2; // Make it horizontal
field.position.y = -0.5; // Slightly below the character
field.receiveShadow = true;
scene.add(field);

// Character
const characterGroup = new THREE.Group();
scene.add(characterGroup);

// Character body
const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 1.25; // Position from ground
body.castShadow = true;
characterGroup.add(body);

// Character head
const headGeometry = new THREE.SphereGeometry(0.35, 32, 32);
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.y = 2.3;
head.castShadow = true;
characterGroup.add(head);

// Zombies
const zombies = [];
const zombieSpeed = 0.05;
const zombieSpawnRadius = 20;
const maxZombies = 10;
const zombieDetectionRadius = 15;

function createZombie(x, z) {
    const zombieGroup = new THREE.Group();
    
    // Zombie body
    const zombieBodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const zombieBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2e8b57 }); // Dark green
    const zombieBody = new THREE.Mesh(zombieBodyGeometry, zombieBodyMaterial);
    zombieBody.position.y = 1.25;
    zombieBody.castShadow = true;
    zombieGroup.add(zombieBody);
    
    // Zombie head
    const zombieHeadGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const zombieHeadMaterial = new THREE.MeshStandardMaterial({ color: 0x98fb98 }); // Light green
    const zombieHead = new THREE.Mesh(zombieHeadGeometry, zombieHeadMaterial);
    zombieHead.position.y = 2.3;
    zombieHead.castShadow = true;
    zombieGroup.add(zombieHead);

    // Position zombie
    zombieGroup.position.set(x, 0, z);
    scene.add(zombieGroup);
    
    // Add to zombies array
    zombies.push({
        group: zombieGroup,
        active: true
    });
}

// Spawn initial zombies
for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = zombieSpawnRadius * Math.sqrt(Math.random());
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    createZombie(x, z);
}

// Function to spawn new zombies
function spawnZombie() {
    if (zombies.length < maxZombies) {
        const angle = Math.random() * Math.PI * 2;
        const x = characterGroup.position.x + Math.cos(angle) * zombieSpawnRadius;
        const z = characterGroup.position.z + Math.sin(angle) * zombieSpawnRadius;
        createZombie(x, z);
    }
}

// Spawn a new zombie every 10 seconds
setInterval(spawnZombie, 10000);

// Game state
let isGameOver = false;
let score = 0;
let lastScoreUpdate = 0;

// Create score display
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontFamily = 'Arial, sans-serif';
scoreElement.style.fontSize = '24px';
scoreElement.style.fontWeight = 'bold';
scoreElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
scoreElement.textContent = 'Score: 0';
document.body.appendChild(scoreElement);

// Game over display
const gameOverElement = document.createElement('div');
gameOverElement.style.position = 'absolute';
gameOverElement.style.top = '50%';
gameOverElement.style.left = '50%';
gameOverElement.style.transform = 'translate(-50%, -50%)';
gameOverElement.style.color = 'red';
gameOverElement.style.fontFamily = 'Arial, sans-serif';
gameOverElement.style.fontSize = '48px';
gameOverElement.style.fontWeight = 'bold';
gameOverElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
gameOverElement.style.display = 'none';
gameOverElement.textContent = 'GAME OVER';
document.body.appendChild(gameOverElement);

// Restart instructions
const restartElement = document.createElement('div');
restartElement.style.position = 'absolute';
restartElement.style.top = '60%';
restartElement.style.left = '50%';
restartElement.style.transform = 'translate(-50%, -50%)';
restartElement.style.color = 'white';
restartElement.style.fontFamily = 'Arial, sans-serif';
restartElement.style.fontSize = '24px';
restartElement.style.fontWeight = 'bold';
restartElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
restartElement.style.display = 'none';
restartElement.textContent = 'Press R to restart';
document.body.appendChild(restartElement);

// Movement controls
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    r: false
};

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = true;
        
        // Restart game when R is pressed
        if (e.key.toLowerCase() === 'r' && isGameOver) {
            restartGame();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = false;
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Character movement speed
const speed = 0.1;

// Function to restart the game
function restartGame() {
    // Remove all zombies from the scene
    zombies.forEach(zombie => {
        scene.remove(zombie.group);
    });
    zombies.length = 0;
    
    // Reset player position
    characterGroup.position.set(0, 0, 0);
    camera.position.set(0, 2, 5);
    
    // Reset game state
    isGameOver = false;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    lastScoreUpdate = Date.now();
    
    // Hide game over text
    gameOverElement.style.display = 'none';
    restartElement.style.display = 'none';
    
    // Spawn initial zombies
    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = zombieSpawnRadius * Math.sqrt(Math.random());
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        createZombie(x, z);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (!isGameOver) {
        // Update score based on survival time
        const now = Date.now();
        if (now - lastScoreUpdate >= 1000) { // Add score every second
            score += 1;
            scoreElement.textContent = `Score: ${score}`;
            lastScoreUpdate = now;
        }
        
        // Movement logic
        const direction = new THREE.Vector3();
        
        if (keys.w) direction.z -= speed;
        if (keys.s) direction.z += speed;
        if (keys.a) direction.x -= speed;
        if (keys.d) direction.x += speed;
        
        // If there's movement, normalize it
        if (direction.length() > 0) {
            direction.normalize();
            
            // Face the direction of movement
            if (direction.x !== 0 || direction.z !== 0) {
                const angle = Math.atan2(direction.x, direction.z);
                characterGroup.rotation.y = angle;
            }
            
            // Move in the facing direction
            characterGroup.position.x += direction.x * speed;
            characterGroup.position.z += direction.z * speed;
            
            // Keep character in bounds
            const fieldSize = 25; // Half of field size
            characterGroup.position.x = Math.max(-fieldSize, Math.min(fieldSize, characterGroup.position.x));
            characterGroup.position.z = Math.max(-fieldSize, Math.min(fieldSize, characterGroup.position.z));
            
            // Update camera to follow character
            camera.position.x = characterGroup.position.x;
            camera.position.z = characterGroup.position.z + 5;
        }
        
        // Update zombies
        zombies.forEach(zombie => {
            if (zombie.active) {
                const zombiePos = zombie.group.position;
                const playerPos = characterGroup.position;
                
                // Calculate distance to player
                const dx = playerPos.x - zombiePos.x;
                const dz = playerPos.z - zombiePos.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // Chase player if within detection radius
                if (distance < zombieDetectionRadius) {
                    // Calculate direction towards player
                    const angle = Math.atan2(dx, dz);
                    zombie.group.rotation.y = angle;
                    
                    // Move towards player
                    zombiePos.x += Math.sin(angle) * zombieSpeed;
                    zombiePos.z += Math.cos(angle) * zombieSpeed;
                    
                    // Check collision with player
                    if (distance < 1) {
                        isGameOver = true;
                        gameOverElement.style.display = 'block';
                        restartElement.style.display = 'block';
                    }
                }
            }
        });
    }
    
    camera.lookAt(characterGroup.position.x, characterGroup.position.y + 1, characterGroup.position.z);
    
    renderer.render(scene, camera);
}

animate(); 