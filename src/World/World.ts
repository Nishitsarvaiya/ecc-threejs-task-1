import {
	AmbientLight,
	Clock,
	DirectionalLight,
	PerspectiveCamera,
	Raycaster,
	Scene,
	Vector2,
	WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import CubeObject from "../objects/CubeObject";
import IcoSphereObject from "../objects/IcoSphereObject";
import CylinderObject from "../objects/CylinderObject";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default class World {
	_vw!: number;
	_vh!: number;
	_renderer!: WebGLRenderer;
	_canvas!: HTMLCanvasElement;
	_camera!: PerspectiveCamera;
	_scene!: Scene;
	_controls!: OrbitControls;
	_raf!: number;
	_clock!: Clock;
	_raycaster!: Raycaster;
	_pointer!: Vector2;
	_objects!: any[];
	_gui!: GUI;

	constructor() {
		this.initWorld();
	}

	/**
	 *	Initialises the Threejs primitives and essentials to create a scene
	 * 	@memberof World
	 */
	initWorld() {
		// Get the viewport
		this._vw = window.innerWidth;
		this._vh = window.innerHeight;

		// Create the Renderer
		this._renderer = new WebGLRenderer({ antialias: true });
		this._renderer.setClearColor(0x121212, 1);
		this._renderer.setSize(this._vw, this._vh);
		this._renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));
		this._canvas = this._renderer.domElement;
		document.getElementById("gl")?.appendChild(this._canvas);

		// Create the Camera
		this._camera = new PerspectiveCamera(50, this._vw / this._vh, 0.01, 1000);
		this._camera.position.set(0, 0, 10);

		// Create the Scene
		this._scene = new Scene();

		// Create the Controls
		this._controls = new OrbitControls(this._camera, this._canvas);
		this._controls.enableDamping = true;
		this._controls.update();

		// Create the lights
		const ambientLight = new AmbientLight();
		const directionalLight = new DirectionalLight(0xffffff, 3);
		directionalLight.position.set(2, 4, 10);
		const directionalLight2 = new DirectionalLight(0xffffff, 1);
		directionalLight2.position.set(-4, -3, -16);
		this._scene.add(ambientLight);
		this._scene.add(directionalLight);
		this._scene.add(directionalLight2);

		// Create the Clock
		this._clock = new Clock();
		this._clock.start();

		this.resize();
		window.addEventListener("resize", () => this.resize());
		this.createObjects();
		this.createRaycaster();
		this._raf = window.requestAnimationFrame(() => this.update());
		window.addEventListener("pointermove", (e) => this.onPointerMove(e));
		window.addEventListener("click", () => this.onMeshClick());
	}

	createObjects() {
		const cube = new CubeObject(1.5, 1.5, 1.5, 32, 32);
		const ico = new IcoSphereObject(1, 1);
		const cylinder = new CylinderObject(1, 1, 2.5, 32, 32);

		cube._mesh.position.set(-4, 0, 0);
		cylinder._mesh.position.set(4, 0, 0);

		this._scene.add(cube._mesh);
		this._scene.add(ico._mesh);
		this._scene.add(cylinder._mesh);

		this._objects = [];
		this._objects.push(cube);
		this._objects.push(ico);
		this._objects.push(cylinder);
	}

	createRaycaster() {
		this._raycaster = new Raycaster();
		this._pointer = new Vector2(-1, -1);
	}

	createGUI() {
		this._gui = new GUI();
	}

	onPointerMove(event: MouseEvent) {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components
		this._pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this._pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	onMeshClick() {
		// update the picking ray with the camera and pointer position
		this._raycaster.setFromCamera(this._pointer, this._camera);

		// calculate objects intersecting the picking ray
		const intersects = this._raycaster.intersectObjects(this._scene.children);

		for (let i = 0; i < intersects.length; i++) {
			console.log(intersects[i].object.userData);
			intersects[i].object.userData.click();
		}
	}

	update = () => {
		this._raf = window.requestAnimationFrame(this.update);
		this.render();
	};

	render() {
		const elapsedTime = this._clock.getElapsedTime();
		this._objects.forEach((obj) => {
			obj._mesh.rotation.x = elapsedTime * 0.1;
			obj._mesh.rotation.y = elapsedTime * 0.2;
			obj._mesh.rotation.z = elapsedTime * 0.3;
		});
		// Render the scene to canvas
		this._renderer.render(this._scene, this._camera);
		this._controls.update();
	}

	/**
	 *	Resize the renderer's viewport and camera's aspect to accomodate the scene within the viewport
	 * 	@memberof World
	 */
	resize() {
		this._vw = window.innerWidth;
		this._vh = window.innerHeight;
		this._renderer.setSize(this._vw, this._vh);
		this._camera.aspect = this._vw / this._vh;
		this._camera.updateProjectionMatrix();
	}
}