import {NS} from "@ns";
import {portReceiver} from "functions";
import * as extension1 from "/cCVExtensions/cCVExtension1";
import * as extension2 from "cCVExtensions/cCVExtension2";
import * as extension3 from "cCVExtensions/cCVExtension3";
import {Lib} from "cCVExtensions/cCVExtension4";
/* import findLargestPrimeFactor from "/cCVExtensions/cCVExtension4/findLargestPrimeFactor";
import {hammingCodesEncodedBinaryToInteger, hammingCodesIntegertoEncodedBinary} from "/cCVExtensions/cCVExtension4/hammingCodes";
import {proper2ColoringOfAGraph} from "/cCVExtensions/cCVExtension4/proper2ColoringOfAGraph";
import {
    compressLZStolen,
    lZCompression,
    lZDecompressionV2,
    rLECompression
} from "/cCVExtensions/cCVExtension4/de-compression_Algorithms";
import {caesarCypher, vigenereCypher} from "/cCVExtensions/cCVExtension4/cyphers";
import {bigIntSquareRoot} from "/cCVExtensions/cCVExtension4/bigIntSquareRoot";*/
let results = "";
let flag : {
    dev: boolean;
    name: string;
    server: string;
} = {dev: false, name: "", server: ""};

/**
 * This function calls the {@link main} of cCV.
 * @param {NS} ns
 * @param {string} name The name of the targeted contract
 * @param {string} server The server hosting the targeted contract
 */
export async function testing(ns: NS, name: string, server: string) {
    await main(ns, true, name, server);
}

/**
 * This function acts as a hub for all the solving functions for the contracts
 * @param {NS} ns
 * @param {boolean} dev Whether or not to run functions that are in active development
 * @param {string} name The name of the targeted contract
 * @param {string} server The server hosting the targeted contract
 */
export async function main(ns: NS, dev: boolean = flag.dev, name: string = flag.name, server: string = flag.server) {

    ns.ui.openTail()

    flag = {dev: dev, name: name, server: server};
    results = ""
    // @ts-ignore
    flag = ns.flags([["dev", flag.dev], ["name", flag.name], ["server", flag.server]]);

    let windowSizes = ns.ui.windowSize();
    ns.ui.moveTail(windowSizes[0] * 1.8 / 3, 0);
    ns.ui.resizeTail(windowSizes[0] / 4, windowSizes[1] / 4);

    /**------------------------------------------------------------------
     *                        Single contract answering
     ------------------------------------------------------------------*/

    if (name !== undefined && name.lastIndexOf(".cct") !== -1) { // In case we're using method arguments, we directly enter them
        await answering(ns, name, server);
        return;
    }

    if (ns.args[0] !== undefined) { // As an alternative to the flags and method calls, we allow the terminal to send the name and server as normal arguments. To verify which one it is, we have to check if dev is true or if the argument is a valid name. Otherwise, we stop the program
        if ((typeof ns.args[0] == "string") && ns.args[0].lastIndexOf(".cct") !== -1) { // Will only try the second condition if the first is true
            await answering(ns, ns.args[0], <string> ns.args[1]);
            return;
        }
    }

    /**------------------------------------------------------------------
     *                        Full internet scan
     *-----------------------------------------------------------------*/

    /** The map of all the servers */
    let serverMap = await portReceiver(ns, "Server Map");
    //Swap between servers
    for (let s of serverMap) {
        let serverName = s[0];
        ns.print("Server name: " + serverName);
        //Get all CC on server
        let contractList = ns.ls(serverName, ".cct");

        //Resolve all CC
        for (let c of contractList) {
            ns.print("Starting answering");
            await ns.sleep(1);
            await answering(ns, c, serverName);
        }
        //await ns.asleep(6000);
    }
    //await ns.sleep(10000);
    //}//Loop off
    if (results === "") {
        results = "Nothing"
    }
    ns.print("INFO Results: " + results);
    let file = "cCV_log.txt";
    ns.write(file, new Date().toDateString() + ":\nResults: " + results + "\n", "a");
    await ns.sleep(600000);
    ns.ui.closeTail();
    ns.spawn(ns.getScriptName(), {preventDuplicates: true, spawnDelay: 1000});
    ns.exit();
}

/**
 This function acts as a hub for all the solving functions for the contracts
 @param {NS} ns
 @param {string} contractName The name of the targeted contract
 @param {string} serverName The server hosting the targeted contract
 */
