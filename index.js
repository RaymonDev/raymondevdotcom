
import { getFresnelMat } from "./src/js/FresnelJS.js";
import { getStarfield } from "./src/js/StarsJS.js";
import { drawOrbit, sendWave } from "./src/js/logicJS.js";




// Original camera position for animation and reset
let initial_cam_x = -0.22981;
let initial_cam_y = 0.246483;
let initial_cam_z = 2.296749;

let allModelsLoaded = false;

//Orbit segments
let segments =128;


//Debug mode active for console log
let debug = true;

function debugMode(to_print) {
    if (debug) {
        console.log(to_print);
    }
}


//Add stars in the background of the loading screen
const loadingScreen = document.querySelector('.loading-screen');
const dots = [];

for (let i = 0; i < 100; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    const size = Math.random() * 5; // Adjust the multiplier for size variation
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * window.innerWidth}px`;
    dot.style.top = `${Math.random() * window.innerHeight}px`;
    dots.push(dot);
}

loadingScreen.append(...dots);



// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = initial_cam_x;
camera.position.y = initial_cam_y;
camera.position.z = initial_cam_z;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, autoClear: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;




//get state of input toggle switch
var toggle = document.getElementById('toggle');
var state = toggle.checked;

debugMode(state ? 'HighRES' : 'LowRES');

//when toggle is changed, update texture of earth, night lights and clouds
toggle.addEventListener('change', function() {
    state = toggle.checked;

    //change texture of earth
    texturePath = state ? 'media/8k/earth_map.jpg' : 'media/2k/earth_map.jpg';
    earthMesh.material.map = new THREE.TextureLoader().load(texturePath);

    //change texture of night lights
    night_texturePath = state ? 'media/8k/earth_night.jpg' : 'media/2k/earth_night.jpg';
    lightMesh.material.map = new THREE.TextureLoader().load(night_texturePath);

    //change texture of clouds
    cloud_texturePath = state ? 'media/8k/earth_clouds.jpg' : 'media/2k/earth_clouds.jpg';
    cloudsMesh.material.map = new THREE.TextureLoader().load(cloud_texturePath);

    //display 8k or 2k in console
    debugMode(state ? 'HighRES' : 'LowRES');

});

// Create earth mesh texture
let texturePath = state ? 'media/8k/earth_map.jpg' : 'media/2k/earth_map.jpg';
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(texturePath),
    roughness: 1,
    metalness: 0
});

const earthMesh = new THREE.Mesh(geometry, material);
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;

// Create a group for the earth
const earthGroup = new THREE.Group();
earthGroup.add(earthMesh);
scene.add(earthGroup);

// night lights mesh
let night_texturePath = state ? 'media/8k/earth_night.jpg' : 'media/2k/earth_night.jpg';
const lightsMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(night_texturePath),
    blending: THREE.AdditiveBlending,
});

const lightMesh = new THREE.Mesh(geometry, lightsMaterial);
earthGroup.add(lightMesh);

// cloud mesh
let cloud_texturePath = state ? 'media/8k/earth_clouds.jpg' : 'media/2k/earth_clouds.jpg';
const cloudsMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('media/8k/earth_clouds.jpg'),
    blending: THREE.AdditiveBlending
});

const cloudsMesh = new THREE.Mesh(geometry, cloudsMaterial);
cloudsMesh.scale.setScalar(1.005);
cloudsMesh.castShadow = true;
earthGroup.add(cloudsMesh);



//Satellite 1 code

//object to control speed
const orbitObj = new THREE.Object3D();

//Satelite mesh
const gltfLoader = new THREE.GLTFLoader();



console.time('load1');
gltfLoader.load('media/3d/3/model.glb', (gltf) => {
    const satelite = gltf.scene;
    
    //console log how long it took to load the model
    console.timeEnd('load1');
    
    satelite.scale.set(0.012, 0.012, 0.012);
    satelite.position.set(1.9, 0, 0);
    
    satelite.castShadow = true;
    satelite.receiveShadow = true;
    satelite.lookAt(earthMesh.position);
    orbitObj.add(satelite);
});

//Satelite orbit
scene.add(orbitObj);
earthGroup.add(orbitObj);

// Draw orbit
drawOrbit(orbitObj, 1.9, segments);



//Satellite 2 code
const orbitObj2 = new THREE.Object3D();

console.time('load2');
gltfLoader.load('media/3d/3/model.glb', (gltf) => {
    const satelite = gltf.scene;
    
    //console log how long it took to load the model
    console.timeEnd('load2');
    
    satelite.scale.set(0.012, 0.012, 0.012);
    satelite.position.set(2.1, 0, 0);
    
    //satelite.rotation.set(0, 0, 2);
    satelite.castShadow = true;
    satelite.receiveShadow = true;
    satelite.lookAt(earthMesh.position);
    orbitObj2.add(satelite);
});

//Satelite orbit
scene.add(orbitObj2);
earthGroup.add(orbitObj2);


// Tilt the satellite 2
orbitObj2.rotation.x = Math.PI / 4;

// Draw orbit
drawOrbit(orbitObj2, 2.1, segments);








// Satelite 3 code
const orbitObj3 = new THREE.Object3D();

console.time('load3');
gltfLoader.load('media/3d/3/model.glb', (gltf) => {
    const satelite = gltf.scene;
    
    //console log how long it took to load the model
    console.timeEnd('load3');
    
    satelite.scale.set(0.012, 0.012, 0.012);
    satelite.position.set(2.3, 0, 0);
    
    //satelite.rotation.set(0, 0, 2);
    satelite.castShadow = true;
    satelite.receiveShadow = true;
    satelite.lookAt(earthMesh.position);
    orbitObj3.add(satelite);
    allModelsLoaded = true;
});

//Satelite orbit
scene.add(orbitObj3);
earthGroup.add(orbitObj3);

// Tilt the satellite 3
orbitObj3.rotation.x = 3*Math.PI / 4;

// Draw orbit
drawOrbit(orbitObj3, 2.3, segments);






// Tilt the earth model
earthGroup.rotation.z = -23.4 * Math.PI / 180;

// Create orbit controls with damping factor
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Start of dragging
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.01; // Stop of dragging
controls.minDistance = 1.25;
controls.maxDistance = 9.7;

// Create a light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-2, 0.5, 1.5);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
scene.add(light);

// Create a Fresnel shader
const fresnelMat = getFresnelMat();
const fresnelMesh = new THREE.Mesh(geometry, fresnelMat);
fresnelMesh.scale.setScalar(1.01);
earthGroup.add(fresnelMesh);

// Add stars to the scene
const starfield = getStarfield();
scene.add(starfield);


//Animation back to the original position
var button = document.getElementById('refresh');
button.onclick = function() {
    gsap.to(camera.position, { duration: 1, z: initial_cam_z, x: initial_cam_x, y: initial_cam_y });
    gsap.to(camera.rotation, { duration: 1, x: 0, y: 0, z: 0, onUpdate: controls.update });
}





//Keyboard events
  
function launch_toast(key, toasttext) {
    var x = document.getElementById("toast");

    var toast_text = document.getElementById("notitext");
    var toast_key = document.getElementById("notikey");

    toast_text.innerHTML = toasttext;
    toast_key.innerHTML = key;

    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}


//when letter R is pressed, animation back to the original position
document.addEventListener('keydown', function(event) {
    if (event.key === 'r') {
        gsap.to(camera.position, { duration: 1, z: initial_cam_z, x: initial_cam_x, y: initial_cam_y });
        gsap.to(camera.rotation, { duration: 1, x: 0, y: 0, z: 0, onUpdate: controls.update });
        launch_toast("R", "Reset camera");
    }

    //when letter O is pressed, start/stop orbit camera
    if (event.key === 'o') {
        controls.autoRotate = !controls.autoRotate;
        controls.autoRotateSpeed = 1.0;
        launch_toast("O","Auto-rotate " + (controls.autoRotate ? "ON" : "OFF"));
    }

    //when left arrow is pressed, rotate camera to the left
    if (event.key === 'ArrowLeft') {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        launch_toast("←","Move left");
    }

    //when right arrow is pressed, rotate camera to the right
    if (event.key === 'ArrowRight') {
        controls.autoRotate = true;
        controls.autoRotateSpeed = -1.0;
        launch_toast("→","Move right");
    }

    //when s is pressed, send a wave to a random satelite
    if (event.key === 's') {

        //select a random orbitObj
        let random = Math.floor(Math.random() * 3);
        let rand_orbitobj = orbitObj;
        if (random == 1) {
            rand_orbitobj = orbitObj2;
        } else if (random == 2) {
            rand_orbitobj = orbitObj3;
        }



        sendWave(rand_orbitobj, earthMesh, scene, controls);
        launch_toast("S","Send signal");
    }

    //when 1 is pressed, send wave from satelite 1
    if (event.key === '1') {
        sendWave(orbitObj, earthMesh, scene, controls);
        launch_toast("1","Signal from first satelite");
    }

    //when 2 is pressed, send wave from satelite 2
    if (event.key === '2') {
        sendWave(orbitObj2, earthMesh, scene, controls);
        launch_toast("2","Signal from second satelite");
    }

    //when 3 is pressed, send wave from satelite 3
    if (event.key === '3') {
        sendWave(orbitObj3, earthMesh, scene, controls);
        launch_toast("3","Signal from third satelite");
    }

});



// Render the scene
function animate() {
    requestAnimationFrame(animate);

    controls.update();

    //console.log("x:" + camera.position.x + " y:" + camera.position.y + " z:" + camera.position.z);



    earthMesh.rotation.y += 0.002;
    lightMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0023;
    fresnelMesh.rotation.y += 0.002;

    orbitObj.rotation.y += 0.007; //speed rotation of satelite
    orbitObj2.rotation.y += 0.006; //speed rotation of satelite
    orbitObj3.rotation.y += 0.005; //speed rotation of satelite

    if (allModelsLoaded) {
        $(document).ready(function() {
            setTimeout(function() {
                $('.loading-screen').fadeOut('slow', function() {
                    $(this).hide();
                });
            }, 700);
        });
    }
    renderer.render(scene, camera);
}


animate();




// Handle resizing
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);