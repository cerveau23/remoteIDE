import {testing} from "codingContractVirus"
import {average, sum} from "functions"

let endl = "\n";
let tab = "\t";

// noinspection JSUnusedGlobalSymbols
/**
 * The cCVTester script is used to test the capabilities of the coding contract virus or cCV.
 * @param {NS} ns
 * @param type The type of contract the function shall test
 * @param massTest Whether or not to test the algorithm 1000 times
 * @param ultimateTest Tests the coding contract virus against every type of contract
 */
export async function main(ns, type = "-", massTest = false, ultimateTest = false) {
    let data = ns.flags([["type", type], ["massTest", massTest], ["ultimateTest", ultimateTest], ["help", false]]);
    ns.tprint(data);

    if(data.help){
        helpInfo(ns);
        return;
    }

    if(data.ultimateTest){
        await ultimate(ns);
        return;
    }

    await dataPrompter(data, ns);

    if (data.massTest) {
        await massTesting(ns, data.type);
    } else {
        await singleTesting(ns, data.type);
    }
}

/**
 * Contains the code for displaying the help message
 * @param {NS} ns
 */
function helpInfo(ns) {
    ns.tprint(
        "The cCVTester script is used to test the capabilities of the coding contract virus or cCV.", endl,
        "Not setting a parameter will, in most cases, result in a prompt to request the user's input", endl,
        "The different parameters are the following:", endl,
        tab, "type", tab, tab, "followed by a string with the name of a contract type, it determines which type is tested", endl,
        tab, "massTest", tab, "a boolean, it determines whether or not to test the algorithm 1000 times", endl,
        tab, "ultimateTest", tab, "a boolean, it will test the coding contract virus against every type of contract. Good PC recommended");
}

/**
 * Goes through all the types of CC and triggers a mass test for each of them.
 * @param {NS} ns
 */
async function ultimate(ns) {
    let tests = [];
    let success = true;
    let failedTests = [];

    for (let type in ns.enums.CodingContractName) {
//        const promise = massTesting(ns, ns.enums.CodingContractName[type])
        const promise = massTesting(ns, `${type}`)
            .catch(e => {
                ns.tprint("Error at type: ", type);
                failedTests.push(type);
                ns.tprint("Error log:");
                ns.tprint(e.message);
                success = false;
            });

        tests.push(promise);

        if (tests.length >= 4) {
            await Promise.race(tests);
            tests = tests.filter(p => !p.done);
        }
        await ns.asleep(100)
    }
    await Promise.all(tests);
    if(success) ns.tprint("Total Success!");
    else ns.tprint("Failed contract types: ", failedTests);
}

/**
 * Prompts the user for additional data (if the type is not set) or confirmation (if massTest is not set)
 * @param {{[p: string]: string | number | boolean}} data
 * @param {NS} ns
 */
async function dataPrompter(data, ns) {
    if (data.type === "-") {
        data.type = await ns.prompt("Type:", {type: "select", choices: ns.codingcontract.getContractTypes()})
    }
    if (!data.massTest) {
        data.massTest = await ns.prompt("Mass Testing?", {type: "boolean"})
    }
    ns.tprintRaw("run cCVTester.js --type \"" + data.type + "\" " + (data.massTest ? "--massTest " : "") + (data.ultimateTest ? "--ultimateTest" : ""))
}

/**
 * Calls {@link singleTesting} 1000 times and updates the player on the completion progress,
 * while keeping the window active
 * @param {string} type the type of CC to test
 * @param {NS} ns
 */
async function massTesting(ns, type) {
    let lastTimePercent = Date.now();
    let allTimesPercent = [];
    let lastTime = Date.now();
    for (let i = 0; i < 1000; i++) {
        // let CC = ns.codingcontract.createDummyContract(data.type);
        // //ns.run("codingContractVirus.js",1,CC,"home");
        // await testing(ns, CC, "home");
        let contractName = await singleTesting(ns, type)
        if(ns.fileExists(contractName)) {
            ns.tprint(Math.floor(i / 10) + "% finished, Time used: " + ns.formatNumber((Date.now() - lastTimePercent) / 1000) + "s, Contract failure!");
            return;
        }
        //if(i%10==0){await ns.sleep();}
        if ((i % 100 === 0) && (i !== 0)) {
            allTimesPercent.push(Date.now() - lastTimePercent);
            ns.print(average(allTimesPercent) * (100 - i / 10) / 1000)
            ns.tprint(i / 10 + "% finished, Time used: " + ns.formatNumber((Date.now() - lastTimePercent) / 1000) + "s, Estimated time remaining: " + ns.formatNumber(average(allTimesPercent) * (10 - i / 100) / 1000) + "s");
            lastTimePercent = Date.now();
        }
        if ((Date.now() - lastTime) > 10) {
            await ns.asleep(Date.now() - lastTime);
            lastTime = Date.now();
        }
        //await ns.sleep();
    }
    ns.tprint("Success! Total time: " + ns.formatNumber(sum(allTimesPercent) / 1000) + "s");
}

/**
 * Creates a fake CC and asks the cCV to solve it
 * @param {string} type the type of CC to test
 * @param {NS} ns
 */
async function singleTesting(ns, type) {
    let CC = ns.codingcontract.createDummyContract(type);
    await testing(ns, CC, "home");
    return CC;
}