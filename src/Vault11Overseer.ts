import type {NS} from "@ns"
import bTSe from "bestTrainingServersV2" ;
import vOe from "VaultOverseer";

/** @param {NS} ns */
export async function main(ns: NS) {
    //part 0.1: Analyze all the servers and determine which ones are the most profitable
    let bTSeData = bTSe(ns);//bestServers, maxExp, maxExpAmount, expValues (keys to bestServers)

    //start loop

    //part 1: Analyze how much the host is occupied and how much every profitable server will earn once they are done in terms of loss of profit and heigtened security

    //part 2: initiate growth and weakening operations for every server that needs it

    //part 3: occupy the remaining RAM with hacking operations

}