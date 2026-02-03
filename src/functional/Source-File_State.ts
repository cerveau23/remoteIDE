// noinspection JSUnusedGlobalSymbols

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

type baseConstructor<T = {}> = new (ns: NS, desiredKnowledge: {[K in keyof T]?: boolean}) => any;

// type Constructor<T> = new (...args: ConstructorParameters<baseConstructor<T>>) => T;

type InstanceOf<T extends baseConstructor> = T extends new (...args: any[]) => infer R ? R : never;

type ExtendInstance<TBase extends baseConstructor, TExtra> = InstanceOf<TBase> & TExtra;

type ConstructorReturn<T extends baseConstructor, TExtra> = new (ns: NS, desiredKnowledge: {[K in keyof T]?: boolean}) => ExtendInstance<T, TExtra>

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the upgraded go module.<br>
 * The go module needs to be added to the object passed to the constructor, allowing for dynamic addition.
 * If the go module should ALWAYS be checked, see {@link WithGo `WithGo`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly go: boolean } = new (WithGoChoice(SourceFile_State_Lite))(ns, {go:true});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly go: boolean}>}
 * @see WithGo
 * @constructor
 */
export function WithGoOption<TBase extends baseConstructor>(Base: TBase):ConstructorReturn<TBase, { readonly go: boolean}>{
    //@ts-expect-error
    return class extends Base {
        readonly go: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean} & {go: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.go =
                desiredKnowledge.go ?
                    "go" in ns &&
                    typeof (ns as any).go?.getCheatCount === "function" // Costs 1 GB
                    : false;
        }
    };
}

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the upgraded go module.<br>
 * The go module **does not need** to be added to the object passed to the constructor, allowing for static typing.
 * If the go module is not ALWAYS checked, see {@link WithGoOption `WithGoOption`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly go: boolean } = new (WithGo(SourceFile_State_Lite))(ns, {});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly go: boolean}>}
 * @see WithGoOption
 * @constructor
 */
export function WithGo<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, { readonly go: boolean}>  {
    //@ts-expect-error
    return class extends Base {
        readonly go: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof InstanceOf<TBase>]?: boolean}) {
            super(ns, desiredKnowledge);

            this.go =
                    "go" in ns &&
                    typeof (ns as any).go?.getCheatCount === "function" // Costs 1 GB
        }
    };
}


/*export class SourceFile_State_Go extends SourceFile_State_Lite{
    readonly go: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Go]?: boolean}) {
        super(ns, desiredKnowledge);

        this.go =
            desiredKnowledge.go ?
                "go" in ns &&
                typeof (ns as any).go?.getCheatCount === "function" // Costs 1 GB
                : false;
    }

}*/

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the grafting and sleeve modules.<br>
 * The grafting and sleeve modules needs to be added to the object passed to the constructor, allowing for dynamic addition.
 * If the grafting and sleeve modules should ALWAYS be checked, see {@link WithGraftingNSleeve `WithGraftingNSleeve`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & {readonly grafting: boolean} & {readonly sleeve: boolean} = new (WithGraftingNSleeve(SourceFile_State_Lite))(ns, {grafting:true; sleeve: false});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly grafting: boolean; readonly sleeve: boolean}>}
 * @see WithGraftingNSleeve
 * @constructor
 */
export function WithGraftingNSleeveOptions<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, {readonly grafting: boolean; readonly sleeve: boolean}>  {
    //@ts-expect-error
    return class extends Base {
        readonly grafting: boolean;
        readonly sleeve: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean} & {grafting: boolean} & {sleeve: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

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
    };
}

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the grafting and sleeve modules.<br>
 * The grafting and sleeve modules **does not need** to be added to the object passed to the constructor, allowing for static typing.
 * If the grafting and sleeve modules is not ALWAYS checked, see {@link WithGraftingNSleeveOption `WithGraftingNSleeveOption`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & {readonly grafting: boolean} & {readonly sleeve: boolean} = new (WithGraftingNSleeve(SourceFile_State_Lite))(ns, {});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly grafting: boolean; readonly sleeve: boolean}>}
 * @see WithGraftingNSleeveOptions
 * @constructor
 */
export function WithGraftingNSleeve<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, {readonly grafting: boolean; readonly sleeve: boolean}>  {
    //@ts-expect-error
    return class extends Base {
        readonly grafting: boolean;
        readonly sleeve: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.grafting =
                    "grafting" in ns &&
                    typeof (ns as any).grafting?.waitForOngoingGrafting === "function"; // Costs 1GB

            this.sleeve =
                    "grafting" in ns &&
                    typeof (ns as any).grafting?.waitForOngoingGrafting === "function"; // Costs 1GB. Copy of Grafting since it's the same function and if there's one there's the other
        }
    };
}

/*export class SourceFile_State_Grafting_N_Sleeve extends SourceFile_State_Lite{
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

}*/

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the hacknet module.<br>
 * The hacknet module needs to be added to the object passed to the constructor, allowing for dynamic addition.
 * If the hacknet module should ALWAYS be checked, see {@link WithHacknet `WithHacknet`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly hacknet: boolean } = new (WithHacknetChoice(SourceFile_State_Lite))(ns, {hacknet:true});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly hacknet: boolean}>}
 * @see WithHacknet
 * @constructor
 */
