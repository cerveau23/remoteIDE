export async function main(ns) {
    if (!ns.bladeburner.inBladeburner()) // TODO: Attempt to join BBDivision
        ns.exit();
    // noinspection InfiniteLoopJS
    while (true) {
        let waitingTime = await ns.bladeburner.nextUpdate();
        if(ns.bladeburner.getActionCurrentTime() > waitingTime + 500)
            continue;
        if(ns.getPlayer().hp.current<(ns.getPlayer().hp.max/5))
            while((ns.getPlayer().hp.current<(ns.getPlayer().hp.max/5*4))){
                let waitingTime = await ns.bladeburner.nextUpdate();
                if(ns.bladeburner.getActionCurrentTime() > waitingTime + 500)
                    continue;
                ns.bladeburner.startAction("General","Hyperbolic Regeneration Chamber");
                await ns.bladeburner.nextUpdate();
        }
        if
        (ns.bladeburner.getActionEstimatedSuccessChance("Contracts", "Bounty Hunter")[0] // Minimum chance < maximum chance
            !== ns.bladeburner.getActionEstimatedSuccessChance("Contracts", "Bounty Hunter")[1]
            && (!["Field Analysis", "Tracking", "Investigation", "Undercover Operation"]
                    .includes(ns.bladeburner.getCurrentAction()) // Don't change if I'm already spying...
                || (ns.bladeburner.getActionEstimatedSuccessChance(ns.bladeburner.getCurrentAction())[0] // ...Unless it's not even enough for that
                    < ns.bladeburner.getActionEstimatedSuccessChance(ns.bladeburner.getCurrentAction())[1]))) {
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
            let contractsSortedBySuccess = ns.bladeburner.getContractNames()
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
            await ns.bladeburner.nextUpdate();
        }
    }
}
