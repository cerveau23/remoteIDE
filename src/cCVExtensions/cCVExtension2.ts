import { NS } from "@ns"

/**
 * @param {NS} ns
 * @param {string} contractName
 * @param {string} serverName
 * @returns {Promise<String>} */
export async function mergeOverlappingIntervals(ns: NS, contractName: string, serverName: string): Promise<string> {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    ns.print(contractData)
    contractData.sort(function (a:number[], b:number[]) {
        return a[0] - b[0]
    });
    let goodBehavior = false;
    while (!goodBehavior) {
        goodBehavior = true;
        for (let i in contractData) {
            for (let b in contractData) {
                if (i === b) {
                    continue;
                }
                if ((contractData[b][0] >= contractData[i][0]) && (contractData[b][1] <= contractData[i][1])) {
                    contractData.splice(b, 1);
                    goodBehavior = false;
                    break;
                }//b is completely within i
                if ((contractData[b][0] >= contractData[i][0]) && (contractData[b][0] <= contractData[i][1]) && (contractData[b][1] >= contractData[i][1])) {
                    let iPair = contractData[i];
                    let bPair = contractData[b];
                    contractData.splice(b, 1);
                    contractData.splice(i, 1, [iPair[0], bPair[1]]);
                    goodBehavior = false;
                    break;
                }//i and b overlap each other, with i being lower and b being higher
            }
            if (!goodBehavior) {
                break;
            }
        }
    }
    ns.print(contractData);
    return contractData;
}

// noinspection JSUnusedGlobalSymbols
/**
 * @param {NS} ns
 * @param {string} contractName
 * @param {string} serverName
 * @returns {Promise<string[]>}
 * @deprecated */
