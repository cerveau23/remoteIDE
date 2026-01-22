import {NS} from "@ns";
import {portReceiver} from "functions"

/** @param {NS} ns */
export async function main(ns: NS) {
    let serverMap = await portReceiver(ns, "Server Map", 1, true);
    let activity = true;
    while (activity) {
        activity = false;
        for (let i of serverMap) if ((ns.ps(i[0]).length !== 0) && (ns.ps(i[0])[0].filename !== "taskKilla.js")) {
            activity = true;
            ns.killall(i[0], true);
        }
        await ns.sleep(10);
    }
    ns.tprint("Genocide ended")
}