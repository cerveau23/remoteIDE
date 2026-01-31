import {NS} from "@ns";
import {clickAPI, keyPressAPI, serverUpWaiter} from "/BBA_API_handler";
import {ui} from "/functional/UIGetter";
import {getHTML} from "/functional/HtmlGetter"

const devLog = false;

async function navigatePath(ns: NS, route: PathPoints) {
    ns.tprint("Route: " + route.toString());
    for (const direction of route[0])
        await keyPressAPI(ns, direction);
    //if (route[0].length === 0)
    //    return;
    //await stringPressAPI(ns, route[0]);
}

let targetCompany: string;

/** @param {NS} ns */
export async function main(ns: NS) {
    const options = ["money", "reputation", "fill all factions"] as const;
    type Options = typeof options[number];
    let moneyRatherThanRep = ((ns.args.length >= 2) && options.includes(ns.args[1] as Options)) ? ns.args[1] as Options : undefined
    while (moneyRatherThanRep === undefined) {
        const temp = await ns.prompt("Do you want Money, Rep,\nor Filling out rep for every faction ?", {
            type: "select",
            choices: Array.from(options)
        }) as Options | ""
        if(temp !== "")
            moneyRatherThanRep = temp;
    }
    let minePath: PathPoints[] = [];
    if (ns.args.length !== 0) { // A target company has been passed to the script
        if (ui.doCument.getElementsByClassName("css-1ro0679").length !== 0 && Array.from(ui.doCument.getElementsByClassName("css-1ro0679")).some((value) => value.innerHTML.includes("successful"))) //TODO: Logic to act whether we're on the terminal or on a success screen
            while (ui.doCument.getElementsByClassName("css-1ro0679").length !== 0 && Array.from(ui.doCument.getElementsByClassName("css-1ro0679")).some((value) => value.innerHTML.includes("successful"))) {
                await ns.asleep(100);
            }
        await ns.asleep(100);
        (<HTMLElement>ui.doCument.querySelector('[aria-label="' + ns.args[0] + '"]')).click();
        while (!Array.from(ui.doCument.getElementsByClassName("css-1d6cey9")).some((element) => element.textContent.includes("Infiltrate Company"))) {
            await ns.asleep(100);
        }
        if (Array.from(ui.doCument.getElementsByClassName("css-1d6cey9")).some((element) => element.textContent.includes("Infiltrate Company"))) {
            await ns.asleep(100);
            Array.from(ui.doCument.getElementsByClassName("css-1d6cey9")).filter((element) => element.textContent.includes("Infiltrate Company")).forEach((element) => (<HTMLElement>element).click());
        }
        await ns.asleep(100);
        if (Array.from(ui.doCument.getElementsByClassName("css-1d6cey9")).some((element) => element.textContent.includes("Infiltrate Company"))) { // So if clicking it programmatically didn't work, we do it with the server
            const rect = (Array.from(
                ui.doCument.getElementsByClassName("css-1d6cey9")
            ).filter((element) =>
                element.textContent.includes("Infiltrate Company"))[0]
            .getBoundingClientRect());

            const screenX = window.screenX + (rect.left + rect.right) / 2;
            const screenY = window.screenY + (rect.top + rect.bottom) / 2 + 40;

            await clickAPI(ns, "left", [screenX, screenY]);
        }
    }
    // We wait until the "Start infiltration" page appears
    while (!Array.from(ui.doCument.getElementsByClassName("css-1ro0679")).some((value) => {
        return value.innerHTML.includes("Infiltrating");
    })) {
        await ns.sleep(100);
    }
    targetCompany = ui.doCument.getElementsByClassName("css-1ro0679")[0].children[0].textContent;
    await serverUpWaiter(ns);
    // Store the target company

    while (ui.doCument.getElementsByClassName("css-1d6cey9").length === 0) {
        await ns.sleep(100);
    }
    (<HTMLElement>ui.doCument.getElementsByClassName("css-1d6cey9")[0]).click();
    // We wait for the "Get Ready!" page
    while (!Array.from(ui.doCument.getElementsByClassName("css-1qsxih2")).some((value) => {
        return value.innerHTML.includes("Get Ready!");
    })) {
        await ns.sleep(10);
    }

    async function attackSentinel(taskNode: Element) {
        ns.print("Found a guard!");
        while (!taskNode.textContent.includes("Distracted")) {
            await ns.sleep(10);
        }
        ns.print("Distracted! Will press!");
        if (devLog) ns.tprint("Distracted! Will press!");
        //await simulateKey(ns, "Space", 32, true);
        await keyPressAPI(ns, "Space");
        ns.print("Pressed!");
    }

    async function enterCode(taskNode: Element) {
        const instructions = taskNode.children[1].children[0];
        if (devLog) ns.tprint(instructions.innerHTML);
        if (devLog) ns.tprint(Array.from(instructions.children).toString())
        for (let index = 0; index < instructions.children.length; ++index) {
            const htmlLine = instructions.children[index];
            if (devLog) if (devLog) ns.tprint(htmlLine.outerHTML);
            if (devLog) ns.tprint(htmlLine.textContent);
            if (!htmlLine.hasAttribute("opacity") && (htmlLine.textContent !== "?")) {
                let correspondingKey;
                switch (htmlLine.textContent) {
                    case "↑":
                        correspondingKey = "w";
                        break;
                    case "→":
                        correspondingKey = "d";
                        break;
                    case "↓":
                        correspondingKey = "s";
                        break;
                    case "←":
                        correspondingKey = "a";
                        break;
                    default:
                        ns.tprint("Failure on: " + htmlLine.textContent)
                        throw Error("Impossible key: " + htmlLine.textContent)
                }
                if (devLog) ns.tprint("Pressing key " + correspondingKey)
                await keyPressAPI(ns, correspondingKey);
            } else {
                if (devLog) ns.tprint("Wrong opacity: " + parseInt(getHTML("opacity", "attribute", htmlLine as HTMLElement)));
            }
        }
    }

    async function typeBackward(taskNode: Element) {
        const sentence = taskNode.getElementsByClassName("css-1vn74cx")[0];
        for (const letter of sentence.textContent) {
            const targetKey = letter === " " ? "Space" : letter;
            await keyPressAPI(ns, targetKey);
        }
    }

    async function closeBrackets(taskNode: Element) {
        const opening = taskNode.getElementsByClassName("css-1vn74cx")[0].textContent;
        const arrayOpeningChars = opening.match(/[\[(<{]/gm);
        if (arrayOpeningChars === null)
            return;
        arrayOpeningChars.reverse();
        const invertor = new Map();
        invertor.set("[", "]");
        invertor.set("(", ")");
        invertor.set("<", ">");
        invertor.set("{", "}");
        for (const character of arrayOpeningChars) {
            const targetKey = invertor.get(character);
            if (devLog) ns.tprint("Pressing " + targetKey);
            // while(! (await (await keyPressAPI(ns, targetKey)).json()).pressed){
            //     await ns.sleep(100)
            // }
            await keyPressAPI(ns, targetKey);
        }
    }

    async function wireCutter(taskNode: Element) {
        // Array.from(taskNode.children).forEach((value)=>ns.tprint(value.outerHTML.toString()));
        const wires2cut = Array.from(taskNode.children).filter((element: Element) => {
            return element.className.includes("css-1vn74cx");
        });
        if (devLog) ns.tprint("Wires to cut: " + wires2cut.toString());
        for (const wire2cut of wires2cut) {
            const currentInstruction = wire2cut.textContent;
            if (devLog) ns.tprint(currentInstruction.toString());
            if (currentInstruction.includes("number")) {
                const number2cut = currentInstruction.charAt(currentInstruction.length - 2);
                if (devLog) ns.tprint("Instruction : " + currentInstruction);
                if (devLog) ns.tprint("Key pressed : " + number2cut);
                await keyPressAPI(ns, number2cut);
            } else if (currentInstruction.includes("colored")) {
                const wires = Array.from(getHTML("", "lastChild", taskNode as HTMLElement).getElementsByClassName("css-1vn74cx"));
                const nbrWires = wires.filter((value) => value.innerHTML.match(/\d/)).length;
                // let wireArray = [[]];
                if (devLog) ns.tprint("Wires: " + wires.toString());
                if (devLog) ns.tprint("Nbr of wires: " + nbrWires);
                const wireMap: Set<string>[] = [];
                for (let i = 0; i < nbrWires; ++i) {
                    wireMap[i] = new Set();
                }
                wires.forEach((wireSegment, index) => {
                    // wireArray[Math.floor(index / nbrWires)][index % nbrWires] = wireSegment;
                    if (devLog) ns.tprint((<HTMLElement>wireSegment).outerHTML)
                    if (wireSegment.textContent.length === 0)
                        return;
                    wireMap[index % nbrWires].add(getHTML("style", "attribute", wireSegment as HTMLElement).substring("color: ".length).replace(";", ""));
                    if (devLog) ns.tprint(wireSegment.attributes.getNamedItemNS(null, "style"));
                    if (devLog) ns.tprint(getHTML("style", "attribute", wireSegment as HTMLElement).toString());
                    if (devLog) ns.tprint(wireSegment.getAttribute("style"));
                    if (devLog) ns.tprint(wireMap[index % nbrWires])
                    if (devLog) ns.tprint(wireMap[index % nbrWires][Symbol.toStringTag])
                    if (devLog) ns.tprint(wireMap[index % nbrWires].values().toArray().toString())
                    // ns.tprint("Substring: " + getHTML("style", "attribute", wireSegment as HTMLElement).substring("color: ".length))
                    // ns.tprint("Full: " + getHTML("style", "attribute", wireSegment as HTMLElement).substring("color: ".length).replace(";", ""))
                    // wireSegment.getAttributeNode("style").childNodes.forEach((value)=> {
                    //     ns.tprint(value)
                    // })
                    // ns.tprint(wireSegment.getAttributeNode("style").childNodes.values().toString())
                    // ns.tprint(wireSegment.getAttribute("style").color.toString())
                    // ns.tprint(Array.from(wireSegment.attributes).reduce((text, value)=> {
                    //     return text + "Name : " + value.localName + " " + value.namespace + " Value : " + value.value
                    // }))
                });
                ns.tprint("Finished analysing wires")
                wireMap.forEach((value) => ns.tprint("Wiremap: " + Array.from(value).toString() + " Length : " + value.size));
                let desiredColor = currentInstruction.slice(currentInstruction.lastIndexOf(" "), currentInstruction.length - 1).toLowerCase().trim();
                if (devLog) ns.tprint("Raw desired color: " + desiredColor);
                const colorDict = new Map([["yellow", "rgb(255, 193, 7)"], ["green", "rgb(0, 204, 0)"]]);
                desiredColor = colorDict.has(desiredColor) ? colorDict.get(desiredColor)! : desiredColor;
                if (devLog) ns.tprint("Desired color: " + desiredColor);
                for (const i in wireMap) {
                    if (devLog) ns.tprint("#: " + i + " Wiremap[#]: " + wireMap[i].toLocaleString());
                    if (devLog) ns.tprint(wireMap[i].has(desiredColor));
                    if (wireMap[i].has(desiredColor)) {
                        if (devLog) ns.tprint("Cut " + (Number(i) + 1));
                        await keyPressAPI(ns, "" + (Number(i) + 1));
                    }
                }
            }
        }
    }

    async function complimenter(taskNode: Element) {
        const initialWord = taskNode.getElementsByClassName("css-eg010m")[1].textContent;
        let first = true;
        const compliments = [
            "generous",
            "energetic",
            "loyal",
            "agreeable",
            "determined",
            "affectionate",
            "friendly",
            "bright",
            "creative",
            "kind",
            "likable",
            "helpful",
            "straightforward",
            "giving",
            "patient",
            "hardworking",
            "diplomatic",
            "polite",
            "charming",
            "dynamic",
            "funny"
        ];
        while (!compliments.includes(taskNode.getElementsByClassName("css-eg010m")[1].textContent) && (taskNode.getElementsByClassName("css-eg010m")[1].textContent !== initialWord || first)) {
            await keyPressAPI(ns, "s");
            first = false;
        }
        if (taskNode.getElementsByClassName("css-eg010m")[1].textContent === initialWord && !first) {
            await ns.sleep(2000);
            return;
        }
        await keyPressAPI(ns, "Space");
    }

    async function symbolMatcher(taskNode: Element) {
        ns.write("Match the symbols".replaceAll(" ", "") + ".txt", taskNode.innerHTML, "w");
        const targets = Array.from(taskNode.getElementsByClassName("css-eg010m")[0].children).map((value) => value.textContent.trim());
        if (devLog) ns.tprint("Targets: " + targets.toString());
        let currentCoords = new Coordinates(0, 0);
        const matrixElement = getHTML("", "lastChild", taskNode as HTMLElement);
        const side = Math.sqrt(matrixElement.children.length);
        /**@type {[String[]]}*/
        const matrix: [string[]] = [[]];
        for (let i = 0; i < side; ++i)
            matrix[i] = [];
        const matrixDimensions = new Coordinates(side, side);
        if (devLog) ns.tprint("Side: " + side);
        if (devLog) ns.tprint("Matrix: " + matrix);
        if (devLog) ns.tprint("Len " + matrixElement.children.length);
        Array.from(matrixElement.children)
            .forEach((value, index) => {
                // if (devLog) ns.tprint(matrix);
                matrix[Math.floor(index / side)][index % side] = value.innerHTML;
            });
        if (devLog) ns.tprint("Matrix full: " + matrix.toString());
        if (devLog) ns.tprint("Matrix side: " + matrix.length);
        for (const target of targets) {
            if (devLog) ns.tprint("Target: " + target);
            const rawIndex = matrix.flat(3).indexOf(target);
            const targetCoordinates = new Coordinates(rawIndex % side, Math.floor(rawIndex / side));
            if (devLog) ns.tprint("Target coordinates: " + targetCoordinates);
            const route = findShortestPathWiWrap(currentCoords, targetCoordinates, matrixDimensions);
            await navigatePath(ns, route);
            await keyPressAPI(ns, "Space");
            currentCoords = targetCoordinates;
        }
    }

// We wait during the "Get Ready!" page
    while (ui.doCument.getElementsByClassName("css-1qsxih2").length !== 0) {
        while (Array.from(ui.doCument.body.getElementsByClassName("css-1qsxih2")).some(
            // while (Array.from(doCument.children) === null ? true : Array.from(doCument.children).some(
            (value) => {
                return value === null ? true : value.innerHTML.includes("Get Ready!");
            })) {
            await ns.sleep(100);
            // ns.tprint(doCument.textContent);
            // if(doCument.body.textContent.includes("wires")) {
            //     copyToClipboard(doCument.getRootNode().textContent)
            //     ns.tprint("Document: ")
            //     ns.tprint(doCument);
            //     ns.tprint(doCument.body.innerHTML);
            //     ns.tprint(ui.doCument.getElementsByClassName("css-1bfln7c").innerHTML);
            //     return;
            // }
        }
        // copyToClipboard("Test");
        // copyToClipboard(Array.from(ui.doCument.getElementsByClassName("css-1qsxih2")).filter((
        //     (value) => {
        //         return value.innerHTML.includes("Cancel Infiltration")
        //     }))[0].innerHTML)
        await ns.sleep(100);
        // ns.tprint(Array.from(ui.doCument.body.getElementsByClassName("css-1qsxih2")).length);
        // ns.tprint(Array.from(ui.doCument.body.getElementsByClassName("css-1qsxih2")).filter((
        //     (value) => {
        //         return value.innerHTML.includes("Cancel Infiltration")
        //     }))[0].innerHTML);
        // let documentNow = doCument.getRootNode().innerHTML;
        // ns.write("HTML_"+new Date(Date.now()).toDateString().replaceAll(" ","")+".txt",documentNow);
        // return;
        if (ui.doCument.getElementsByClassName("css-1ro0679").length !== 0 && Array.from(ui.doCument.getElementsByClassName("css-1ro0679")).some((value) => value.innerHTML.includes("successful"))) {
            while (ui.doCument.getElementsByClassName("css-lg118y").length === 0) {
                await ns.sleep(100);
            }
            if (moneyRatherThanRep === "money") (<HTMLElement>Array.from(ui.doCument.getElementsByClassName("css-lg118y")).find((element) => element.textContent.includes("Sell for"))).click();
            else if(moneyRatherThanRep === "fill all factions"){
                let parent = ui.doCument.querySelector("#root > div.MuiBox-root.css-1mojy8p-root > div > div > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation1.css-1p7xay4 > div > div > div");
                if(parent === null) {
                    ns.spawn(ns.getScriptName(), {spawnDelay: 1000}, targetCompany, moneyRatherThanRep);
                    ns.exit()
                }
                let divElement = parent.querySelector("div");
                let inputElement = parent.querySelector("input");
                if((divElement === null) || inputElement === null) {
                    ns.spawn(ns.getScriptName(), {spawnDelay: 1000}, targetCompany, moneyRatherThanRep);
                    ns.exit()
                }
                divElement.textContent = "NiteSec";
                inputElement.nodeValue = "NiteSec";
            }
            ns.spawn(ns.getScriptName(), {spawnDelay: 1000}, targetCompany, moneyRatherThanRep);
        }
        (<HTMLElement>getHTML("css-jhk36g", "class")[0]).click();
        const challengeList = [
            "Attack after the sentinel drops his guard",    // Done
            "Close the brackets",                           //
            "Type it backward",                             // Done
            "Say something nice about the guard",           // Mostly done
            "Enter the Code",                               // Done
            "Match the symbols",                            // Done
            "Mark all the mines",                           //
            "Remember all the mines",                       //
            "Cut the wires"                                 // Done
        ];
        let page;
        if (ui.doCument.body.getElementsByClassName("css-1qsxih2").length === 1
            && ui.doCument.body.getElementsByClassName("css-1qsxih2")[0].innerHTML.includes("Cancel Infiltration"))
            page = ui.doCument.body.getElementsByClassName("css-1qsxih2")[0];
        else if (ui.doCument.body.getElementsByClassName("css-1qsxih2").length === 0)
            throw Error("Wrong window, does not have css-1qsxih2!");
        else
            page = Array.from(ui.doCument.body.getElementsByClassName("css-1qsxih2")).filter(((value) => {
                return value.innerHTML.includes("Cancel Infiltration");
            }))[0];
        // Find the right child that has the task
        const taskNode = Array.from(page.children).find((value) => {
            return value.classList.toString().match(/css-9bcezy|css-12f8zm3/) === null;
        });
        if (taskNode === undefined)
            continue;
        const taskTitle = taskNode.children[0];
        if (devLog) ns.tprint(taskTitle.innerHTML);
        // enumerate through the task types to find the one to be done
        let correctType = "";
        for (const type of challengeList)
            if (taskTitle.innerHTML.includes(type)) {
                correctType = type;
                break;
            }
        if (devLog) ns.tprint("Type: " + correctType);
        ns.toast("Type: " + correctType, "info");
        // if (devLog) ns.tprint(doCument);
        // if (devLog) ns.tprint(doCument.body.innerHTML);
        if (correctType === "") {
            await ns.sleep(10);
            continue;
        }
        //Switch through the tasks algorithms
        switch (correctType) {
            case "Attack after the sentinel drops his guard":
                await attackSentinel(taskNode);
                break;
            case "Enter the Code":
                await enterCode(taskNode);
                break;
            case "Type it backward":
                await typeBackward(taskNode);
                break;
            case "Close the brackets":
                await closeBrackets(taskNode);
                break;
            case "Cut the wires":
                await wireCutter(taskNode);
                break;
            case "Say something nice about the guard":
                await complimenter(taskNode);
                break;
            case "Match the symbols":
                await symbolMatcher(taskNode);
                break;
            case "Remember all the mines":
                // If there is already a path stored, break
                if (minePath.length !== 0)
                    break;

                // Make a matrix using the class MuiTypography-body1
                const linearMatrix = Array.from(taskNode.getElementsByClassName("MuiTypography-body1"));
                const side = Math.sqrt(linearMatrix.length);
                //ns.tprint(side)
                const matrix: Element[][] = [];
                for (let lineNbr = 0; lineNbr < side; lineNbr++) {
                    matrix[lineNbr] = [];
                }
                for (const nodeIndex in linearMatrix) {
                    const x = parseInt(nodeIndex) % side;
                    const y = (parseInt(nodeIndex) - x) / side;
                    matrix[y][x] = linearMatrix[nodeIndex];
                }
                //ns.tprint(linearMatrix.toString())

                // Locate the indexes with the class css-6zml06 for the mines
                const mineList: Coordinates[] = [];
                for (const matrixY in matrix) {
                    for (const matrixX in matrix[matrixY]) {
                        if (matrix[matrixY][matrixX].classList.contains("css-6zml06"))
                            mineList.push(new Coordinates(parseInt(matrixX), parseInt(matrixY)));
                    }
                }
                if (devLog) ns.tprint("Mine list: " + mineList.toString());
                // Determine the best path
                const path = algorithmPathing(ns, mineList, new Coordinates(0, 0), side);
                // Test that path reaches everything
                // Store the best path
                minePath = path;
                if (devLog) ns.tprint(path.toString());
                // Break
                break;
            case "Mark all the mines":

                if (devLog) ns.tprint(minePath.toString())

                // If there is no path stored, throw an error
                if (minePath.length === 0)
                    throw GeolocationPositionError;

                // Follow the best path
                for (const oneMinePath of minePath) {
                    await navigatePath(ns, oneMinePath);
                    // Press space on each mine
                    await keyPressAPI(ns, "Space");
                }
                // Consume the path stored
                minePath = [];
                // Break
                break;
            default:
                ns.write(correctType.replaceAll(" ", "") + ".txt", taskNode.innerHTML, "w");
                break;
        }
        //Do the task
        ns.print("Prout");
    }
}

type PathPoints = [string[], number[]];

/**
 * @param {Coordinates} start
 * @param {Coordinates} end
 * @param {Coordinates} arrayDimensions
 * @returns {PathPoints}
 */
function findShortestPathWiWrap(start: Coordinates, end: Coordinates, arrayDimensions: Coordinates): PathPoints {
    const answer = [""].filter(() => false);
    const movement = [0].filter(() => false);
    const directions = {"x": {"-": "a", "+": "d"}, "y": {"-": "w", "+": "s"}};
    for (const dimension of ["x", "y"] as const) {
        const distanceSE = Math.abs(start[dimension] - end[dimension]);
        if (distanceSE < arrayDimensions[dimension] - distanceSE) // Shorter to go directly
            for (let i = 0; i < distanceSE; ++i)
                answer.push(start[dimension] > end[dimension] ? directions[dimension]["-"] : directions[dimension]["+"]);
        else { // Shorter to wrap around the board
            for (let i = 0; i < arrayDimensions[dimension] - distanceSE; ++i)
                answer.push(start[dimension] > end[dimension] ? directions[dimension]["+"] : directions[dimension]["-"]);
        }
        movement[Number(dimension === "y")] = Math.min(distanceSE, arrayDimensions[dimension] - distanceSE);
    }
    return [answer, movement];
}

class Coordinates {
    /**@type {number} y*/
    y: number;
    /**@type {number} x*/
    x: number;

    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return "X: " + this.x + " Y: " + this.y;
    }
}

class Node {
    /**@type {Coordinates} location*/
    location: Coordinates;
    /**@type {Path} pathToNode*/
    pathToNode: Path;
    /**@type {boolean} found*/
    found = false;
    /**@type {boolean} permanent*/
    permanent = false;

    /**
     * @param {Coordinates} location
     * @param {Path} pathToNode
     */
    constructor(location: Coordinates, pathToNode: Path) {
        this.location = location;
        this.pathToNode = pathToNode;
    }

    update(pathToNode: Path) {
        if (pathToNode.length < this.pathToNode.length) {
            this.pathToNode = pathToNode;
        }
        this.found = true;
    }
}

class Path {
    /**@type {Node|null} previousNode*/
    previousNode: Node | null;
    /**@type {number} length*/
    length: number;

    /**
     * @param {Node|null} previousNode
     * @param {number} lengthOfPath
     */
    constructor(previousNode: Node | null, lengthOfPath: number) {
        this.previousNode = previousNode;
        this.length = lengthOfPath;
    }
}

/**
 * @param {*[]} locationsArray
 * @param {Coordinates} startingLocation
 * @param {number} mapSideLength
 * @returns {[]}
 */
function dijkstra(locationsArray: any[], startingLocation: Coordinates, mapSideLength: number): Node[] {

    const nodeMap = locationsArray.map((value) => {
        return new Node(value, new Path(null, 100000));
    });
    const startingLocationNode = new Node(startingLocation, new Path(null, 0));
    startingLocationNode.found = true;
    nodeMap.unshift(startingLocationNode);
    while (nodeMap.some((node) => (!node.permanent))) {
        nodeMap.sort((a, b) => {
            return a.pathToNode.length - b.pathToNode.length;
        });
        const permanentsIndex = nodeMap.map((node, index) => (node.permanent ? index : null)).filter((value) => value !== null);
        const foundsIndex = nodeMap.map((node, index) => ((node.permanent !== node.found) ? index : null)).filter((value) => value !== null);
        const virginsIndex = nodeMap.map((node, index) => (node.found ? null : index)).filter((value) => value !== null);
        // for (const foundI of foundsIndex) { // Nope, it should only take the first of the founds, the one which has the lowest path, before reloading and sorting them out again
        const foundI = foundsIndex[0];
        nodeMap[foundI].permanent = true;
        for (const updateI of virginsIndex.concat(foundsIndex.slice(1))) {
            const distance = nodeMap[foundI].pathToNode.length + findShortestPathWiWrap(nodeMap[foundI].location, nodeMap[updateI].location, new Coordinates(mapSideLength, mapSideLength))[1].reduce((previous, current) => previous + current);
            nodeMap[updateI].update(new Path(nodeMap[foundI], distance));
        }
        //}
    }
    return nodeMap;
}

/**
 * @param {NS} ns
 * @param {Coordinates[]} locationsArray
 * @param {Coordinates} startingLocation
 * @param {number} mapSideLength
 * @returns {PathPoints[]}
 */
function algorithmPathing(ns: NS, locationsArray: Array<Coordinates>, startingLocation: Coordinates, mapSideLength: number): PathPoints[] {
    // let visitedArray = [];
    const unvisitedArray = locationsArray.slice();
    const fullPath: PathPoints[] = [];
    if (devLog) ns.tprint(unvisitedArray.toString());
    while (unvisitedArray.length !== 0) {
        let closestNode: [Coordinates, number, number, PathPoints] = [startingLocation, 100000, 0, [[], []]];
        for (const location2VisitIndex in unvisitedArray) {
            const location2Visit = unvisitedArray[location2VisitIndex];
            ns.print("Location: " + location2Visit.toString());
            const path = findShortestPathWiWrap(startingLocation, location2Visit, new Coordinates(mapSideLength, mapSideLength));
            ns.print(path.toString());
            if (path[1][0] + path[1][1] < closestNode[1])
                closestNode = [location2Visit, path[1][0] + path[1][1], parseInt(location2VisitIndex), path];
        }
        ns.print(closestNode);
        // visitedArray = unvisitedArray.shift()
        startingLocation = unvisitedArray.splice(closestNode[2], 1)[0];
        fullPath.push(closestNode[3]);
    }
    return fullPath;
}