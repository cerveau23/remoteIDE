import {BladeburnerSkillName, NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
    let target;
    do{
        target = await ns.prompt("What buy", {type: "select", choices: ns.bladeburner.getSkillNames()}) as false | BladeburnerSkillName
    }while(typeof target === "boolean")
    let continuous = await ns.prompt("Permanent?",{type:"boolean"}) as boolean;
    ns.tprint("Target: " + target + " Permanent: " + continuous);
    ns.tprint(typeof target + typeof continuous);
    while(
        ns.bladeburner.getSkillUpgradeCost(target) < ns.bladeburner.getSkillPoints()
        || continuous){
        if(ns.bladeburner.getSkillUpgradeCost(target) < ns.bladeburner.getSkillPoints())
            ns.print(
                ns.bladeburner.upgradeSkill(
                    target,
                    Math.floor(ns.bladeburner.getSkillPoints() / ns.bladeburner.getSkillUpgradeCost(target) ))
                ? "Upgraded "+target : "Failed to upgrade");
        else{
            ns.print("Not enough points")
        }
        await ns.sleep(100);
    }
}