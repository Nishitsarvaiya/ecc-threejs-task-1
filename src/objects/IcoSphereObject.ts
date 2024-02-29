import { Mesh, MeshStandardMaterial, IcosahedronGeometry } from "three";

export default class IcoSphereObject {
	_geometry: IcosahedronGeometry;
	_material: MeshStandardMaterial;
	_mesh: Mesh;

	constructor(radius: number, detail: number) {
		this._geometry = new IcosahedronGeometry(radius, detail);
		this._material = new MeshStandardMaterial();
		this._mesh = new Mesh(this._geometry, this._material);
		this._mesh.userData.name = "IcoSphere";
		this._mesh.userData.click = () => this.onClick();
	}

	onClick() {
		console.log(this._mesh.geometry);
	}
}
