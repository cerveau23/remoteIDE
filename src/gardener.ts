// noinspection InfiniteLoopJS

import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  while(true) { //@ignore-infinite
    let file = ns.read("targets.txt");
    let business_list = file.split(',');
    business_list = business_list.map(element => element.trim());
    for(let i in business_list){
      await ns.grow(business_list[i]);
    }
  }
}