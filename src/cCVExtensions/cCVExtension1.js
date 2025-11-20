/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
export async function subarrayWithMaximumSum(ns, contractName, serverName) {
	let data = ns.codingcontract.getData(contractName, serverName);
	//ns.tprint(data);
	let max = Math.max.apply(null, data);
	if (max <= 0) { return max }
	function remove0(value) { return value !== 0 }
	data = data.filter(remove0);
	let data1 = [data[0]];
	for (let i = 1; i < data.length; i++) {
		if ((data[i] < 1) && (data1[data1.length - 1] < 1)) { data1[data1.length - 1] += data[i] }
		else { data1[data1.length] = data[i] }
		max = Math.max(Math.max.apply(null, data1), max);
	}
	while (data1[data1.length - 1] < 1) { data1.pop() }
	while (data1[0] < 1) { data1.shift() }
	data1 = data1.filter(remove0);
	//ns.tprint(data1)
	let data2 = [data1[0]];
	for (let i = 1; i < data1.length; i++) {
		if ((data1[i] > -1) && (data2[data2.length - 1] > -1)) { data2[data2.length - 1] += data1[i] }
		else { data2[data2.length] = data1[i] }
		max = Math.max(Math.max.apply(null, data2), max);
	}
	data2 = data2.filter(remove0);
	//ns.tprint(data2)
	let data3 = [];
	for (let i = 0; i < data2.length; i++) {
		if ((data2[i] > -1) && (data2[i - 1] + data2[i] < 1) && (data2[i + 1] + data2[i] < 1)) { data3[data3.length - 1] += data2[i] + data2[i + 1]; i++ }
		else { data3[data3.length] = data2[i] }
		max = Math.max(Math.max.apply(null, data3), max);
	}
	data3 = data3.filter(remove0);
	do {
		ns.print(data3);
		max = Math.max(Math.max.apply(null, data3), max);
		if (data3.length > 2) {
			if (data3[0] > Math.abs(data3[1])) {
				data3[2] = data3[2] + data3[0] + data3[1];
			}
			data3.splice(0, 2);
		}
		else { break; }
		//await ns.sleep();
		/**for (let i of [0, data3.length - 1]) {
			//ns.tprint(Math.round((data3.length - 2 * (i + 1)) / data3.length));
			//if ((i * ((data2.length - 1) - i) === 0) && (data2[i + ((data2.length - 2 * (i + 1)) / data2.length)] + data2[i] < 1)) {
			let max = Math.max.apply(null, data3);
			if ((data3[i + Math.round((data3.length - 2 * (i + 1)) / data3.length)] + data3[i] < 1) && (data3.length > 1) && (data3[i] !== max)) {//for the 1st and the last entry, if there is more than 1 entry
				//ns.tprint(data3)
				ns.print("Bug if")
				data3.splice(i - 1 * Math.round(i / data3.length), 2);
				goodBehavior = false;
			}
			else if ((data3[i + Math.round((data3.length - 2 * (i + 1)) / data3.length)] + data3[i] > -1) && (data3.length > 1) && (data3[i] !== max)) {
				//ns.tprint(data3);
				ns.print("bug else")
				//ns.print(i + 2 * Math.round((data3.length - 2 * (i + 1)) / data3.length))
				//ns.print(i + Math.round((data3.length - 2 * (i + 1)) / data3.length))
				//data3[i + 2 * Math.round((data3.length - 2 * (i + 1)) / data3.length)] += data3[i + Math.round((data3.length - 2 * (i + 1)) / data3.length)] + data3[i];
				data3[i-2] += data3[i-1] + data3[i]
				//data3.splice(i - 1 * Math.round(i / data3.length), 2);
				data3.splice(i-1,2);
				goodBehavior = false;
			}
		}*/
		let dataTemp = data3.filter(remove0);
		if (data3.length !== dataTemp.length) {
			data3 = data3.filter(remove0);
			//goodBehavior = false;
		}
	} while (data3.length !== 1)
	//ns.tprint(data3);
	max = Math.max(Math.max.apply(null, data3), max);
	let sum = 0;
	for (let i of data3) { sum += i; }
	//ns.tprint("Sum: " + sum);

	//ns.tprint(data3);
	let answer;
	if (sum > max) { answer = sum; }
	else { answer = max; }
	/**ns.tprint("Answer: " + answer);
	ns.tprint("Max: " + max);*/
	for (let i of [data, data1, data2, data3]) { ns.print(i) }
	return answer
}
/** @param {NS} ns
 *  @param {String} contractName
 *  @param {String} serverName */
