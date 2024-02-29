import { IcosahedronGeometry, Mesh, MeshStandardMaterial } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default class IcoSphereObject {
	_geometry: IcosahedronGeometry;
	_material: MeshStandardMaterial;
	_mesh: Mesh;
	_icoGui!: GUI;
	_data!: { radius: number; detail: number };
	_isGuiVisible: boolean;

	constructor(config: IcoConfig) {
		this._isGuiVisible = false;
		this._geometry = new IcosahedronGeometry(config.radius, config.detail);
		this._material = new MeshStandardMaterial({ wireframe: false });
		this._mesh = new Mesh(this._geometry, this._material);
		this._mesh.userData.name = "IcoSphere";
		this._mesh.userData.zoomOutFactor = 2.5;
		this._mesh.userData.click = () => this.onClick();
		this._mesh.userData.updateGeometry = (config: IcoConfig) => this.updateGeometry(config);
		this.initGui(config);
	}

	initGui(config: IcoConfig) {
		this._data = { ...config };
		this._icoGui = new GUI({ title: "IcoSphere", container: document.getElementById("gui") || undefined });
		this.hideGui();

		this._icoGui
			.add(this._data, "radius", 0.1, 2, 0.1)
			.onChange(() => this._mesh.userData.updateGeometry(this._data));
		this._icoGui.add(this._data, "detail", 1, 10, 1).onChange(() => this._mesh.userData.updateGeometry(this._data));
	}

	updateGeometry(config: IcoConfig) {
		this._geometry = new IcosahedronGeometry(config.radius, config.detail);
		this._mesh.geometry.dispose();
		this._mesh.geometry = this._geometry;
	}

	onClick() {
		if (this._isGuiVisible) {
			this.hideGui();
		} else {
			this.showGui();
		}
		this._isGuiVisible = !this._isGuiVisible;
	}

	showGui() {
		this._icoGui.show();
	}

	hideGui() {
		this._icoGui.hide();
	}
}
