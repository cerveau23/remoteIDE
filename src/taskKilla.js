import {portReceiver} from "functions"
/** @param {NS} ns */
export async function main(ns) {
	let serverMap = await portReceiver(ns, "Server Map");
	let activity = true;
	while (activity){
		activity = false;
		for (let i of serverMap) if((ns.ps(i[0]).length!==0) && (ns.ps(i[0])[0].filename!=="taskKilla.js")){
			activity = true;
			ns.killall(i[0],true);
		}
		await ns.sleep(10);
	}
	ns.tprint("Genocide ended")
}