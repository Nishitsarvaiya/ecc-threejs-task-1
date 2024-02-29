import { Mesh, MeshStandardMaterial, BoxGeometry } from "three";

export default class CubeObject {
	_geometry: BoxGeometry;
	_material: MeshStandardMaterial;
	_mesh: Mesh;

	constructor(width: number, height: number, depth: number, widthSegments: number, heightSegments: number) {
		this._geometry = new BoxGeometry(width, height, depth, widthSegments, heightSegments);
		this._material = new MeshStandardMaterial();
		this._mesh = new Mesh(this._geometry, this._material);
		this._mesh.userData.name = "Cube";
		this._mesh.userData.click = () => this.onClick();
	}

	onClick() {
		console.log(this._mesh.geometry);
	}
}
