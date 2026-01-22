import {NS} from "@ns";
import {portReceiver} from "functions";

/** @param {NS} ns*/
export async function main(ns: NS) {
    ns.ui.openTail()
    let answerList = [];
    let filter = ns.args[0];
    let portData = await portReceiver(ns, "Server Map", 1, true);
    for (let i of portData) {
        //ns.print(i[0]);
        let content = ns.ls(i[0], ".cct");
        //ns.print(content);
        //ns.print(filter);
        for (let b of content) {
            if (b.includes(filter.toString())) {
                answerList.push(i[0])
            }
        }
    }
    ns.print(answerList);
    return answerList;
}