export async function totalWaysToSum(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);

	function countPartitionsObsolete(n, max) {
        let memoization = ""; // Fake statement to avoid errors
		if (n === 0) return 1;// Base case: if n is 0, we have found a valid partition
		if ((n < 0) || (max === 0)) return 0;// If n is negative or max is 0, no valid partition
		for (let i of [[n - max, max], [n, max - 1]]) {//Memoization
			ns.print(memoization)
			ns.print(i)
            // eslint-disable-next-line @typescript-eslint/no-empty-function
			setTimeout(function () { }, 100);
			if (i[0] < 0) { memoization[i[0]] = Array(contractData + 1).fill(0) }
			else {
				if (memoization[i[0]][i[1]] === undefined) {
                    // eslint-disable-next-line no-undef
                    memoization[i[0]][i[1]] = countPartitions(i[0], i[1]);
				}
			}
		}
		// Try to include max in the partition or exclude it
		return memoization[n - max][max] + memoization[n][max - 1];
	}
    // noinspection JSUnusedLocalSymbols
    /**
     * @deprecated
    eslint-disable-next-line @typescript-eslint/no-unused-vars*/
	function numberOfPartitionsObsolete(n) {
		// Start counting partitions of n using numbers from n-1 downwards.
		return countPartitionsObsolete(n, n - 1);
	}
/**
 * Function to calculate the number of ways to write X as a sum of at least two positive integers
 * @param {number} X - The target number
 * @return {number} - Number of distinct partitions with at least two integers
 */
	function partitionSum(X) {
		// Initialize a DP array to store the number of partitions for each number from 0 to X
		let dp = Array(X + 1).fill(0);
		// Base case: there is 1 way to partition 0 (empty partition)
		dp[0] = 1;
		// Fill the DP array, computing the number of ways to partition each number
		for (let i = 1; i < X; i++) {
			for (let j = i; j <= X; j++) {
				dp[j] += dp[j - i];
			}
		}
		// Return dp[X] which holds the number of partitions of X excluding the single partition X
		return dp[X];
	}
	return partitionSum(contractData);
}

/** @param {NS} ns
 *  @param {String} contractName
 *  @param {String} serverName */
export async function totalWaysToSumII(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let target = contractData[0];
	let authorizedG = contractData[1].toSorted(function (a, b) { return a - b });
	let maxIndex = 0;
	let memoization = Array(target + 1).fill(null).map(() => Array(authorizedG.length).fill(null))
	/**
	 * Recursive function to find the number of ways to sum to 'n' using numbers starting from 'index'
	 * @param {Number} n - Remaining target sum
	 * @param {Number} index - Current index in authorizedG
	 * @return {Number} - Number of ways to sum to 'n'  */
	function ways(n, index) {
		let count;
		if (n === 0) { return 1 }
		if (n < 0 || index === authorizedG.length) { return 0; }
		if (memoization[n][index] !== null) { return memoization[n][index]; }
		count = ways(n - authorizedG[index], index) + ways(n, index + 1);
		memoization[n][index] = count;
		return memoization[n][index]
	}
	return ways(target, maxIndex);
}

/** @param {NS} ns
 *  @param {String} contractName
 *  @param {String} serverName */
