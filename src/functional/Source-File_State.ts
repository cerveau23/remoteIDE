import { NS } from "@ns";

export class SourceFile_State_Lite {
    readonly bladeburner: boolean;
    readonly corporation: boolean;
    readonly formulas: boolean;
    readonly gang: boolean;
    readonly stanek: boolean;
    readonly stock: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Lite]?: boolean}) {
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

        this.stanek =
            desiredKnowledge.stanek ?
                "stanek" in ns &&
                typeof (ns as any).stanek?.clearGift === "function"
                : false;

        this.stock =
            desiredKnowledge.stock ?
                "stock" in ns &&
                typeof (ns as any).stock?.getBonusTime === "function"
                : false;
    }
}

export class SourceFile_State_Go extends SourceFile_State_Lite{
    readonly go: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Go]?: boolean}) {
        super(ns, desiredKnowledge);

        this.go =
            desiredKnowledge.go ?
                "go" in ns &&
                typeof (ns as any).go?.getCheatCount === "function" // Costs 1 GB
                : false;
    }

}

export class SourceFile_State_Grafting_N_Sleeve extends SourceFile_State_Lite{
    readonly grafting: boolean;
    readonly sleeve: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Grafting_N_Sleeve]?: boolean}) {
        super(ns, desiredKnowledge);

        this.grafting =
            desiredKnowledge.grafting || desiredKnowledge.sleeve ?
                "grafting" in ns &&
                typeof (ns as any).grafting?.waitForOngoingGrafting === "function" // Costs 1GB
                : false;

        this.sleeve =
            desiredKnowledge.grafting || desiredKnowledge.sleeve ?
                "grafting" in ns &&
                typeof (ns as any).grafting?.waitForOngoingGrafting === "function" // Costs 1GB. Copy of Grafting since it's the same function and if there's one there's the other
                : false;
    }

}

export class SourceFile_State_Hacknet extends SourceFile_State_Lite{
    readonly hacknet: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Hacknet]?: boolean}) {
        super(ns, desiredKnowledge);

        this.hacknet =
            desiredKnowledge.hacknet ?
                "hacknet" in ns &&
                typeof (ns as any).hacknet?.getCacheUpgradeCost === "function"
                : false;// Costs 4GB
    }

}

export class SourceFile_State_Singularity extends SourceFile_State_Lite{
    readonly singularity: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Singularity]?: boolean}) {
        super(ns, desiredKnowledge);

        this.singularity =
            desiredKnowledge.singularity ?
                "singularity" in ns &&
                typeof (ns as any).singularity?.isFocused === "function"
                : false; // Costs 1.6 GB
    }

}

export class SourceFile_State_Advanced_Stock extends SourceFile_State_Lite{
    readonly advancedStock: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Advanced_Stock]?: boolean}) {
        super(ns, desiredKnowledge);

        this.advancedStock =
            desiredKnowledge.advancedStock ?
                "stock" in ns &&
                typeof (ns as any).stock?.buyShort === "function"
                : false; // Costs 2.5 GB
    }

}