export async function generateIPAdressesSelfMade(ns: NS, contractName: string, serverName: string): Promise<string[]> {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let answer: string[] = [];
    let contractArray = [];
    for (let i = 0; i < contractData.length; i++) {
        contractArray.push(contractData[i]);
    }

    /**
     * @param {Number} n
     * @param {string[]} previous
     * @returns {void}*/
    function IPmaker(n: number, previous: string[]): void {//n = position of the new dot, previous = passed array
        //await ns.asleep(1);
        /*ns.print(answer);
        ns.print(previous);*/
        if (n === previous.length) {
            return;
        }
        if ((previous[n] !== "0") && (previous[n - 1] !== ".") && (previous[n] !== ".") && (n !== 0)) {
            let newer = previous.toSpliced(n, 0, ".");
            let string = "";
            for (let i = 0; i < newer.length; i++) {
                string += newer[i]
            }
            let nope = false;
            let megaNope = false
            let insurranceArray = string.split(".");
            for (let i in insurranceArray) {
                if (parseInt(insurranceArray[i]) > 255) {
                    if (parseInt(i) !== insurranceArray.length - 1) {
                        megaNope = true;
                    }
                    nope = true;
                }
                if (parseInt(insurranceArray[i]) + "" !== insurranceArray[i]) {
                    nope = megaNope = true
                }
            }
            if (insurranceArray.length !== 4) {
                nope = true;
                if (insurranceArray.length > 4) {
                    megaNope = true;
                }
            } else if (parseInt(insurranceArray[insurranceArray.length - 1]) > 255) {
                nope = megaNope = true;
            }
            if (!nope) {
                answer.push(string);
            }
            if (!megaNope) {
                IPmaker(n + 1, newer);
            }
        } else if (previous[n] === "0" && (previous[n - 1] !== ".") && (n !== 0)) {
            let newer = previous.toSpliced(n, 0, ".");
            newer.splice(n + 2, 0, ".");
            if (newer[newer.length - 1] === ".") {
                newer.pop()
            }
            let string = "";
            for (let i = 0; i < newer.length; i++) {
                string += newer[i]
            }
            let nope = false;
            let megaNope = false
            let insurranceArray = string.split(".");
            for (let i : number = 0 ; i < insurranceArray.length; ++i) {
                if (parseInt(insurranceArray[i]) > 255) {
                    if (i !== insurranceArray.length - 1) {
                        megaNope = true;
                    }
                    nope = true;
                }
            }
            if (insurranceArray.length !== 4) {
                nope = true;
                if (insurranceArray.length > 4) {
                    megaNope = true;
                }
            } else if (parseInt(insurranceArray[insurranceArray.length - 1]) > 255) {
                nope = megaNope = true;
            }
            if (!nope) {
                answer.push(string);
            }
            if (!megaNope) {
                IPmaker(n + 1, newer);
            }
        }
        IPmaker(n + 1, previous);
    }

    IPmaker(0, contractArray);
    ns.print(answer);
    return answer;
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @return {string[]} */
export function generateIPAdresses(ns: NS, contractName: string, serverName: string): string[] {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let answer : string[] = [];

    /**
     * Helper function to check if a segment is a valid octet
     * @param {string} segment
     * @returns {boolean}
     */
    function isValidOctet(segment: string): boolean {
        if (segment.length > 1 && segment[0] === '0') return false; // No leading 0s
        let num = parseInt(segment);
        return num >= 0 && num <= 255;
    }

    /**
     * Recursive function to generate all valid IP addresses.
     * @param {Number} start
     * @param {Number[]} parts
     */
    function recursiveIP(start: number, parts: number[]) {
        // Base case: If we have 4 parts and we're at the end of the string, it's a valid IP
        if (parts.length === 4) {
            if (start === contractData.length) {
                answer.push(parts.join('.')); // Join octets to form the IP address
            }
            return;
        }
        if (parts.length > 4) {
            return
        }

        // Try placing dots by adding a new octet of length 1 to 3
        for (let len = 1; len <= 3; len++) {
            if (start + len <= contractData.length) {
                let part = contractData.substring(start, start + len);
                if (isValidOctet(part)) {
                    recursiveIP(start + len, [...parts, part]);
                }
            }
        }
    }

    // Start recursion with the first character and an empty IP address
    recursiveIP(0, []);

    // Return the final list of valid IP addresses
    return answer;
}

/** @param {NS} ns
 *  @param {string} [contractName=""]
 *  @param {string} [serverName=""]
 *  @param {Array} [researchArray=[]]
 *  @returns {number} */
export function algoStonksI(ns: NS, contractName: string = "", serverName: string = "", researchArray: Array<any> = []): number {
    let contractData: any[];
    if (researchArray.length !== 0) {
        contractData = researchArray
    } else {
        contractData = ns.codingcontract.getData(contractName, serverName);
    }
    let memory: number[] = [];
    if (contractData.length < 2) {
        return 0
    }

    /**
     * @param {Number} n
     * @param {Number} origin Useless??? TODO!
     * @returns {number}
     */
    function trader(n: number, origin: number): number {
        if (n >= contractData.length) {
            return 0
        }
        if (memory[n] === undefined) {
            memory[n] = Math.max(trader(n + 1, origin), contractData[n]);
        }
        return memory[n]
    }

    let arrayBest = [];
    for (let i : number = 0; i < contractData.length; ++i) {
        let traderAnswer = trader(contractData.length - 1 - i, contractData.length - 1 - i);
        arrayBest.push((traderAnswer - contractData[contractData.length - 1 - i]) * Math.sign(traderAnswer));
    }
    arrayBest.sort(function (a, b) {
        return b - a
    });
    return arrayBest[0];
}

/**
 * @param {NS} ns
 * @param {string} contractName
 * @param {string} serverName
 * @param {Array} [outsourceArray=[]]
 * @returns {Number} */
export function algoStonksII(ns: NS, contractName: string, serverName: string, outsourceArray: Array<any> = []): number {
    let contractData
    if (outsourceArray.length !== 0) {
        contractData = outsourceArray
    } else {
        contractData = ns.codingcontract.getData(contractName, serverName);
    }
    let totalProfit = 0;

    // Loop through the prices to find all opportunities for profit
    for (let i : number = 0; i < contractData.length - 1; i++) {
        // If the price on day i+1 is higher than day i, make a profit
        if (contractData[i + 1] > contractData[i]) {
            totalProfit += contractData[i + 1] - contractData[i];
        }
    }

    return totalProfit;  // Return the total profit we can make
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @returns {Number} */
export function algoStonksIII(ns: NS, contractName: string, serverName: string): number {
    return algoStonksIV(ns, contractName, serverName, 2);
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @param {Number} [maxTransactions = 0]
 *  @returns {Number} */
export function algoStonksIV(ns: NS, contractName: string, serverName: string, maxTransactions: number = 0): number {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let k;
    let prices;
    if (maxTransactions !== 0) {
        k = maxTransactions;
        prices = contractData;
    } else {
        k = contractData[0];
        prices = contractData[1];
    }
    let n = prices.length;
    if (n <= 1) return 0;  // No stock prices available, no profit possible

    // Edge case 1: If only 1 transaction is allowed, use algoStonksI
    if ((k === 1) || (n === 2)) {
        return algoStonksI(ns, contractName, serverName, prices);
    }

    // Edge case: if k >= n/2, it's equivalent to unlimited transactions
    if (k >= Math.floor(n / 2)) {
        return algoStonksII(ns, contractName, serverName, prices);  // Use the unlimited transactions solution
    }

    // For the general case with k transactions, use the DP approach
    let dp = Array(k + 1).fill(0).map(() => Array(n).fill(0));

    // Dynamic programming to calculate maximum profit for up to k transactions
    for (let t = 1; t <= k; t++) {
        let maxDiff = -prices[0];  // Keep track of the best buy opportunity
        for (let d = 1; d < n; d++) {
            // Update the dp table for t transactions at day d
            dp[t][d] = Math.max(dp[t][d - 1], prices[d] + maxDiff);

            // Update maxDiff to keep track of the best buy price up to day d
            maxDiff = Math.max(maxDiff, dp[t - 1][d] - prices[d]);
        }
    }
    // The maximum profit will be in dp[k][n - 1], i.e., the last day with k transactions
    return dp[k][n - 1];
}