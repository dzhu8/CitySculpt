import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupEnvironment } from './scene.js';

/**
 * Initialize the 3D scene and start the application
 * 
 * @param {number} [baseplateWidth=100] - Width of the baseplate in world units
 * @param {number} [baseplateLength=100] - Length of the baseplate in world units
 * @returns {void}
 */
function init(baseplateWidth = 100, baseplateLength = 100) {
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
        75, // FOV
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);

    // Create scene
    const scene = new THREE.Scene();

    // Set up orbit controls for camera
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Set up the environment with customizable baseplate dimensions
    setupEnvironment(scene, baseplateWidth, baseplateLength);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

/**
 * Entry point for the application
 * The DOMContentLoaded event fires when the HTML document has been completely parsed
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create basic HTML UI
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '100';
    container.style.background = 'rgba(0, 0, 0, 0.5)';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.color = 'white';
    document.body.appendChild(container);

    const title = document.createElement('h2');
    title.textContent = 'CitySculpt - Baseplate Test';
    title.style.margin = '0 0 10px 0';
    container.appendChild(title);

    const widthLabel = document.createElement('label');
    widthLabel.textContent = 'Baseplate Width: ';
    container.appendChild(widthLabel);
    
    const widthInput = document.createElement('input');
    widthInput.type = 'number';
    widthInput.value = '100';
    widthInput.min = '20';
    widthInput.max = '500';
    widthInput.style.marginRight = '10px';
    container.appendChild(widthInput);

    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = 'Baseplate Length: ';
    container.appendChild(lengthLabel);
    
    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.value = '100';
    lengthInput.min = '20';
    lengthInput.max = '500';
    lengthInput.style.marginRight = '10px';
    container.appendChild(lengthInput);

    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Baseplate';
    generateButton.style.marginLeft = '10px';
    container.appendChild(generateButton);

    // Initialize app with default values
    init(parseInt(widthInput.value), parseInt(lengthInput.value));

    // Handle button click to regenerate baseplate with new dimensions
    generateButton.addEventListener('click', () => {
        // Remove existing scene
        while(document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        
        // Re-initialize with new dimensions
        init(parseInt(widthInput.value), parseInt(lengthInput.value));
        
        // Re-add UI
        document.body.appendChild(container);
    });
});
