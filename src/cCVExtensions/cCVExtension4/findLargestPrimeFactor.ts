import {NS} from "@ns";
import {decompressPrimes, runLengthDecode, sieveOfEratosthenes} from "/functional/functions";

/**
 * @param {NS} ns
 * @param {string} contractName
 * @param {string} serverName
 * @returns {Number}
 */
export function findLargestPrimeFactor(ns: NS, contractName: string, serverName: string): number {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let maxPrime = 0;
    while (contractData % 2 === 0) {
        contractData /= 2
        maxPrime = 2
    }
    for (let i = 3; i <= Math.sqrt(contractData) + 1; i += 2) {
        while (contractData % i === 0) {
            contractData /= i
            maxPrime = i
        }
    }
    if (contractData > 2) {
        maxPrime = contractData
    }
    return maxPrime
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @deprecated */
export async function findLargestPrimeFactorObsolete(ns: NS, contractName: string, serverName: string) {
    let number = ns.codingcontract.getData(contractName, serverName);
    /*    ns.tprint("1000 miles to go") */
    await ns.sleep(1000);
    let primeArray: any;
    let primeNumbers: (any[] | number)[] = [[], 0];
    if (primeNumbers[1] < number) {
        primeArray = await sieveOfEratosthenes(ns, number);
        primeArray = decompressPrimes(await runLengthDecode(primeArray))
        let smolPrimes = [2, 3, 5, 7]
        let bigPrimes = smolPrimes.filter((a) => {
            return number % a === 0
        }).map((a) => {
            return number / a
        })
        if (primeArray.length === 0) {
            primeArray = bigPrimes
        }
        primeArray.unshift(smolPrimes)
        /* ns.tprint("Sieve obtained"); */
        await ns.sleep(1000);
        primeNumbers = [primeArray, number];
    } else {
        primeArray = primeNumbers[0]
    }
    /* ns.print(primeArray) */
    let maxPrime;
    for (let p of primeArray) {
        if (number % p === 0) {
            maxPrime = p
        }
    }
    ns.print(maxPrime)
    if (maxPrime === undefined) {
        maxPrime = number
    }
    ns.atExit(function () {
        if (ns.fileExists("./PrimeNumbers.txt")) {
            ns.rm("PrimeNumbers.txt")
        }
    })
    /* throw Error() */
    return maxPrime
}