export function WithHacknetOption<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, { readonly hacknet: boolean}> {
    //@ts-expect-error
    return class extends Base {
        readonly hacknet: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean} & {hacknet: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.hacknet =
                desiredKnowledge.hacknet ?
                    "hacknet" in ns &&
                    typeof (ns as any).hacknet?.getCacheUpgradeCost === "function"
                    : false;// Costs 4GB
        }
    };
}

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the hacknet module.<br>
 * The hacknet module **does not need** to be added to the object passed to the constructor, allowing for static typing.
 * If the hacknet module is not ALWAYS checked, see {@link WithHacknetOption `WithHacknetOption`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly hacknet: boolean } = new (WithHacknet(SourceFile_State_Lite))(ns, {});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly hacknet: boolean}>}
 * @see WithHacknetOption
 * @constructor
 */
export function WithHacknet<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, { readonly hacknet: boolean}> {
    //@ts-expect-error
    return class extends Base {
        readonly hacknet: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.hacknet =
                    "hacknet" in ns &&
                    typeof (ns as any).hacknet?.getCacheUpgradeCost === "function" // Costs 4GB
        }
    };
}

/*export class SourceFile_State_Hacknet extends SourceFile_State_Lite{
    readonly hacknet: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Hacknet]?: boolean}) {
        super(ns, desiredKnowledge);

        this.hacknet =
            desiredKnowledge.hacknet ?
                "hacknet" in ns &&
                typeof (ns as any).hacknet?.getCacheUpgradeCost === "function"
                : false;// Costs 4GB
    }

}*/

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the singularity module.<br>
 * The singularity module needs to be added to the object passed to the constructor, allowing for dynamic addition.
 * If the singularity module should ALWAYS be checked, see {@link WithSingularity `WithSingularity`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly singularity: boolean } = new (WithSingularityChoice(SourceFile_State_Lite))(ns, {singularity:true});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly singularity: boolean}>}
 * @see WithSingularity
 * @constructor
 */
export function WithSingularityOption<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, { readonly singularity: boolean}> {
    //@ts-expect-error
    return class extends Base {
        readonly singularity: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean} & {singularity: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.singularity =
                desiredKnowledge.singularity
                    ? "singularity" in ns &&
                    typeof (ns as any).singularity?.isFocused === "function"
                    : false;
        }
    };
}

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the singularity module.<br>
 * The singularity module **does not need** to be added to the object passed to the constructor, allowing for static typing.
 * If the singularity module is not ALWAYS checked, see {@link WithSingularityOption `WithSingularityOption`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly singularity: boolean } = new (WithSingularity(SourceFile_State_Lite))(ns, {});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly singularity: boolean}>}
 * @see WithSingularityOption
 * @constructor
 */
export function WithSingularity<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, { readonly singularity: boolean}> {
    //@ts-expect-error
    return class extends Base {
        readonly singularity: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.singularity =
                    "singularity" in ns &&
                    typeof (ns as any).singularity?.isFocused === "function";
        }
    };
}

/*export class SourceFile_State_Singularity extends SourceFile_State_Lite{
    readonly singularity: boolean;
    constructor(ns: NS, desiredKnowledge : {[K in keyof SourceFile_State_Singularity]?: boolean}) {
        super(ns, desiredKnowledge);

        this.singularity =
            desiredKnowledge.singularity ?
                "singularity" in ns &&
                typeof (ns as any).singularity?.isFocused === "function"
                : false; // Costs 1.6 GB
    }

}*/

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the advanced stock module.<br>
 * The advanced stock module needs to be added to the object passed to the constructor, allowing for dynamic addition.
 * If the advanced stock module should ALWAYS be checked, see {@link WithAdvancedStock `WithAdvancedStock`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly advancedStock: boolean } = new (WithAdvancedStockChoice(SourceFile_State_Lite))(ns, {advancedStock:true});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly advancedStock: boolean}>}
 * @see WithAdvancedStock
 * @constructor
 */
export function WithAdvancedStockOption<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, { readonly advancedStock: boolean}>  {
    //@ts-expect-error
    return class extends Base {
        readonly advancedStock: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean} & {advancedStock: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.advancedStock =
                desiredKnowledge.advancedStock ?
                    "stock" in ns &&
                    typeof (ns as any).stock?.buyShort === "function"
                    : false; // Costs 2.5 GB
        }
    };
}

/**
 * A function to upgrade a SourceFile_State class with the ability to check for the advanced stock module.<br>
 * The advanced stock module **does not need** to be added to the object passed to the constructor, allowing for static typing.
 * If the advanced stock module is not ALWAYS checked, see {@link WithAdvancedStockOption `WithAdvancedStockOption`}
 *
 * @example<caption>The function must be surrounded by parentheses.</caption>
 *    let source_file_state: SourceFile_State_Lite & { readonly advancedStock: boolean } = new (WithAdvancedStock(SourceFile_State_Lite))(ns, {});
 *
 * @template {SourceFile_State_Lite} TBase
 * @param {TBase} Base The SourceFile_State_Lite class or a derivate from another With- function.
 * @returns {ConstructorReturn<TBase, {readonly advancedStock: boolean}>}
 * @see WithAdvancedStockOption
 * @constructor
 */
export function WithAdvancedStock<TBase extends baseConstructor>(Base: TBase): ConstructorReturn<TBase, { readonly advancedStock: boolean}>  {
    //@ts-expect-error
    return class extends Base {
        readonly advancedStock: boolean;
        constructor(ns: NS, desiredKnowledge: {[K in keyof TBase]?: boolean}) {
            super(ns, desiredKnowledge as {[K in keyof TBase]?: boolean});

            this.advancedStock =
                "stock" in ns &&
                typeof (ns as any).stock?.buyShort === "function"; // Costs 2.5 GB
        }
    };
}

/*
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

}*/
