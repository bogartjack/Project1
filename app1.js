const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const DEPTH = 1000;
const SPHERERADIUS = 50;
const planeStartTime = 400;
const planeStartOpacity = .4;
let animating =false;
let LastTime = 0;
const planes = {};
const spheres = [];
const boundBox = { LEFT: 0, RIGHT: 1, TOP: 2, BOTTOM: 3, BACK: 4};
let lastTime = new Date();

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT, 1, 1000);
camera.position.z = 500;
scene.add(camera);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.x = WIDTH - 50;
pointLight.position.y = HEIGHT - 50;
pointLight.position.z = DEPTH - 50;
scene.add(pointLight);



class Plane {
	constructor(mesh){
		this.mesh = mesh;
		this.timeLeft = planeStartTime;
	}
	
	reset(){
		this.timeLeft = planeStartTime;
		this.mesh.material.opacity = planeStartOpacity;
	}

	updateMesh(elapsed) {
		//check for time left in the amination
		if(this.timeLeft > 0){this.timeLeft -=elapsed;}
		//check again for time left after elapsed time 
		if (this.timeLeft > 0){
			this.mesh.material.opacity = planeStartOpacity + (1.0 - planeStartOpacity) * (this.timeLeft/planeStartTime);
		}
		else {
			this.mesh.material.opacity = planeStartOpacity;
		}	
	}
}

class Sphere {
	constructor(mesh, sphereRadius){
		this.mesh = mesh;
		this.direction = [
			Math.round(Math.random()) == 1 ? 1: -1,
			Math.round(Math.random()) == 1 ? 1: -1,
			Math.round(Math.random()) == 1 ? 1: -1
		]
		this.sphereRadius = sphereRadius;
		this.speed = 500;
	}

	updatePosition(elapsed){
		this.mesh.position.x += this.direction[0] * (elapsed/1000.0 *this.speed);
		this.mesh.position.y += this.direction[1] * (elapsed/1000.0 *this.speed);
		this.mesh.position.z += this.direction[2] * (elapsed/1000.0 *this.speed);
	}

	updateCollision(){
		if (this.mesh.position.x >= (WIDTH - this.sphereRadius)){
			hitPlanes(boundBox.RIGHT);
			this.direction[0] = -1;
		}
		else if (this.mesh.position.x <= -(WIDTH - this.sphereRadius)){
			hitPlanes(boundBox.LEFT);
			this.direction[0] = 1;
		}
		
		if (this.mesh.position.y >= (HEIGHT - this.sphereRadius)){
			hitPlanes(boundBox.TOP);
			this.direction[1] = -1;
		}
		else if (this.mesh.position.y <= -(HEIGHT - this.sphereRadius)){
			hitPlanes(boundBox.BOTTOM);
			this.direction[1] = 1;
		}

		if (this.mesh.position.z >= DEPTH){
			this.direction[2] = -1;
		}
		else if (this.mesh.position.z <= -DEPTH){
			hitPlanes(boundBox.BACK); 
			this.direction[2] = 1;
		}
	}
}

class Player {
	constructor (){
		this.forward = false;
		this.backward = false;
		this.left = false;
		this.right = false;
		$(document).ready().on('keydown', (event) => {this.startMovement(event)});
		$(document).ready().on('keyup', (event) => {this.endMovement(event)});
	}

	toggleMovement (keyCode, directionBool){
		switch (keyCode) {
			case 37:
				this.left = directionBool;
				break;
			case 38: 
				this.forward = directionBool;
				break;
			case 39:
				this.right = directionBool;
				break;
			case 40: 
				this.backward = directionBool;
				break;
		}
	}

	updatePosition (elapsed) {
		let curPosX = camera.position.x;
		let curPosZ = camera.position.z;
		let curRot = camera.rotation.y;

		const tr = 5.0;
		const rot = .025;

		if (this.forward){
			curPosX -= Math.sin(-curRot) * -tr;
			curPosZ -= Math.cos(-curRot) * tr;
		}
		else if (this.backward){
			curPosX -= Math.sin(curRot) * -tr;
			curPosY += Math.cos(curRot) * tr;
		}

		if (this.left){
			curRot += rot;
		}
		else if (this.right) {
			curRot -= rot;
		}

		camera.rotation.y = curRot;
		camera.position.x = curPosX;
		camera.position.z = curPosZ;
	}

	startMovement (keyEvent) {
		this.toggleMovement(keyEvent.keyCode, true);
	}

	endMovement (keyEvent) {
		this.toggleMovement(keyEvent.keyCode, false);
	}
}

const init = () => {
	
	const geometry = new THREE.SphereGeometry(SPHERERADIUS, 10, 10);
	const material = new THREE.MeshLambertMaterial({color: 0xff00ff});
	const firstSphere = new Sphere( new THREE.Mesh(geometry, material));
	spheres[0] = firstSphere;

	scene.add(firstSphere);
	
	initPlanes();
	
	const $renderarea = $('#render-area');
	if ($renderarea.children().length>0){
		$renderarea.children().remove();
	}
	$('#render-area').append(renderer.domElement);
	renderer.render(scene, camera);
}

const initPlanes = () => {
	initPlane(boundBox.TOP);
	initPlane(boundBox.BOTTOM);
	initPlane(boundBox.RIGHT);
	initPlane(boundBox.LEFT);
	initPlane(boundBox.BACK);
}

const initPlane = (planeLoc) => {
	let w, h, posx = 0, posy = 0, posz = 0, roty =0, rotx = 0, rotz =0;
	switch (planeLoc) {
		case boundBox.BACK:
			w = WIDTH;
			h = HEIGHT;
			posz = -DEPTH;
			break;
		case boundBox.LEFT:
			w = DEPTH;
			h = HEIGHT;
			posx = -WIDTH;
			roty = Math.PI/2;
			break;
		case boundBox.RIGHT:
			w = DEPTH;
			h = HEIGHT;
			posx = WIDTH;
			roty = -Math.PI/2;
		case boundBox.BOTTOM:
			w = WIDTH;
			h = DEPTH;
			posx = -HEIGHT;
			rotx = -Math.PI/2;
			break;
		case boundBox.TOP:
			w = WIDTH;
			h = DEPTH;
			posy = HEIGHT;
			rotx = Math.PI/2;
			break;
	}
	
	const geometry = new THREE.PlaneGeometry( w, h);
	const material = new THREE.MeshLambertMaterial({color: 0x0f0f0f, opacity: planeStartOpacity, transparent: true});

	const planeMesh = new THREE.Mesh(geometry, material);
	planeMesh.position.x = posx;
	planeMesh.position.y = posy;
	planeMesh.position.z = posz;
	planeMesh.rotation.x = rotx;
	planeMesh.rotation.y = roty;
	planeMesh.rotation.z = rotz;

	const thePlane = new Plane(planeMesh);
	planes[planeLoc] = thePlane;

	scene.add(thePlane.mesh)
}

const hitPlanes = (planeLoc) => {
	planes[planeLoc].reset();
}

const animate = () => {
	if (animating){
		const now = new Date();
		const elapsed = now.getTime() - lastTime.getTime();
		lastTime = now; 
	
		spheres[0].updateCollision();
		spheres[0].updatePosition(elapsed);
		
		for(key in planes) {
			planes[key].updateMesh(elapsed);
		}

		player.updatePosition(elapsed);

		requestAnimationFrame(animate);
	}

}
const player = new Player();
animating = true;
init();
animate();
