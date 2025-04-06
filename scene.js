import { EffectComposer, RenderPass } from "postprocessing";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Initialize the loader
const loader = new GLTFLoader();

/**
 * Creates a baseplate from individual tiles
 * 
 * @param {THREE.Scene} scene - The scene to add the baseplate to
 * @param {number} width - The width of the baseplate in world units
 * @param {number} length - The length of the baseplate in world units
 * @param {number} [yPosition=-4] - The y-position (height) of the baseplate
 * @param {number} [tileSize=4] - The size of each tile in world units
 * @returns {THREE.Group} The baseplate group containing all tiles
 */
export function createBaseplate(scene, width, length, yPosition = -4, tileSize = 4) {
    // Create a group to hold all the baseplate tiles
    const baseplate = new THREE.Group();
    baseplate.name = "Baseplate";
    
    // Calculate dimensions
    const tilesX = Math.ceil(width / tileSize);
    const tilesZ = Math.ceil(length / tileSize);
    
    // Center offset to position the baseplate correctly
    const offsetX = (tilesX * tileSize) / 2 - tileSize / 2;
    const offsetZ = (tilesZ * tileSize) / 2 - tileSize / 2;
    
    // Either use an individual tile asset
    const useTileAsset = true; // Set to false to use simple geometry

    if (useTileAsset) {
        // Create tiles by loading models
        for (let x = 0; x < tilesX; x++) {
            for (let z = 0; z < tilesZ; z++) {
                const posX = (x * tileSize) - offsetX;
                const posZ = (z * tileSize) - offsetZ;
                
                // Base tile will be desert
                loader.load('./assets/base_tile.glb', function(gltf) {
                    const tile = gltf.scene;
                    tile.position.set(posX, yPosition, posZ);
                    // Baseplate should receive shadows but not cast them
                    setShadow(tile, false, true);
                    baseplate.add(tile);
                });
            }
        }
    } else {
        // Create tiles as simple geometries (faster and more efficient)
        const geometry = new THREE.BoxGeometry(tileSize, 0.5, tileSize);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8
        });
        
        for (let x = 0; x < tilesX; x++) {
            for (let z = 0; z < tilesZ; z++) {
                const tile = new THREE.Mesh(geometry, material);
                tile.position.set(
                    (x * tileSize) - offsetX,
                    yPosition,
                    (z * tileSize) - offsetZ
                );
                // Baseplate should receive shadows but not cast them
                tile.receiveShadow = true;
                tile.castShadow = false;
                baseplate.add(tile);
            }
        }
    }
    
    scene.add(baseplate);
    return baseplate;
}

/**
 * Set up shadow properties for an object and its children
 * 
 * @param {THREE.Object3D} object - The object to configure shadows for
 * @param {boolean} [cast=true] - Whether the object should cast shadows
 * @param {boolean} [receive=true] - Whether the object should receive shadows
 */
function setShadow(object, cast = true, receive = true) {
    object.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = cast;
            child.receiveShadow = receive;
        }
    });
}

/**
 * Sets up the 3D environment with baseplate and other elements
 * 
 * @param {THREE.Scene} scene - The scene to set up
 * @param {number} [baseplateWidth=80] - Width of the baseplate in world units
 * @param {number} [baseplateLength=80] - Length of the baseplate in world units
 * @returns {void}
 */
export function setupEnvironment(scene, baseplateWidth = 80, baseplateLength = 80) {
    const sceneBackground = new THREE.Color(0x9ad0ec);
    scene.background = sceneBackground;

    const position = new THREE.Vector3(0, -4, 0);

    // Create baseplate
    createBaseplate(scene, baseplateWidth, baseplateLength, position.y);

    // TODO later: Render environment objects (assets that lie on top of the baseplate)

    // TODO later: Render and animate any animated parts
}
