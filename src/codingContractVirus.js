import { portReceiver, sieveOfEratosthenes, decompressPrimes, runLengthEncode, runLengthDecode } from "functions";
import * as extension1 from "cCVExtensions/cCVExtension1";
import * as extension2 from "cCVExtensions/cCVExtension2";
import * as extension3 from "cCVExtensions/cCVExtension3";
let results = "";
let flag = { dev: false };
//let timer = 20000;
//let workingTimers = [];
export default async function testing(ns, name, server) {
	flag.dev = true
	await main(ns, name, server);
}
/** @param {NS} ns */
export async function main(ns, name = undefined, server = undefined) {
	results = ""
	ns.ui.openTail();
	if (!flag.dev) { flag = ns.flags([["dev", false]]); }
	let windowSizes = ns.ui.windowSize();
	ns.ui.moveTail(windowSizes[0] * 2 / 3, 0);
	ns.ui.resizeTail(windowSizes[0] / 4, windowSizes[1] / 4);
	if ((name !== undefined)
		&& (name.lastIndexOf(".cct") !== -1)) {
		await answering(ns, name, server);
		return
	}
	else if ((name !== undefined)
		&& (!flag.dev)) { ns.ui.closeTail(name) }
	if (typeof ns.args[0] == "string") {
		if ((ns.args[0] !== undefined)
			&& (ns.args[0].lastIndexOf(".cct") !== -1)) {
			await answering(ns, ns.args[0], ns.args[1]);
			return
		}
	}
	else if ((ns.args[0] !== undefined)
		&& (!flag.dev)) { ns.ui.closeTail(ns.args[0]) }
	let serverMap = await portReceiver(ns, "Server Map");
	//Swap between servers
	for (let s of serverMap) {
		let serverName = s[0];
		//Get all CC on server
		let contractList = ns.ls(serverName, ".cct");

		//Resolve all CC
		for (let c of contractList) {
			ns.print("Starting answering");
			await ns.sleep();
			await answering(ns, c, serverName);
		}
		//await ns.asleep(6000);
	}
	//await ns.sleep(10000);
	//}//Loop off
	if (results === "") { results = null }
	ns.print("INFO Results: " + results);
	await ns.sleep(600000);
	ns.spawn(ns.getScriptName(), { preventDuplicates: true, spawnDelay: 1 }, ns.pid);
}
async function answering(ns, contractName, serverName) {
	let answer = undefined;
	let contractType = ns.codingcontract.getContractType(contractName, serverName)
	switch (contractType) {
		default:
			//ns.print("Contract type not handled: " + ns.codingcontract.getContractType(contractName, serverName));
			ns.print("Contract type not handled: " + contractType);
			break;
		case "Find Largest Prime Factor":
			answer = await findLargestPrimeFactor(ns, contractName, serverName);
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
			answer = await extension2.generateIPAdresses(ns, contractName, serverName);
			break;
		case "Algorithmic Stock Trader I":
			answer = await extension2.algoStonksI(ns, contractName, serverName);
			break;
		case "Algorithmic Stock Trader II":
			answer = await extension2.algoStonksII(ns, contractName, serverName);
			break;
		case "Algorithmic Stock Trader III":
			answer = await extension2.algoStonksIII(ns, contractName, serverName);
			break;
		case "Algorithmic Stock Trader IV":
			answer = await extension2.algoStonksIV(ns, contractName, serverName);
			break;
		case "Minimum Path Sum in a Triangle":
			answer = await extension3.minimumPathSumInATriangle(ns, contractName, serverName);
			break;
		case "Unique Paths in a Grid I":
			answer = await extension3.uniquePathsInAGridI(ns, contractName, serverName);
			break;
		case "Unique Paths in a Grid II":
			answer = await extension3.uniquePathsInAGridII(ns, contractName, serverName);
			break;
		case "Shortest Path in a Grid":
			answer = await extension3.shortestPathInAGrid(ns, contractName, serverName);
			break;
		case "Sanitize Parentheses in Expression":
			answer = await extension3.deathToParentheses(ns, contractName, serverName);
			break;
		case "Find All Valid Math Expressions":
			answer = await extension3.findAllValidMathExpressions(ns, contractName, serverName);
			break;
		case "HammingCodes: Integer to Encoded Binary":
			answer = await hammingCodesIntegertoEncodedBinary(ns, contractName, serverName);
			break;
		case "HammingCodes: Encoded Binary to Integer":
			answer = await hammingCodesEncodedBinaryToInteger(ns, contractName, serverName);
			break;
		case "Proper 2-Coloring of a Graph":
			answer = await proper2ColoringOfAGraph(ns, contractName, serverName);
			break;
		case "Compression I: RLE Compression":
			answer = await rLECompression(ns, contractName, serverName);
			break;
		case "Compression II: LZ Decompression":
			answer = await lZDecompression(ns, contractName, serverName);
			break;
		case "Compression III: LZ Compression":
			if (flag.dev) { answer = await lZCompression(ns, contractName, serverName); }
			break;
		case "Encryption I: Caesar Cipher":
			answer = await caesarCypher(ns, contractName, serverName);
			break;
		case "Encryption II: Vigenère Cipher":
			answer = await vigenereCipher(ns, contractName, serverName);
			break;
	}
	let result;
	if (answer !== undefined) {
		ns.print("Attempting " + contractType); 
		result = ns.codingcontract.attempt(answer, contractName, serverName); 
	}
	if (result === "") {
		ns.run("beep.js", 1, 1440);
		throw Error("Failed at: " + contractName + " on: " + serverName + " which is a: " + contractType + "\n My answer: " + answer)
	}
	else if (answer !== undefined) { results += "\n " + result }
}
//Make all CC-solving algorythms as functions
/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
// async function findLargestPrimeFactorObsolete(ns, contractName, serverName) {
// 	let number = ns.codingcontract.getData(contractName, serverName);
// 	//ns.tprint("1000 miles to go")
// 	await ns.sleep(1000);
// 	let primeArray;
// 	if (primeNumbers[1] < number) {
// 		primeArray = await sieveOfEratosthenes(ns, number);
// 		primeArray = decompressPrimes(await runLengthDecode(primeArray))
// 		let smolPrimes = [2, 3, 5, 7]
// 		let bigPrimes = smolPrimes.filter((a) => { return number % a === 0 }).map((a) => { return number / a })
// 		if (primeArray.length === 0) { primeArray = bigPrimes }
// 		primeArray.unshift(smolPrimes)
// 		//ns.tprint("Sieve obtained");
// 		await ns.sleep(1000);
// 		primeNumbers = [primeArray, number];
// 	}
// 	else { primeArray = primeNumbers[0] }
// 	//ns.print(primeArray)
// 	let maxPrime;
// 	for (let p of primeArray) {
// 		if (number % p === 0) { maxPrime = p }
// 	}
// 	ns.print(maxPrime)
// 	if (maxPrime === undefined) { maxPrime = number }
// 	ns.atExit(function () {
// 		if (ns.fileExists("./PrimeNumbers.txt")) { ns.rm("PrimeNumbers.txt") }
// 	})
// 	//throw Error()
// 	return maxPrime
// }
async function findLargestPrimeFactor(ns, contractName, serverName) {
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
	if (contractData > 2) { maxPrime = contractData }
	return maxPrime
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
// async function hammingCodesIntegertoEncodedBinaryHomemade(ns, contractName, serverName) {
// 	let contractData = ns.codingcontract.getData(contractName, serverName);
// 	let binaryString = contractData.toString(2);
// 	ns.print(`Binary Representation: ${binaryString}`);
//
// 	// Pad binary string to ensure it's of a manageable length
// 	let binaryArray = binaryString.split("").map(Number);
//
// 	function initializeHammingCode() {
// 		binaryArray.unshift(0);
// 		let i = 0;
// 		while (Math.pow(2, i) < binaryArray.length) {
// 			binaryArray.splice(Math.pow(2, i), 0, 0);  // Add parity bits at power-of-2 positions
// 			i++;
// 		}
// 	}
// 	function setHammingCode() {
// 		// Set each parity bit based on the bits it covers
// 		for (let i = 0; i <= Math.log2(binaryArray.length); i++) {  // Use <= here
// 			let position = Math.pow(2, i);
// 			let sum = 0;
// 			// Calculate parity bit by checking positions covered by the parity bit
// 			for (let j = position; j < binaryArray.length; j++) {
// 				if (((j + 1) & position) !== 0) {  // Check if bit is set in position
// 					sum += binaryArray[j];
// 				}
// 			}
// 			binaryArray[position] = sum % 2;
// 		}
// 		// Calculate overall parity bit at position 0
// 		let overallSum = binaryArray.reduce((acc, val) => acc + val, 0);
// 		binaryArray[0] = overallSum % 2;
// 	}
// 	initializeHammingCode();
// 	ns.print(binaryArray);
// 	setHammingCode();
// 	ns.print(binaryArray);
// 	let sum = 0;
// 	binaryArray.forEach((value) => { sum += value })
// 	ns.print(sum)
// 	await ns.sleep(100);
// 	//throw (Error);
// 	return binaryArray;
// }
/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName 
 *  @param {Number} outsourced*/
export async function hammingCodesIntegertoEncodedBinary(ns, contractName, serverName, outsourced = 0) {
	let contractData;
	if (outsourced !== 0) { contractData = outsourced; }
	else { contractData = ns.codingcontract.getData(contractName, serverName); }
	switch (contractData) {
		case 0: return "0000"
		case 1: return "1111"
		case 2: return "111100"
		case 3: return "001111"
	}
	function hammingEncode(value) {
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
		// Function to calculate parity for each 2^N position
		function setParityBits(encodedBits) {
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
	if (answer[answer.length - 1] === "x") { answer = answer.slice(0, answer.length - 1) }
	return answer;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function hammingCodesEncodedBinaryToInteger(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	// Convert to array
	contractData = contractData.split("").map(Number);
	//Check for errors
	let position = 0;
	for (let i in contractData) { if (contractData[i] === 1) { position ^= i } }
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
	let binaryAnswer = contractData.filter((val, ind) => { return (Math.log2(ind) % 1 !== 0) && (ind !== 0) });
	while (binaryAnswer[0] === 0) { binaryAnswer.shift(); }
	let answer = parseInt(binaryAnswer.join(""), 2);
	return answer;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function proper2ColoringOfAGraph(ns, contractName, serverName) {
	let [nbrOfVertex, edges] = ns.codingcontract.getData(contractName, serverName);
	let vertices = new Array(nbrOfVertex).fill(undefined);
	let completionIndex = new Array(edges.length).fill(false);
	vertices[edges[0][0]] = 0
	let workInProgress = true;
	edges = edges.map((a) => { return [Number(a[0]), Number(a[1])] });
	while (completionIndex.includes(false)) {
		workInProgress = false;
		for (let i in vertices) if (vertices[i] !== undefined) {
			for (let b of edges.filter((value, index) => { return (value.includes(Number(i))) && (!completionIndex[index]) })) {
				if (b[1] === i) { b = [b[1], b[0]] }//puts the value that is i at position 0
				if (vertices[b[1]] === vertices[i]) { return [] }
				vertices[b[1]] = 1 - vertices[i]
				completionIndex[edges.indexOf(b)] = true;
				workInProgress = true;
			}
		}
		if (!workInProgress && completionIndex.includes(false)) {
			vertices[vertices.indexOf(undefined)] = 0 //Graph is split in two, so we need to initiate the second part
			workInProgress = true
		}
	}
	return vertices;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function rLECompression(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let answer = runLengthEncode(ns, contractData, "m");
	return answer;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function lZDecompression(ns, contractName, serverName, outsourced = "", returnArray = false) {
	let contractData = outsourced
	let dev = false;
	if (contractData === "") { contractData = ns.codingcontract.getData(contractName, serverName); }
	contractData = contractData.split("");
	let answer = "";
	let answerArray = []
	let lastCharWasNumber = "a";
	let chunkType = "L"//L or LX
	let count = 0;
	if (dev) { ns.print(contractData) }
	for (let i in contractData) {
		//ns.print(contractData[i]);
		//ns.print(answer);
		if ((Number(contractData[i]) >= 0) && (((parseInt(lastCharWasNumber) === count) && (chunkType === "LX")) || (count === 0))) {//Number but not within the length of the previous chunk
			if (parseInt(lastCharWasNumber) > 0) {//Last character was a number, meaning we need to reference the earlier parts of the message, except if it was 0
				let x = lastCharWasNumber;
				answerArray[answerArray.length - 1] += ("" + contractData[i])
				do {
					answer += answer.substring(answer.length - contractData[i], x)
					x -= contractData[i]
				}
				while (x > 0)
				lastCharWasNumber = "a";//avoid mistakenly using that as the L part
				count = 0
				chunkType = "L";
				continue;
			}
			else if (contractData[i] === "0") {
				chunkType = (chunkType === "L") ? "LX" : "L";
				answerArray.push("0")
				continue
			}
			else {
				//Last character was a letter, meaning this is the L part
				count = Number(contractData[i])
				answerArray.push(contractData[i])
			}
		}
		else {//Letter
			answer += contractData[i];
			answerArray[answerArray.length - 1] += contractData[i]
			count--
			if (count === 0) { chunkType = (chunkType === "L") ? "LX" : "L"; }
			if (Number(contractData[i]) >= 0) { lastCharWasNumber = "a"; continue }//In case the current character is a number but is not used as an L or X parameter
		}
		lastCharWasNumber = contractData[i];
	}
	if (dev) { ns.print(answer) }
	//throw (Error)
	if (returnArray) { return answerArray }
	return answer;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function lZCompressionV1(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let unprocessed = contractData;
	let answer = "";
	let LCounter = "";
	let i = contractData.length;
	let lastChunkIsL = false
	let debugChunkCounter = -1
	while (i >= 1) {
		let added = false;
		let additions = []
		for (let length = Math.min(Math.ceil(i / 2), 9); length > 1; length--) {
			let [unprocStart, unprocStop, abbStart, abbStop] = [i - (length + 9), i - length, i - length, i]
			let unprocessedSlice = unprocessed.slice(unprocStart, unprocStop);
			let abbreviatedSection = unprocessed.slice(abbStart, abbStop);
			//ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length)
			//ns.print("Reference: " + unprocessedSlice)
			ns.print("Abbreviated section: " + abbreviatedSection)
			ns.print("Current answer: " + answer)
			//ns.print("Original string: "+contractData)
			let repetitions = []
			for (let b = 1; b <= length; b++) {
				let caseInQuestion = abbreviatedSection.slice(abbreviatedSection.length - b);
				let iterations = 0;
				let padding = "";
				if (abbreviatedSection.at(0) === abbreviatedSection.at(abbreviatedSection.length - 1)) { padding = abbreviatedSection.at(0) }
				let rest = unprocessedSlice + padding + abbreviatedSection.slice(0, abbreviatedSection.length - b)
				let lastPosition = 0;
				while (rest.endsWith(caseInQuestion)) {
					iterations++;
					lastPosition = rest.length - caseInQuestion.length
					rest = rest.slice(0, lastPosition)
				}
				//if(padding!=""){caseInQuestion = caseInQuestion.slice(0,caseInQuestion.length-(padding.length+1))}
				if (iterations !== 0) { repetitions.push([caseInQuestion, iterations, padding]) }
			}
			if (repetitions.length > 0) {
				ns.print(repetitions)
				let best = ["", 0, ""]
				for (let o of repetitions) { best = [best, o].sort(function (a, b) { return b[0].length * b[1] - a[0].length * a[1] })[0] }
				additions.push([unprocessedSlice, abbreviatedSection, best])
			}
			if (unprocessedSlice.includes(abbreviatedSection)) {
				ns.print("Previous answer: " + answer)
				ns.print("Original string: " + contractData)
				ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length)
				ns.print("Reference: " + unprocessedSlice)
				ns.print("1st char at: " + unprocStart + " Last char at: " + (unprocStop - 1))
				ns.print("Abbreviated section: " + abbreviatedSection)
				ns.print("1st char at: " + abbStart + " Last char at: " + (abbStop - 1))
				added = true
				additions.push([unprocessedSlice, abbreviatedSection]);
			}
		}
		if (added) {
			let setback = 0;
			let length = 0;
			let caseInQuestion
			for (let b in additions) {
				let newLength = 0;
				let newSetback = 0;
				let newCaseInQuestion = additions[b]
				if (Array.isArray(newCaseInQuestion[2])) {//Meaning this is a repetition case
					newLength = newCaseInQuestion[2][0].length * newCaseInQuestion[2][1]
					newSetback = newCaseInQuestion[2][0].length - newCaseInQuestion[2][2].length
					//if(caseInQuestion[0].includes(caseInQuestion[2][0])&& (length === caseInQuestion[1].length)){}
				}
				else {
					newLength = newCaseInQuestion[1].length
					newSetback = newCaseInQuestion[0].length - newCaseInQuestion[0].indexOf(newCaseInQuestion[1])
				}
				let best = [[length, setback, caseInQuestion], [newLength, newSetback, newCaseInQuestion]].sort(function (a, b) { return b[0] - a[0] });
				[length, setback, caseInQuestion] = best[0];
				ns.print(newLength, newSetback)
			}
			ns.print("Previous answer: " + answer)
			ns.print("Original string: " + contractData)
			ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length)
			ns.print("Reference: " + caseInQuestion[0])
			ns.print("Abbreviated section: " + caseInQuestion[1])
			let tempLength = length
			while (tempLength > 0) {
				answer = "" + (tempLength % 9 + Math.sign(Math.floor(tempLength / 9)) * 9) + setback + LCounter + answer;
				tempLength = tempLength - 9
			}
			ns.print("New answer: " + answer)
			LCounter = 0;
			debugChunkCounter += 2
			lastChunkIsL = false
			if (length >= 9) { i = i - (length) }// + 1)}//Repetitions 9-long need an additional setback
			else { i -= length }
		}
		else {
			if (lastChunkIsL === true) { answer = contractData[i - 1] + "0" + answer; lastChunkIsL = false }
			else { answer = contractData[i - 1] + answer; }
			i--;
			LCounter++;
			if (LCounter === 10) {
				answer = "" + 9 + answer;
				LCounter = 0;
				lastChunkIsL = true
				debugChunkCounter++
			}
		}
		//await ns.sleep(100)
		let debugStopper = 7
		//if ((debugChunkCounter >= debugStopper)) { throw Error(debugChunkCounter) }
	}
	if (LCounter !== 0) { answer = "" + LCounter + answer; }
	ns.print(answer)
	//throw (Error)
	//return answer;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function lZCompressionV2(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let unprocessed = contractData;
	let answerArray = [];
	let emergencyReplacementArray = [];
	let answer = "";
	let LCounter = "";
	let i = contractData.length;
	let lastChunkIsL = false
	let debugChunkCounter = -1
	let dev = false;
	while (i >= 1) {
		let added = false;
		let additions = []
		//for (let length = Math.min(Math.ceil(i / 2), 9); length > 0; length--) {
		for (let length = Math.min(i, 9); length > 0; length--) {
			//for (let length = Math.max(Math.ceil(i / 2), Math.min(9, i)); length > 0; length--) {
			let [unprocStart, unprocStop, abbStart, abbStop] = [Math.max(i - (length + 9), 0), i - length, i - length, i]
			let unprocessedSlice = unprocessed.slice(unprocStart, unprocStop);
			let abbreviatedSection = unprocessed.slice(abbStart, abbStop);
			if (dev) { ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length) }
			if (dev) { ns.print([unprocStart, unprocStop, abbStart, abbStop]) }
			ns.print("Reference: " + unprocessedSlice)
			ns.print("Abbreviated section: " + abbreviatedSection)
			ns.print("Current answer: " + answerArray)
			ns.print("Original string: " + contractData)
			let repetitions = []
			let best = repetition(abbreviatedSection, unprocessedSlice);
			if (best[0][2] !== 1) {
				/*if (best[1] > 0) { additions.push([unprocessedSlice, abbreviatedSection, best[0], false]); added = true }
				else if (best[1] === -1) { additions.push([unprocessedSlice, abbreviatedSection, best[0], true]); added = true }*/
				additions.push([unprocessedSlice, abbreviatedSection, best[0], best[0][3]]); added = true
			}
			else {
				additions.push([unprocessedSlice, abbreviatedSection, 1, best[0][3]]); added = true
			}
			if (dev) { ns.print(additions) }
			function repetition(abbreviatedSection, unprocessedSlice, firstTime = 8) {
				for (let b = 1; b <= abbreviatedSection.length; b++) {
					let caseInQuestion = abbreviatedSection.slice(abbreviatedSection.length - b);
					let iterations = 0;
					let padding = "";
					if (dev) { ns.print("Case in question: " + caseInQuestion) }
					/**for (let i = 0; i < abbreviatedSection.length/2; i++) {
						if (abbreviatedSection.at(0 + i) === abbreviatedSection.at(- 1 - i)) { padding = abbreviatedSection.at(0 + i)+padding; ns.print(padding); ns.print("Padding on!") }
						else { break; }
					}*/
					let rest = unprocessedSlice.slice(-b) + abbreviatedSection.slice(0, abbreviatedSection.length - b)
					let indexFirst = rest.concat(caseInQuestion).indexOf(caseInQuestion);
					if (dev) { ns.print("Rest: " + rest) }
					if (dev) { ns.print("Index First: " + indexFirst + " unprocLeng " + rest.length + rest.indexOf(caseInQuestion)) }
					if ((indexFirst < rest.length)
						&& (indexFirst !== -1)
						&& (rest.indexOf(caseInQuestion) === -1)) {
						padding = caseInQuestion.slice(0, -(rest.length - indexFirst - caseInQuestion.length))
						if (dev) { ns.print("Padding in process") }
						if (padding === caseInQuestion) { padding = "" }
					}
					rest += padding
					if (dev) { ns.print("Rest padded: " + rest) }
					let lastPosition = 0;
					while (rest.endsWith(caseInQuestion)) {
						iterations++;
						lastPosition = rest.length - caseInQuestion.length
						rest = rest.slice(0, lastPosition)
					}
					//if(padding!=""){caseInQuestion = caseInQuestion.slice(0,caseInQuestion.length-(padding.length+1))}
					if (dev) { ns.print([caseInQuestion, iterations, padding]) }
					if (iterations !== 0) { repetitions.push([caseInQuestion, iterations, padding, firstTime]) }
					if (rest.includes(caseInQuestion)) {
						repetitions.push([rest, caseInQuestion, 1, firstTime]);
					}
				}
				if ((firstTime >= 0) && ((unprocStart - (9 - firstTime)) >= 0)) { repetition(unprocessed.slice(abbStart - (9 - firstTime), abbStop - (9 - firstTime)), unprocessed.slice(unprocStart - (9 - firstTime), unprocStop - (9 - firstTime)), firstTime - 1) }
				let best = ["", 0, "", 1, 8]
				if (repetitions.length > 0) {
					for (let o of repetitions) {
						let bestLength = (best[2] !== 1) ? best[0].length * best[1] : best[1].length;
						let oLength = (o[2] !== 1) ? o[0].length * o[1] : o[1].length;
						best = [[best, bestLength], [o, oLength]].sort((a, b) => b[1] - a[1])[0][0]
						/*if (o[3] === undefined) { best = [best, o].sort(function (a, b) { return (b[0].length * b[1]) * ((b[0].length * b[1]) % 10) - (a[0].length * a[1]) * ((a[0].length * a[1]) % 10) })[0]; if (dev) { ns.print("Best: " + best) } }
						else { best = [best, o].sort(function (a, b) { return (b[1].length) - (a[0].length * a[1]) * ((a[0].length * a[1]) % 10) })[0] }*/
					}
				}
				/*let bestLength = (best[3] === undefined) ? best[0].length * best[1] : best[1].length;
				if (lastChunkIsL && firstTime && (abbreviatedSection.length > 1)) if (answerArray[0].length < 9) { //&& (best === 0)) {
					let bestAfterward = repetition(unprocessed.slice(abbStart - 1, abbStop - 1), unprocessed.slice(unprocStart - 1, unprocStop - 1))
					if (dev) { ns.print("Best after: " + bestAfterward) }
					if (bestAfterward[3] === undefined) {
						if (bestAfterward[1] != 0) {
							bestAfterward = bestAfterward[0]
							if (bestLength === 0) { return [bestAfterward, -1] }
							if (bestAfterward[0].length * bestAfterward[1] > bestLength) { return [bestAfterward, -1] }
						}
					}
					else {
						if (bestLength === 0) { return [bestAfterward, -1] }
						if (bestAfterward[1].length > bestLength) { return [bestAfterward, -1] }
					}
				}*/
				return [best, best[4] !== 8 ? -1 : best[0].length * best[1]]
			}
			if (unprocessedSlice.includes(abbreviatedSection)) {
				ns.print("Previous answer: " + answerArray)
				ns.print("Original string: " + contractData)
				ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length)
				ns.print("Reference: " + unprocessedSlice)
				ns.print("1st char at: " + unprocStart + " Last char at: " + (unprocStop - 1))
				ns.print("Abbreviated section: " + abbreviatedSection)
				ns.print("1st char at: " + abbStart + " Last char at: " + (abbStop - 1))
				added = true
				additions.push([unprocessedSlice, abbreviatedSection, 1, 8]);
			}
		}
		if (added) {
			let setback = 0;
			let length = 0;
			let caseInQuestion;
			let replacement = "";
			for (let b in additions) {
				let newLength = 0;
				let newSetback = 0;
				let newCaseInQuestion = additions[b]
				let newReplacement = ""
				if (newCaseInQuestion[2] !== 1) {//Meaning this is a repetition case
					newLength = newCaseInQuestion[2][0].length * newCaseInQuestion[2][1]
					newSetback = newCaseInQuestion[2][0].length - newCaseInQuestion[2][2].length
					newReplacement = newCaseInQuestion[2][0].repeat(newCaseInQuestion[2][1]);
					//if(caseInQuestion[0].includes(caseInQuestion[2][0])&& (length === caseInQuestion[1].length)){}
				}
				else {
					newLength = newCaseInQuestion[1].length
					newSetback = newCaseInQuestion[0].length - newCaseInQuestion[0].lastIndexOf(newCaseInQuestion[1])
					newReplacement = newCaseInQuestion[1]
				}
				let best = [[length, setback, caseInQuestion, replacement], [newLength, newSetback, newCaseInQuestion, newReplacement]].sort(function (a, b) { return (b[0] + (b[3][3] ? (-0.5) : 0)) - (a[0] + (a[3][3] ? (-0.5) : 0)) });
				[length, setback, caseInQuestion, replacement] = best[0];
				ns.print(newLength, newSetback, newCaseInQuestion, newReplacement)
			}
			ns.print("Previous answer: " + answerArray)
			ns.print("Original string: " + contractData)
			ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length)
			ns.print("Reference: " + caseInQuestion[0])
			ns.print("Abbreviated section: " + caseInQuestion[1])
			let fusion = false;
			if (!lastChunkIsL && (emergencyReplacementArray.length > 0) && caseInQuestion[3] === 8) {
				//if ((contractData.lastIndexOf(emergencyReplacementArray[0], i - length) - emergencyReplacementArray[0].length - 1 === i - (setback + length) + length) && (parseInt(answerArray[0].slice(0, answerArray[0].length - 1)) + length <= 9) && !caseInQuestion[3]) {
				let foundAt = contractData.lastIndexOf(replacement + emergencyReplacementArray[0], i - length - 1)
				if (((i - length) - foundAt < 9) && (foundAt !== -1) && ((parseInt(answerArray[0].slice(0, - 1)) + length) <= 9)) {
					ns.print("Fusion!")
					let lastAnswer = answerArray.shift();
					let lastReplacement = emergencyReplacementArray.shift();
					i = i - length
					length = length + parseInt(lastAnswer.slice(0, lastAnswer.length - 1))
					setback = (i - contractData.lastIndexOf(replacement + lastReplacement, i - 1))
					replacement = replacement + lastReplacement
					debugChunkCounter -= 1.8
					fusion = true
				}
				else if ((answerArray[0].slice(0, -1) > answerArray[0].slice(-1)) && (answerArray[0].slice(-1) === setback) && (answerArray[0].slice(0, -1) % answerArray[0].slice(-1) === 0) && [1, 2, 3].includes((parseInt(answerArray[0].slice(0, -1)) + length) % 9) && (parseInt(answerArray[0].slice(0, -1)) + length > 9) && (answerArray[1] !== "0") && (9 - answerArray[1].length >= (parseInt(answerArray[0].slice(0, -1)) + length) % 9)) {
					answerArray[1] = replacement + answerArray[1]
					emergencyReplacementArray[1] = replacement + emergencyReplacementArray[1]
					i -= length;
					lastChunkIsL = false
					continue
				}
				else {
					answerArray.unshift("0");
					emergencyReplacementArray.unshift("")
				}
			}
			if (caseInQuestion[3] === 8) {
				i--;
				if (lastChunkIsL) {
					answerArray[0] = contractData[i] + answerArray[0];
					emergencyReplacementArray[0] = contractData[i] + emergencyReplacementArray[0]
				}
				else {
					let character;
					if (contractData[i] === "0") { character = " 0" }
					else { character = "" + contractData[i] }
					answerArray.unshift("" + character);
					emergencyReplacementArray.unshift("" + character)
					lastChunkIsL = true;
				}
				continue;
			}
			answerArray.unshift("" + length + setback)
			emergencyReplacementArray.unshift(replacement)
			/**let tempLength = length
			while (tempLength > 0) {
				answer = "" + (tempLength % 9 + Math.sign(Math.floor(tempLength / 9)) * 9) + setback + LCounter + answer;
				tempLength = tempLength - 9
			}*/
			ns.print("New answer: " + answerArray)
			/*LCounter = 0;*/
			debugChunkCounter += 2;
			lastChunkIsL = false
			if (!fusion) {
				if (length >= 9) { i = i - (length) }// + 1)}//Repetitions 9-long need an additional setback
				else { i -= length }
			}
		}
		else {
			/**if (lastChunkIsL === true) { answer = contractData[i - 1] + "0" + answer; lastChunkIsL = false }
			else { answer = contractData[i - 1] + answer; }
			i--;
			LCounter++;
			if (LCounter === 10) {
				answer = "" + 9 + answer;
				LCounter = 0;
				lastChunkIsL = true
				debugChunkCounter++
			}*/
			i--;
			if (!lastChunkIsL) {
				let character;
				if (contractData[i] === "0") { character = " 0" }
				else { character = "" + contractData[i] }
				answerArray.unshift("" + character);
				emergencyReplacementArray.unshift("" + character)
				lastChunkIsL = true;
				//if((contractData[i] === "6")&&(debugChunkCounter >= 1)){throw Error}
			}
			else {
				answerArray[0] = contractData[i] + answerArray[0];
				emergencyReplacementArray[0] = contractData[i] + emergencyReplacementArray[0]
			}
		}
		//await ns.sleep(100)
		ns.print(answerArray)
		ns.print("Replacement: " + emergencyReplacementArray)
		let debugStopper = 8 - 2
		if ((debugChunkCounter >= debugStopper)) { throw Error(debugChunkCounter + "\n" + answerArray) }
	}
	lastChunkIsL = false;
	const backupArray = answerArray.slice(0);
	if (answerArray[-1] === 0) { answerArray.pop() }
	let b = answerArray.length
	let chunkL
	let secondaryAnswerArray = [0]
	while (b > 0) {
		let tempAnswerArray = []
		b--;
		chunkL = (b % 2 === 0)
		for (let i in secondaryAnswerArray) {
			tempAnswerArray.push(answerArray)
		}
	}
	/*b = 0
	chunkL = undefined;
	while (b < answerArray.length) {
		ns.print(answer)
		let i = answerArray[b];
		if (i === "0") {
			answer += "0";
			lastChunkIsL = !lastChunkIsL;
			b++;
			continue;
		}
		if (!lastChunkIsL) {//meaning this chunk must be an L
			let remainingLetters = i;
			chunkL = (remainingLetters) => {
				let remainingLength = remainingLetters.length;
				while (remainingLength > 0) {
					answer += "" + (Math.floor(remainingLength / 9) === 0 ? remainingLength % 9 : 9) + remainingLetters.slice(0, 9) + 0;
					remainingLetters = remainingLetters.slice(9);
					remainingLength = remainingLetters.length;
				}
				answer = answer.slice(0, -1)
			}
			chunkL(remainingLetters)
		}
		else {
			let setback = i.charAt(i.length - 1);
			let length = i.slice(0, i.length - 1);
			if (length <= 2) {
				function fusionLR() {
					let text = emergencyReplacementArray[b]
					ns.print(answerArray[b])
					ns.print(answerArray[b - 1])
					ns.print(answerArray[b + 1])
					if (![answerArray[b - 1], answerArray[b + 1]].includes(undefined)) { ns.print((parseInt(text.length) + parseInt(!(answerArray[b - 1] === "0") ? answerArray[b - 1].length : 0) + parseInt(!(answerArray[b + 1] === "0") ? answerArray[b + 1].length : 0))) }
					let hello = (b, LXChunk) => {//Rewrite as a recursive function?
						let textLength = 0
						let stoicLength = 0
						let counter = -1
						let best = [0, -1]//[Gain in space, counter at the time]
						do {
							let z = answerArray[b + counter]
							if (z === undefined) { break }
							if (z != "0") {
								textLength += (LXChunk ? parseInt(z.at(0)) : z.length)
								stoicLength += (LXChunk ? (z.length + ((answerArray[b + counter + 1] === "0") ? 1 : 0)) : (z.length + (Math.floor(z.length / 9) + Math.sign(z.length % 9)) * 2 - 1))
							}
							else {//in case the previous chunk was "0"
								stoicLength++
							}
							let gain = stoicLength - (textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
							if (best[0] - (best[1] / 1000) < gain - (counter / 1000)) { best = [gain, counter] }
							LXChunk = !LXChunk;
							counter++;
						}
						while (answerArray[counter + b] != "0")
						if (answerArray[best[1] + b + 1] === "0") { best[1] = counter }
						ns.print(textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
						ns.print(stoicLength)
						return (best)
					}
					function helloRecurse(b, LXChunk) {//Rewrite as a recursive function?
						let textLength = 0
						let stoicLength = 0
						let counter = -1
						let best = [0, -1]//[Gain in space, counter at the time]
						do {
							let z = answerArray[b + counter]
							if (z === undefined) { break }
							if (z != "0") {
								textLength += (LXChunk ? parseInt(z.at(0)) : z.length)
								stoicLength += (LXChunk ? (z.length + ((answerArray[b + counter + 1] === "0") ? 1 : 0)) : (z.length + (Math.floor(z.length / 9) + Math.sign(z.length % 9)) * 2 - 1))
							}
							else {//in case the previous chunk was "0"
								stoicLength++
							}
							let gain = stoicLength - (textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
							if (best[0] - (best[1] / 1000) < gain - (counter / 1000)) { best = [gain, counter] }
							LXChunk = !LXChunk;
							counter++;
						}
						while (answerArray[counter + b] != "0")
						if (answerArray[best[1] + b + 1] === "0") { best[1] = counter }
						ns.print(textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
						ns.print(stoicLength)
						return (best)
					}
					let bestCrunch = hello(b, false)
					ns.print(bestCrunch)
					if (bestCrunch[0] > 0) {
						ns.print("Fusion!")
						if (!(answerArray[b - 1] === "0")) {
							let answerArrayB = answerArray[b - 1].length
							answer = answer.slice(0, -(answerArrayB + (Math.floor(answerArrayB / 9) + Math.sign(answerArrayB % 9)) * 2 - 1))
							text = answerArray[b - 1] + text
						}
						for (let m = 1; m <= bestCrunch[1]; m++) {
							if (answerArray[b + m] != "0") {
								if (m % 2 === 1) {//We're working on an LChunk
									text += answerArray[b + m]
								}
								else {
									text += emergencyReplacementArray[b + m]
								}
							}
						}
						if (answerArray[b - 1] === "0") { answer = answer.slice(0, answer.length - 1) }
						b += bestCrunch[1]//Cases: Arrive on LX, followed by L; Arrive on L; Arrive on LX, followed by 0
						let wrong = false
						if (answerArray[b + 1] === "0") { answerArray.splice(b, 2, text) }//LX followed by 0
						else if ((b % 2 === 0) || (answerArray[b + 1] === undefined)) { answerArray[b] = text }//L
						else {//LX followed by L
							b -= bestCrunch[1]
							wrong = true;
							setback = i.charAt(i.length - 1);
							length = i.slice(0, i.length - 1);
							chunkL(answerArray[b - 1])
						}
						if (!wrong) {
							lastChunkIsL = false;
							ns.print("Fusion: " + text)
							return false;
						}
					}
				}
				//if(fusionLR()==false){continue}
				function fusionRL() {
					let text = emergencyReplacementArray[b]
					ns.print(answerArray[b])
					ns.print(answerArray[b - 1])
					ns.print(answerArray[b + 1])
					if (![answerArray[b - 1], answerArray[b + 1]].includes(undefined)) { ns.print((parseInt(text.length) + parseInt(!(answerArray[b - 1] === "0") ? answerArray[b - 1].length : 0) + parseInt(!(answerArray[b + 1] === "0") ? answerArray[b + 1].length : 0))) }
					let helloReverse = (b) => {//Rewrite as a recursive function?
						let textLength = 0
						let stoicLength = 0
						let counter = answerArray.indexOf("0", b) - 1
						if (counter === -2) { counter = answerArray.length - b - 1 }
						let best = [0, -1]//[Gain in space, counter at the time]
						let LXChunk = (counter + b)%2==1 
						do {
							let z = answerArray[b + counter]
							if (z === undefined) { break }
							if (z != "0") {
								textLength += (LXChunk ? parseInt(z.at(0)) : z.length)
								stoicLength += (LXChunk ? (z.length + ((answerArray[b + counter + 1] === "0") ? 1 : 0)) : (z.length + (Math.floor(z.length / 9) + Math.sign(z.length % 9)) * 2 - 1))
							}
							else {//in case the previous chunk was "0"
								stoicLength++
							}
							let gain = stoicLength - (textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
							if (best[0] - (best[1] / 1000) < gain - (counter / 1000)) { best = [gain, counter] }
							LXChunk = !LXChunk;
							counter--;
						}
						while (counter != -2)
						if (answerArray[best[1] + b + 1] === "0") { best[1] = counter }
						ns.print(textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
						ns.print(stoicLength)
						return (best)
					}
					function helloReverseRecurse(b, LXChunk) {//Rewrite as a recursive function?
						let textLength = 0
						let stoicLength = 0
						let counter = -1
						let best = [0, -1]//[Gain in space, counter at the time]
						do {
							let z = answerArray[b + counter]
							if (z === undefined) { break }
							if (z != "0") {
								textLength += (LXChunk ? parseInt(z.at(0)) : z.length)
								stoicLength += (LXChunk ? (z.length + ((answerArray[b + counter + 1] === "0") ? 1 : 0)) : (z.length + (Math.floor(z.length / 9) + Math.sign(z.length % 9)) * 2 - 1))
							}
							else {//in case the previous chunk was "0"
								stoicLength++
							}
							let gain = stoicLength - (textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
							if (best[0] - (best[1] / 1000) < gain - (counter / 1000)) { best = [gain, counter] }
							LXChunk = !LXChunk;
							counter++;
						}
						while (answerArray[counter + b] != "0")
						if (answerArray[best[1] + b + 1] === "0") { best[1] = counter }
						ns.print(textLength + (Math.floor(textLength / 9) + Math.sign(textLength % 9)) * 2 - 1)
						ns.print(stoicLength)
						return (best)
					}
					let bestCrunch = helloReverse(b)
					ns.print(bestCrunch)
					if (bestCrunch[0] > 0) {
						ns.print("Fusion!")
						if (!(answerArray[b - 1] === "0")) {
							let answerArrayB = answerArray[b - 1].length
							answer = answer.slice(0, -(answerArrayB + (Math.floor(answerArrayB / 9) + Math.sign(answerArrayB % 9)) * 2 - 1))
							text = answerArray[b - 1] + text
						}
						for (let m = 1; m <= bestCrunch[1]; m++) {
							if (answerArray[b + m] != "0") {
								if (m % 2 === 1) {//We're working on an LChunk
									text += answerArray[b + m]
								}
								else {
									text += emergencyReplacementArray[b + m]
								}
							}
						}
						if (answerArray[b - 1] === "0") { answer = answer.slice(0, answer.length - 1) }
						b += bestCrunch[1]//Cases: Arrive on LX, followed by L; Arrive on L; Arrive on LX, followed by 0
						let wrong = false
						if (answerArray[b + 1] === "0") { answerArray.splice(b, 2, text) }//LX followed by 0
						else if ((b % 2 === 0) || (answerArray[b + 1] === undefined)) { answerArray[b] = text }//L
						else {//LX followed by L
							b -= bestCrunch[1]
							wrong = true;
							setback = i.charAt(i.length - 1);
							length = i.slice(0, i.length - 1);
							chunkL(answerArray[b - 1])
						}
						if (!wrong) {
							lastChunkIsL = false;
							ns.print("Fusion: " + text)
							return false;
						}
					}
				}
				if(fusionRL()==false){continue}
			}
			while (length > 0) {
				answer += "" + (Math.floor(length / 9) === 0 ? length % 9 : 9) + setback + 0;
				length -= 9;
			}
			answer = answer.slice(0, -1)
		}
		lastChunkIsL = !lastChunkIsL;
		b++;
	}*/
	/**@param {String[]} array - array to count
	 * @return {String}
	 */
	function getString(array) {
		let answer = ""
		for (let p = 0, h = array[p]; p < array.length; p++, h = array[p]) {
			if (h === "0") { answer += h; }
			else if ((p % 2) === 0) {//Meaning an LChunk
				let newZ = h.slice().toString().replaceAll(" ", "").split("")
				while (newZ.length > 0) {
					answer += "" + Math.min(newZ.length, 9) + newZ.slice(0, Math.min(newZ.length, 9)).join("") + "0";
					if (newZ.length > 9) { newZ = newZ.slice(9) } else { newZ = "" }
				}
				answer = answer.slice(0, -1)//remove the final "0"
			}
			else {//Meaning an LXChunk
				answer += h
			}
		}
		return answer
	}
	/**@param {Any[]} array - array to count
	 * @return {Number}
	 */
	function getLengthV1(array) {
		let answerLength = 0
		for (let i = 0, z = array[i]; i < array.length; i++, z = array[i]) {
			if (z === "0") { answerLength++; }
			else if ((i % 2) === 0) {//Meaning an LChunk
				answerLength += z.length + (Math.floor(z.length / 9) + Math.sign(z.length % 9)) * 2 - 1;
			}
			else {//Meaning an LXChunk
				answerLength += z.length;
			}
		}
		return answerLength
	}
	/**@param {Any[]} array - array to count
	 * @return {Number}
	 */
	function getLength(array) { return getString(array).length }
	let bitLengthArray = [[getLength(answerArray), answerArray]];
	for (let k = answerArray.length - 1 - (((answerArray.length - 1) % 2 === 1) ? 0 : 1), z = "", newBitLengthArray = bitLengthArray.slice(), newArray = []; k > 0; k -= 2, z = "") {
		if (answerArray[k] === "0") { continue }
		if (dev) { ns.print("-------------------------------") }
		if (dev) { ns.print(k) }
		//await ns.asleep(1);
		bitLengthArray.forEach((value) => {
			if (value === null) { return }
			newArray = value[1].slice();
			let before = "", after = "";
			if ((k !== 0) && (newArray[k - 1] !== "0")) before = newArray[k - 1]
			if ((k !== newArray.length - 1) && (newArray[k + 1] !== "0")) after = newArray[k + 1]
			z = before + emergencyReplacementArray[k].slice() + after
			newArray.splice(k - 1, 3, z);
			if (dev) { ns.print(newArray) }
			//newBitLengthArray[index + Math.pow(2, k)] = [getLength(newArray), k, newArray]
			newBitLengthArray.push([getLength(newArray), newArray])
		})
		let newBitLengthArrayOccupied = newBitLengthArray.filter((value) => { return !(value === null) })
		let bitLengthArrayOccupied = bitLengthArray.filter((value) => { return !(value === null) })
		if (dev) { ns.print(newBitLengthArrayOccupied) }
		if (dev) { ns.print("---------------------") }
		if (dev) { ns.print(bitLengthArrayOccupied) }
		if (dev) { ns.print(newBitLengthArrayOccupied.length) }
		if (dev) { ns.print(bitLengthArrayOccupied.length) }
		if (newBitLengthArrayOccupied.length !== bitLengthArrayOccupied.length * 2) {
			let intruders = newBitLengthArray.filter((value, index) => {
				if ((value === bitLengthArray[index]) || (newBitLengthArray[index - 2 ** k] === bitLengthArray[index])) { return false }
				return true
			})
			ns.print(newBitLengthArrayOccupied.length)
			ns.print(bitLengthArrayOccupied.length)
			ns.print(intruders)
			await ns.sleep(1000)
			throw Error(intruders.toString())
		}
		bitLengthArray = newBitLengthArray.slice()
	}
	if (dev) { ns.print(bitLengthArray.filter((value) => { return !(value === null) })) }
	if (dev) { await ns.sleep(500) }
	let bestCombination = bitLengthArray.filter((value) => { return !(value === null) }).sort((a, b) => { return a[0] - b[0] })
	if (dev) { ns.print(bestCombination) }
	if (dev) { await ns.sleep(500) }
	answer = getString(bestCombination[0][1].slice());
	if (dev) { ns.print(answer) }
	if (dev) { await ns.sleep(500) }
	if (((bestCombination[0][1].length % 2 === 1) && (answer.at(-1) === "0")) || ((emergencyReplacementArray.at(-1) === "") && (answer.at(-1) === "0"))) { answer = answer.slice(0, -1) }
	let decompressed = await lZDecompression(ns, "", "", answer);
	let stolenAnswer = compressLZStolen(contractData)
	if (dev) { await ns.sleep(500) }
	ns.print(answerArray)
	ns.print("Original string: " + contractData)
	ns.print("Answer: \n" + answer)
	ns.print("Length is correct?: " + (answer.length === stolenAnswer.length))
	ns.print(stolenAnswer)
	if (dev) { await ns.sleep(500) }
	/*if (answer.length != stolenAnswer.length) {
		ns.print(answer.split("").map((v, i) => {
			if (v === stolenAnswer.split("")[i]) { return "" }
			else { return "" + v + "->" + stolenAnswer.split("")[i] }
		}))
	}*/
	ns.print("Decoding correct?: " + (decompressed === contractData))
	if (decompressed !== contractData) { ns.print(decompressed) }
	ns.print(emergencyReplacementArray)
	ns.print(backupArray)
	ns.print(await lZDecompression(ns, "", "", stolenAnswer, true))
	//await ns.sleep(500)
	//if(arrayToString(emergencyReplacementArray)==contractData)(ns.print("Error!"))
	if ((answer.length === stolenAnswer.length) && (decompressed === contractData)) {
		ns.print("Correct!");
		ns.toast("Correct!", "success")
		return answer;
	}
	else if (flag.dev) { throw Error((debugChunkCounter + 1) + "\n" + answerArray) }
}/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function lZCompressionV3(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let unprocessed = contractData;
	let answerArray = [];
	let emergencyReplacementArray = [];
	let answer = "";
	let i = contractData.length;
	let lastChunkIsL = false
	let debugChunkCounter = -1
	let devBase = true;
	let devrep = false;
	while (i >= 1) {
		let added = false;
		let additions = []
		for (let length = Math.min(i, 9); length > 0; length--) {
			let [unprocStart, unprocStop, abbStart, abbStop] = [Math.max(i - (length + 9), 0), i - length, i - length, i]
			let unprocessedSlice = unprocessed.slice(unprocStart, unprocStop);
			let abbreviatedSection = unprocessed.slice(abbStart, abbStop);
			if (devrep) { ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length) }
			if (devrep) { ns.print([unprocStart, unprocStop, abbStart, abbStop]) }
			if (devBase) {
				ns.print("Reference: " + unprocessedSlice)
				ns.print("Abbreviated section: " + abbreviatedSection)
				ns.print("Current answer: " + answerArray)
				ns.print("Original string: " + contractData)
			}
			let repetitions = []
			if (length === Math.min(i, 9)) {
				let best = repetition(abbreviatedSection, unprocessedSlice);
				ns.print(best)
				//await ns.sleep(10)
				if (best !== -1) {
					/*if (best[1] > 0) { additions.push([unprocessedSlice, abbreviatedSection, best[0], false]); added = true }
					else if (best[1] === -1) { additions.push([unprocessedSlice, abbreviatedSection, best[0], true]); added = true }*/
					additions.push(best); added = true
				}
				if (devrep) { ns.print(additions) }
			}
			function repetition(abbreviatedSection, unprocessedSlice, firstTime = length) {
				for (let b = 1; b <= abbreviatedSection.length; b++) {
					let caseInQuestion = abbreviatedSection.slice(abbreviatedSection.length - b);
					let iterations = 0;
					let padding = "";
					if (devrep) { ns.print("Case in question: " + caseInQuestion) }
					let rest = unprocessedSlice.slice(-b) + abbreviatedSection.slice(0, abbreviatedSection.length - b)
					let indexFirst = rest.concat(caseInQuestion).indexOf(caseInQuestion);
					if (devrep) { ns.print("Rest: " + rest) }
					if (devrep) { ns.print("Index First: " + indexFirst + " unprocLeng " + rest.length + rest.indexOf(caseInQuestion)) }
					if ((indexFirst < rest.length) && (indexFirst !== -1) && (rest.indexOf(caseInQuestion) === -1)) {
						padding = caseInQuestion.slice(0, -(rest.length - indexFirst - caseInQuestion.length))
						if (devrep) { ns.print("Padding in process") }
						if (padding === caseInQuestion) { padding = "" }
					}
					rest += padding
					if (devrep) { ns.print("Rest padded: " + rest) }
					let lastPosition = 0;
					while (rest.endsWith(caseInQuestion)) {
						iterations++;
						lastPosition = rest.length - caseInQuestion.length
						rest = rest.slice(0, lastPosition)
					}
					if (devrep) { ns.print([caseInQuestion, iterations, padding]) }
					if (iterations !== 0) { repetitions.push([caseInQuestion, iterations, padding, firstTime === length, firstTime, length]) }
					if (rest.includes(caseInQuestion)) {
						repetitions.push([rest, caseInQuestion, "-", firstTime === length, firstTime, length]);
					}
				}
				firstTime--
				if ((firstTime >= 0) && ((unprocStart - (length - firstTime)) >= 0)) { repetition(unprocessed.slice(abbStart - (length - firstTime), abbStop - (length - firstTime)), unprocessed.slice(unprocStart - (length - firstTime), unprocStop - (length - firstTime)), firstTime) }
				let best = ["", 0, "", 8]
				let devBest = true
				ns.print(repetitions)
				if ((repetitions.length > 0) && (firstTime + 1 === length)) {
					best = repetitions[0]
					let bestO = [0, 0]//total length, index
					for (let temp = 0; temp < repetitions.length; temp++) {
						let o = repetitions[temp]
						if (!o[3]) {
							let text0 = ((o[2] === "-") ? o[1] : o[0].repeat(o[1]))
							if (devBest) { ns.print(o) }
							if (devBest) { ns.print("Text0: " + text0); }
							let firstTimeO = o[4];
							let startPositionO = (abbStart - (length - firstTimeO) + abbreviatedSection.length - text0.length)
							if (devBest) { ns.print("startPositionO: " + startPositionO) }
							let stopPositionO = abbStop - (length - firstTimeO) - 1
							if (devBest) { ns.print(firstTimeO, " ", stopPositionO) }
							if (devBest) { ns.print(bestO) }
							let lastBest = bestO
							repetitions.forEach((value, index) => {
								let textV = ((value[2] === "-") ? value[1] : value[0].repeat(value[1]));
								let firstTimeV = value[4];
								let startPositionV = abbStart - (length - firstTimeV) + abbreviatedSection.length - textV.length
								let compensation = (Math.max(text0.length, textV.length) * 1.01 + Math.min(text0.length, textV.length)) / 1.02
								if ((startPositionV === stopPositionO + 1) && (bestO[0] < compensation)) {
									bestO = [compensation, index];
									if (index < temp) { temp = -1; }
								}
								if ((startPositionV < stopPositionO + 1) && (value[2] !== "-") && value[3] && (bestO[0] < abbStop - (length - firstTimeV) - startPositionO)) {
									if (value[0].length === 1) {
										let stopPositionV = abbStop - (length - firstTimeV) // caseInQuestion, iterations, padding, firstTime === length, firstTime, length
										let newStuff = [value[0], stopPositionV - stopPositionO, value[2], true, value[4], value[5]];
										if (!repetitions.includes(newStuff)) {
											repetitions.push(newStuff);
											compensation = (Math.max(text0.length, stopPositionV - stopPositionO) * 1.01 + Math.min(text0.length, stopPositionV - stopPositionO)) / 1.02
											bestO = [compensation, repetitions.length - 1];
										}
									}
									else if (((stopPositionO - startPositionV) % value[0].length === 0) && (value[2] === "")) {
										let stopPositionV = abbStop - (length - firstTimeV) // caseInQuestion, iterations, padding, firstTime === length, firstTime, length
										let newIterations = value[1] - (stopPositionO - startPositionV) / value[0].length
										let newStuff = [value[0], newIterations, "", true, value[4], value[5]]
										if (!repetitions.includes(newStuff)) {
											repetitions.push(newStuff);
											let newLength = value[0].length * newIterations
											compensation = (Math.max(text0.length, newLength) * 1.01 + Math.min(text0.length, newLength)) / 1.02
											bestO = [compensation, repetitions.length - 1];
										}
									}
								}
							})
							if (lastBest !== bestO) { ns.print(bestO); ns.print(repetitions[bestO[1]]); continue }
							if (repetitions.some((value) => {
								let textV = ((value[2] === "-") ? value[1] : value[0].repeat(value[1]));
								let firstTimeV = value[4];
								let startPositionV = abbStart - (length - firstTimeV) + abbreviatedSection.length - textV.length
								if (devBest) { ns.print("stopPositionV: " + (abbStop - (length - firstTimeV))) }
								if (devBest) { ns.print(textV, " ", firstTimeV, " ", startPositionV) }
								return startPositionV >= stopPositionO
							})) { ns.print("Ejected: " + o); continue; }
							if ((o[2] !== "-") && (o[2] !== "") && (abbStop - (length - o[4]) !== abbStop) && (length - o[4] === o[2].length)) { if ((o[2] === unprocessed.slice(abbStop - (length - o[4]), abbStop)) && (o[2] !== unprocessed.slice(abbStop - 2 * (length - o[4]), abbStop - (length - o[4])))) { ns.print("continued"); continue } }
						}
						let bestLength = (best[6] === undefined) ? ((best[2] !== "-") ? best[0].length * best[1] : best[1].length) : best[6];
						let bestSetback = (best[2] !== "-") ? best[0].length - best[2].length : best[0].length - best[0].indexOf(best[1])
						let oLength = (bestO[1] === temp) ? bestO[0] : ((o[2] !== "-") ? o[0].length * o[1] : o[1].length);
						let oSetback = (o[2] !== "-") ? o[0].length - o[2].length : o[0].length - o[0].indexOf(o[1])
						best = [[best, bestLength, bestSetback], [o, oLength, oSetback]].sort((a, b) => b[1] + (a[2] / 5000) - a[1] - (b[2] / 5000))[0]
						best[0][6] = best[1]
						best = best[0]
						//if (i === 72) (ns.print(best))
					}
					return best
				}
				else return -1
			}
			if (unprocessedSlice.includes(abbreviatedSection)) {
				if (devBase) {
					ns.print("Previous answer: " + answerArray)
					ns.print("Original string: " + contractData)
					ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length)
					ns.print("Reference: " + unprocessedSlice)
					ns.print("1st char at: " + unprocStart + " Last char at: " + (unprocStop - 1))
					ns.print("Abbreviated section: " + abbreviatedSection)
					ns.print("1st char at: " + abbStart + " Last char at: " + (abbStop - 1))
				}
				added = true
				additions.push([unprocessedSlice, abbreviatedSection, "-", true]);
			}
		}
		if (added) {
			let setback = 0;
			let length = 0;
			let caseInQuestion = ["", 0, "", true, 8];
			let replacement = "";
			ns.print(additions)
			for (let b in additions) {
				let newLength = 0;
				let newSetback = 0;
				let newCaseInQuestion = additions[b]
				let newReplacement = ""
				if (devBase) { ns.print(newCaseInQuestion, b) }
				if (newCaseInQuestion[2] !== "-") {//Meaning this is a repetition case
					newLength = newCaseInQuestion[0].length * newCaseInQuestion[1]
					newSetback = newCaseInQuestion[0].length - newCaseInQuestion[2].length
					newReplacement = newCaseInQuestion[0].repeat(newCaseInQuestion[1]);
				}
				else {
					newLength = newCaseInQuestion[1].length
					newSetback = newCaseInQuestion[0].length - newCaseInQuestion[0].lastIndexOf(newCaseInQuestion[1])
					newReplacement = newCaseInQuestion[1]
				}
				if (newCaseInQuestion[6] !== undefined) { newLength = newCaseInQuestion[6] }
				if (devBase) { ns.print(newLength, newSetback, newCaseInQuestion, newReplacement) }
				let best = [[length, setback, caseInQuestion, replacement], [newLength, newSetback, newCaseInQuestion, newReplacement]].sort(function (a, b) {
					return (b[0] + (b[2][3] ? 0 : (-0.5)) - (b[1] / 5000)) - (a[0] + (a[2][3] ? 0 : (-0.5)) - (a[1] / 5000))
				});
				[length, setback, caseInQuestion, replacement] = best[0];
			}

			if (devBase) { ns.print(length, setback, caseInQuestion, replacement) }
			if (devBase) {
				ns.print("Previous answer: " + answerArray)
				ns.print("Original string: " + contractData)
				ns.print("Max position : " + (contractData.length) + " I: " + i + " Length: " + length)
				ns.print("Reference: " + caseInQuestion[0])
				ns.print("Abbreviated section: " + replacement)
			}
			if (caseInQuestion[6] !== undefined) {//Rectify the advantage given to promote smaller "fillers"
				if (caseInQuestion[2] !== "-") { length = caseInQuestion[0].length * caseInQuestion[1] }
				else {
					length = caseInQuestion[1].length
				}
			}
			let fusion = false;
			if (!lastChunkIsL && (emergencyReplacementArray.length > 0) && caseInQuestion[3]) {
				let foundAt = contractData.lastIndexOf(replacement + emergencyReplacementArray[0], i - length - 1)
				if (((i - length) - foundAt < 9) && (foundAt !== -1) && ((parseInt(answerArray[0].slice(0, - 1)) + length) <= 9)) {
					if (devBase) { ns.print("Fusion!") }
					let lastAnswer = answerArray.shift();
					let lastReplacement = emergencyReplacementArray.shift();
					i = i - length
					length = length + parseInt(lastAnswer.slice(0, lastAnswer.length - 1))
					setback = (i - contractData.lastIndexOf(replacement + lastReplacement, i - 1))
					replacement = replacement + lastReplacement
					debugChunkCounter -= 1.8
					fusion = true
				}
				/*else if ((answerArray[0].slice(0, -1) > answerArray[0].slice(-1)) && (answerArray[0].slice(-1) === setback) && (answerArray[0].slice(0, -1) % answerArray[0].slice(-1) === 0) && [1, 2, 3].includes((parseInt(answerArray[0].slice(0, -1)) + length) % 9) && (parseInt(answerArray[0].slice(0, -1)) + length > 9) && (answerArray[1] != "0") && (9 - answerArray[1].length >= (parseInt(answerArray[0].slice(0, -1)) + length) % 9)) {
					ns.print("Shift")
					answerArray[1] = replacement + answerArray[1]
					emergencyReplacementArray[1] = replacement + emergencyReplacementArray[1]
					i -= length;
					lastChunkIsL = false
					continue
				}*/
				else {
					answerArray.unshift("0");
					emergencyReplacementArray.unshift("")
				}
			}
			if (!caseInQuestion[3]) {
				i--;
				ns.print("Skip")
				if (lastChunkIsL) {
					if (answerArray[0] === "-0-") { answerArray[0] = emergencyReplacementArray[0] = "0-" }
					answerArray[0] = contractData[i] + answerArray[0];
					emergencyReplacementArray[0] = contractData[i] + emergencyReplacementArray[0]
				}
				else {
					let character;
					if (contractData[i] === "0") { character = "-0-" }
					else { character = "" + contractData[i] }
					answerArray.unshift("" + character);
					emergencyReplacementArray.unshift("" + character)
					lastChunkIsL = true;
				}
				continue;
			}
			answerArray.unshift("" + length + setback)
			emergencyReplacementArray.unshift(replacement)
			if (devBase) { ns.print("New answer: " + answerArray) }
			debugChunkCounter += 2;
			lastChunkIsL = false
			if (!fusion) {
				i = i - (length)
			}
		}
		else {
			i--;
			if (!lastChunkIsL) {
				let character;
				if (contractData[i] === "0") { character = "-0-" }
				else { character = "" + contractData[i] }
				answerArray.unshift("" + character);
				emergencyReplacementArray.unshift("" + character)
				lastChunkIsL = true;
			}
			else {
				if (answerArray[0] === "-0") { answerArray[0] = emergencyReplacementArray[0] = "0-" }
				answerArray[0] = contractData[i] + answerArray[0];
				emergencyReplacementArray[0] = contractData[i] + emergencyReplacementArray[0]
			}
		}
		if (devBase) {
			ns.print(answerArray)
			ns.print("Replacement: " + emergencyReplacementArray)
		}
		let debugStopper = 9
		if ((debugChunkCounter >= debugStopper) || (answerArray[0] === "55")) { throw Error(debugChunkCounter + "\n" + answerArray) }
	}
	lastChunkIsL = false;
	const backupArray = answerArray.slice(0);
	if (answerArray[-1] === 0) { answerArray.pop() }
	/**@param {String[]} array - array to count
	 * @return {String}
	 */
	function getString(array) {
		let answer = ""
		for (let p = 0, h = array[p]; p < array.length; p++, h = array[p]) {
			if (h === "0") { answer += h; }
			else if ((p % 2) === 0) {//Meaning an LChunk
				let newZ = h.slice().toString().replaceAll(" ", "").replaceAll("-", "").split("")
				while (newZ.length > 0) {
					answer += "" + Math.min(newZ.length, 9) + newZ.slice(0, Math.min(newZ.length, 9)).join("") + "0";
					if (newZ.length > 9) { newZ = newZ.slice(9) } else { newZ = "" }
				}
				answer = answer.slice(0, -1)//remove the final "0"
				if (answer.slice(-1) === "0") { answer = answer + "-" }
			}
			else {//Meaning an LXChunk
				answer += h
			}
		}
		return answer
	}
	/**@param {Any[]} array - array to count
	 * @return {Number}
	 */
	function getLength(array) { return getString(array).length }
	let bitLengthArray = [[getLength(answerArray), answerArray]];
	let devFusion = false
	for (let k = answerArray.length - 1 - (((answerArray.length - 1) % 2 === 1) ? 0 : 1), z = "", newBitLengthArray = bitLengthArray.slice(), newArray = []; k > 0; k -= 2, z = "") {
		if (answerArray[k] === "0") { continue }
		if (devFusion) {
			ns.print("-------------------------------")
			ns.print(k)
		}
		let fusionModifier = 0
		bitLengthArray.forEach((value) => {
			if (value === null) { return }
			newArray = value[1].slice();
			let before = "", after = "";
			if ((k !== 0) && (newArray[k - 1] !== "0")) before = newArray[k - 1]
			if ((k !== newArray.length - 1) && (newArray[k + 1] !== "0")) after = newArray[k + 1]
			z = before + emergencyReplacementArray[k].slice() + after
			newArray.splice(k - 1, 3, z);
			if (devFusion) {
				ns.print(newArray)
				ns.print(emergencyReplacementArray)
			}
			newBitLengthArray.push([getLength(newArray), newArray])
			let fusionArray = value[1].slice();
			if (fusionArray[k + 1] === "0") {
				let k2Setback = parseInt(fusionArray[k + 2].at(-1))
				let k2Length = parseInt(fusionArray[k + 2].slice(0, -1))
				let kSetback = parseInt(fusionArray[k].at(-1))
				let kLength = parseInt(fusionArray[k].slice(0, -1))
				if (k2Setback > kLength) { return; }//Only the ones which use the previous chunk remain
				//if (kSetback > kLength) { return; }//Only those where both are repetitions of the previous chunk remain
				if (kSetback !== k2Setback) { return; }//Only those with the same iterating chain remain
				let lengthMoreThan9 = k2Length + kLength - 9
				if (lengthMoreThan9 <= 0) {
					fusionArray.splice(k, 3, "" + (kLength + k2Length) + kSetback)
					newBitLengthArray.push([getLength(fusionArray), fusionArray])
					fusionModifier++
				}
				else {
					ns.print(k)
					ns.print(lengthMoreThan9)
					ns.print(emergencyReplacementArray[k])
					if (fusionArray[k - 1] !== ("0" || undefined)) {
						before = emergencyReplacementArray[k].slice(0, lengthMoreThan9)
						let beforeArray = fusionArray.toSpliced(k, 3, "" + 9 + kSetback)
						beforeArray[k - 1] += before
						newBitLengthArray.push([getLength(beforeArray), beforeArray])
						fusionModifier++
					}
					else if (fusionArray[k - 1] === "0") {
						before = emergencyReplacementArray[k].slice(0, lengthMoreThan9)
						let beforeArray = fusionArray.toSpliced(k - 1, 4, before, "" + 9 + kSetback)
						newBitLengthArray.push([getLength(beforeArray), beforeArray])
						fusionModifier++
					}
					if (fusionArray[k + 3] !== ("0" || undefined)) {
						after = emergencyReplacementArray[k + 2].slice(k2Length - lengthMoreThan9)
						let afterArray = fusionArray.toSpliced(k, 3, "" + 9 + kSetback)
						afterArray[k + 1] = after + afterArray[k + 1]
						newBitLengthArray.push([getLength(afterArray), afterArray])
						fusionModifier++
					}
					else if (fusionArray[k + 3] === "0") {
						after = emergencyReplacementArray[k + 2].slice(k2Length - lengthMoreThan9)
						let afterArray = fusionArray.toSpliced(k, 4, "" + 9 + kSetback, after)
						newBitLengthArray.push([getLength(afterArray), afterArray])
						fusionModifier++
					}
				}
			}
		})
		let newBitLengthArrayOccupied = newBitLengthArray.filter((value) => { return !(value === null) })
		let bitLengthArrayOccupied = bitLengthArray.filter((value) => { return !(value === null) })
		if (devFusion) {
			ns.print(newBitLengthArrayOccupied)
			ns.print("---------------------")
			ns.print(bitLengthArrayOccupied)
			ns.print(newBitLengthArrayOccupied.length)
			ns.print(bitLengthArrayOccupied.length)
		}
		if (newBitLengthArrayOccupied.length !== bitLengthArrayOccupied.length * 2 + fusionModifier) {
			let intruders = newBitLengthArray.filter((value, index) => {
				if ((value === bitLengthArray[index]) || (newBitLengthArray[index - 2 ** k] === bitLengthArray[index])) { return false }
				return true
			})
			ns.print(newBitLengthArrayOccupied.length)
			ns.print(bitLengthArrayOccupied.length)
			ns.print(intruders)
			await ns.sleep(1000)
			throw Error(intruders.toString())
		}
		bitLengthArray = newBitLengthArray.slice()
	}
	if (devFusion) {
		ns.print(bitLengthArray.filter((value) => { return !(value === null) }))
	}
	let bestCombination = bitLengthArray.filter((value) => { return !(value === null) }).sort((a, b) => { return a[0] - b[0] })
	if (devFusion) {
		ns.print(bestCombination)
	}
	answer = getString(bestCombination[0][1].slice());
	if (devBase) {
		ns.print(answer)
	}
	if (((bestCombination[0][1].length % 2 === 1) && (answer.at(-1) === "0")) || ((emergencyReplacementArray.at(-1) === "") && (answer.at(-1) === "0"))) { answer = answer.slice(0, -1) }
	answer = answer.replaceAll("-", "")
	let decompressed = await lZDecompression(ns, "", "", answer);
	let stolenAnswer = compressLZStolen(contractData)
	if (devBase) {
		ns.print(answerArray)
		ns.print("Original string: " + contractData)
		ns.print("Answer: \n" + answer)
		ns.print("Length is correct?: " + (answer.length === stolenAnswer.length))
		ns.print(stolenAnswer)
		ns.print("Decoding correct?: " + (decompressed === contractData))
		if (decompressed !== contractData) { ns.print(decompressed) }
		ns.print(emergencyReplacementArray)
		ns.print(backupArray)
		ns.print(await lZDecompression(ns, "", "", stolenAnswer, true))
	}
	if ((answer.length === stolenAnswer.length) && (decompressed === contractData)) {
		ns.print("Correct!");
		ns.toast("Correct!", "success")
		return answer;
	}
	else if (flag.dev) { throw Error((debugChunkCounter + 1) + "\n" + answerArray) }
}
/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function lZCompression(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let answer = "";
	let correspondances = new Array(contractData.length).fill([0])
	for (let i = contractData.length - 1; i >= 0; i--) {//Finding correspondences in the text
		let character = contractData[i]
		let firstPresenceKnown = i + 1;
		while ((contractData.lastIndexOf(character, firstPresenceKnown-1) > -1) && (contractData.lastIndexOf(character, firstPresenceKnown-1) > i - 10)) {
		//while (contractData.lastIndexOf(character, firstPresenceKnown) > -1 && i - 10)) {
			firstPresenceKnown = contractData.lastIndexOf(character, firstPresenceKnown-1)
			correspondances[i].push(firstPresenceKnown);
		}
	}
	ns.print("Correspondances established!"); await ns.sleep(100)
	/**@param {String[]} array - array to count
	 * @return {String}
	 */
	function getString(array) {
		let answer = ""
		for (let p = 0, h = array[p]; p < array.length; p++, h = array[p]) {
			if (h === "0") { answer += h; }
			else if ((p % 2) === 0) {//Meaning an LChunk
				let newZ = h.slice().toString().replaceAll(" ", "").replaceAll("-", "").split("")
				while (newZ.length > 0) {
					answer += "" + Math.min(newZ.length, 9) + newZ.slice(0, Math.min(newZ.length, 9)).join("") + "0";
					if (newZ.length > 9) { newZ = newZ.slice(9) } else { newZ = "" }
				}
				answer = answer.slice(0, -1)//remove the final "0"
				if (answer.slice(-1) === "0") { answer = answer + "-" }
			}
			else {//Meaning an LXChunk
				answer += h
			}
		}
		return answer
	}
	/**@param {Any[]} array - array to count
	 * @return {Number}
	 */
	function getLength(array) { return getString(array).length }
	let testingString;
	let length = correspondances.length
	for (let combination = 0; combination < (10 ** length) / 5; combination++) {
		let arrayCombination = combination.toString().split("").map((v) => parseInt(v));
		ns.print("Combination: " + arrayCombination); await ns.sleep(100)
		if (arrayCombination.length < length - 1) {//Everything gets represented
			arrayCombination = new Array(length - arrayCombination.length).fill(0).concat(arrayCombination)
		}
		else if (arrayCombination.length > length - 1) { break; }//if we're over the number of characters, we stop
		for (let i = 0; i < arrayCombination.length; i++) {//if we're over the number of connections for one character, we advance the next by 1, starting with the first character
			if (correspondances[i].length <= arrayCombination[i]) {
				combination = (arrayCombination[i] + 1) * (10 ** (length - i - 1));
				break;
			}
		}
		//if(combination != parseInt(arrayCombination.join(""))){}
		let baseSentence = arrayCombination.reduce((p, value, i, a, sentence = "") => {
			ns.print(p)
			ns.print(sentence)
			ns.asleep(100)
			sentence += value
			return sentence
		})
		//Todo 1: we create the sentence as per the current combination (Order In Code(OIC): 1)
		//Todo 2: we check if the different sentences are shorter than the current best (OIC: 4)
		//Todo 3: we check if we can find patterns in the current sentence (OIC: 2)
		//Todo 4: memoization (OIC: 3)
	}
	let decompressed = await lZDecompression(ns, "", "", answer);
	let stolenAnswer = compressLZStolen(contractData)
	ns.print(answerArray)
	ns.print("Original string: " + contractData)
	ns.print("Answer: \n" + answer)
	ns.print("Length is correct?: " + (answer.length === stolenAnswer.length))
	ns.print(stolenAnswer)
	ns.print("Decoding correct?: " + (decompressed === contractData))
	if (decompressed !== contractData) { ns.print(decompressed) }
	ns.print(emergencyReplacementArray)
	ns.print(backupArray)
	ns.print(await lZDecompression(ns, "", "", stolenAnswer, true))
	if ((answer.length === stolenAnswer.length) && (decompressed === contractData)) {
		ns.print("Correct!");
		ns.toast("Correct!", "success")
		return answer;
	}
	else if (flag.dev) { throw Error((debugChunkCounter + 1) + "\n" + answerArray) }
}
/**@param {str} str
 * @returns {string}*/
function compressLZStolen(str) {
	/**@param {string[][]} state
	 * @param {number} i
	 * @param {number} j
	 * @param {string} str*/
	function set(state, i, j, str) {
		if (state[i][j] === undefined || str.length < state[i][j].length) state[i][j] = str;
	}
	// state [i][j] contains a backreference of offset i and length j
	let cur_state = Array.from(Array(10), _ => Array(10)), new_state, tmp_state, result;
	cur_state[0][1] = ''; // initial state is a literal of length 1
	for (let i = 1; i < str.length; i++) {
		new_state = Array.from(Array(10), _ => Array(10));
		const c = str[i];
		// handle literals
		for (let len = 1; len <= 9; len++) {
			const input = cur_state[0][len];
			if (input === undefined) continue;
			if (len < 9) { set(new_state, 0, len + 1, input); } // extend current literal
			else { set(new_state, 0, 1, input + '9' + str.substring(i - 9, i) + '0'); } // start new literal
			for (let offset = 1; offset <= Math.min(9, i); offset++) { // start new backreference
				if (str[i - offset] === c) set(new_state, offset, 1, input + len + str.substring(i - len, i));
			}
		}
		// handle backreferences
		for (let offset = 1; offset <= 9; offset++) {
			for (let len = 1; len <= 9; len++) {
				const input = cur_state[offset][len];
				if (input === undefined) continue;
				if (str[i - offset] === c) {
					if (len < 9) set(new_state, offset, len + 1, input); // extend current backreference
					else set(new_state, offset, 1, input + '9' + offset + '0'); // start new backreference
				}
				set(new_state, 0, 1, input + len + offset); // start new literal
				// end current backreference and start new backreference
				for (let new_offset = 1; new_offset <= Math.min(9, i); new_offset++) {
					if (str[i - new_offset] === c) set(new_state, new_offset, 1, input + len + offset + '0');
				}
			}
		}
		tmp_state = new_state;
		new_state = cur_state;
		cur_state = tmp_state;
	}
	for (let len = 1; len <= 9; len++) {
		let input = cur_state[0][len];
		if (input === undefined) continue;
		input += len + str.substring(str.length - len, str.length);
		// noinspection JSUnusedAssignment
		if (result === undefined || input.length < result.length) result = input;
	}
	for (let offset = 1; offset <= 9; offset++) {
		for (let len = 1; len <= 9; len++) {
			let input = cur_state[offset][len];
			if (input === undefined) continue;
			input += len + '' + offset;
			if (result === undefined || input.length < result.length) result = input;
		}
	}
	return result ?? '';
}
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function caesarCypher(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let [pT, shift] = contractData;
	let encryptedAlphabet = {}
	for (let x = 0; x < 26; x++) {
		encryptedAlphabet[alphabet[x]] = alphabet[(26 - shift + x) % 26]
	}
	encryptedAlphabet[" "] = " "
	pT = pT.split("")
	let answer = "";
	for (let letter of pT) { answer += encryptedAlphabet[letter] }
	return answer;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function vigenereCipher(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let [pT, key] = contractData;
	let encryptedAlphabet = {}
	for (let keyLetter of key.split("")) {
		encryptedAlphabet[keyLetter] = {};
		let shift = alphabet.indexOf(keyLetter);
		for (let x = 0; x < 26; x++) {
			encryptedAlphabet[keyLetter][alphabet[x]] = alphabet[(26 + shift + x) % 26]
		}
	}
	let answer = "";
	pT = pT.split("")
	for (let letter = 0; letter < pT.length; letter++) {
		answer += encryptedAlphabet[key[letter % key.length]][pT[letter]]
	}
	return answer;
}

/** @param {NS} ns 
 *  @param {String} contractName
 *  @param {String} serverName */
async function basicNewFunction(ns, contractName, serverName) {
	let contractData = ns.codingcontract.getData(contractName, serverName);
	let answer;
	return answer;
}

//["Find Largest Prime Factor","Subarray with Maximum Sum","Total Ways to Sum","Total Ways to Sum II","Spiralize Matrix","Array Jumping Game","Array Jumping Game II","Merge Overlapping Intervals","Generate IP Addresses","Algorithmic Stock Trader I","Algorithmic Stock Trader II","Algorithmic Stock Trader III","Algorithmic Stock Trader IV","Minimum Path Sum in a Triangle","Unique Paths in a Grid I","Unique Paths in a Grid II","Shortest Path in a Grid","Sanitize Parentheses in Expression","Find All Valid Math Expressions","HammingCodes: Integer to Encoded Binary","HammingCodes: Encoded Binary to Integer","Proper 2-Coloring of a Graph","Compression I: RLE Compression","Compression II: LZ Decompression","Compression III: LZ Compression","Encryption I: Caesar Cipher","Encryption II: Vigenère Cipher"]

