import {NS} from "@ns";

/*export interface dSeLib {
    /!**
     * @param {NS} ns
     * @param {PartialFlag} argument
     * @returns <p>A ``string[]`` if ``NAS == true``. </p>
     * <p> A ``string`` if we pass a destination. </p>
     * <p> A {@link Map ``Map``} if we don't pass a destination. </p>
     *!/
    dSe(ns: NS, argument? : Array<[string, (string|boolean|any[])]>): string[] | Location[] | string ;
    Location : typeof Location;
    Map : typeof Map;
}

export const DSE : dSeLib = {dSe, Location, Map};*/


/**
 * Represents a location on the net.
 *
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
    /** PathPoints to the Server via IDs */
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

class Flag {
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

    constructor(init?: Partial<Flag>) {
        this._ = init?._ ?? [];
        this.NAS = init?.NAS ?? false;
        this.d = init?.d ?? "-";
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

type PartialFlag = {
    [K in keyof Flag]?: Flag[K];
};

let flagTemp = new Flag({"_": [], "NAS": false, "d": "-", "connector": false, "help": false, "o": false});//NAS === newly available servers
let commandline = true;

/** @param {NS} ns
 *  @param {PartialFlag} [flagOpt = new Flag()] */
export function main(ns: NS, flagOpt: PartialFlag = new Flag()): string[] | Location[] | string {//exemple: dSe(ns, [["d", i], ["connector", true]])
    flagTemp.parseFlags(ns.flags([["NAS", flagTemp.NAS], ["d", flagTemp.d], ["connector", flagTemp.connector], ["help", flagTemp.help], ["o", flagTemp.o]]));//if called by the terminal
    flagTemp.parseFlags(flagOpt);
    /** @const {Flag} */
    const flag: Flag = flagTemp;
    //await ns.tprint (flag);
    if (flag.help) {
        ns.tprintRaw(`The depthScanner script is used to map out the entire server network.
It has 5 possible flags:
\t--NAS, for "newly available servers", will return the servers that are have become available for hacking since the last registered hackfest. It is based on the level stored at "lastHackingAtLevel.txt".
\t-d, for "destination", requires a hostname and will return the path to the hostname.
\t\t--connector is used only in conjunction with "-d" and transforms the output to be usable as a command line instruction.
\t--help will display this screen.
\t-o, for "",`);//I can't recall what I wanted it for
        ns.exit();
    }
    //await ns.tail();
    let lastLevel = 0;
    if (flag["NAS"]) {
        lastLevel = parseInt(ns.read("lastHackingAtLevel.txt"));
    }
    let file = ns.read("targetsNew.txt");

    let map: Map = [];
    let newServers = [];
    let startLocation = ns.getHostname();
    let currentLocation = startLocation;
    let id = 0;

    let path: Path = [];
    map.push([currentLocation, id, path, false, true]);//writing of the starting location as example: [Server's Name, Server's ID, PathPoints to the Server via IDs, Whether or not the server has "children", whether or not the server has been backdoored in the past]
    let position = 0;
    let finishedCode = true;
    do {
        /*for (let i in map){
          if (map[i][0] === currentLocation){
            path = map[i][2];
            break;
          }
        }*/
        ns.print("New Scan");
        currentLocation = map[position][0]
        /** @var {Number} cLI Stores the Current Location's Index inside of {@link ``map``}*/
        let cLI = position;
        /** @var {Number} cLD Stores the Current Location's Data */
        let cLD = map[cLI];
        ns.print(cLD);
        path = copy(cLD[2]);
        path.push(cLD[1]);
        ns.print(path);
        /** @type string[] The list of all adjacent {@link Location ``locations``} to the current location. */
        let touched: Hostname[] = ns.scan(currentLocation);
        ns.print(touched);
        for (let i in touched) {
            const serverName = touched[i];
            ns.print(sIIS(map, 0, serverName) + "; " + serverName);
            if (sIIS(map, 0, serverName) === -1) {
                id++;
                map.push([serverName, id, copy(path), false]);
                map[cLI][3] = true;
                if (flag["NAS"] && ns.getServerRequiredHackingLevel(serverName) > lastLevel && ns.getServerRequiredHackingLevel(serverName) <= ns.getHackingLevel()) {
                    newServers.push(serverName + ": " + ns.getServerRequiredHackingLevel(serverName));
                }
            }
        }
        if (!finishedCode) {
            ns.print(id);/*
      ns.tprint(map[sIIS(map, 0, currentLocation)]);
      map.push(currentLocation);
      ns.tprint(map.find(test));
      map.pop()*/
            break;
        }
        position++;
    }
    while (position !== map.length);
    if (flag["NAS"]) {
        // if (!commandline) {
        //     ns.tprint("New servers: " + newServers);
        // } else {
            ns.print(newServers);
        // }
        return newServers;
    } else {
        if (flag.d !== "-") {
            let pathTarget = "";
            let targetPosition = sIIS(map, 0, flag.d);
            try {
                for (let i in map[targetPosition][2]) {
                    let pathName = map[sIIS(map, 1, map[targetPosition][2][i])][0];
                    pathTarget += " --> " + pathName;
                }
            } catch (_) {
                ns.tprint(map.toString());
                ns.tprint("Target: " + targetPosition);
                ns.tprint("Flag d: " + flag.d);
                throw DOMException;
            }
            pathTarget += " --> " + flag.d;
            pathTarget = pathTarget.replace(" --> ", "")
            if (flag.connector) {
                pathTarget = pathTarget.replaceAll(" --> ", "; connect ");
            }
            if (commandline) {
                ns.tprint("PathPoints to the target: " + pathTarget);
            } else {
                ns.printRaw(pathTarget);
            }
            return pathTarget;
        } else {
            let names = map.map(namePrinter);
            //ns.print(map);
            //ns.print(names.toString());
            return map;
        }
    }
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
}/*
function test(value,index,array){
  return value[0]==array[array.length-1];
}*/
function namePrinter<T>(value: Array<T>): T {
    return value[0];
}

/**@param {array} array*/
function copy<T>(array: Array<T>): Array<T> {//returns an independent copy of a global variable to avoid future changes to affect the copy
    return array.slice();
}

/**
 * @param {NS} ns
 * @param {PartialFlag} argument
 * @returns <p>A ``string[]`` if ``NAS == true``. </p>
 * <p> A ``string`` if we pass a destination. </p>
 * <p> A {@link Map ``Map``} if we don't pass a destination. </p>
 */
export function dSe(ns: NS, argument = Array<[string, (string | boolean | any[])]>()): string[] | Location[] | string {
    //await ns.tprint(argument);
    commandline = false;

    let flags: PartialFlag = Object.fromEntries(argument)
    //await ns.tprint (answer);
    //await ns.tprint (typeof answer);
    return main(ns, flags);
}

/*

/!**@param {array} value*!/
function replace(value: Array<any>) {
    flagTemp[value[0]] = value[1];
}*/
