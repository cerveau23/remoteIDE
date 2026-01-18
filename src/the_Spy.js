import {keyPressAPI, serverUpWaiter} from "/BBA_API_handler";

async function navigatePath(ns, route) {
    ns.tprint("Route: " + route.toString());
    for (let direction of route[0])
        await keyPressAPI(ns, direction);
    //if (route[0].length === 0)
    //    return;
    //await stringPressAPI(ns, route[0]);
}
let targetCompany

/** @param {NS} ns */
export async function main(ns) {
    try{
        let minePath = [];
        let documentFree = eval("document");

        if (ns.args.length !== 0) { // A target company has been passed to the script
            if (documentFree.getElementsByClassName("css-1ro0679").length !== 0 && Array.from(documentFree.getElementsByClassName("css-1ro0679")).some((value) => value.innerHTML.includes("successful"))) //TODO: Logic to act whether we're on the terminal or on a success screen
                while (documentFree.getElementsByClassName("css-1ro0679").length !== 0 && Array.from(documentFree.getElementsByClassName("css-1ro0679")).some((value) => value.innerHTML.includes("successful"))) {
                    await ns.asleep(100);
                    documentFree = eval("document");
                }
            await ns.asleep(200);
            documentFree = eval("document");
            documentFree.querySelector('[aria-label="' + ns.args[0] + '"]').click();
            while (!Array.from(documentFree.getElementsByClassName("css-1d6cey9")).some((element) => element.textContent.includes("Infiltrate Company"))) {
                await ns.asleep(200);
                documentFree = eval("document");
            }
            while (Array.from(documentFree.getElementsByClassName("css-1d6cey9")).some((element) => element.textContent.includes("Infiltrate Company"))) {
                await ns.asleep(200);
                documentFree = eval("document");
                Array.from(documentFree.getElementsByClassName("css-1d6cey9")).filter((element) => element.textContent.includes("Infiltrate Company")).forEach((element) => element.click());
                /** <span aria-label="Alpha Enterprises" class="css-wfzdsz-location"><b>T</b></span> */
            }
        }
        // We wait until the "Start infiltration" page appears
        while (!Array.from(documentFree.getElementsByClassName("css-1ro0679")).some((value) => {
            return value.innerHTML.includes("Infiltrating");
        })) {
            await ns.sleep(100);
            documentFree = eval("document");
        }
        targetCompany = documentFree.getElementsByClassName("css-1ro0679")[0].children[0].textContent;
        await serverUpWaiter(ns);
        documentFree = eval("document");
        // Store the target company

        while (documentFree.getElementsByClassName("css-1d6cey9").length === 0) {
            await ns.sleep(100);
            documentFree = eval("document");
        }
        documentFree.getElementsByClassName("css-1d6cey9")[0].click();
        // We wait for the "Get Ready!" page
        while (!Array.from(documentFree.getElementsByClassName("css-1qsxih2")).some((value) => {
            return value.innerHTML.includes("Get Ready!");
        })) {
            await ns.sleep(10);
            documentFree = eval("document");
        }

        async function attackSentinel(taskNode) {
            ns.print("Found a guard!");
            while (!taskNode.textContent.includes("Distracted")) {
                await ns.sleep(10);
            }
            ns.print("Distracted! Will press!");
            ns.tprint("Distracted! Will press!");
            //await simulateKey(ns, "Space", 32, true);
            await keyPressAPI(ns, "Space");
            ns.print("Pressed!");
        }

        async function enterCode(taskNode) {
            let instructions = taskNode.children[1].children[0];
            for (let htmlLine of instructions.children)
                if (htmlLine.getAttribute("opacity") !== 0.4) {
                    ns.tprint(htmlLine.outerHTML);
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
                    }
                    await keyPressAPI(ns, correspondingKey);
                }
        }

        async function typeBackward(taskNode) {
            let sentence = taskNode.getElementsByClassName("css-1vn74cx")[0];
            for (let letter of sentence.textContent) {
                let targetKey = letter === " " ? "Space" : letter;
                await keyPressAPI(ns, targetKey);
            }
        }

        async function closeBrackets(taskNode) {
            let opening = taskNode.getElementsByClassName("css-1vn74cx")[0].textContent;
            let arrayOpeningChars = opening.match(/[\[(<{]/gm);
            arrayOpeningChars.reverse();
            let invertor = new Map();
            invertor.set("[", "]");
            invertor.set("(", ")");
            invertor.set("<", ">");
            invertor.set("{", "}");
            for (let character of arrayOpeningChars) {
                let targetKey = invertor.get(character);
                ns.tprint("Pressing " + targetKey);
                // while(! (await (await keyPressAPI(ns, targetKey)).json()).pressed){
                //     await ns.sleep(100)
                // }
                await keyPressAPI(ns, targetKey);
            }
        }

        async function wireCutter(taskNode) {
            // Array.from(taskNode.children).forEach((value)=>ns.tprint(value.outerHTML.toString()));
            let wires2cut = Array.from(taskNode.children).filter((element) => {
                return element.className.includes("css-1vn74cx");
            });
            ns.tprint("Wires to cut: " + wires2cut.toString());
            for (let wire2cut of wires2cut) {
                let currentInstruction = wire2cut.textContent;
                ns.tprint(currentInstruction.toString());
                if (currentInstruction.includes("number")) {
                    let number2cut = currentInstruction.charAt(currentInstruction.length - 2);
                    ns.tprint("Instruction : " + currentInstruction);
                    ns.tprint("Key pressed : " + number2cut);
                    await keyPressAPI(ns, number2cut);
                } else if (currentInstruction.includes("colored")) {
                    let wires = Array.from(taskNode.lastElementChild.getElementsByClassName("css-1vn74cx"));
                    let nbrWires = wires.filter((value) => value.innerHTML.match(/\d/)).length;
                    // let wireArray = [[]];
                    ns.tprint(wires.toString());
                    ns.tprint("Nbr of wires: " + nbrWires);
                    let wireMap = [];
                    for (let i = 0; i < nbrWires; ++i) {
                        wireMap[i] = new Set();
                    }
                    wires.forEach((wireSegment, index) => {
                        // wireArray[Math.floor(index / nbrWires)][index % nbrWires] = wireSegment;
                        wireMap[index % nbrWires].add(wireSegment.getAttribute("style").substring("color: ".length).replace(";", ""));
                        ns.tprint(wireSegment.attributes.getNamedItemNS(null, "style"));
                        ns.tprint(wireSegment.getAttributeNode("style").toString());
                        ns.tprint(wireSegment.getAttribute("style"));
                        // wireSegment.getAttributeNode("style").childNodes.forEach((value)=> {
                        //     ns.tprint(value)
                        // })
                        // ns.tprint(wireSegment.getAttributeNode("style").childNodes.values().toString())
                        // ns.tprint(wireSegment.getAttribute("style").color.toString())
                        // ns.tprint(Array.from(wireSegment.attributes).reduce((text, value)=> {
                        //     return text + "Name : " + value.localName + " " + value.namespace + " Value : " + value.value
                        // }))
                    });
                    wireMap.forEach((value) => ns.tprint("Wiremap: " + Array.from(value).toString() + " Length : " + value.size));
                    let desiredColor = currentInstruction.slice(currentInstruction.lastIndexOf(" "), currentInstruction.length - 1).toLowerCase().trim();
                    ns.tprint("Raw desired color: " + desiredColor);
                    let colorDict = new Map([["yellow", "rgb(255, 193, 7)"], ["green", "rgb(0, 204, 0)"]]);
                    desiredColor = colorDict.has(desiredColor) ? colorDict.get(desiredColor) : desiredColor;
                    ns.tprint("Desired color: " + desiredColor);
                    for (let i in wireMap) {
                        ns.tprint("#: " + i + " Wiremap[#]: " + wireMap[i].toLocaleString());
                        ns.tprint(wireMap[i].has(desiredColor));
                        if (wireMap[i].has(desiredColor)) {
                            ns.tprint("Cut " + (Number(i) + 1));
                            await keyPressAPI(ns, "" + (Number(i) + 1));
                        }
                    }
                }
            }
        }

        async function complimenter(taskNode) {
            let initialWord = taskNode.getElementsByClassName("css-eg010m")[1].textContent;
            let first = true;
            let compliments = [
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

        async function symbolMatcher(taskNode) {
            ns.write("Match the symbols".replaceAll(" ", "") + ".txt", taskNode.innerHTML, "w");
            let targets = Array.from(taskNode.getElementsByClassName("css-eg010m")[0].children).map((value) => value.textContent.trim());
            ns.tprint("Targets: " + targets.toString());
            let currentCoords = new Coordinates(0, 0);
            let matrixElement = taskNode.lastElementChild;
            let side = Math.sqrt(matrixElement.children.length);
            /**@type {[String[]]}*/
            let matrix = [];
            for (let i = 0; i < side; ++i)
                matrix[i] = [];
            let matrixDimensions = new Coordinates(side, side);
            ns.tprint("Side: " + side);
            ns.tprint("Matrix: " + matrix);
            ns.tprint("Len " + matrixElement.children.length);
            Array.from(matrixElement.children)
                .forEach((value, index) => {
                    // ns.tprint(matrix);
                    matrix[Math.floor(index / side)][index % side] = value.innerHTML;
                });
            ns.tprint("Matrix full: " + matrix.toString());
            ns.tprint("Matrix side: " + matrix.length);
            for (let target of targets) {
                ns.tprint("Target: " + target);
                let rawIndex = matrix.flat(3).indexOf(target);
                let targetCoordinates = new Coordinates(rawIndex % side, Math.floor(rawIndex / side));
                ns.tprint("Target coordinates: " + targetCoordinates);
                let route = findShortestPathWiWrap(currentCoords, targetCoordinates, matrixDimensions);
                await navigatePath(ns, route);
                await keyPressAPI(ns, "Space");
                currentCoords = targetCoordinates;
            }
        }

// We wait during the "Get Ready!" page
        while (documentFree.getElementsByClassName("css-1qsxih2").length !== 0) {
            while (Array.from(documentFree.body.getElementsByClassName("css-1qsxih2")).some(
                // while (Array.from(document.children) === null ? true : Array.from(document.children).some(
                (value) => {
                    return value === null ? true : value.innerHTML.includes("Get Ready!");
                })) {
                await ns.sleep(100);
                documentFree = eval("document");
                // ns.tprint(document.textContent);
                // if(document.body.textContent.includes("wires")) {
                //     copyToClipboard(document.getRootNode().textContent)
                //     ns.tprint("Document: ")
                //     ns.tprint(document);
                //     ns.tprint(document.body.innerHTML);
                //     ns.tprint(documentFree.getElementsByClassName("css-1bfln7c").innerHTML);
                //     return;
                // }
            }
            // copyToClipboard("Test");
            // copyToClipboard(Array.from(documentFree.getElementsByClassName("css-1qsxih2")).filter((
            //     (value) => {
            //         return value.innerHTML.includes("Cancel Infiltration")
            //     }))[0].innerHTML)
            await ns.sleep(100);
            // ns.tprint(Array.from(documentFree.body.getElementsByClassName("css-1qsxih2")).length);
            // ns.tprint(Array.from(documentFree.body.getElementsByClassName("css-1qsxih2")).filter((
            //     (value) => {
            //         return value.innerHTML.includes("Cancel Infiltration")
            //     }))[0].innerHTML);
            // let documentNow = document.getRootNode().innerHTML;
            // ns.write("HTML_"+new Date(Date.now()).toDateString().replaceAll(" ","")+".txt",documentNow);
            // return;
            documentFree = eval("document");
            if (documentFree.getElementsByClassName("css-1ro0679").length !== 0 && Array.from(documentFree.getElementsByClassName("css-1ro0679")).some((value) => value.innerHTML.includes("successful"))) {
                while (documentFree.getElementsByClassName("css-lg118y").length === 0) {
                    await ns.sleep(100);
                    documentFree = eval("document");
                }
                Array.from(documentFree.getElementsByClassName("css-lg118y")).find((element) => element.textContent.includes("Sell for")).click();
                ns.run(ns.getScriptName(), {spawnDelay: 1000}, targetCompany);
                ns.exit();
            }
            documentFree.body.getElementsByClassName("css-jhk36g")[0].click();
            let challengeList = [
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
            if (documentFree.body.getElementsByClassName("css-1qsxih2").length === 1
                && documentFree.body.getElementsByClassName("css-1qsxih2")[0].innerHTML.includes("Cancel Infiltration"))
                page = documentFree.body.getElementsByClassName("css-1qsxih2")[0];
            else if (documentFree.body.getElementsByClassName("css-1qsxih2").length === 0)
                throw Error("Wrong window, does not have css-1qsxih2!");
            else
                page = Array.from(documentFree.body.getElementsByClassName("css-1qsxih2")).filter(((value) => {
                    return value.innerHTML.includes("Cancel Infiltration");
                }))[0];
            // Find the right child that has the task
            let taskNode = Array.from(page.children).find((value) => {
                return value.classList.toString().match(/css-9bcezy|css-12f8zm3/) === null;
            });
            if (taskNode === undefined)
                continue;
            let taskTitle = taskNode.children[0];
            ns.tprint(taskTitle.innerHTML);
            // enumerate through the task types to find the one to be done
            let correctType = "";
            for (let type of challengeList)
                if (taskTitle.innerHTML.includes(type)) {
                    correctType = type;
                    break;
                }
            ns.tprint("Type: " + correctType);
            ns.toast("Type: " + correctType, "info");
            // ns.tprint(document);
            // ns.tprint(document.body.innerHTML);
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
                    if (minePath == [])
                        break;

                    // Make a matrix using the class MuiTypography-body1
                    let linearMatrix = Array.from(taskNode.getElementsByClassName("MuiTypography-body1"));
                    let side = Math.sqrt(linearMatrix.length);
                    let matrix = [];
                    for (let lineNbr = 0; lineNbr < side; lineNbr++) {
                        matrix[lineNbr] = [];
                    }
                    for (const nodeIndex in linearMatrix) {
                        let x = nodeIndex % side;
                        let y = (nodeIndex - x) / side;
                        matrix[y][x] = linearMatrix[nodeIndex];
                    }

                    // Locate the indexes with the class css-6zml06 for the mines
                    let mineList = [];
                    for (const matrixY in matrix) {
                        for (const matrixX in matrix[matrixY]) {
                            if (matrix[matrixY][matrixX].classList.contains("css-6zml06"))
                                mineList.push(new Coordinates(matrixX, matrixY));
                        }
                    }
                    ns.tprint("Mine list: " + mineList.toString());
                    // Determine the best path
                    let path = algorithmPathing(ns, mineList, new Coordinates(0, 0), side);
                    // Test that path reaches everything
                    // Store the best path
                    minePath = path;
                    ns.tprint(path.toString());
                    // Break
                    break;
                case "Mark all the mines":
                    // If there is no path stored, throw an error
                    if (minePath == [])
                        throw GeolocationPositionError;
                    // Follow the best path
                    for (let oneMinePath of minePath) {
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
        documentFree = eval("document")
    }catch(Exception){
        ns.run(ns.getScriptName(), {spawnDelay: 1000}, targetCompany);
    }
}

//css-1ro0679 -> Start infiltration (entre autres)
//css-1qsxih2 ->
/**
 * @param {Coordinates} start
 * @param {Coordinates} end
 * @param {Coordinates} arrayDimensions
 * @returns {(string[] | number[])[]}
 */
function findShortestPathWiWrap(start, end, arrayDimensions) {
    let answer = [""].filter(() => false);
    let movement = [0].filter(() => false);
    let directions = { "x": { "-": "a", "+": "d" }, "y": { "-": "w", "+": "s" } };
    for (let dimension of ["x", "y"]) {
        let distanceSE = Math.abs(start[dimension] - end[dimension]);
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
    y;
    /**@type {number} x*/
    x;
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return "X: " + this.x + " Y: " + this.y;
    }
}

/**
 * @param {*[]} locationsArray
 * @param {Coordinates} startingLocation
 * @param {number} mapSideLength
 * @returns {[]}
 */
function dijkstra(locationsArray, startingLocation, mapSideLength) {
    class Node {
        /**@type {Coordinates} location*/
        location;
        /**@type {Path} pathToNode*/
        pathToNode;
        /**@type {boolean} found*/
        found = false;
        /**@type {boolean} permanent*/
        permanent = false;
        /**
         * @param {Coordinates} location
         * @param {Path} pathToNode
         */
        constructor(location, pathToNode) {
            this.location = location;
            this.pathToNode = pathToNode;
        }
        update(pathToNode) {
            if (pathToNode.length < this.pathToNode.length) {
                this.pathToNode = pathToNode;
            }
            this.found = true;
        }
    }
    class Path {
        /**@type {Node|null} previousNode*/
        previousNode;
        /**@type {number} length*/
        length;
        /**
         * @param {Node|null} previousNode
         * @param {number} lengthOfPath
         */
        constructor(previousNode, lengthOfPath) {
            this.previousNode = previousNode;
            this.length = lengthOfPath;
        }
    }

    let nodeMap = locationsArray.map((value) => { return new Node(value, new Path(null, 100000)); });
    let startingLocationNode = new Node(startingLocation, new Path(null, 0));
    startingLocationNode.found = true;
    nodeMap.unshift(startingLocationNode);
    while (nodeMap.some((node) => (!node.permanent))) {
        nodeMap.sort((a, b) => {
            return a.pathToNode.length - b.pathToNode.length;
        });
        let permanentsIndex = nodeMap.map((node, index) => (node.permanent ? index : null)).filter((value) => value !== null);
        let foundsIndex = nodeMap.map((node, index) => ((node.permanent !== node.found) ? index : null)).filter((value) => value !== null);
        let virginsIndex = nodeMap.map((node, index) => (node.found ? null : index)).filter((value) => value !== null);
        // for (const foundI of foundsIndex) { // Nope, it should only take the first of the founds, the one which has the lowest path, before reloading and sorting them out again
        let foundI = foundsIndex[0];
        nodeMap[foundI].permanent = true;
        for (const updateI of virginsIndex.concat(foundsIndex.slice(1))) {
            let distance = nodeMap[foundI].pathToNode.length + findShortestPathWiWrap(nodeMap[foundI].location, nodeMap[updateI].location, mapSideLength)[1].reduce((previous, current) => previous + current);
            nodeMap[updateI].update(distance);
        }
        //}
    }
    return nodeMap;
}

/**
 * @param {Array} locationsArray
 * @param {Coordinates} startingLocation
 * @param {number} mapSideLength
 * @returns {[]}
 */
function algorithmPathing(ns, locationsArray, startingLocation, mapSideLength) {
    // let visitedArray = [];
    let unvisitedArray = locationsArray.slice();
    let fullPath = [];
    ns.tprint(unvisitedArray.toString());
    while (unvisitedArray.length !== 0) {
        let closestNode = [null, 100000, 0, null];
        for (const location2VisitIndex in unvisitedArray) {
            let location2Visit = unvisitedArray[location2VisitIndex];
            ns.print("Location: " + location2Visit.toString());
            let path = findShortestPathWiWrap(startingLocation, location2Visit, new Coordinates(mapSideLength, mapSideLength));
            ns.print(path.toString());
            if (path[1][0] + path[1][1] < closestNode[1])
                closestNode = [location2Visit, path[1][0] + path[1][1], location2VisitIndex, path];
        }
        ns.print(closestNode);
        // visitedArray = unvisitedArray.shift()
        startingLocation = unvisitedArray.splice(closestNode[2], 1)[0];
        fullPath.push(closestNode[3]);
    }
    return fullPath;
}