// noinspection InfiniteLoopJS

import {NS} from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
    while (true) {
        if (
            ns.hacknet.maxNumNodes() > ns.hacknet.numNodes()
            && ns.hacknet.getPurchaseNodeCost() <= ns.getPlayer().money) {
            ns.hacknet.purchaseNode();
        }
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            if (ns.getPlayer().money >= ns.hacknet.getRamUpgradeCost(i)
                && ns.hacknet.getRamUpgradeCost(i) !== Infinity) {
                ns.hacknet.upgradeRam(i);
            }
        }
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getCoreUpgradeCost(i) === Infinity
                || ns.hacknet.getLevelUpgradeCost(i) === Infinity) {
                if (ns.hacknet.getCoreUpgradeCost(i) === Infinity
                    && ns.hacknet.getLevelUpgradeCost(i) !== Infinity
                    && ns.getPlayer().money >= ns.hacknet.getLevelUpgradeCost(i, 10)) {
                    ns.hacknet.upgradeLevel(i, 10);
                }
                if (ns.hacknet.getLevelUpgradeCost(i) === Infinity
                    && ns.hacknet.getCoreUpgradeCost(i) !== Infinity
                    && ns.getPlayer().money >= ns.hacknet.getCoreUpgradeCost(i)) {
                    ns.hacknet.upgradeCore(i);
                }
                continue;
            }
            if (ns.getPlayer().money >= ns.hacknet.getCoreUpgradeCost(i)
                && ns.getPlayer().money >= ns.hacknet.getLevelUpgradeCost(i, 10)) {
                if (ns.hacknet.getCoreUpgradeCost(i) >= ns.hacknet.getLevelUpgradeCost(i, 10) * 1.8) {
                    ns.hacknet.upgradeLevel(i, 10);
                } else {
                    ns.hacknet.upgradeCore(i);
                }
            } else {
                if (ns.getPlayer().money >= ns.hacknet.getLevelUpgradeCost(i, 10)
                    && ns.hacknet.getCoreUpgradeCost(i) > ns.hacknet.getLevelUpgradeCost(i, 10) * 1.8) {
                    ns.hacknet.upgradeLevel(i, 10);
                }
            }
        }
        await ns.sleep(1000);
    }
}