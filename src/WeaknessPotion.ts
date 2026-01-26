// noinspection InfiniteLoopJS

import type {NS} from "@ns";

let target = ('');

export async function main(ns: NS) {
    target = ns.args[0].toString();
    while (true) {
        await ns.weaken(target);
    }
}