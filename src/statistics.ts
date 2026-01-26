import {NS} from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
    let rolls = 1;
    const avrGain = 3;
    let gain = 0;
    let bestGainAt = [0, 0];
    let previousGain = 0;
    let lostProba = 0;
    ns.ui.openTail();
    while ((rolls < 100) && (previousGain >= 0)) {
        lostProba = 1 - ((1 - 1 / 6) ** rolls);
        gain = avrGain * 5 / 6 - lostProba * previousGain;
        previousGain += gain;
        if (bestGainAt[1] < previousGain) {
            bestGainAt = [rolls, previousGain].toSpliced(0);
        }

        ns.print("Rolls: " + rolls + "; Average gain: " + gain + "; Best choice: " + bestGainAt[0]);
        rolls++;
    }
}