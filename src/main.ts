import World from "./World/World";
import WebGL from "three/addons/capabilities/WebGL.js";

const errorDiv = document.querySelector(".error") as HTMLDivElement;

if (WebGL.isWebGLAvailable()) {
	errorDiv.style.display = "none";
	new World();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	errorDiv?.appendChild(warning);
}
