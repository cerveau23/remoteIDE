import { NS } from "@ns";
import { dSe } from "depthScannerV2";
let awakenAtStartOfScript: string;
// noinspection JSUnusedGlobalSymbols
/**
 * Requires: 3 GB of ram (self, low ram state), up to 4.6 GB of ram (self, high ram state), from 2 to 80.75 GB of ram (external scripts)
 *  Total: from 5 to 85.35 GB of ram
 * The main function of beholder. Is tasked with calling and maintaining both of the side-functions
 *  as well as deploying all other passive scripts.
 * Is the best "one script launcher" for now
 * @param {NS} ns
 * */
export async function main(ns: NS) {
  awakenAtStartOfScript = await softResetManager(ns);
  if ((ns.getServerMaxRam(ns.getHostname()) < ns.getScriptRam(ns.getScriptName()))) {
    ns.ramOverride(2.9);
    ns.run(await softResetManager(ns));
    await ns.sleep(10);
    if (ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) >= ns.getScriptRam("wolf.js")) {
      ns.run("wolf.js", { preventDuplicates: true, temporary: true });
    }
    ns.tprint("Low Ram");
    // eslint-disable-next-line no-constant-condition
    // noinspection InfiniteLoopJS
    while (true) {
      ns.run(await softResetManager(ns));
      await ns.sleep(10000);
    }
  }
  else {
    ns.ramOverride(ns.getScriptRam(ns.getScriptName()));
  }
  ns.tprint("Ram Okay");
  await newHackingServers(ns);
  let functionList = ns.ps();
  if (functionList.reduce((count, currentItem) => {
    return currentItem.filename === "netGrowth.js" ? count + 1 : count;
  }, 0) > 0) {
    ns.kill("netGrowth.js", "home");
  }
  if (functionList.reduce((count, currentItem) => {
    return currentItem.filename === "beholder.js" ? count + 1 : count;
  }, 0) > 1) {
    ns.exit();
  }
  let runningScripts = ["wolf.js", "googleMaps.js"]; //, "codingContractVirus.js"];
  for (let i of runningScripts) {
    ns.run(i, { preventDuplicates: true, temporary: true });
  }
  // eslint-disable-next-line no-constant-condition
  // noinspection InfiniteLoopJS
  while (true) {
    ns.run(await softResetManager(ns));
    await ns.sleep(10000);
  }
}
/**
 * Checks if new servers are available for hacking
 * @param {NS} ns */
async function newHackingServers(ns: NS) {
  let toBeHacked = dSe(ns, {"NAS": true});
  let toBeHackedString;
  let color;
  const reset = "\u001b[0m";
  if (toBeHacked.length === 0) {
    toBeHackedString = "Nothing new to hack";
    color = "\u001b[31m ";
  }
  else {
    for (let i in toBeHacked) {
      toBeHacked[i] += "\n";
    }
    color = "\u001b[36m ";
    toBeHackedString = toBeHacked.toString()
  }
  ns.tprint(color + toBeHackedString + reset);
}
/**
 * Continuously checks if there was a change in ram significant enough to change which awakening script to use
 *  and makes it change
 * Needs to be reviewed
 * @param {NS} ns
 * */
async function softResetManager(ns: NS) {
  let awaken;
  if ((ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) >= ns.getScriptRam("awakenV2.js")) && ns.scan().includes("Overseer") && ns.ls(ns.getHostname()).includes("Formulas.exe")) {
    awaken = "awakenV2.js";
  }
  else {
    awaken = "awaken.js";
  }
  if ((awakenAtStartOfScript !== awaken) && (awakenAtStartOfScript !== undefined)) {
    for (let i of dSe(ns)) {
      ns.ramOverride(ns.getScriptRam(ns.getScriptName()));
      ns.killall(i[0], true);
      ns.run("goPlayer.js");
      ns.spawn(ns.getScriptName(), { spawnDelay: 10 });
    }
  }
  return awaken;
}