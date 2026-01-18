import {NS} from "@ns";

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @param {Number} [outsourced = 0]
 *  @returns {string} */
export function hammingCodesIntegertoEncodedBinary(ns: NS, contractName: string, serverName: string, outsourced: number = 0): string {
    let contractData;
    if (outsourced !== 0) {
        contractData = outsourced;
    } else {
        contractData = ns.codingcontract.getData(contractName, serverName);
    }
    switch (contractData) {
        case 0:
            return "0000"
        case 1:
            return "1111"
        case 2:
            return "111100"
        case 3:
            return "001111"
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    function hammingEncode(value: string): string {
        // Convert to binary string without leading zeroes
        const dataBits = parseInt(value).toString(2).split("");
        // Calculate minimum required parity bits for the given data length
        const numParityBits = Math.ceil(Math.log2(dataBits.length + Math.ceil(Math.log2(dataBits.length)) + 1));
        // Build the encoded array with "x" placeholders for parity bits
        const encodedBits = [];
        let dataBitIndex = 0;
        for (let i = 0; i < dataBits.length + numParityBits; i++) {
            if ((i & (i + 1)) === 0) {  // If i is 2^N, set as a parity bit
                encodedBits.push("x");
            } else {
                encodedBits.push(dataBits[dataBitIndex++]);
            }
        }

        /**
         * Function to calculate parity for each 2^N position
         * @param {string[]} encodedBits
         */
        function setParityBits(encodedBits: string[]) {
            for (let p = 0; p < numParityBits; p++) {
                const position = Math.pow(2, p);
                let parity = 0;
                // Alternate between reading 'position' bits and skipping 'position' bits
                for (let i = position - 1; i < encodedBits.length; i += 2 * position) {
                    for (let j = i; j < i + position && j < encodedBits.length; j++) {
                        if (encodedBits[j] === "1") parity ^= 1;  // Toggle parity for each 1 bit
                    }
                }
                encodedBits[position - 1] = parity.toString();
            }
        }

        // Calculate parity bits for each 2^N position
        setParityBits(encodedBits);
        // Set the overall parity bit at position 0
        const overallParity = encodedBits.reduce((count, bit) => count + (bit === "1" ? 1 : 0), 0) % 2;
        encodedBits.unshift(overallParity.toString());  // Insert overall parity at the start
        return encodedBits.join("");
    }

    let answer = hammingEncode(contractData);
    if (answer[answer.length - 1] === "x") {
        answer = answer.slice(0, answer.length - 1)
    }
    return answer;
}

// noinspection JSUnusedGlobalSymbols
/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @deprecated */
export async function hammingCodesIntegertoEncodedBinaryHomemade(ns: NS, contractName: string, serverName: string) {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let binaryString = contractData.toString(2);
    ns.print(`Binary Representation: ${binaryString}`);

    // Pad binary string to ensure it's of a manageable length
    let binaryArray = binaryString.split("").map(Number);

    function initializeHammingCode() {
        binaryArray.unshift(0);
        let i = 0;
        while (Math.pow(2, i) < binaryArray.length) {
            binaryArray.splice(Math.pow(2, i), 0, 0);  // Add parity bits at power-of-2 positions
            i++;
        }
    }

    function setHammingCode() {
        // Set each parity bit based on the bits it covers
        for (let i = 0; i <= Math.log2(binaryArray.length); i++) {  // Use <= here
            let position = Math.pow(2, i);
            let sum = 0;
            // Calculate parity bit by checking positions covered by the parity bit
            for (let j = position; j < binaryArray.length; j++) {
                if (((j + 1) & position) !== 0) {  // Check if bit is set in position
                    sum += binaryArray[j];
                }
            }
            binaryArray[position] = sum % 2;
        }
        // Calculate overall parity bit at position 0
        let overallSum = binaryArray.reduce((acc: number, val: number) => acc + val, 0);
        binaryArray[0] = overallSum % 2;
    }

    initializeHammingCode();
    ns.print(binaryArray);
    setHammingCode();
    ns.print(binaryArray);
    let sum = 0;
    binaryArray.forEach((value: number) => {
        sum += value
    })
    ns.print(sum)
    await ns.sleep(100);
    //throw (Error);
    return binaryArray;
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @returns {Number} */
export function hammingCodesEncodedBinaryToInteger(ns: NS, contractName: string, serverName: string): number {
    let contractDataRaw = ns.codingcontract.getData(contractName, serverName);
    // Convert to array
    let contractData : number[] = contractDataRaw.split("").map(Number);
    //Check for errors
    let position: number = 0;
    for (let i = 0; i < contractData.length; ++i) {
        if (contractData[i] === 1) {
            position ^= i
        }
    }
    contractData[position] = 1 - contractData[position]
    /**function errorCorrectionHomemade(parityBit) {
     let position;
     switch (parityBit) {
     case -1:
     //In case the entire string is odd
     position = []
     for (let i = 0; i < numParityBits; i++) { position.unshift(errorCorrection(i)) }
     console.log(position);
     position = arrayToString(position)
     console.log(position);
     position = parseInt(position, 2);
     console.log(position);
     //return position
     contractData[position] = 1 - contractData[position]
     default:
     position = Math.pow(2, parityBit);
     let parity = 0;
     // Alternate between reading 'position' bits and skipping 'position' bits
     for (let i = position - 1; i < contractData.length; i += 2 * position) {
     for (let j = i; j < i + position && j < contractData.length; j++) {
     if (contractData[j] === 1) parity ^= 1;  // Toggle parity for each 1 bit
     }
     }
     let answer;
     if (contractData[position] === parity.toString()) { answer = 0 }
     else { answer = 1 }
     //return (contractData[position] + parity.toString()) % 2;
     return answer;
     }
     }*/
        // Extract data bits by filtering out positions that are powers of 2 as well as the 1st bit
    let binaryAnswer = contractData.filter((val, ind) => {
            return (Math.log2(ind) % 1 !== 0) && (ind !== 0)
        });
    while (binaryAnswer[0] === 0) {
        binaryAnswer.shift();
    }
    let answer = parseInt(binaryAnswer.join(""), 2);
    return answer;
}