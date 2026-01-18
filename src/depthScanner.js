export {dSe};

let flagTemp = {"_": [], "NAS": false, "d": "-", "connector": false, "help": false, "o": false};//NAS === newly available servers
let commandline = true;

/** @param {NS} ns
 *  @param {Array[]} flagOpt */
export async function main(ns, flagOpt = []) {//exemple: dSe(ns, [["d", i], ["connector", true]])
    if (flagOpt.length !== 0) {//if called by another script
        flagOpt.forEach(replace);
    }
    else {//if called by the terminal
        flagTemp = ns.flags([["NAS", false], ["d", "-"], ["connector", false], ["help", false], ["o", false]]);
    }
    const flag = flagTemp;
    //await ns.tprint (flag);
    if (flag.help) {
        ns.tprintRaw(`The depthScanner script is used to map out the entire server network.
It has 5 possible flags:
\t--NAS, for "newly available servers", will return the servers that are have become available for hacking since the last registered hackfest. It is based on the level stored at "lastHackingAtLevel.txt".
\t-d, for "destination", requires a hostname and will return the path to the hostname.
\t\t--connector is used only in conjunction with "-d" and transforms the output to be usable as a command line instruction.
\t--help will display this screen.
\t-o, for "",`);//I can't recall what I wanted it for
        return;
    }
    //await ns.tail();
    let lastLevel = 0;
    if (flag["NAS"]) {
        lastLevel = parseInt(ns.read("lastHackingAtLevel.txt"));
    }
    let file = ns.read("targetsNew.txt");
    let map = [];
    let newServers = [];
    let startLocation = ns.getHostname();
    let currentLocation = startLocation;
    let id = 0;
    let path = [];
    map.push([currentLocation, id, path, false, true]);//writing of the starting location as example: [Server's Name, Server's ID, Path to the Server via IDs, Whether or not the server has "children", whether or not the server has been backdoored in the past]
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
        let currentLocationIndex = position;
        let cLI = currentLocationIndex; //abbreviation
        let currentLocationData = map[cLI];
        let cLD = currentLocationData; //abbreviation
        ns.print(cLD);
        path = copy(cLD[2]);
        path.push(cLD[1]);
        ns.print(path);
        let touched = ns.scan(currentLocation);
        ns.print(touched);
        for (let i in touched) {
            ns.print(sIIS(map, 0, touched[i]) + "; " + touched[i]);
            if (sIIS(map, 0, touched[i]) === -1) {
                id++;
                map.push([touched[i], id, copy(path), false]);
                map[cLI][3] = true;
                if (flag["NAS"] && ns.getServerRequiredHackingLevel(touched[i]) > lastLevel && ns.getServerRequiredHackingLevel(touched[i]) <= ns.getHackingLevel()) {
                    newServers.push(touched[i] + ": " + ns.getServerRequiredHackingLevel(touched[i]));
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
        if (!commandline) {
            ns.tprint(newServers);
        } else {
            ns.print(newServers);
        }
        return newServers;
    } else {
        if (flag.d !== "-") {
            let pathTarget = "";
            let targetPosition = sIIS(map, 0, flag.d);
            for (let i in map[targetPosition][2]) {
                let pathName = map[sIIS(map, [1], map[targetPosition][2][i])][0];
                pathTarget += " --> " + pathName;
            }
            pathTarget += " --> " + flag.d;
            pathTarget = pathTarget.replace(" --> ", "")
            if (flag.connector) {
                pathTarget = pathTarget.replaceAll(" --> ", "; connect ");
            }
            if (commandline) {
                ns.tprint(pathTarget);
            } else {
                ns.printRaw(pathTarget);
            }
            return pathTarget;
        } else {
            let names = map.map(namePrinter);
            //ns.print(map);
            //ns.print(names.toString());
            return (map);
        }
    }
}

/**@param {array} array
 * @param {number} positionOfInterest
 * @param {string} keyword*/
function sIIS(array, positionOfInterest, keyword) {//positionOfInterest = position in the subarray that is to be searched; sIIS=searchIfInSubArray
    for (let i in array) {
        if (array[i][positionOfInterest] === keyword) {
            return i;
        }
    }
    return -1;
}/*
function test(value,index,array){
  return value[0]==array[array.length-1];
}*/
function namePrinter(value) {
    return value[0];
}

/**@param {array} array*/
function copy(array) {//returns an independent copy of a global variable to avoid future changes to affect the copy
    return array.slice();
}

/** @param {NS} ns
 * @param argument
 */
async function dSe(ns, argument = []) {
    //await ns.tprint(argument);
    commandline = false;
    let answer = await main(ns, argument);
    //await ns.tprint (answer);
    //await ns.tprint (typeof answer);
    return answer;
}

/**@param {array} value*/
function replace(value) {
    flagTemp[value[0]] = value[1];
}