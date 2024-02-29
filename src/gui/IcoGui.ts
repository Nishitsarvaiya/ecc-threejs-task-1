import { Mesh } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default class IcoGui {
	_icoGui!: GUI;
	_data!: { radius: number; detail: number };

	constructor(mesh: Mesh, config: IcoConfig) {
		this.initGui(mesh, config);
	}

	initGui(mesh: Mesh, config: IcoConfig) {
		this._data = { ...config };
		this._icoGui = new GUI({ title: "IcoSphere", container: document.getElementById("gui") || undefined });

		this._icoGui.add(this._data, "radius", 0.1, 2, 0.1).onChange(() => mesh.userData.updateGeometry(this._data));
		this._icoGui.add(this._data, "detail", 1, 10, 1).onChange(() => mesh.userData.updateGeometry(this._data));
	}
}
