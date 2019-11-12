Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

const VIEW_ANGLE = 45;
const NEAR = 1;
const FAR = 10000
const ASPECT = window.innerWidth / window.innerHeight;
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );
const renderer = new THREE.WebGLRenderer();
clock = new THREE.Clock()
const scene = new Physijs.Scene();
var gravity = new THREE.Vector3(0, -150, 0);
scene.setGravity(gravity)
let cubeGeo = new THREE.BoxGeometry(10, 10, 10);
let cubeMaterial = new THREE.MeshLambertMaterial({
    color: getRandomColor()
})
const cube = new Physijs.BoxMesh(cubeGeo, cubeMaterial)
cube.position.y = 50
var geometryS = new THREE.SphereGeometry(4, 10);
var materialS = new THREE.MeshNormalMaterial({
    wireframe: true
});
var sphere = new THREE.Mesh(geometryS, materialS);
sphere.position.set(0, 4, 0)
sphere.scale.set(2, 2, 2)
var sphereIsClicked = true;
t = 0
let domEvents = new THREEx.DomEvents(camera, renderer.domElement)
let tl = new TimelineMax()

/*base = new Physijs.PlaneMesh(new THREE.PlaneGeometry(500,500,500), new THREE.MeshLambertMaterial({color: 0x000F0F, side: THREE.DoubleSide}))
base.rotation.x = Math.PI/2
base.position.y = -2*/

// ***** LIGHTS ******

const ambientLight = new THREE.AmbientLight(0xffff44, 2);
ambientLight.position.set(0, 100, 100)
const dLight = new THREE.DirectionalLight(0xffff44, 10);
dLight.castShadow = true;

//*** ESTRADA ********

let textureL = new THREE.TextureLoader();
texture1 = textureL.load('textures/roadMiddleLine.png')
texture2 = textureL.load('grass.jpg')
let roadMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
}), 0.1, 0.8)
let roadGeometryS = new THREE.PlaneGeometry(100, 30)
let roadGeometryB = new THREE.PlaneGeometry(130, 30)
let squareAboutG = new THREE.PlaneGeometry(70, 70)
let squareAboutM = Physijs.createMaterial(new THREE.MeshBasicMaterial({
    map: texture2,
    side: THREE.DoubleSide
}), 0.1, 0.8)


let road1 = new Physijs.BoxMesh(roadGeometryS, roadMaterial)
road1.rotation.x += Math.PI / 2
road1.position.set(0, 0, 50)
let road2 = new Physijs.BoxMesh(roadGeometryS, roadMaterial)
road2.rotation.x += Math.PI / 2
road2.position.set(0, 0, -50)
let road3 = new Physijs.BoxMesh(roadGeometryB, roadMaterial)
road3.rotation.x += Math.PI / 2
road3.rotation.z += Math.PI / 2
road3.position.set(50, 0, 0)
let road4 = new Physijs.BoxMesh(roadGeometryB, roadMaterial)
road4.rotation.x += Math.PI / 2
road4.rotation.z += Math.PI / 2
road4.position.set(-50, 0, 0)
let squareAbout = new Physijs.BoxMesh(squareAboutG, squareAboutM);
squareAbout.rotation.x += Math.PI / 2

// BACKGROUND + VEICULO *********************
let backG = [
    'textures/corona_ft.PNG', 'textures/corona_bk.PNG',
    'textures/corona_up.PNG', 'textures/corona_dn.PNG',
    'textures/corona_rt.PNG', 'textures/corona_lf.PNG'
]
let bLoader = new THREE.CubeTextureLoader();
scene.background = bLoader.load(backG)
loader = new THREE.GLTFLoader();
loader.load('GroundVehicle.glb', function (gltf) {
    car = gltf.scene.children[0];
    car.scale.set(4, 4, 4)
    car.rotation.y += Math.PI / 2
    car.position.set(-50, 0, 50)
    scene.add(gltf.scene);
})
// **********************************************************************


// ********** EVENTS **************

domEvents.bind(sphere, 'mouseout', function () {
    sphereIsClicked = changeBool(sphereIsClicked)
    tl.to(sphere.scale, 1, {
        x: 3,
        y: 3,
        z: 3
    }).to(sphere.scale, 1, {
        x: 1,
        y: 1,
        z: 1
    })
})

