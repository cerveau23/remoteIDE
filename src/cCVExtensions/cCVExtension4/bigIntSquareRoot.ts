import {NS} from "@ns";

/**
 *  A function that roots a bigint.
 *  Works by successively testing the powers of two until it becomes higher than the target;
 *  then, it goes back one lower and adds it to the answer. Repeat until we reach the end.
 *  @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @param {boolean} [dev = false]
 *  @returns {string} */
export function bigIntSquareRoot(ns: NS, contractName: string, serverName: string, dev: boolean = false): string {
    let contractData: bigint = ns.codingcontract.getData(contractName, serverName); // Get the string with the number
    if (contractData == 0n || contractData == 1n) // Handle simple edge cases
        return contractData.toString();
    let target = BigInt(contractData); // The number to root
    let answer = 0n;
    let previousAnswer = 0n;
    while ((answer * answer) < target) { // As long as we're lower than the target, we keep increasing
        let bit = 1n;
        while (((bit + answer) * (bit + answer)) <= target) { // While we're lower or equal to the target, we keep increasing
            bit <<= 1n; // Shift the bits to the left, effectively doubling the value
        }
        bit >>= 1n; // Shift the bit to the right, effectively dividing by two, in order to go just before we overtook the target
        if (bit === 0n) // If we reached 0 by shifting 0001 to the right (becoming 0000), this means we're equal to the target
            break;
        previousAnswer = answer.valueOf(); // Storing in case we overshoot the target by mistake
        answer += bit; // Adding the current value
    }
    // Testing for single digit mistakes
    if (target > (answer * answer)) { // If we're lower than the target, we must check if a higher number is better
        //Typically if the integer over the exact answer is closer to it than our current approximation
        if (target < (answer + 1n) * (answer + 1n)) {  // In case the algorithm is bugged and doesn't give the closest value,
            // We make sure the next value is higher than the target
            while (target - (answer * answer) > (((answer + 1n) * (answer + 1n)) - target))
                answer += 1n;
        } else while (target - (answer * answer) > (target - ((answer + 1n) * (answer + 1n))))
            answer += 1n;
    } else if (target - (previousAnswer * previousAnswer) < (answer * answer) - target) // In the case of previousAnswer being closer to the target than answer
        answer = previousAnswer;
    if (dev) {
        ns.print("Answer: " + answer.toString());
        ns.print("Square: " + (answer * answer).toString());
        ns.print("Difference: " + (target - (answer * answer)).toString());
    }
    return answer.toString();
}