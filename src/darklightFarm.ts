// noinspection InfiniteLoopJS

import { NS } from "@ns";

let target = ('darkweb');
export async function main(ns : NS) {
  while (true) {
    for (let i = 0; i < 10; i++) { 
      await ns.grow(target);
    }
    await ns.sleep(10);
  }
}