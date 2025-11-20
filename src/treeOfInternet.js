/** @param {NS} ns */
import {dSe} from "depthScanner";
export async function main(ns){
  let treeMapBare=[[]];
  ns.tail();
  ns.tprint("Test?");
  if(!ns.fileExists("depthScanner.js")){ns.scp("depthScanner.js",ns.getHostname(),"home");}
  let map = [];
  map = await dSe(ns);
  for (let i in map){
    if (treeMapBare.length-1<map[i][2].length){treeMapBare[map[i][2].length]=[]}
    treeMapBare[map[i][2].length].push([i,map[i]]);
  }
  for(let i in treeMapBare){
    for (let x in treeMapBare[i]){
      //write on the tree
      if (treeMapBare[i][x][3]){
        break;
      }
    }
  }
  /*for (let i in treeMapBare){
    ns.tprint(treeMapBare[i]);
  }*/
}
