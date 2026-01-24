import type { NS } from "@ns"
import {dSe} from "depthScannerV2";
import {Geography} from "/typeLib";

/** @param {NS} ns
 * @deprecated Broken */
export async function main(ns: NS) {
    let treeMapBare: (string| Geography.Location)[][] = new Array<[string, Geography.Location]>;
    ns.ui.openTail();
    ns.tprint("Test?");
    if (!ns.fileExists("depthScanner.js")) {
        ns.scp("depthScanner.js", ns.getHostname(), "home");
    }
    let map: Geography.Map = dSe(ns);
    for (let i in map) {
        if (treeMapBare.length - 1 < map[i][2].length) {
            treeMapBare[map[i][2].length] = []
        }
        treeMapBare[map[i][2].length] = ([i, map[i]]);
    }
    for (let i in treeMapBare) {
        for (let x in treeMapBare[i]) {
            //write on the tree
            if (treeMapBare[i][x][3]) {
                break;
            }
        }
    }
    /*for (let i in treeMapBare){
      ns.tprint(treeMapBare[i]);
    }*/
}
