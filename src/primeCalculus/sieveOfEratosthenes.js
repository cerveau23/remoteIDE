/** @param {NS} ns */
export async function main(ns) {
	//Function that returns an array with all the prime numbers under $limit
	ns.ui.openTail();
	let limit = ns.args[0];
	// Create an array of true values, each index corresponds to a number
	let sieve = [[]];
	ns.tprint("Sieve started");
	await ns.sleep(1000);
	if (ns.fileExists("PrimeNumbers.txt")) {
		let file = ns.read("PrimeNumbers.txt");
		let primeList = file.split(',');
		primeList = primeList.map(element => element.trim());
		primeList = primeList.filter(element => element !== "");
		for (let n of primeList) {
			if (sieve[Math.floor(n / 1000000)] === undefined) { sieve[Math.floor(n / 1000000)] = [] }
			sieve[Math.floor(n / 1000000)][n % 1000000] = true
		}
	}
	sieve[0][0] = sieve[0][1] = false; // 0 and 1 are not prime numbers

	// Mark multiples of each prime starting from 2
	for (let i = 0; i * i <= limit; i++) {
		if (sieve[Math.floor(i / 1000000)][i % 1000000] !== false) {
			for (let j = i * i; j <= limit; j += i) {/*ns.print(j);
			ns.print("Math.floor(j / 1000000)="+Math.floor(j / 1000000))
			ns.print("j % 1000000="+j % 1000000)*/
				if (sieve[Math.floor(j / 1000000)] === undefined) { sieve.push([false]) }
				if (sieve[Math.floor(j / 1000000)][j % 1000000] === undefined) {
					sieve[Math.floor(j / 1000000)][j % 1000000] = false;
					//await ns.sleep(1);
					if ((j % 50000 === 0) && (i !== 50000)) { await ns.asleep(1); }
					if ((j % 1000000 === 0) && (i !== 1000000)) {
						ns.print(j + " " + i);
						await ns.sleep(1000)
					}
				}
			}
		}
		//await ns.sleep(1);
	}

	// Collect all primes
	let primes = [];
	for (let j in sieve) {
		for (let i in sieve[j]) {
			if (sieve[j][i] !== false) {
				primes.push(j + i);
				//await ns.sleep(1);
			}
		}
	}
	ns.writePort(1, { name: "Prime Numbers", data: primes, loop: false });
	ns.write("PrimeNumbers.txt", primes.toString(), "w");
	ns.tprint("Sieve finished")
}