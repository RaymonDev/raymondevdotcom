export function drawOrbit(orbitObj, orbitRadius, orbitSegments) {
    const ellipseCurve = new THREE.EllipseCurve(
        0, 0,            // ax, aY
        orbitRadius, orbitRadius,           // xRadius, yRadius
        0, 2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );

    const points = ellipseCurve.getPoints(orbitSegments);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
    const orbitEllipse = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    orbitEllipse.rotation.x = Math.PI / 2;
    orbitObj.add(orbitEllipse);
}


//animate a torus to go from the first a satelite to the earth
export function sendWave(orbit_obj, earthMesh, scene, controls) {

    //calculate the position of the first satelite
    var satelite = orbit_obj.children[1];
    var satelitePos = new THREE.Vector3();


    for (let i = 0; i < 7; i++) {
        setTimeout(() => {
            var torus = new THREE.Mesh(
                new THREE.TorusGeometry(0.005, 0.0005, 16, 100),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );

            var world_position = satelite.getWorldPosition(satelitePos);
            torus.position.set(world_position.x, world_position.y, world_position.z);
            torus.lookAt(earthMesh.position);

            scene.add(torus);

            //gsap scale animation
            gsap.to(torus.scale, {
                duration: 7,
                x: 35,
                y: 35,
                z: 35
            });


            //gsap position animation
            gsap.to(torus.position, {
                duration: 5,
                x: 0,
                y: 0,
                z: 0,
                onUpdate: controls.update,
                onComplete: () => {
                    scene.remove(torus);
                }
            });
        }, i * 100);
    }
}




//Slide up and down the info container
const dropdownButton = document.getElementById('dropdown-button');
const hideButton = document.getElementById('hide-button');
const infoContainer = document.getElementById('info-container');

//name
const mainname = document.getElementById('header-div');

//socials
const socials = document.getElementById('socials');

//bottomright menu
const menu = document.getElementById('bottomright-menu');


dropdownButton.addEventListener('click', () => {
    infoContainer.style.animation = 'slide-up 0.5s ease-in-out';
    infoContainer.classList.toggle('hidden');

    //hide the name and socials div
    mainname.style.display = 'none';
    socials.style.display = 'none';

    //hide the bottomright menu
    menu.style.display = 'none';

    //enable scrollbar
    document.body.style.overflow = 'auto';


});

hideButton.addEventListener('click', () => {
    infoContainer.style.animation = 'slide-down 0.5s ease-in-out';
    setTimeout(() => {
        infoContainer.classList.toggle('hidden');
    }, 500); // Wait for the animation to finish

    //show the name and socials div
    mainname.style.display = 'flex';
    socials.style.display = 'flex';

    //disable scrollbar
    document.body.style.overflow = 'hidden';

    //show the bottomright menu
    menu.style.display = 'flex';
});