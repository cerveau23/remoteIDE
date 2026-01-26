import {BladeburnerSkillName, NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
    let target;
    do{
        target = await ns.prompt("What buy", {type: "select", choices: ns.bladeburner.getSkillNames()}) as false | BladeburnerSkillName
    }while(target === false || target === undefined)
    let continuous = await ns.prompt("Permanent?",{type:"boolean"}) as boolean;
    ns.tprint("Target: " + target + " Permanent: " + continuous);
    ns.tprint(typeof target + typeof continuous);
    while(
        ns.bladeburner.getSkillUpgradeCost(target) < ns.bladeburner.getSkillPoints()
        || continuous){
        for(let amount = ns.bladeburner.getSkillPoints(); amount > 0; ) {
            if (ns.bladeburner.getSkillUpgradeCost(target, amount) < ns.bladeburner.getSkillPoints()) {
                ns.print("Points: " + ns.bladeburner.getSkillPoints())
                ns.print("Skill cost:" + ns.bladeburner.getSkillUpgradeCost(target))
                ns.print("Number: " + amount)
                ns.print(
                    ns.bladeburner.upgradeSkill(target, amount)
                        ? "Upgraded " + target : "Failed to upgrade");
            } else {
                ns.printf("Not enough points for %s levels", amount)
                amount = Math.floor(amount / 4)
            }
            await ns.sleep(10 );
        }
        await ns.sleep(100);
    }
}