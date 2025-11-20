import { compressPrimes, decompressPrimes, runLengthEncode, runLengthDecode } from "functions.js"
let done = false;
/** @param {NS} ns */
export async function main(ns) {
    //ns.tail()
    let limit = ns.args[0];
    let primesKnown = [];
    /*if (ns.fileExists("./PrimeNumbers.txt")) {
        let file = ns.read("./PrimeNumbers.txt");
        let primeList = decompressPrimes(await runLengthDecode(file));
        if (primeList[primeList.length - 1] >= limit) { primesKnown = primeList }
    }*/
    //ns.tprint("Sieve about 2 start")
    //ns.tprint(primesKnown);
    //await ns.sleep(1000);
    let primes = await segmentedSieve(ns, limit, primesKnown);
    //ns.tprint("Sieve finished")
    await ns.sleep(1000);
    //while (true) { await ns.asleep(1000) }
    let sPrimes = compressPrimes(primes);
    let cPrimes = runLengthEncode(ns,sPrimes);
    //ns.write("PrimeNumbers.txt", cPrimes, "w");
    ns.writePort(1, { name: "Prime Numbers", data: cPrimes, loop: false });
    //ns.tprint("Sieve stored")
}
/** @param {NS} ns 
 *  @param {Number} limit
 *  @param {Number[]} smallPrimes*/
async function simpleSieve(ns, limit, smallPrimes) {
    let sieve = new Array(limit + 1);
    smallPrimes.forEach(function (value) { sieve[value] = true })
    sieve[0] = sieve[1] = false; // 0 and 1 are not prime numbers

    for (let i = 2; i * i <= limit; i++) {
        if (sieve[i] !== false) {
            for (let j = i * i; j <= limit; j += i) {
                sieve[j] = false;
                //if ((j % 100000 == 0) && (i != 100000)) { await ns.asleep(); }
            }
        }
    }

    let primes = [];
    for (let i = 2; i <= limit; i++) {
        if (sieve[i] !== false) {
            primes.push(i);
        }
    }

    return primes;
}

/** @param {NS} ns 
 *  @param {Number} n*/
async function segmentedSieve(ns, n, smallPrimes = []) {
    let limit = Math.floor(Math.sqrt(n)) + 1;
    let primes = await simpleSieve(ns, limit, smallPrimes); // Step 1: Find small primes up to sqrt(n)
    let low = limit;
    let high = 2 * limit;

    // To store all primes up to n
    let result = [...primes];  // Add small primes to the result array

    // Step 2: Use small primes to sieve segments of size `limit`
    while (low < n) {
        if (high > n) {
            high = n;
        }

        // Create a boolean array for marking primes in the current segment
        let sieve = new Array(high - low + 1).fill(true);

        // Mark multiples of primes in the current range
        for (let i = 0; i < primes.length; i++) {
            let prime = primes[i];

            // Find the minimum number in [low..high] that is a multiple of prime
            let base = Math.floor(low / prime) * prime;
            if (base < low) {
                base += prime;
            }

            // Mark all multiples of prime in the range [low..high]
            for (let j = base; j <= high; j += prime) {
                sieve[j - low] = false;
                if ((j % 1000000 === 0) && (i === 0)) { await ns.asleep(); }
                if ((j % 10000000 === 0) && (i === 0)) {
                    ns.print(j + " " + i + " " + Math.floor(j / n * 100) + "%");
                    await ns.asleep(1000);
                }
            }
        }

        // Collect all primes in this segment
        for (let i = low; i <= high; i++) {
            if (sieve[i - low]) {
                result.push(i);
            }
        }

        // Move to the next segment
        low += limit;
        high += limit;
    }
    done = true;
    return result;
}