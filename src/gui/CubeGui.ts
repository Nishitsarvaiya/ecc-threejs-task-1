import { Mesh } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default class CubeGui {
	_cubeGui!: GUI;
	_data!: { width: number; height: number; depth: number };

	constructor(mesh: Mesh, config: CubeConfig) {
		this.initGui(mesh, config);
	}

	initGui(mesh: Mesh, config: CubeConfig) {
		this._data = { ...config };
		this._cubeGui = new GUI({ title: "Cube", container: document.getElementById("gui") || undefined });

		this._cubeGui.add(this._data, "width", 0.1, 2, 0.1).onChange(() => mesh.userData.updateGeometry(this._data));
		this._cubeGui.add(this._data, "height", 0.1, 2, 0.1).onChange(() => mesh.userData.updateGeometry(this._data));
		this._cubeGui.add(this._data, "depth", 0.1, 2, 0.1).onChange(() => mesh.userData.updateGeometry(this._data));
	}
}
