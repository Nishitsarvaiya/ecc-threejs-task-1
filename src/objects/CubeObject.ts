import { Mesh, MeshStandardMaterial, BoxGeometry } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default class CubeObject {
	_geometry: BoxGeometry;
	_material: MeshStandardMaterial;
	_mesh: Mesh;
	_cubeGui!: GUI;
	_data!: { width: number; height: number; depth: number };
	_isGuiVisible: boolean;

	constructor(config: CubeConfig) {
		this._isGuiVisible = false;
		this._geometry = new BoxGeometry(config.width, config.height, config.depth);
		this._material = new MeshStandardMaterial({ wireframe: false });
		this._mesh = new Mesh(this._geometry, this._material);
		this._mesh.userData.name = "Cube";
		this._mesh.userData.zoomOutFactor = 3;
		this._mesh.userData.click = () => this.onClick();
		this._mesh.userData.updateGeometry = (config: CubeConfig) => this.updateGeometry(config);
		this.initGui(config);
	}

	initGui(config: CubeConfig) {
		this._data = { ...config };
		this._cubeGui = new GUI({ title: "Cube", container: document.getElementById("gui") || undefined });
		this.hideGui();

		this._cubeGui
			.add(this._data, "width", 0.1, 2, 0.1)
			.onChange(() => this._mesh.userData.updateGeometry(this._data));
		this._cubeGui
			.add(this._data, "height", 0.1, 2, 0.1)
			.onChange(() => this._mesh.userData.updateGeometry(this._data));
		this._cubeGui
			.add(this._data, "depth", 0.1, 2, 0.1)
			.onChange(() => this._mesh.userData.updateGeometry(this._data));
	}

	updateGeometry(config: CubeConfig) {
		this._geometry = new BoxGeometry(config.width, config.height, config.depth);
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
		this._cubeGui.show();
	}

	hideGui() {
		this._cubeGui.hide();
	}
}
