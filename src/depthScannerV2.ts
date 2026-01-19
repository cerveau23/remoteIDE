// noinspection DuplicatedCode

import {NS} from "@ns";


/**
 * Represents a location on the net.
 * @property {Hostname} ServerName - The location's name.
 * @property {Number} ServerID - The location's UID.
 * @property {Path} Path - The path to the location.
 * @property {Boolean} HasChildren - Whether the location has children locations.
 * @property {Boolean} [Backdoored] - Whether the server has been backdoored in the past.
 */
export type Location = [
    /** Server Name */
    ServerName: Hostname, // Test
    /** Server ID */
    ServerID: number,
    /** Path to the Server via IDs */
    Path: Path,
    /** Whether the server has "children" */
    HasChildren: boolean,
    /** whether the server has been backdoored in the past */
    Backdoored?: boolean
]

type Hostname = string;

/** An array of {@link Location locations}.*/
export type Map = Location[];

/**
 * The path to a {@link ``Location``}, represented as an array of ``UIDs`` from ``Home`` to the ``Location``
 */
interface Path extends Array<number> {
}

type DSeReturn<T> =
    T extends Help ? void :
        T extends NAS ? string[] :
            T extends Connector ? string :
                T extends Destination ? string :
                    Map;

export interface FromCLI {
    _: any[]
}

export interface Help extends FromCLI {
    help: boolean
}

export interface NAS {
    NAS: boolean
}

export interface Destination {
    d: string
}

export interface Connector extends Destination {
    connector: boolean
}

export class Flag implements Help, NAS, Connector {
    /** Any unflagged arguments. */
    _: any[];
    /** The flag to return all newly available server. */
    NAS: boolean;
    /** The flag to designate a target hostname to return the path towards. */
    d: string;
    /** The flag to designate to format the return as a CLI-compliant string. Used with the ``-d`` flag. */
    connector: boolean;
    /** The flag to display the help screen. */
    help: boolean;
    /** I forgot why I wanted this flag. */
    o: boolean;

    constructor(init?: PartialFlag) {
        this._ = init?._ ?? [];
        this.NAS = init?.NAS ?? false;
        this.d = init?.d ?? "";
        this.connector = init?.connector ?? false;
        this.help = init?.help ?? false;
        this.o = init?.o ?? false;
    }

    parseFlags(raw: ReturnType<NS["flags"]> | PartialFlag): void {
        this._ = (raw._ ?? this._) as any[];
        this.NAS = Boolean(raw.NAS ?? this.NAS);
        this.d = String(raw.d ?? this.d);
        this.connector = Boolean(raw.connector ?? this.connector);
        this.help = Boolean(raw.help ?? this.help);
        this.o = Boolean(raw.o ?? this.o);
    }
}

export type PartialFlag = {
    [K in keyof Flag]?: Flag[K];
};

let flagTemp = new Flag({"_": [], "NAS": false, "d": "", "connector": false, "help": false, "o": false});//NAS === newly available servers
let commandline = false;

/** @param {NS} ns*/
export function main(ns: NS): string[] | Location[] | string | void {//exemple: dSe(ns, [["d", i], ["connector", true]])
    commandline = true;
    flagTemp.parseFlags(ns.flags([["NAS", flagTemp.NAS], ["d", flagTemp.d], ["connector", flagTemp.connector], ["help", flagTemp.help], ["o", flagTemp.o]]));//if called by the terminal
    /** @const {Flag} */
    const flag: Flag = flagTemp;
    return hub(ns,flag);
}

/**
 * Returns the index of the value whose ``positionOfInterest`` value equals ``keyword``, or ``-1`` if none is found
 * @param {array} array
 * @param {number} positionOfInterest
 * @param {string} keyword*/
function sIIS<T>(array: Array<Array<T>>, positionOfInterest: number, keyword: T): number {//positionOfInterest = position in the subarray that is to be searched; sIIS=searchIfInSubArray
    for (let i in array) {
        if (array[i][positionOfInterest] === keyword) {
            return parseInt(i);
        }
    }
    return -1;
}

function namePrinter<T>(value: Array<T>): T {
    return value[0];
}

/**
 * Returns an independent copy of a global variable to prevent future changes to affect the copy
 * @param {array} array*/
function copy<T>(array: Array<T>): Array<T> {
    return array.slice();
}

/*export function dSe(ns: NS): Map
export function dSe(ns: NS, NAS: NAS): string[]
export function dSe(ns: NS, con: Connector): string
export function dSe(ns: NS, d: Destination): string
export function dSe(ns: NS, help: Help): void*/
/** @function dSe
 * @param {NS} ns
 * @param {PartialFlag} partialFlag
 * @returns <p>A ``string[]`` if ``NAS == true``. </p>
 * <p> A ``string`` if we pass a destination. </p>
 * <p> A {@link Map ``Map``} if we don't pass a destination. </p>
 */
export function dSe<T extends PartialFlag>( ns: NS, partialFlag?: T): DSeReturn<T>{
//export function dSe(ns: NS, partialFlag?: PartialFlag): string[] | Map | string | void {
    commandline = false;

    const flags: Flag = new Flag(partialFlag)//Object.fromEntries(partialFlag)
    return hub(ns, flags) as DSeReturn<T>;
}

