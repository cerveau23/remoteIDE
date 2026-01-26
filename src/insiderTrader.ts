import {NS} from "@ns";

// noinspection JSUnusedGlobalSymbols
/** @param {NS} ns */
export async function main(ns: NS) {
    //@ignore-infinite
    while(true){
        const host = "Saboteur";
        let threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam("grower.js"));
        if(threads > 0){
            ns.exec("grower.js",host, threads, "computek");
        }
        await ns.sleep(1000);
    }
}