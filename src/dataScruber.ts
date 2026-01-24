//import dSe from "./depthScanner.js";
import { NS } from "@ns";
import { portReceiver } from "/functional/functions";
/** @param {NS} ns */
export async function main(ns: NS) {
	let authorisedFormats = ["txt", "lit"]
	//let mapp = await dSe(ns);
	let mapp = await portReceiver(ns, "Server Map", 1,true);
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