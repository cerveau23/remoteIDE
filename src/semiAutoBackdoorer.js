import { portReceiver } from "functions";
import {dSe} from "depthScanner";
/** @param {NS} ns */
export async function main(ns) {
	//ns.tail();
	let mapp = await portReceiver(ns, "Server Map");
	let serversWithoutBackdoors = [];
	let serversWithBackdoors = [];
	for (let i of mapp) {
		if ((!ns.getServer(i[0]).backdoorInstalled) && (!ns.getServer(i[0]).purchasedByPlayer) && (ns.getServer(i[0]).hasAdminRights)) {
			serversWithoutBackdoors.push(i[0]);
		}
		else {
			if ((!ns.getServer(i[0]).backdoorInstalled) && (!ns.getServer(i[0]).purchasedByPlayer) && !(ns.getServer(i[0]).hasAdminRights)) {
				serversWithBackdoors.push(i[0]);
			}
		}
	}
	ns.print(serversWithBackdoors);
	serversWithoutBackdoors.splice(serversWithoutBackdoors.indexOf("home"), 1);
	let previousServer = ns.getHostname();
	for (let i of serversWithoutBackdoors) {
		let command = await dSe(ns, [["d", i], ["connector", true]]) + "; backdoor";
		ns.tprintRaw(command);
		copyToClipboard(command);
		await ns.sleep(1);
		triggerDivClick();
  	//document.querySelector('.MuiInputBase-root').addEventListener('click', onClick);
		await ns.sleep(1);
		//pasteFromClipboard();
		//await ns.sleep(1);
		//document.getElementById('terminal-input').addEventListener('keydown', onSpace);
		ns.print("Finished")
		let documentFree = eval("document");
		await waitr(ns, 20, "Giving time to execute command", function () {if(documentFree.getElementById('terminal-input').value.trim()==="" || " "){documentFree.getElementById('terminal-input').value = command} return !ns.getServer(previousServer).isConnectedTo });
		while (ns.getServer(previousServer).isConnectedTo) {
			ns.toast("Backdoor finished, start new backdoor!", "error");
			documentFree = eval("document");
			await waitr(ns, 1, "Waiting for command to be executed", function () {if(documentFree.getElementById('terminal-input').value.trim()==="" || " "){documentFree.getElementById('terminal-input').value = command} return false});
			ns.run("beep.js", 1, 1440);
		}
		while (!ns.getServer(i).backdoorInstalled) {
			ns.toast("Waiting on backdoor for " + i + "...", "info");
			await waitr(ns, 11, "Waiting during installation", function () { return ns.getServer(i).backdoorInstalled });
		}
		ns.toast("Backdoor finished!", "success");
		ns.run("beep.js", 1, 440);
		previousServer = i;
	}
	if (serversWithoutBackdoors.length === 0) { ns.tprint("All servers backdoored!") }
}
/** @param {String} text */
export function copyToClipboard(text) {
	// Use the Clipboard API to copy the text
	navigator.clipboard.writeText(text)
		.then(() => {
			// Display success message
			//alert('Text copied to clipboard!');
		})
		.catch(err => {
			// Handle errors
			console.error('Failed to copy: ', err);
		});
}/*
function pasteFromClipboard() {
	// Use the Clipboard API to read text from the clipboard
	navigator.clipboard.readText()
		.then(text => {
			// Set the pasted text into the textarea
			document.getElementById('terminal-input').value = text;
		})
		.catch(err => {
			// Handle any errors (e.g., permission denied)
			console.error('Failed to read clipboard: ', err);
		});
}*/
function onSpace(event){
	//simulateKey("Space",32)
	if(event.keyCode===32){simulateKey("Enter",13)}
}
/** @param {String} keyToPress
 * @param {Number} keysCode
 */
function simulateKey(keyToPress,keysCode) {
	// Create a new KeyboardEvent for the 'Enter' key
	const enterKeyEvent = new KeyboardEvent('keydown', {
		key: keyToPress,
		keyCode: keysCode, // Enter key code
		code: keyToPress,
		which: keysCode,
		bubbles: true // Ensure the event bubbles up to trigger listeners
	});
	let documentFree = eval("document");

	// Find the input element and dispatch the event
	const inputElement = documentFree.getElementById('terminal-input');
	inputElement.dispatchEvent(enterKeyEvent);
}
function triggerDivClick() {
	let documentFree = eval("document");
	// Select the div using its class name
	const divElement = documentFree.querySelector('.MuiInputBase-root');

	// Create a new click event
	const clickEvent = new Event('click');

	// Dispatch the click event on the div element
	divElement.dispatchEvent(clickEvent);
}

//<div spellcheck="false" class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedStart css-1u3hywr-input"><p class="MuiTypography-root MuiTypography-body1 css-r3d8m1">[home&nbsp;/]&gt;&nbsp;</p><input aria-invalid="false" autocomplete="off" id="terminal-input" type="text" class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart css-1oaunmp" value=""></div>

/** 
 * @param {NS} ns 
 * @param {Number} seconds 
 * @param {String} reason
 * @param {Function} breaker - A function which, when returning true, will stop the wait
 */
async function waitr(ns, seconds, reason, breaker = function () { return false }) {
	for (let i = 0; i < seconds; i++) {
		await ns.asleep(1000);
		ns.print(reason);
		if (breaker()) { break }
	}
	return 1;
}