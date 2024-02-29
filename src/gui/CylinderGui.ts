import { Mesh } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export default class CylinderGui {
	_cylinderGui!: GUI;
	_data!: { radius: number; height: number };

	constructor(mesh: Mesh, config: CylinderConfig) {
		this.initGui(mesh, config);
	}

	initGui(mesh: Mesh, config: CylinderConfig) {
		this._data = { ...config };
		this._cylinderGui = new GUI({ title: "Cylinder", container: document.getElementById("gui") || undefined });

		this._cylinderGui
			.add(this._data, "radius", 0.1, 2, 0.1)
			.onChange(() => mesh.userData.updateGeometry(this._data));
		this._cylinderGui
			.add(this._data, "height", 0.1, 2, 0.1)
			.onChange(() => mesh.userData.updateGeometry(this._data));
	}

	showGui() {
		this._cylinderGui.show();
	}
	hideGui() {
		this._cylinderGui.hide();
	}
}
