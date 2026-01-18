//import type {BladeburnerActionType, BladeburnerCurAction, NS} from "@ns"

/** @param {NS} ns */
export async function main(ns) {

}

/**
 * Gets the type of a bladeburner action.
 * @param {NS} ns
 * @param { string | BladeburnerCurAction } action
 * @returns { string | BladeburnerActionType }
 */
export function getActionType(ns, action){
	const type2function = {
		"General" : 			ns.bladeburner.getGeneralActionNames,
		"Contracts" : 			ns.bladeburner.getContractNames,
		"Operations" : 			ns.bladeburner.getOperationNames,
		"Black Operations" : 	ns.bladeburner.getBlackOpNames
	}
	if(typeof action === "string") {
		for (const type of Object.values(BladeburnerActionType))
			if (type2function[type]().includes(action))
				return type;
	}
	else
		return action.type;
}

/** @param {String} target - Designation to listen for. Must be a string.
 * @param {NS} ns 
 * @remarks
 * RAM cost: 0 GB*/
export async function portReceiver(ns, target) {
	let portData;
	do {
		if (portData === "NULL PORT DATA") { await ns.sleep(1000); ns.print(portData) }
		else if (portData === undefined) { }
		else {
			switch (portData.loop) {
				case false:
				case undefined:
					portData["loop"] = false;
					ns.writePort(1, portData);
					await ns.sleep(1);
					break;
				case true:
					await ns.sleep(1);
					break;
			}
		}
		portData = ns.readPort(1);
	}
	while (portData.name !== target)
	return portData.data;
}
/** @param {NS} ns 
 * @param {Number} limit */
export async function sieveOfEratosthenes(ns, limit) {
	let primeEnough = false;
	let primes;
	/*if (ns.fileExists("./PrimeNumbers.txt")) {
		let file = ns.read("./PrimeNumbers.txt");
		let primeList = decompressPrimes(await runLengthDecode(file));
		//ns.tprint(await runLengthDecode(file));
		if (primeList[primeList.length - 1] >= limit) { primeEnough = true; primes = primeList }
	}*/
	if (!primeEnough) {
		//ns.tprint("Hasn't calaculatad yet");
		let smallPrimes = [2, 3, 5, 7]
		let rest = limit
		let divided = true;
		while (divided) {
			divided = false
			let divisors = smallPrimes.filter((a) => { return (rest / a) === (Math.floor(rest / a)) })
			if (divisors.length !== 0) {
				rest = rest / divisors.reduce((a, b) => { return a * b })
				divided = true
			}
		}
		await ns.sleep(1000);
		ns.run("./primeCalculus/segmentedSieveOfEratosthenes.js", { preventDuplicates: true }, rest);
		primes = await portReceiver(ns, "Prime Numbers");
	}
	return primes
}
export function compressPrimes(primes) {

	function eliasGammaEncode(n) {
		// Step 1: Compute binary representation without leading zero
		let binary = n.toString(2);

		// Step 2: Length of the binary string minus 1 zeros followed by the binary representation
		let zeroPadding = '0'.repeat(binary.length - 1);
		return zeroPadding + binary;
	}

	function deltaEncode(primes) {
		let deltas = [];
		for (let i = 1; i < primes.length; i++) {
			deltas.push(primes[i] - primes[i - 1]);
		}
		return deltas;
	}

	let deltas = deltaEncode(primes);
	let encodedDeltas = deltas.map(delta => eliasGammaEncode(delta));
	return encodedDeltas.join(''); // Join as a single binary string for storage
}
export function decompressPrimes(encodedBitString) {

	function eliasGammaDecode(bitString) {
		let index = 0;
		let result = [];

		while (index < bitString.length) {
			// Step 1: Read leading zeros
			let zeroCount = 0;
			while (bitString[index] === '0') {
				zeroCount++;
				index++;
			}

			// Step 2: Read the next (zeroCount + 1) bits for the actual number
			let binaryPart = bitString.slice(index, index + zeroCount + 1);
			index += zeroCount + 1;

			// Convert binary to number and add to result
			result.push(parseInt(binaryPart, 2));
		}
		return result;
	}

	function deltaDecode(deltas) {
		let primes = [2]; // The first prime is 2
		for (let i = 0; i < deltas.length; i++) {
			primes.push(primes[primes.length - 1] + deltas[i]);
		}
		return primes;
	}

	let deltas = eliasGammaDecode(encodedBitString);
	return deltaDecode(deltas);
}
// Saving primes in binary format
export function saveBinaryFile(ns, primes, filename) {
	const buffer = new Uint32Array(primes);  // Create a typed array (32-bit unsigned integer)
	const blob = new Blob([buffer.buffer], { type: 'application/octet-stream' });
	ns.write(filename, blob);
}

// Reading primes from binary format
export function readBinaryFile(ns, filename) {
	let buffer = ns.read(filename)
	const primes = Array.from(buffer);  // Convert the typed array back to a regular array
	return primes;
}

/** @param {String} input 
 * @param {"n"|"m"} characterType */
