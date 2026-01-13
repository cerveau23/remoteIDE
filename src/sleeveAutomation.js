/** @param {NS} ns */
export async function main(ns) {
    //@ignore-infinite
    while(true){
        for(let sleeveNbr = 0; sleeveNbr < ns.sleeve.getNumSleeves(); ++sleeveNbr){
            let sleeveStats = ns.sleeve.getSleeve(sleeveNbr);
            if(sleeveStats.sync < 100)
                ns.sleeve.setToSynchronize(sleeveNbr);
            else if(sleeveStats.shock < 100)
                ns.sleeve.setToShockRecovery(sleeveNbr);
            else if(Object.keys(ns.getPlayer().skills).some((value)=>value<100))
                for(let stat of Object.keys(ns.getPlayer().skills)) if(stat < 100){
                    ns.sleeve.setToGymWorkout(sleeveNbr, "Powerhouse Gym", ns.enums.GymType[stat]);
                }
                else
                if(!ns.sleeve.setToBladeburnerAction(sleeveNbr,"Field Analysis"))
                    ns.sleeve.setToGymWorkout(sleeveNbr,"Powerhouse Gym", "agi");
        }
        await ns.sleep(1000);
    }
}