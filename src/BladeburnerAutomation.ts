import {BladeburnerActionType, BladeburnerActionName, NS} from "@ns";

export async function main(ns : NS ) {
    if (!ns.bladeburner.inBladeburner()) // TODO: Attempt to join BBDivision test
        ns.exit();
    // noinspection InfiniteLoopJS
    while (true) {
        let waitingTime = await ns.bladeburner.nextUpdate();
        if(ns.bladeburner.getActionCurrentTime() > waitingTime + 500)
            continue;
        while((ns.bladeburner.getCityEstimatedPopulation(ns.bladeburner.getCity()) < 1000 * 1000 * 1000)
        && ns.bladeburner.getActionEstimatedSuccessChance("Operations", "Assassination")[0] // Minimum chance < maximum chance
        === ns.bladeburner.getActionEstimatedSuccessChance("Operations", "Assassination")[1]) {
            const cityNames = Object.values(ns.enums.CityName);
            let newCity = Math.floor(Math.random() * Object.values(ns.enums.CityName).length);
            if(cityNames[newCity] === ns.bladeburner.getCity())
                newCity = ++newCity % cityNames.length ;
            ns.bladeburner.switchCity(cityNames[newCity])
        }
        if(ns.getPlayer().hp.current<(ns.getPlayer().hp.max/5)){
            ns.singularity.hospitalize();
            /*while((ns.getPlayer().hp.current<(ns.getPlayer().hp.max/5*4))){
                let waitingTime = await ns.bladeburner.nextUpdate();
                if(ns.bladeburner.getActionCurrentTime() > waitingTime + 500)
                    continue;
                ns.bladeburner.startAction("General","Hyperbolic Regeneration Chamber");
                await ns.bladeburner.nextUpdate();*/
        }
        if
        (ns.bladeburner.getActionEstimatedSuccessChance("Contracts", "Bounty Hunter")[0] // Minimum chance < maximum chance
            !== ns.bladeburner.getActionEstimatedSuccessChance("Contracts", "Bounty Hunter")[1]
            && (!["Field Analysis", "Tracking", "Investigation", "Undercover Operation"]
                    .includes((ns.bladeburner.getCurrentAction()??"null").toString()) // Don't change if I'm already spying...
                || (ns.bladeburner.getActionEstimatedSuccessChance(<`${BladeburnerActionType}`> ns.bladeburner.getCurrentAction()?.type ?? "General",<`${BladeburnerActionName}`>   ns.bladeburner.getCurrentAction()?.name ?? "Diplomacy")[0] // ...Unless it's not even enough for that
                    < ns.bladeburner.getActionEstimatedSuccessChance(<`${BladeburnerActionType}`>  ns.bladeburner.getCurrentAction()?.type ?? "General", <`${BladeburnerActionName}`> ns.bladeburner.getCurrentAction()?.name ?? "Diplomacy")[1]))) {
            ns.bladeburner.startAction("General", "Field Analysis");
            await ns.bladeburner.nextUpdate();
            continue;
        }
        let [currentStam, maxStam] = ns.bladeburner.getStamina()
        if ((currentStam * 2) < maxStam) {
            while (ns.bladeburner.getStamina()[0] < (ns.bladeburner.getStamina()[1] - 1)) {
                let waitingTime = await ns.bladeburner.nextUpdate();
                if(ns.bladeburner.getActionCurrentTime() > waitingTime + 500)
                    continue;
                if ( (ns.bladeburner.getTeamSize() < 100) && (ns.bladeburner.getActionEstimatedSuccessChance("General", "Recruitment")[0] > 0.75)) {
                    ns.bladeburner.startAction("General", "Recruitment");
                }
                else {
                    ns.bladeburner.startAction("General", "Hyperbolic Regeneration Chamber");
                }
                await ns.bladeburner.nextUpdate();
            }
        }
        else {
            /*let contractsSortedBySuccess = ns.bladeburner.getContractNames()
            contractsSortedBySuccess.sort(
                (a,b)=> {
                    return Math.pow(ns.bladeburner.getActionEstimatedSuccessChance("Contracts", b)[0], 3) * ns.bladeburner.getActionRepGain("Contracts", b) / (ns.bladeburner.getActionTime("Contracts", b)/1000)
                        - Math.pow(ns.bladeburner.getActionEstimatedSuccessChance("Contracts", a)[0], 3) * ns.bladeburner.getActionRepGain("Contracts", a) / (ns.bladeburner.getActionTime("Contracts", a)/1000)
                })
            for (let contract of contractsSortedBySuccess)
                if (ns.bladeburner.getActionCountRemaining("Contracts", contract) >= 1) {
                    ns.bladeburner.startAction("Contracts", contract);
                    break;
                }
            await ns.bladeburner.nextUpdate();*/
            let contractsSortedBySuccess: [`${BladeburnerActionType}`, `${BladeburnerActionName}`][] = [["Contracts","Tracking"], ["Contracts","Bounty Hunter"], ["Contracts","Retirement"], ["Operations", "Investigation"], ["Operations", "Undercover Operation"], ["Operations", "Assassination"]]
            contractsSortedBySuccess.sort(
                (a,b)=> {
                    return Math.pow(ns.bladeburner.getActionEstimatedSuccessChance(b[0], b[1])[0], 3) * ns.bladeburner.getActionRepGain(b[0], b[1]) / (ns.bladeburner.getActionTime(b[0], b[1])/1000)
                        - Math.pow(ns.bladeburner.getActionEstimatedSuccessChance(a[0], a[1])[0], 3) * ns.bladeburner.getActionRepGain(a[0], a[1]) / (ns.bladeburner.getActionTime(a[0], a[1])/1000)
                })
            for (let contract of contractsSortedBySuccess)
                if ((ns.bladeburner.getActionCountRemaining(contract[0], contract[1]) >= 1)
                    && (ns.bladeburner.getActionEstimatedSuccessChance(contract[0], contract[1]) [0] >= 0.8)) {
                    ns.bladeburner.startAction(contract[0], contract[1]);
                    break;
                }
            await ns.bladeburner.nextUpdate();
        }
    }
}
