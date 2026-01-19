// noinspection InfiniteLoopJS

import { NS } from "@ns";
import { dSe , Map, Location} from "depthScanner";
function scanner(ns : NS,...arg: any[]) { return dSe(ns,arg); }

/** @param {NS} ns */
export async function main(ns: NS) {
	//@ignore-infinite
	while (true) {
		let portHandle = ns.getPortHandle(1);
		while (!portHandle.full()) {
			let scanMap = <Map>scanner(ns);
			portHandle.tryWrite({ name: "Server Map", data: scanMap, loop: true });
		}
		await ns.sleep(10);
	}
}