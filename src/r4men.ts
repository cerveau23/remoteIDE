// noinspection InfiniteLoopJS

import { NS } from "@ns";

let target = ('');
export async function main(ns: NS) {
  target = ns.args[0].toString();
  while (true) {
    await ns.hack(target);
    await ns.grow(target);
    for (let i = 0; i < 3; i++) { 
      await ns.weaken(target);
    }
  }
}