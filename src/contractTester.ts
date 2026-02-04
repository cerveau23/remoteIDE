import { NS } from "@ns";

import {copyToClipboard} from "/functional/functions";
/** @param {NS} ns */
export async function main(ns: NS) {
	let type = <string> await ns.prompt("Type:", { type: "select", choices: ns.codingcontract.getContractTypes() })
	let massTest = <boolean> await ns.prompt("Mass Testing?", { type: "boolean" })
	if (massTest) {
		for (let i = 0; i < 1000; i++) {
			ns.codingcontract.createDummyContract(type)
		}
	}
	else {
		let CC = ns.codingcontract.createDummyContract(type);
		ns.tprint(ns.codingcontract.getData(CC))
		ns.tprintRaw(CC)
		copyToClipboard(CC)
	}
}