domEvents.addEventListener(squareAbout, 'mouseout', () => {
    cubes = new Physijs.BoxMesh(new THREE.CubeGeometry(10,10,10), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0x000000
    }), .1, .7))
    cubes.position.set(Math.random() * 100 - 50,10,Math.random() * 100 - 50)
    //cube1.position.set((Math.random() * 100 - 50), 150, (Math.random() * 100 - 50))
    scene.add(cubes)
    cubes.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        // objCollidedWith.scale.set(.5,.5,.5)       
    });
})
domEvents.bind(squareAbout, 'click', function () {
    sphereB = new Physijs.BoxMesh(new THREE.SphereGeometry(5, 32, 32), Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: getRandomColor()
    }), .1, .7))
    sphereB.position.set(camera.position.x, camera.position.y,camera.position.z)
    //cube1.position.set((Math.random() * 100 - 50), 150, (Math.random() * 100 - 50))
    scene.add(sphereB)
    sphereB.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {
        // objCollidedWith.scale.set(.5,.5,.5)       
    });
    sphereB.setLinearVelocity(new THREE.Vector3(squareAbout.position.x - camera.position.x, squareAbout.position.y - (camera.position.y/3), squareAbout.position.z - camera.position.z))

})

squareAbout.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {});
road1.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {});
road2.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {});
road3.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {});
road4.addEventListener('collision', function (objCollidedWith, linearVelOfCollision, angularVelOfCollision) {});
//base.addEventListener( 'collision', function( objCollidedWith, linearVelOfCollision, angularVelOfCollision ) {});

//*********CONTROLS *** /


var fly = new THREE.OrbitControls(camera, renderer.domElement) 

/*fly.movementSpeed = 100
fly.lookVertical = true;
fly.autoSpeedFactor = 0
fly.rollSpeed = 1.5
fly.verticanMin = -1;
fly.verticanMin = 1;
fly.constrainVertical = true*/



controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.maxDistance = 1000
controls.minDistance = 2
controls.minPolarAngle  = Math.PI/4


// ********************************* FUNCTIONS ******************************************
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeBool(bool) {
    if (bool == true) {
        bool = false
    } else {
        bool = true
    }
    return bool
}

function ajustarJanela() {
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = (window.innerWidth / window.innerHeight)
        camera.updateProjectionMatrix();
    })
}
//++++++++++
function init() {
    camera.position.set(0, 20, 100)
    scene.add(camera)
    //scene.add(base)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    ajustarJanela()
    scene.add(road1)
    scene.add(road2)
    scene.add(road3)
    scene.add(road4)
    scene.add(squareAbout)
    scene.add(ambientLight);
    scene.add(ambientLight);
    scene.add(sphere)
    //scene.add(new THREE.GridHelper(100, 10, new THREE.Color(0x00ff00),new THREE.Color(0xffffff)));
    renderer.render(scene, camera)
}

function animate() {

    requestAnimationFrame(animate)
    var delta = clock.getDelta()
    //fly.update(delta)
    controls.update()
    cube.rotation.x += 0.03;
    cube.rotation.y += 0.03;
    sphere.rotation.x -= 0.1;
    sphere.rotation.y -= 0.1;

    if (car.position.x < 50 && car.position.z == 50) {
        car.position.x += 1;
    } else if (car.position.x == 50 && car.position.z > -50) {
        car.position.z -= 1
    } else if (car.position.x > -50 && car.position.z == -50) {
        car.position.x -= 1
    } else if (car.position.x == -50 && car.position.z < 50) {
        car.position.z += 1
    }
    if (car.position.x == -50 && car.position.z == 50) {
        car.rotation.y += Math.PI / 2;
    } else if (car.position.x == 50 && car.position.z == 50) {
        car.rotation.y += Math.PI / 2;
    } else if (car.position.x == 50 && car.position.z == -50) {
        car.rotation.y += Math.PI / 2;
    } else if (car.position.x == -50 && car.position.z == -50) {
        car.rotation.y += Math.PI / 2;
    }

    if (sphereIsClicked) {
        t += 0.02
        sphere.position.x = 120 * Math.cos(t);
        sphere.position.z = 120 * Math.sin(t);
    } else {
        t -= 0.02
        sphere.position.x = 120 * Math.cos(t);
        sphere.position.z = 120 * Math.sin(t);
    }

    scene.simulate();
    renderer.render(scene, camera)

}

init()
animate()