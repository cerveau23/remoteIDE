import { copyToClipboard } from "semiAutoBackdoorer"
/** @param {NS} ns */
export async function main(ns) {
	let type = await ns.prompt("Type:", { type: "select", choices: ns.codingcontract.getContractTypes() })
	let massTest = await ns.prompt("Mass Testing?", { type: "boolean" })
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

