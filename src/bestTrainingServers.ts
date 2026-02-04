import { NS } from "@ns";
import {dSe} from "depthScannerV2";
import {Geography} from "/typeLib";
let previousExp = 0;
let amountSame = 0;
let maxExp = 0;
let maxExpAmount = 0;
let trueNS : NS;
let bestServers: string[] = [];

/**
 * Takes the server map and sends it to {@link checkExp} for sorting.
 * @return {Promise<[string[],number, number]>} Once sorted, it returns the list of servers, the maximum possible exp and the number of servers giving that amount
 * The list goes in the descending order of efficiency
 * @param {NS} ns*/
export async function main(ns: NS): Promise<[string[],number, number]> {
  trueNS = ns;
  let mapp = <Geography.Map>dSe(ns);
  mapp.forEach(checkExp);
  ns.print("Servers same exp: " + amountSame);
  ns.print("Max exp: " + maxExp + " Amount: " + maxExpAmount);
  ns.printRaw("Best Training Servers: " + bestServers);
  return [bestServers,maxExp,maxExpAmount];
}

/**
 * A function that analyses a server and records whether it is better than the previously known
 *  best training server
 * @param {Location} location The location of the server to analyse
 * @return {void} It doesn't return anything, instead it affects global variables inside the script
 */
function checkExp(location: Geography.Location): void {
  let exp = trueNS.formulas.hacking.hackExp(trueNS.getServer(location[0]), trueNS.getPlayer());
  if (exp === previousExp) { amountSame++; }
  if (exp === maxExp) { maxExpAmount++; bestServers.push(location[0]) }
  if (exp > maxExp) { maxExp = exp; maxExpAmount = 1; bestServers = [location[0]] }
  previousExp = exp;
}

/**
 * Calls {@link main} from bestTrainingServers.js
 *
 * @return {Promise<[string[],number, number]>} the list of servers, the maximum possible exp and the number of servers giving that amount
 *
 * The list goes in the descending order of efficiency
 * @param {NS} ns */
export async function bTSe(ns: NS): Promise<[string[], number, number]> {
  //await ns.tprint(argument);
  let answer = await main(ns);
  //await ns.tprint (answer);
  //await ns.tprint (typeof answer);
  return answer;
}