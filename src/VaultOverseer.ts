// noinspection InfiniteLoopJS

import type {NS, ProcessInfo} from "@ns";

let ramUsed = {weaker: 1.75, grower: 1.75, hacker: 1.7};

/** @param {NS} ns */
export async function main(ns: NS) {
    let flag = ns.flags([["v", "undefined"], ["h", "undefined"]]) as { v: string, h: string };
    if (flag.h === "undefined") {
        flag.h = flag.v;
    }
    if (ns.getServerMaxRam(flag["h"]) === 0 || ns.getServerMoneyAvailable(flag["v"]) === 0) {
        ns.exit();
    }
    let operators = ["hacker.js", "grower.js", "weaker.js"];
    for (let i in operators) {
        if (!ns.fileExists(operators[i], flag["h"])) {
            ns.scp(operators[i], flag["h"], "home");
        }
    }
    let i = 0;
    let currentNbrHackers = 0;
    while (true) {
        let exp = ns.formulas.hacking.hackExp(ns.getServer(flag["v"]), ns.getPlayer());
        let growthFactor = exp / (10 * ns.getGrowTime(flag["v"]));
        let hackFactor = exp / ns.getHackTime(flag["v"]);
        let weakenFactor = exp / (10 * ns.getWeakenTime(flag["v"]));
        if (currentNbrHackers / 25 > 0) { //hacker compensation
            let breaker = 1;
            do {
                await ns.sleep(1);
                if (ns.getServerUsedRam(flag["h"]) === 0) {
                    breaker = Infinity;
                    break;
                }
            } while (ns.getServerMaxRam(flag["h"]) < ns.getServerUsedRam(flag["h"]) + ramUsed.weaker * currentNbrHackers / 25);
            ns.print("Police squad deployed");
            ns.exec("weaker.js", flag["h"], Math.floor(Math.max(Math.min(currentNbrHackers * breaker / 25, (ns.getServerMaxRam(flag["h"]) - ns.getServerUsedRam(flag["h"])) / ramUsed.weaker), 1)), flag["v"]);
        }
        if (ns.getServerSecurityLevel(flag["v"]) - ns.weakenAnalyze(1) * ns.ps().reduce(counting, 0) >= ns.getServerMinSecurityLevel(flag["v"]) + ns.weakenAnalyze(1, 1)) { //emergency weakening
            let breaker = 1;
            let idealistThreads = Math.floor((ns.getServerSecurityLevel(flag["v"]) - ns.weakenAnalyze(1) * ns.ps().reduce(counting, 0) - ns.getServerMinSecurityLevel(flag["v"])) / ns.weakenAnalyze(1, 1));
            do {
                await ns.sleep(1);
                if (ns.getServerUsedRam(flag["h"]) === 0) {
                    breaker = Infinity;
                    break;
                }
            } while (ns.getServerMaxRam(flag["h"]) < ns.getServerUsedRam(flag["h"]) + ramUsed.weaker * idealistThreads);
            let threadsNumber = Math.min(Math.floor((ns.getServerMaxRam(flag["h"]) - ns.getServerUsedRam(flag["h"])) / ramUsed.weaker), idealistThreads * breaker);
            if (threadsNumber === 0) {
                threadsNumber = 1;
            }
            if (isNaN(threadsNumber)) {
                ns.toast("Existential dread about numbers unlocked", "error");
                ns.exit();
            }
            ns.print("SWAT squad deployed");
            ns.exec("weaker.js", flag["h"], threadsNumber, flag["v"]);
        }
        currentNbrHackers = 0;
        if (ns.getServerMaxMoney(flag["v"]) >= ns.getServerMoneyAvailable(flag["v"]) * (1 + ns.getServerGrowth(flag["v"]) / 100)) { // Max Growth!
            let breaker = 1;
            let growthMultiplier = 1 + ns.getServerGrowth(flag["v"]) / 100;
            let idealistThreads = Math.floor(Math.log(ns.getServerMaxMoney(flag["v"]) / ns.getServerMoneyAvailable(flag["v"])) / Math.log(growthMultiplier));
            do {
                await ns.sleep(1);
                if (ns.getServerUsedRam(flag["h"]) === 0) {
                    breaker = Infinity;
                    break;
                }
            } while (ns.getServerMaxRam(flag["h"]) < ns.getServerUsedRam(flag["h"]) + ramUsed.grower * idealistThreads);
            let threadsNumber = Math.min(Math.floor((ns.getServerMaxRam(flag["h"]) - ns.getServerUsedRam(flag["h"])) / ramUsed.grower), idealistThreads * breaker);
            if (threadsNumber === 0) {
                threadsNumber = 1;
            }
            if (isNaN(threadsNumber)) {
                ns.toast("Existential dread about numbers unlocked", "error");
                ns.exit();
            }
            ns.print("Farmer squad deployed");
            ns.exec("grower.js", flag["h"], threadsNumber, flag["v"]);
            currentNbrHackers += threadsNumber;
        }
        if (hackFactor < growthFactor) {
            currentNbrHackers += launcher("grower", flag["h"], flag["v"], ns);
        } else {
            /*let usedCartridges = Math.floor((ns.getServerMaxRam(flag["v"]) - ns.getServerUsedRam(flag["v"])) / ns.getScriptRam("hacker.js"));
            if (usedCartridges > 0) {ns.exec("hacker.js", flag["v"], usedCartridges, flag["v"]);}*/
            currentNbrHackers += launcher("hacker", flag["h"], flag["v"], ns);
        }
        await ns.sleep(1);
        ns.print(currentNbrHackers);
        ns.print(i);
        i++;
    }
}

function counting(total: number, value: ProcessInfo): number {
    if (value["filename"] === "weaker.js") {
        return total++;
    } else {
        return total;
    }
}

/** @param {string} ammo
 *  @param {string} canon
 * @param {string} target
 * @param {NS} ns*/
function launcher(ammo: "weaker" | "grower" | "hacker", canon: string, target: string, ns: NS) {
    let usedCartridges = Math.floor((ns.getServerMaxRam(canon) - ns.getServerUsedRam(canon)) / ramUsed[ammo]);
    if (usedCartridges > 0) {
        ns.print(ammo + " deployed");
        ns.exec(ammo + ".js", canon, usedCartridges, target);
    }
    ns.print(usedCartridges);
    return usedCartridges;
}

/** @param {NS} ns
 * @param {...} argument
 */
export default async function vOe(ns: NS, ...argument: []) {
    //await ns.tprint(argument);
    let answer = await main(ns, ...argument);
    //await ns.tprint (answer);
    //await ns.tprint (typeof answer);
    return answer;
}