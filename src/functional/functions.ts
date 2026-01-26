import type {BladeburnerActionType, BladeburnerCurAction, NS} from "@ns"
import type {PortData, Geography} from "/typeLib"

/**
 * Gets the type of a bladeburner action.
 * @param {NS} ns
 * @param { string | BladeburnerCurAction } action
 * @returns { string | BladeburnerActionType }
 */
export function getActionType(ns: NS, action: string | BladeburnerCurAction): string | BladeburnerActionType | void{
	const type2function = {
		"General" : 			ns.bladeburner.getGeneralActionNames(),
		"Contracts" : 			ns.bladeburner.getContractNames(),
		"Operations" : 			ns.bladeburner.getOperationNames(),
		"Black Operations" : 	ns.bladeburner.getBlackOpNames()
	}
	if(typeof action === "string") {
		const arrayType2Function: [string, any[]][] = Object.entries(type2function)
		for (const type in arrayType2Function) {
			if (arrayType2Function[type][1].includes(action))
				return arrayType2Function[type][0];
		}
		return;
	}
	else
		return action.type;
}

type receiverReturn<t extends "Server Map" | string, y extends boolean> =
	y extends false ? ((t extends "Server Map" ? Geography.Map : any) | false) : (t extends "Server Map" ? Geography.Map : any);

/** @param {String} target - Designation to listen for. Must be a string.
 * @param {NS} ns
 * @param {number} [portID = 1] The port's ID
 * @param {boolean} [force = false]
 * @remarks
 * RAM cost: 0 GB*/
export async function portReceiver<T extends string, Y extends boolean>(ns: NS, target: T, portID: number = 1, force: Y = (false as Y)) : Promise<receiverReturn<T, Y>> {
	let targetPort = ns.getPortHandle(portID);
	if(targetPort.empty()) {
		if (force === false)
			return false as receiverReturn<string, false>;
		else {
			ns.exec("googleMaps.js", "home", {preventDuplicates: true})
			while (targetPort.empty())
				await ns.sleep(1000)
		}
	}
	let portData : PortData<receiverReturn<T, true>>|"NULL PORT DATA"|undefined = undefined;
	while (portData == "NULL PORT DATA"
	|| portData?.name !== target) {
		if (portData === "NULL PORT DATA") { await ns.sleep(1000); ns.print(portData) }
		else if (portData === undefined) { }
		else if( portData?.kind === "PortData"){
			switch (portData.loop) {
				case false:
				case undefined:
					portData.loop = false;
					targetPort.write(portData);
					await ns.sleep(1);
					break;
				case true:
					await ns.sleep(1);
					break;
			}
		}
		portData = targetPort.read();
	}
	return portData.data;
}

/** @param {NS} ns 
 * @param {Number} limit */
export async function sieveOfEratosthenes(ns: NS, limit: number) {
	let primeEnough = false;
	let primes;
	/*if (ns.fileExists("./PrimeNumbers.txt")) {
		let file = ns.read("./PrimeNumbers.txt");
		let primeList = decompressPrimes(await runLengthDecode(file));
		//ns.tprint(await runLengthDecode(file));
		if (primeList[primeList.length - 1] >= limit) { primeEnough = true; primes = primeList }
	}*/
	if (!primeEnough) {
		//ns.tprint("Hasn't calculated yet");
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

export function compressPrimes(primes:number[]) {

	function eliasGammaEncode(n:number) {
		// Step 1: Compute binary representation without leading zero
		let binary = n.toString(2);

		// Step 2: Length of the binary string minus 1 zeros followed by the binary representation
		let zeroPadding = '0'.repeat(binary.length - 1);
		return zeroPadding + binary;
	}

	function deltaEncode(primes: number[]) {
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
export function decompressPrimes(encodedBitString : string) {

	function eliasGammaDecode( bitString: string) {
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

	function deltaDecode(deltas: any[]) {
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
export function saveBinaryFile(ns : NS, primes: number, filename: string) {
	const buffer = new Uint32Array(primes);  // Create a typed array (32-bit unsigned integer)
	const blob = new Blob([buffer.buffer], { type: 'application/octet-stream' });
	ns.write(filename, blob.toString());
}

// Reading primes from binary format
export function readBinaryFile(ns : NS, filename: string) {
	let buffer = ns.read(filename)
	const primes = Array.from(buffer);  // Convert the typed array back to a regular array
	return primes;
}

/** @param ns
 @param {String} input
 * @param {"n"|"m"} characterType */
export function runLengthEncode(ns : NS, input: string, characterType: "n" | "m" = "m") {
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
				encoded += count + code[<"1"> input[i].toString()];
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
export async function runLengthDecode(encoded: string, characterType: "n" | "m" = "m") {
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
				decoded += code[<"A">encoded[i].toString()].repeat(parseInt(count));
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
export function average(...argument: number[]) {
	return sum(...argument) / argument.length;
}
/**@param {Number[]} argument*/
export function sum(...argument: number[]) {
	let sum = 0;
	for (let i of argument) { sum += i }
	return sum
}
/** @param {Number} number */
export function factorial(number: number) {
	let answer = 1;
	for (let i = number; i > 0; i--) {
		answer = answer * i;
	}
	return answer
}
/** @template T
 * @param {Array<T>} array
 * @param {T} itemToRemove
 * @param {Number} [startingPoint=0] - Where the function will start removing the item (included)
 * @param {Number} endPoint - Where the function will stop removing the item (included)
 * @returns {Array<T>} */
export function removeAll<T>(array: Array<T>, itemToRemove: T, startingPoint: number = 0, endPoint: number = array.length - 1): Array<T> {
	let workingArray = array.slice(0);
	for (let i = startingPoint; (i <= endPoint) && (i < workingArray.length); i++) {
		while (workingArray[i] === itemToRemove) { workingArray.splice(i, 1) }
	}
	return workingArray
}

/** @param {Array} array*/
export function arrayToString(array: Array<any>) {
	let answer = "";
	for (let i of array) {
		answer += i;
	}
	return answer
}

/** @param {String} string*/
export function stringToArray(string: string) {
	let answer = [];
	for (let i = 0; i < string.length; i++) {
		answer.push(string.charAt(i));
	}
	return answer
}

/** @param {NS} ns
 * @param {String} keyToPress
 * @param {Number} keysCode
 * @param {boolean} upPress
 * @deprecated
 */
export async function simulateKey(ns : NS, keyToPress: string, keysCode: number, upPress: boolean) {
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