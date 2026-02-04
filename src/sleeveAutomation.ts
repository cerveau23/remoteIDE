import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
    //@ignore-infinite
    // noinspection InfiniteLoopJS
    while(true){
        for(let sleeveNbr = 0; sleeveNbr < ns.sleeve.getNumSleeves(); ++sleeveNbr){
            let sleeveStats = ns.sleeve.getSleeve(sleeveNbr);
            if(sleeveStats.sync < 100)
                ns.sleeve.setToSynchronize(sleeveNbr);
            else if(sleeveStats.shock < 100)
                ns.sleeve.setToShockRecovery(sleeveNbr);
            else if(Object.values(ns.getPlayer().skills).some((value)=>value<100))
                for(let stat of Object.entries(ns.getPlayer().skills)) if(stat[1] < 100 && Object.keys(ns.enums.GymType).includes(stat[0])){
                    ns.sleeve.setToGymWorkout(sleeveNbr, "Powerhouse Gym", ns.enums.GymType[<"strength"|"defense"|"dexterity"|"agility">stat[0]]);
                }
                else
                if(!ns.sleeve.setToBladeburnerAction(sleeveNbr,"Field Analysis"))
                    ns.sleeve.setToGymWorkout(sleeveNbr,"Powerhouse Gym", "agi");
        }
        await ns.sleep(1000);
    }
}