function hub(ns: NS, Flags: Flag): string[] | Map | string | void {
    if (Flags.help)
        return help(ns);
    const map = WholeMap(ns);
    if(Flags.NAS)
        return nas(ns, map);
    if(Flags.d !== undefined && Flags.d.length > 0){
        let path = pathing(ns, map, Flags.d);
        if(Flags.connector)
            path = connector(path);
        else path = path.replace(" --> ", "") // Should happen after we checked if we need connector
        if (commandline) {
            ns.tprint("Path to the target: " + path);
        } else {
            ns.printRaw(path);
        }
        return path;
    }
    let names = map.map(namePrinter);
    //ns.print(map);
    //ns.print(names.toString());
    return map;
}

function help(ns: NS) {
    ns.tprintRaw(`The depthScanner script is used to map out the entire server network.
It has 5 possible flags:
\t--NAS, for "newly available servers", will return the servers that are have become available for hacking since the last registered hackfest. It is based on the level stored at "lastHackingAtLevel.txt".
\t-d, for "destination", requires a hostname and will return the path to the hostname.
\t\t--connector is used only in conjunction with "-d" and transforms the output to be usable as a command line instruction.
\t--help will display this screen.
\t-o, for "",`);//I can't recall what I wanted it for
    return;
}

function WholeMap(ns: NS) : Map{

    let map: Map = [];
    let startLocation = ns.getHostname();

    if(startLocation !== "home")
        throw new GeolocationPositionError();

    // Creating the initial (home) location
    /** @type {string}
     * The currently visited location. */
    let currentLocation: string = startLocation;
    /** @type {number}
     * The location's UID, used in the path to said location. */
    let id: number = 0;
    /** @type {number[]}
     * The path to the {@link currentLocation ``current location``}, formed by the {@link id ``UIDs``} of each location starting from {@link startLocation ``home``}. */
    let path: Path = [];

    // Writing of the starting location as example: [Server's Name, Server's ID, Path to the Server via IDs, Whether or not the server has "children", whether or not the server has been backdoored in the past (Optional)]
    map.push([currentLocation, id, path, false, true]);

    /** @type {number}
     * The current id we're studying. */
    let position: number = 0;

    /** @type {boolean}
     * If ``false``, more information is printed to the tail. */
    const finishedCode: boolean = true;

    /**
     * While we haven't explored all the positions in the array, we're not gonna go beyond the end of the array.<br>
     * @link position ``Position`` is incremented at the end of the loop to detect if we're
     */
    for (;position !== map.length; ++position) {

        ns.print("New Scan");

        currentLocation = map[position][0]

        /** @const {Number} cLI
         * Stores the Current Location's Index inside of {@link ``map``}*/
        const cLI = position;

        /** @const {Number} cLD
         * Stores the Current Location's Data. */
        const cLD = map[cLI];
        ns.print(cLD);

        /**
         * Set the path to the one of the current location (as a copy, to avoid backflow contamination).
         * @type {Array<number>}
         */
        path = copy(cLD[2]);

        /**
         * Add the current location's ID, to obtain the actual path to all its children.
         */
        path.push(cLD[1]);
        ns.print(path);

        /** @const {Hostname[]} touched
         * The list of all adjacent {@link Location ``locations``} to the current location. */
        const touched: Hostname[] = ns.scan(currentLocation);
        ns.print(touched);

        for (const i in touched) {
            /**
             * The currently watched parent/child server.
             * @const {Hostname} serverName
             */
            const serverName = touched[i];
            ns.print(serverName + "'s id: " + sIIS(map, 0, serverName)); //Logs the server's id if it is known, -1 otherwise
            if (sIIS(map, 0, serverName) === -1) { // Aka if the server isn't in the database yet
                id++;
                map.push([serverName, id, copy(path), false]);
                map[cLI][3] = true; // Since at least one child of the current location was found, we set its third value (whether it has children) to true
                /*if (flag["NAS"] && ns.getServerRequiredHackingLevel(serverName) > lastLevel && ns.getServerRequiredHackingLevel(serverName) <= ns.getHackingLevel()) {
                    newServers.push(serverName + ": " + ns.getServerRequiredHackingLevel(serverName));
                }*/
            }
        }

        if (!finishedCode) {
            ns.print(id);
            break;
        }
    }
    return map;
}

function nas(ns: NS, map: Map) {
    const lastHackAtLevel = Number.parseInt(ns.read("lastHackAtLevel.txt"));
    let newServers = map.filter((value)=>
                    (ns.getServerRequiredHackingLevel(value[0]) > lastHackAtLevel
                    && ns.getServerRequiredHackingLevel(value[0]) < ns.getHackingLevel()))
    if (commandline) {
        ns.tprint("New servers: " + newServers);
    }
    ns.print(newServers);
    return newServers;
}

function pathing(ns: NS, map: Map, destination: string) {
    let pathTarget = "";
    let targetPosition = sIIS(map, 0, destination);
    try {
        for (let i in map[targetPosition][2]) {
            let pathName = map[sIIS(map, 1, map[targetPosition][2][i])][0];
            pathTarget += " --> " + pathName;
        }
    } catch (_) {
        ns.tprint(map.toString());
        ns.tprint("Target: " + targetPosition);
        ns.tprint("Flag d: " + destination);
        throw DOMException;
    }
    pathTarget += " --> " + destination;
    return pathTarget;
}

function connector(path: string) {
    path = path.replaceAll(" --> ", "; connect ");
    return path
}