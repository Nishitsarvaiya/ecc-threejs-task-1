import gsap from 'gsap';
import {
	ACESFilmicToneMapping,
	Clock,
	Group,
	HemisphereLight,
	Mesh,
	Object3D,
	Object3DEventMap,
	PerspectiveCamera,
	Raycaster,
	SRGBColorSpace,
	Scene,
	Vector2,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import CubeObject from '../objects/CubeObject';
import CylinderObject from '../objects/CylinderObject';
import IcoSphereObject from '../objects/IcoSphereObject';

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
	_cubeConfig!: CubeConfig;
	_icoConfig!: IcoConfig;
	_cylinderConfig!: CylinderConfig;
	_group!: Group;

	constructor() {
		this.initWorld();
	}

	/**
	 *	Initialises the Threejs primitives and essentials to create a scene
	 * 	@memberof World
	 */
	initWorld() {
		// Initialise the parameters of the Geometries
		this._cubeConfig = {
			width: 1.5,
			height: 1.5,
			depth: 1.5,
		};
		this._icoConfig = {
			radius: 1,
			detail: 1,
		};
		this._cylinderConfig = {
			radius: 1,
			height: 2.5,
		};

		// Get the viewport
		this._vw = window.innerWidth;
		this._vh = window.innerHeight;

		// Create the Renderer
		this._renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
		this._renderer.outputColorSpace = SRGBColorSpace;
		this._renderer.toneMapping = ACESFilmicToneMapping;
		this._renderer.setClearColor(0x2f2f2f, 1);
		this._renderer.setSize(this._vw, this._vh);
		this._renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2));
		this._canvas = this._renderer.domElement;
		document.getElementById('gl')?.appendChild(this._canvas);

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
		const light = new HemisphereLight(0xffffff, 'cornflowerblue', 3);

		this._scene.add(light);

		// Create the Clock
		this._clock = new Clock();
		this._clock.start();

		this.resize();
		window.addEventListener('resize', () => this.resize());
		this.createObjects();
		this.createRaycaster();
		this._raf = window.requestAnimationFrame(() => this.update());
		window.addEventListener('pointermove', (e) => this.onPointerMove(e));
		window.addEventListener('click', () => this.onMeshClick());
		document.getElementById('resetCamera')?.addEventListener('click', () => this.resetView());
	}

	createObjects() {
		const cube = new CubeObject(this._cubeConfig);
		const ico = new IcoSphereObject(this._icoConfig);
		const cylinder = new CylinderObject(this._cylinderConfig);
		this._group = new Group();

		cube._mesh.position.set(-4, 0, 0);
		cylinder._mesh.position.set(4, 0, 0);

		this._group.add(cube._mesh);
		this._group.add(ico._mesh);
		this._group.add(cylinder._mesh);

		this._scene.add(this._group);
		this._group.children.forEach((mesh) => this.animateIn(mesh as Mesh));

		this._objects = [];
		this._objects.push(cube);
		this._objects.push(ico);
		this._objects.push(cylinder);
		this.removeLoader();
	}

	createRaycaster() {
		this._raycaster = new Raycaster();
		this._pointer = new Vector2(-1, -1);
	}

	animateIn(mesh: Mesh) {
		let tl = gsap.timeline({ defaults: { duration: 2, ease: 'expo.inOut' } });
		tl.to(
			mesh.material,
			{
				opacity: 1,
			},
			'start'
		).fromTo(
			mesh.scale,
			{ x: 0, y: 0, z: 0 },
			{
				x: 1,
				y: 1,
				z: 1,
			},
			'start'
		);
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

		if (intersects.length > 0) {
			for (let i = 0; i < intersects.length; i++) {
				const object = intersects[i].object;
				this.focusOnObject(object);
			}
		}
	}

	focusOnObject = (object: Object3D<Object3DEventMap>) => {
		let tl = gsap.timeline({ defaults: { duration: 1.5, ease: 'expo.out' } });
		tl.to(this._controls.target, { x: object.position.x, y: object.position.y, z: object.position.z }).to(
			this._camera.position,
			{
				x: object.position.x,
				y: object.position.y,
				z: object.position.z + object.userData.zoomOutFactor,
			},
			0
		);
		object.userData.click();
		this._camera.updateProjectionMatrix();
	};

	resetView() {
		let tl = gsap.timeline({ defaults: { duration: 1.5, ease: 'expo.out' } });
		tl.to(this._controls.target, { x: 0, y: 0, z: 0 }).to(
			this._camera.position,
			{
				x: 0,
				y: 0,
				z: 10,
			},
			0
		);
		this._objects.forEach((obj) => obj.hideGui());
	}

	removeLoader() {
		const loader = document.querySelector('.loader') as HTMLDivElement;
		loader.style.display = 'none';
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