async function answering(ns: NS, contractName: string, serverName: string) {
    let answer = undefined;
    let contractType = ns.codingcontract.getContractType(contractName, serverName)
    ns.print("Generating answer for " + contractName + " of type: " + contractType);
    switch (contractType) {
        default:
            //ns.print("Contract type not handled: " + ns.codingcontract.getContractType(contractName, serverName));
            ns.print("Contract type not handled: " + contractType);
            break;
        case "Find Largest Prime Factor":
            answer = Lib.findLargestPrimeFactor(ns, contractName, serverName);
            break;
        case "Subarray with Maximum Sum":
            answer = await extension1.subarrayWithMaximumSum(ns, contractName, serverName);
            break;
        case "Total Ways to Sum":
            answer = await extension1.totalWaysToSum(ns, contractName, serverName);
            break;
        case "Total Ways to Sum II":
            answer = await extension1.totalWaysToSumII(ns, contractName, serverName);
            break;
        case "Spiralize Matrix":
            answer = await extension1.spiralizeMatrix(ns, contractName, serverName);
            break;
        case "Array Jumping Game":
            answer = await extension1.arrayJumpingGame(ns, contractName, serverName);
            break;
        case "Array Jumping Game II":
            answer = await extension1.arrayJumpingGameII(ns, contractName, serverName);
            break;
        case "Merge Overlapping Intervals":
            answer = await extension2.mergeOverlappingIntervals(ns, contractName, serverName);
            break;
        case "Generate IP Addresses":
            answer = extension2.generateIPAdresses(ns, contractName, serverName);
            break;
        case "Algorithmic Stock Trader I":
            answer = extension2.algoStonksI(ns, contractName, serverName);
            break;
        case "Algorithmic Stock Trader II":
            answer = extension2.algoStonksII(ns, contractName, serverName);
            break;
        case "Algorithmic Stock Trader III":
            answer = extension2.algoStonksIII(ns, contractName, serverName);
            break;
        case "Algorithmic Stock Trader IV":
            answer = extension2.algoStonksIV(ns, contractName, serverName);
            break;
        case "Minimum Path Sum in a Triangle":
            answer = extension3.minimumPathSumInATriangle(ns, contractName, serverName);
            break;
        case "Unique Paths in a Grid I":
            answer = extension3.uniquePathsInAGridI(ns, contractName, serverName);
            break;
        case "Unique Paths in a Grid II":
            answer = extension3.uniquePathsInAGridII(ns, contractName, serverName);
            break;
        case "Shortest Path in a Grid":
            answer = extension3.shortestPathInAGrid(ns, contractName, serverName);
            break;
        case "Sanitize Parentheses in Expression":
            answer = extension3.deathToParentheses(ns, contractName, serverName);
            break;
        case "Find All Valid Math Expressions":
            answer = extension3.findAllValidMathExpressions(ns, contractName, serverName);
            break;
        case "HammingCodes: Integer to Encoded Binary":
            answer = Lib.HammingCodes.hammingCodesIntegertoEncodedBinary(ns, contractName, serverName);
            break;
        case "HammingCodes: Encoded Binary to Integer":
            answer = Lib.HammingCodes.hammingCodesEncodedBinaryToInteger(ns, contractName, serverName);
            break;
        case "Proper 2-Coloring of a Graph":
            answer = Lib.proper2ColoringOfAGraph(ns, contractName, serverName);
            break;
        case "Compression I: RLE Compression":
            answer = Lib.CompressionAlgorithms.rLECompression(ns, contractName, serverName);
            break;
        case "Compression II: LZ Decompression":
            answer = Lib.CompressionAlgorithms.lZDecompressionV2(ns, contractName, serverName);
            break;
        case "Compression III: LZ Compression":
            if (flag.dev) {
                answer = Lib.CompressionAlgorithms.lZCompression(ns, contractName, serverName);
                break;
            }
            answer = Lib.CompressionAlgorithms.compressLZStolen(ns.codingcontract.getData(contractName, serverName))
            break;
        case "Encryption I: Caesar Cipher":
            answer = Lib.Cypher.caesarCypher(ns, contractName, serverName);
            break;
        case "Encryption II: Vigenère Cipher":
            answer = Lib.Cypher.vigenereCypher(ns, contractName, serverName);
            break;
        case "Square Root":
            answer = Lib.bigIntSquareRoot(ns, contractName, serverName, flag.dev);
            break;
    }

    let result;

    if (answer !== undefined) {
        ns.print("Attempting " + contractName + " of type " + contractType);
        result = ns.codingcontract.attempt(answer, contractName, serverName);
    }

    if (result === "") {
        ns.run("beep.js", 1, 1440);
        throw Error("Failed at: " + contractName + " on: " + serverName + " which is a: " + contractType + "\n My answer: " + answer)
    } else if (answer !== undefined) {
        results += "\n " + result
    }
}

/**--------------------------------------------
 * Make all CC-solving algorithms as functions
 --------------------------------------------*/

// noinspection JSUnusedLocalSymbols
/** @param {NS} ns
 *  @param {String} contractName
 *  @param {String} serverName */
async function basicNewFunction(ns: NS, contractName: string, serverName: string) {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let answer;
    return answer;
}

//["Find Largest Prime Factor","Subarray with Maximum Sum","Total Ways to Sum","Total Ways to Sum II","Spiralize Matrix","Array Jumping Game","Array Jumping Game II","Merge Overlapping Intervals","Generate IP Addresses","Algorithmic Stock Trader I","Algorithmic Stock Trader II","Algorithmic Stock Trader III","Algorithmic Stock Trader IV","Minimum Path Sum in a Triangle","Unique Paths in a Grid I","Unique Paths in a Grid II","Shortest Path in a Grid","Sanitize Parentheses in Expression","Find All Valid Math Expressions","HammingCodes: Integer to Encoded Binary","HammingCodes: Encoded Binary to Integer","Proper 2-Coloring of a Graph","Compression I: RLE Compression","Compression II: LZ Decompression","Compression III: LZ Compression","Encryption I: Caesar Cipher","Encryption II: Vigenère Cipher"]

