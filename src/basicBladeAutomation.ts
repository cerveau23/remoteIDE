import {BladeburnerActionName, BladeburnerActionType, BladeburnerContractName, NS} from "@ns";

let mode: string;

/** @param {NS} ns */
export async function main(ns: NS) {
    while (true) {
        let waitingTime = await ns.bladeburner.nextUpdate();
        handlePlayer(ns, waitingTime)
        handleSleeve(ns, waitingTime)

    }
}

/** @param {NS} ns
 * @param {Number} waitingTime
 */
function handlePlayer(ns: NS, waitingTime: number) {
    let currentAction = (ns.bladeburner.getCurrentAction() ?? {name: "Training", type: "General"}) as {name: BladeburnerActionName, type: BladeburnerActionType};
    // ns.print(ns.bladeburner.getActionCurrentTime(currentAction.type, currentAction.name))
    if (ns.bladeburner.getActionTime(currentAction.type as BladeburnerActionType , currentAction.name as BladeburnerActionName) > (waitingTime + 500))
        if (ns.bladeburner.getActionCurrentTime() > (waitingTime + 500) && ns.bladeburner.getActionCurrentTime() !== ns.bladeburner.getActionTime(currentAction.type, currentAction.name))
            return;

    ns.print("Checking what to do.")

    if ((mode === "Diplomacy")
        && (ns.bladeburner.getCityChaos(ns.bladeburner.getCity()) > 10)
    ) {
        if (currentAction.name !== "Diplomacy") {
            ns.print("Starting to do diplomacy")
            ns.bladeburner.startAction("General", "Diplomacy");
        }
        return;
    }

    if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity()) > 10000) {
        mode = "Diplomacy";
        ns.print("Choosing to do diplomacy")
        return;
    }

    mode = "Incite";
    ns.print("Choosing to incite violence")

    if (currentAction.name !== "Incite Violence") {
        ns.print("Starting to incite violence")
        ns.bladeburner.startAction("General", "Incite Violence");
    }
}

type SleeveBladeburnerTask = {
    type: "BLADEBURNER"
    actionType: "General" | "Contracts"
    actionName: BladeburnerActionName | `${BladeburnerActionName}`
    cyclesWorked: number
    cyclesNeeded: number
    nextCompletion: Promise<any>
    tasksCompleted: number
}

    /** @param {NS} ns
 * @param {Number} waitingTime
 */
function handleSleeve(ns: NS, waitingTime: number) {
    let basicBBTask: SleeveBladeburnerTask = {type: "BLADEBURNER",
        actionType: "General",
        actionName: "Training",
        cyclesWorked: 0,
        cyclesNeeded: 1,
        nextCompletion: new Promise<void>(function<T>(p1: (value: (PromiseLike<T> | T)) => void,p2: (reason?: any) => void){}),
        tasksCompleted: 0}
    let currentAction = ns.sleeve.getTask(0) ?? basicBBTask as SleeveBladeburnerTask ;
    if ( currentAction.type !== "BLADEBURNER" )
        currentAction = basicBBTask;
    else
        currentAction = currentAction as SleeveBladeburnerTask;
    //ns.print(ns.bladeburner.getActionCurrentTime(currentAction.actionType, currentAction.actionName))
    if (currentAction.cyclesWorked > (5) && currentAction.cyclesWorked !== currentAction.cyclesNeeded)
        return;

    ns.print("Checking what to do.")

    if (ns.bladeburner.getActionEstimatedSuccessChance("Contracts", "Bounty Hunter", 0)[0] < 0.9) {
        ns.print("Too low chances for sleeve, checking how to change that")
        if (ns.bladeburner.getActionEstimatedSuccessChance("Contracts", "Bounty Hunter", 0)[0] !== ns.bladeburner.getActionEstimatedSuccessChance("Contracts", "Bounty Hunter", 0)[1])
            ns.sleeve.setToBladeburnerAction(0, "Field Analysis")
        else if (ns.bladeburner.getCityChaos(ns.bladeburner.getCity()) > 10000)
            ns.sleeve.setToBladeburnerAction(0, "Diplomacy");
        else
            ns.sleeve.setToBladeburnerAction(0, "Training")

        return;
    }

    if (ns.bladeburner.getActionCountRemaining("Contracts", "Bounty Hunter") > 1) {
        if (currentAction.actionName !== "Bounty Hunter")
            ns.sleeve.setToBladeburnerAction(0, "Take on contracts", "Bounty Hunter" as BladeburnerContractName.BountyHunter)
        return;
    }

    if (ns.bladeburner.getActionCountRemaining("Contracts", "Retirement") > 1) {
        if (currentAction.actionName !== "Retirement")
            ns.sleeve.setToBladeburnerAction(0, "Take on contracts", "Retirement" as BladeburnerContractName.Retirement)
        return;
    }

    /*if( ns.bladeburner.getActionCountRemaining("Contracts", "Tracking") > 1
        && currentAction.name !== "Tracking"){
            ns.bladeburner.startAction("Contracts", "Tracking")
            return;
    }*/

    ns.sleeve.setToBladeburnerAction(0, "Infiltrate Synthoids")
}