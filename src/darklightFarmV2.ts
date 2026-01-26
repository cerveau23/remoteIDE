import type { NS, ProcessInfo } from "@ns";

const ramUsed = {weaker: 1.75, grower: 1.75, hacker: 1.7};

/** @param {NS} ns */
export async function main(ns: NS) {
    let flag = ns.flags([["v", "darkweb"], ["h", "Darklight_Farm"]]) as {v: string, h: string};
    let operators = ["hacker.js", "grower.js", "weaker.js"];
    if (!ns.getServer(flag["v"]).hasAdminRights) {
        ns.exit();
    }
    for (let i in operators) {
        if (!ns.fileExists(operators[i], flag["h"])) {
            ns.scp(operators[i], flag["h"], "home");
        }
    }
    let i = 0;
    let currentNbrHackers = 0;
    // noinspection InfiniteLoopJS
    while (true) {
        let exp = ns.formulas.hacking.hackExp(ns.getServer(flag["v"]), ns.getPlayer());
        let growthFactor = exp / ns.getGrowTime(flag["v"]);
        let hackFactor = exp / ns.getHackTime(flag["v"]);
        let weakenFactor = exp / ns.getWeakenTime(flag["v"]);
        if (Math.floor(currentNbrHackers / 25) > 0) { //hacker compensation
            while (ns.getServerMaxRam(flag["h"]) < ns.getServerUsedRam(flag["h"]) + ramUsed.weaker * currentNbrHackers / 25) {
                await ns.sleep(1);
            }
            ns.print("Police squad deployed");
            ns.exec("weaker.js", flag["h"], Math.floor(currentNbrHackers / 25), flag["v"]);
        }
        if (ns.getServerSecurityLevel(flag["v"]) - ns.weakenAnalyze(1) * ns.ps().reduce(counting, 0) >= ns.getServerMinSecurityLevel(flag["v"]) + ns.weakenAnalyze(1, 1)) { //emergency weakening
            let idealistThreads = Math.floor((ns.getServerSecurityLevel(flag["v"]) - ns.weakenAnalyze(1) * ns.ps().reduce(counting, 0) - ns.getServerMinSecurityLevel(flag["v"])) / ns.weakenAnalyze(1, 1));
            while (ns.getServerMaxRam(flag["h"]) < ns.getServerUsedRam(flag["h"]) + ramUsed.weaker * idealistThreads) {
                await ns.sleep(1);
            }
            let threadsNumber = Math.min(Math.floor((ns.getServerMaxRam(flag["h"]) - ns.getServerUsedRam(flag["h"])) / ramUsed.weaker), idealistThreads);
            if (threadsNumber === 0) {
                threadsNumber = 1;
            }
            ns.print("SWAT squad deployed");
            ns.exec("weaker.js", flag["h"], threadsNumber, flag["v"]);
        }
        if (hackFactor < growthFactor) {
            currentNbrHackers = launcher("grower", flag["h"], flag["v"], ns);
        } else {
            /*let usedCartridges = Math.floor((ns.getServerMaxRam(flag["h"]) - ns.getServerUsedRam(flag["h"])) / ns.getScriptRam("hacker.js"));
            if (usedCartridges > 0) {ns.exec("hacker.js", flag["h"], usedCartridges, flag["v"]);}*/
            currentNbrHackers = launcher("hacker", flag["h"], flag["v"], ns);
        }
        await ns.sleep(1);
        ns.print(currentNbrHackers);
        ns.print(i);
        i++;
    }
}

function counting(total: number, value: ProcessInfo) {
    if (value["filename"] === "weaker.js") {
        return total++;
    } else {
        return total;
    }
}

/** @param {"weaker"|"hacker"|"grower"} ammo
 *  @param {string} canon
 * @param {string} target
 * @param {NS} ns*/
function launcher(ammo: "weaker"|"hacker"|"grower", canon: string, target: string, ns: NS) {
    let usedCartridges = Math.floor((ns.getServerMaxRam(canon) - ns.getServerUsedRam(canon)) / ramUsed[ammo]);
    if (usedCartridges > 0) {
        ns.print(ammo + " deployed");
        ns.exec(ammo + ".js", canon, usedCartridges, target);
    }
    ns.print(usedCartridges);
    return usedCartridges;
}