import { CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

export default class CylinderObject {
	_geometry: CylinderGeometry;
	_material: MeshStandardMaterial;
	_mesh: Mesh;
	_cylinderGui!: GUI;
	_data!: { radius: number; height: number };
	_isGuiVisible: boolean;

	constructor(config: CylinderConfig) {
		this._isGuiVisible = false;
		this._geometry = new CylinderGeometry(config.radius, config.radius, config.height, 32);
		this._material = new MeshStandardMaterial({ wireframe: false, transparent: true, opacity: 0 });
		this._mesh = new Mesh(this._geometry, this._material);
		this._mesh.userData.name = 'Cylinder';
		this._mesh.userData.zoomOutFactor = 4.5;
		this._mesh.userData.click = () => this.onClick();
		this._mesh.userData.updateGeometry = (config: CylinderConfig) => this.updateGeometry(config);
		this.initGui(config);
	}

	initGui(config: CylinderConfig) {
		this._data = { ...config };
		this._cylinderGui = new GUI({ title: 'Cylinder', container: document.getElementById('gui') || undefined });
		this.hideGui();

		this._cylinderGui.add(this._data, 'radius', 0.1, 2, 0.1).onChange(() => this._mesh.userData.updateGeometry(this._data));
		this._cylinderGui.add(this._data, 'height', 0.1, 2, 0.1).onChange(() => this._mesh.userData.updateGeometry(this._data));
	}

	updateGeometry(config: CylinderConfig) {
		this._geometry = new CylinderGeometry(config.radius, config.radius, config.height);
		this._mesh.geometry.dispose();
		this._mesh.geometry = this._geometry;
	}

	onClick() {
		if (this._isGuiVisible) {
			this.hideGui();
		} else {
			this.showGui();
		}
	}

	showGui() {
		this._cylinderGui.show();
		this._isGuiVisible = true;
	}

	hideGui() {
		this._cylinderGui.hide();
		this._isGuiVisible = false;
	}
}
