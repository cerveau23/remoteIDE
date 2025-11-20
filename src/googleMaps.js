// noinspection InfiniteLoopJS

import {dSe} from "depthScanner";
function scanner(ns,...arg) { return dSe(ns,arg); }
/** @param {NS} ns */
export async function main(ns) {
	//@ignore-infinite
	while (true) {
		let portHandle = ns.getPortHandle(1);
		while (!portHandle.full()) {
			let scanMap = await scanner(ns);
			portHandle.tryWrite({ name: "Server Map", data: scanMap, loop: true });
		}
		await ns.sleep(10);
	}
}