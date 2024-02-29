import { Mesh, MeshStandardMaterial, CylinderGeometry } from "three";

export default class CylinderObject {
	_geometry: CylinderGeometry;
	_material: MeshStandardMaterial;
	_mesh: Mesh;

	constructor(
		radiusTop: number,
		radiusBottom: number,
		height: number,
		radialSegments: number,
		heightSegments: number
	) {
		this._geometry = new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);
		this._material = new MeshStandardMaterial();
		this._mesh = new Mesh(this._geometry, this._material);
		this._mesh.userData.name = "Cylinder";
		this._mesh.userData.click = () => this.onClick();
	}

	onClick() {
		console.log(this._mesh.geometry);
	}
}