export function runLengthEncode(ns, input, characterType = "m") {
	let encoded = '';
	let count = 1;
	if (input === undefined) { return undefined }

	if (characterType === "n") {
		let code = { "1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "6": "F", "7": "G", "8": "H", "9": "I", "0": "J" };
		for (let i = 0; i < input.length; i++) {
			// If the current character is the same as the next one, increment the count
			if ((input[i] === input[i + 1])) {
				count++;
			} else {
				// Otherwise, append the count and the character to the result
				encoded += count + code[input[i].toString()];
				count = 1;  // Reset the count for the next run
			}
		}
	}
	else {
		for (let i = 0; i < input.length; i++) {
			// If the current character is the same as the next one, increment the count
			if ((input[i] === input[i + 1]) && (count < 9)) {
				count++;
			} else {
				// Otherwise, append the count and the character to the result
				encoded += count + input[i];
				count = 1;  // Reset the count for the next run
			}
		}
	}

	return encoded;
}
/** @param {String} encoded 
 * @param {"n"|"m"} characterType */
export async function runLengthDecode(encoded, characterType = "m") {
	let decoded = '';
	let count = '';

	/**for (let i = 0; i < encoded.length; i++) {
		// If the current character is a digit, accumulate the count
		if (/\d/.test(encoded[i])) {
			count += encoded[i];
		} else {
			// Otherwise, repeat the character 'count' times and append to the result
			decoded += encoded[i].repeat(parseInt(count));
			count = '';  // Reset the count for the next run
		}
	}*/
	if (characterType === "n") {
		let code = { "A": "1", "B": "2", "C": "3", "D": "4", "E": "5", "F": "6", "G": "7", "H": "8", "I": "9", "J": "0" };
		for (let i = 0; i < encoded.length; i++) {
			//if(count == ""){count = encoded[i]}
			if (!isNaN(parseInt(encoded[i]))) {
				count += encoded[i];
			}
			else {
				decoded += code[encoded[i].toString()].repeat(parseInt(count));
				count = '';
			}
		}
	}
	else {
		let count = 0;
		for (let i = 0; i < encoded.length; i++) {
			//if(count == ""){count = encoded[i]}
			if (i % 2 === 0) {
				count = parseInt(encoded[i]);
			}
			else {
				decoded += encoded[i].toString().repeat(count);
				count = 0;
			}
		}
	}

	return decoded;
}
/**@param {Number[]} argument*/
export function average(argument) {
	return sum(argument) / argument.length;
}
/**@param {Number[]} argument*/
export function sum(argument) {
	let sum = 0;
	for (let i of argument) { sum += i }
	return sum
}
/** @param {Number} number */
export function factorial(number) {
	let answer = 1;
	for (let i = number; i > 0; i--) {
		answer = answer * i;
	}
	return answer
}
/** @param {Array<T>} array
 * @param {T} itemToRemove
 * @param {Number} [startingPoint=0] - Where the function will start removing the item (included)
 * @param {Number} endPoint - Where the function will stop removing the item (included)
 * @returns {Array<T>} */
export function removeAll(array, itemToRemove, startingPoint = 0, endPoint = array.length - 1) {
	let workingArray = array.slice(0);
	for (let i = startingPoint; (i <= endPoint) && (i < workingArray.length); i++) {
		while (workingArray[i] === itemToRemove) { workingArray.splice(i, 1) }
	}
	return workingArray
}

/** @param {Array} array*/
export function arrayToString(array) {
	let answer = "";
	for (let i of array) {
		answer += i;
	}
	return answer
}

/** @param {String} string*/
export function stringToArray(string) {
	let answer = [];
	for (let i = 0; i < string.length; i++) {
		answer.push(string.charAt(i));
	}
	return answer
}

/** @param {NS} ns
 * @param {String} keyToPress
 * @param {Number} keysCode
 * @param {bool} upPress
 */
export async function simulateKey(ns, keyToPress,keysCode, upPress) {
	let initDict = {
		key: keyToPress,
		keyCode: keysCode, // Enter key code
		code: keyToPress,
		which: keysCode,
		type: "keydown",
		metaKey: false,
		altKey:
			false,
		cancelBubble:
			false,
		cancelable:
			true,
		charCode:
			0,
		timeStamp:
			3208093,
		ctrlKey:
			false,
		currentTarget:
			null,
		defaultPrevented:
			true,
		detail:
			0,
		eventPhase:
			0,
		isComposing:
			false,
		repeat:
			false,
		returnValue:
			false,
		shiftKey:
			false,
		bubbles: true, // Ensure the event bubbles up to trigger listeners
		isTrusted: true,
		composed: true
	}

	// Find the input element and dispatch the event
	document.body.dispatchEvent(new KeyboardEvent('keydown', initDict));
	initDict.type = "keypress";
	document.body.dispatchEvent(new KeyboardEvent('keypress', initDict));
	if(upPress) {
		await ns.sleep(5);
		initDict.type = "keyup";
		document.body.dispatchEvent(new KeyboardEvent('keyup', initDict));
	}
}