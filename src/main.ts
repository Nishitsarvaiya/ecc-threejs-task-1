import "./style.css";
import World from "./World/World";
import WebGL from "three/addons/capabilities/WebGL.js";

if (WebGL.isWebGLAvailable()) {
	(() => {
		new World();
	})();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	console.log(warning);
}
