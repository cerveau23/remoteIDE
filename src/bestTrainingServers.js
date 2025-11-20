import {dSe} from "depthScanner";
let previousExp = 0;
let amountSame = 0;
let maxExp = 0;
let maxExpAmount = 0;
let truens;
let bestServers = [];

/**
 * Takes the server map and sends it to {@link checkExp} for sorting.
 * @return Once sorted, it returns the list of servers, the maximum possible exp and the number of servers giving that amount
 * The list goes in the descending order of efficiency
 * @param {NS} ns*/
export async function main(ns) {
  truens = ns;
  let mapp = await dSe(ns);
  mapp.forEach(checkExp);
  ns.print("Servers same exp: " + amountSame);
  ns.print("Max exp: " + maxExp + " Amount: " + maxExpAmount);
  ns.printRaw("Best Training Servers: " + bestServers);
  return [bestServers,maxExp,maxExpAmount];
}

/**
 * A function that analyses a server and records whether it is better than the previously known
 *  best training server
 * @param {string} value The name of the server to analyse TODO: Check if it's really a string!
 * @return void It doesn't return anything, instead it affects global variables inside the script
 */
function checkExp(value) {
  let exp = truens.formulas.hacking.hackExp(truens.getServer(value[0]), truens.getPlayer());
  if (exp === previousExp) { amountSame++; }
  if (exp === maxExp) { maxExpAmount++; bestServers.push(value[0]) }
  if (exp > maxExp) { maxExp = exp; maxExpAmount = 1; bestServers = [value[0]] }
  previousExp = exp;
}

/**
 * Calls {@link main} from bestTrainingServers.js
 *
 * @return the list of servers, the maximum possible exp and the number of servers giving that amount
 *
 * The list goes in the descending order of efficiency
 * @param {NS} ns */
export async function bTSe(ns) {
  //await ns.tprint(argument);
  let answer = await main(ns);
  //await ns.tprint (answer);
  //await ns.tprint (typeof answer);
  return answer;
}