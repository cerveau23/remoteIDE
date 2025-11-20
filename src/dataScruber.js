//import dSe from "./depthScanner.js";
import { portReceiver } from "functions";
/** @param {NS} ns */
export async function main(ns) {
	let authorisedFormats = ["txt", "lit"]
	//let mapp = await dSe(ns);
	let mapp = await portReceiver(ns, "Server Map");
	//let tested = false;
	for (let i in mapp) {
		let content = ns.ls(mapp[i][0]);
		//ns.print(content);
		for (let b in content) {
			/**if (!tested) {
				ns.tprint(content[b].substring(content[b].lastIndexOf(".") + 1));
				tested = true;
			}*/
			if ((ns.ls("home", content[b]).length === 0) && (authorisedFormats.indexOf(content[b].substring(content[b].lastIndexOf(".") + 1)) !== -1)) { ns.scp(content[b], "home", mapp[i][0]); }
		}
	}

}