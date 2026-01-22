import { NS } from "@ns";

export class SourceFile_State {
    readonly bladeburner: boolean;
    readonly corporation: boolean;
    readonly formulas: boolean;
    readonly gang: boolean;
    readonly go: boolean;
    readonly grafting: boolean;
    readonly hacknet: boolean;
    readonly singularity: boolean;
    readonly sleeve: boolean;
    readonly stanek: boolean;
    readonly stock: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State]?: boolean}) {
        ns.ramOverride(1.6 + Number(desiredKnowledge.hacknet) * 4 + Number(desiredKnowledge.go) + Number(desiredKnowledge.grafting || desiredKnowledge.sleeve) + Number(desiredKnowledge.singularity) * 0.1)
        this.bladeburner =
            desiredKnowledge.bladeburner ?
                "bladeburner" in ns &&
                typeof (ns as any).bladeburner?.getContractNames === "function"
                : false;

        this.corporation =
            desiredKnowledge.corporation ?
                "corporation" in ns &&
                typeof (ns as any).corporation?.canCreateCorporation === "function"
                : false;

        this.formulas =
            desiredKnowledge.formulas ?
                "formulas" in ns &&
                typeof (ns as any).formulas?.bladeburner.skillMaxUpgradeCount === "function"
                : false;

        this.gang =
            desiredKnowledge.gang ?
                "gang" in ns &&
                typeof (ns as any).gang?.getBonusTime === "function"
                : false;

        this.go =
            desiredKnowledge.go ?
                "go" in ns &&
                typeof (ns as any).go?.getCheatCount === "function" // Costs 1GB?
                : false;

        this.grafting =
            desiredKnowledge.grafting || desiredKnowledge.sleeve ?
                "grafting" in ns &&
                typeof (ns as any).grafting?.waitForOngoingGrafting === "function" // Costs 1GB?
                : false;

        this.hacknet =
            desiredKnowledge.hacknet ?
                "hacknet" in ns &&
                typeof (ns as any).hacknet?.getCacheUpgradeCost === "function"
                : false;// Costs 1GB?

        this.singularity =
            desiredKnowledge.singularity ?
                "singularity" in ns &&
                typeof (ns as any).singularity?.isFocused === "function"
                : false;

        this.sleeve =
            desiredKnowledge.grafting || desiredKnowledge.sleeve ?
                "grafting" in ns &&
                typeof (ns as any).grafting?.waitForOngoingGrafting === "function" // Costs 1GB? Copy of Grafting since it's the same function and if there's one there's the other
                : false;

        this.stanek =
            desiredKnowledge.stanek ?
                "singularity" in ns &&
                typeof (ns as any).stanek?.clearGift === "function"
                : false;

        this.stock =
            desiredKnowledge.stock ?
                "singularity" in ns &&
                typeof (ns as any).stock?.getBonusTime === "function"
                : false;
    }
}