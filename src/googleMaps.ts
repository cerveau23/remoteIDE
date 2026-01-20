// noinspection InfiniteLoopJS

import { NS } from "@ns";
import { dSe , PartialFlag} from "depthScannerV2";
import {Location, Map} from "/typeLib/Geography";
function scanner(ns : NS, arg?: PartialFlag) : Map {
	return dSe(ns,arg);
}

/** @param {NS} ns */
export async function main(ns: NS) {
	let scanMap;
	let previousMap;
	//@ignore-infinite
	while (true) {
		let portHandle = ns.getPortHandle(1);
		while (!portHandle.full()) {
			scanMap = <Map>scanner(ns);
			if(previousMap != scanMap) {
				portHandle.tryWrite({name: "Server Map", data: scanMap, loop: true});
				previousMap = scanMap;
			}
		}
		await ns.sleep(10);
	}
}