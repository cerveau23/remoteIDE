import {NS} from "@ns";

// noinspection JSUnusedGlobalSymbols
/** @param {NS} ns */
export async function main(ns: NS) {
    //@ignore-infinite
    while(true){
        let threads = Math.floor((ns.getServerMaxRam("Saboter") - ns.getServerUsedRam("Saboter")) / ns.getScriptRam("grower.js"));
        if(threads > 0){
            ns.exec("grower.js","Saboter", threads, "computek");
        }
        await ns.sleep(1000);
    }
}