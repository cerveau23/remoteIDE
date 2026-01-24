import { NS } from "@ns"

/** @param {NS} ns */
export async function main(ns: NS) {
	let flag = ns.flags([["destination", ""], ["script", ""], ["args", ""]]) as {destination: string, script: string, args: string}
	if (flag.destination === "" && ns.serverExists("Overseer")) { flag.destination = "Overseer" }
	else if(flag.destination === ""){flag.destination = "home"}
	if(!flag.script.endsWith(".js")){flag.script+=".js"}
	if ((ns.getServerMaxRam(flag.destination) - ns.getServerUsedRam(flag.destination) >= ns.getScriptRam(flag.script)) && ns.getServer(flag.destination).hasAdminRights) {
		if (!ns.ls(flag.destination).includes(flag.script)){ns.scp(flag.script,flag.destination)}
		if (!ns.ls(flag.destination).includes("./functional/functions.js")){ns.scp("./functional/functions.js",flag.destination + "./functional/functions.js")}
		ns.exec(flag.script,flag.destination,1,flag.args)
	}
	else if((flag.destination === "Overseer") && (ns.getServerMaxRam("home") - ns.getServerUsedRam("home") >= ns.getScriptRam(flag.script))){ns.run(flag.script,1,flag.args)}
}