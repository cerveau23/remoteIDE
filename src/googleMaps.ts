// noinspection InfiniteLoopJS

import { NS } from "@ns";
import { dSe , PartialFlag} from "depthScannerV2";
import {PortData, Geography} from "/typeLib";
function scanner(ns : NS, arg?: PartialFlag) : Geography.Map {
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
			scanMap = <Geography.Map>scanner(ns);
			if(previousMap != scanMap) {
				let data : PortData<Geography.Map> = {kind: "PortData", name: "Server Map", data: scanMap, loop: true}
				portHandle.tryWrite(data);
				previousMap = scanMap;
			}
		}
		await ns.sleep(10);
	}
}