import {dSe} from "depthScanner";

/**let previousExp = 0;
 let amountSame = 0;*/
let expValues = [];
let maxExp = 0;
let maxExpAmount = 0;
let truens;
let bestServers = {0: []};

/**
 * Takes the server map and sends it to {@link checkExp} for sorting.
 * TODO: Adapt this doc to V2!
 * @return Once sorted, it returns the list of servers, the maximum possible exp and the number of servers giving that amount
 *
 * The list goes in the descending order of efficiency
 * @param {NS} ns*/
export async function main(ns) {
    ns.ui.openTail();
    truens = ns;
    let mapp = await dSe(ns);
    mapp.forEach(checkExp);
    //ns.print("Servers same exp: " + amountSame);
    ns.print("Max exp: " + maxExp + " Amount: " + maxExpAmount);
    ns.printRaw("Best Training Servers: " + bestServers[maxExp]);
    expValues.sort(function (a, b) {
        return b - a
    });
    return [bestServers, maxExp, maxExpAmount, expValues];
}

/**
 * A function that analyses a server and records whether it is better than the previously known
 *  best training server
 * @param {string} value The name of the server to analyse TODO: Check if it's really a string!
 * @return void It doesn't return anything, instead it affects global variables inside the script
 */
function checkExp(value) {
    let exp = truens.formulas.hacking.hackExp(truens.getServer(value[0]), truens.getPlayer());
    //truens.print(exp + " exp;" + Object.values(bestServers));
    //if (exp == previousExp) { amountSame++; }
    if (exp === maxExp) {
        maxExpAmount++;
    }
    if (exp > maxExp) {
        maxExp = exp;
        maxExpAmount = 1;
        bestServers[exp] = [value[0]];
        expValues.push(exp);
    } else {
        if (bestServers[exp] === undefined) {
            bestServers[exp] = [value[0]];
            expValues.push(exp);
        } else {
            bestServers[exp].push(value[0]);
        }
    }
    //previousExp = exp;
}

/**
 * Calls {@link main} from bestTrainingServers.js
 * TODO: Adapt this doc to V2!
 * @return the list of servers, the maximum possible exp and the number of servers giving that amount
 *
 * The list goes in the descending order of efficiency
 * @param {NS} ns */
export default async function bTSe(ns) {
    //await ns.tprint(argument);
    let answer = await main(ns);
    //await ns.tprint (answer);
    //await ns.tprint (typeof answer);
    return answer;
}