export async function spiralizeMatrix(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let finished = false;
	let position = [0, 0];//[x,y]
	let horizontalMvmt = 1;//1=true/h,0=false/v
	let backOrForth = 1;//1=forward,-1=backward
	let columnDone = 0;
	let lineDone = 0;
	let trace = [[0, 0]];
	let lengthMax;
	let answer = [];
	if (!Array.isArray(contractData[0])) { lengthMax = contractData.length }
	else { lengthMax = contractData.length * contractData[0].length }
	for (let i of contractData) { ns.print(i); }
	while (!finished) {
		answer.push(contractData[position[1]][position[0]]);
		trace.push(position);
		let newPosition = [position[0] + horizontalMvmt * backOrForth, position[1] + (1 - horizontalMvmt) * backOrForth];
		if ((newPosition[0] === contractData[position[1]].length - Math.ceil(columnDone / 2)) || (newPosition[1] === contractData.length - Math.floor(lineDone / 2))) {//reach right-top or right-bottom
			lineDone += horizontalMvmt;
			columnDone += 1 - horizontalMvmt;
			horizontalMvmt = 1 - horizontalMvmt;//switch vertical-horizontal Mvmt
			backOrForth = backOrForth - 2 * horizontalMvmt
		}
		else if ((newPosition[0] === Math.floor(columnDone / 2) - 1) || (newPosition[1] === Math.floor(lineDone / 2) - 1)) {//reach left-top or left-bottom
			lineDone += horizontalMvmt;
			columnDone += 1 - horizontalMvmt;
			horizontalMvmt = 1 - horizontalMvmt;//switch vertical-horizontal Mvmt
			backOrForth = backOrForth - 2 * horizontalMvmt * backOrForth
		}
		newPosition = [position[0] + horizontalMvmt * backOrForth, position[1] + (1 - horizontalMvmt) * backOrForth];
		if (trace.length === lengthMax + 1) { finished = true; }
		else { position = newPosition; }
	}
	return answer
}

/** @param {NS} ns
 *  @param {String} contractName
 *  @param {String} serverName */
export async function arrayJumpingGame(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let memoization = Array(contractData.length).fill(null).map(() => Array(contractData.length).fill(undefined))
	function jumping(n, jump) {
		if (n + jump >= contractData.length - 1) { return 1 }
		if ((n < 0) || (jump === 0)) { return 0 }
		if (memoization[n][jump] !== undefined) { return memoization[n][jump] }
		let included = jumping(n + jump, contractData[n + jump])
		let excluded = jumping(n, jump - 1)
		let result = Math.max(included, excluded);
		memoization[n][jump] = result;
		return result;
	}
	return jumping(0, contractData[0])
}

/** @param {NS} ns
 *  @param {String} contractName
 *  @param {String} serverName */
export async function arrayJumpingGameIIAttempt(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let memoization = [];
	// Recursive function to check if we can reach the first index from position `n`
	function reverseJumping(n) {
		// Base case: if we are at position 0, we can successfully reach the start
		if (n === 0) {
			return 1;
		}
		// Try to jump to `n` from any earlier position `i`
		for (let i = 0; i < n; i++) {
			if (i + contractData[i] >= n) {
				// If we can jump from `i` to `n`, recursively check if we can get to `i`
				if (memoization[i] === undefined) { memoization[i] = reverseJumping(i) }
				if (memoization[i] !== 0) {
					return memoization[i];
				}
			}
		}
		// If no jump can reach the start, return 0
		return 0;
	}
	// Start the recursion from the last index
	return reverseJumping(contractData.length - 1);
}
/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
export async function arrayJumpingGameII(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let n = contractData.length;

	if (n === 1) return 0;  // If there's only one element, no jump is needed

	let jumps = 0;           // Number of jumps made
	let farthest = 0;        // The farthest point we can reach so far
	let currentEnd = 0;      // The current range we're jumping within

	for (let i = 0; i < n - 1; i++) {
		// Update the farthest position we can reach from position i
		farthest = Math.max(farthest, i + contractData[i]);

		// If we have reached the end of the current jump's range
		if (i === currentEnd) {
			jumps++;           // Increment jump count
			currentEnd = farthest;  // Update the range for the next jump

			// If the current end is already beyond or at the last index, we're done
			if (currentEnd >= n - 1) {
				return jumps;
			}
		}
	}

	// If we exit the loop without reaching the last index, it's impossible
	return 0;
}