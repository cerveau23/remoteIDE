// noinspection DuplicatedCode

import {portReceiver} from "functions";
import {dSe} from "depthScannerV2";
import {keyPressAPI, serverPing, initialization as serverInitialization} from "BBA_API_handler"
import {NS} from "@ns";
import {ui} from "/functional/UIGetter"

// noinspection JSUnusedLocalSymbols
/** @param {NS} ns **/
export async function main(ns: NS) {

    // ---------------------------------
    //         Initialization
    // ---------------------------------

    await serverInitialization(ns, true);
    /*    ns.tprint("Server initialised") */
    /* ns.tail(); */
    let mapp = await portReceiver(ns, "Server Map", 1, true);
    // ns.tprint(mapp.toString());
    // ns.tprint(typeof mapp)
    // ns.tprint(mapp[0])
    let serversWithoutBackdoors = [];
    let serversWithBackdoors = [];
    let others = [];
    for (let i of mapp) {
        const serverName = i[0];
        const server = ns.getServer(serverName);
        if ((!server.backdoorInstalled) && (!server.purchasedByPlayer) && (server.hasAdminRights) && (ns.getServerRequiredHackingLevel(serverName) <= ns.getHackingLevel())) {
            serversWithoutBackdoors.push(serverName);
        } else {
            if (server.backdoorInstalled && (!server.purchasedByPlayer)) {
                serversWithBackdoors.push(serverName);
            } else
                others.push(serverName);
        }
    }
    ns.print("Servers owned: " + serversWithBackdoors);
    ns.print("Servers to hack: " + serversWithoutBackdoors);
    ns.print("Other: " + others);

    if (serversWithoutBackdoors.indexOf("home") !== -1) // If home is in sWoB, we remove it
        serversWithoutBackdoors.splice(serversWithoutBackdoors.indexOf("home"), 1);
    let previousServer = ns.getHostname(); // Start with home

    // ---------------------------------
    //              Loop
    // ---------------------------------

    for (let i of serversWithoutBackdoors) {
        ns.print(i);
        let command = dSe(ns, Object.fromEntries([["d", i], ["connector", true]]), mapp) + "; backdoor";
        ns.tprintRaw(command);
        copyToClipboard(command);
        await ns.sleep(1);
        // triggerDivClick();
        /* document.querySelector('.MuiInputBase-root').addEventListener('click', onClick); */
        await ns.sleep(1);
        /* pasteFromClipboard(); */
        /* await ns.sleep(1); */
        /* document.getElementById('terminal-input').addEventListener('keydown', onSpace); */
        ns.print("Finished");
        await waitr(ns, 20, "Giving time to execute command", async function () {
            let terminal = ui.document.getElementById('terminal-input');
            if (terminal === null)
                throw new Error("No terminal")
            if ((<HTMLInputElement>ui.document.getElementById('terminal-input')).value.trim() === "" || " ") {
                (<HTMLInputElement>ui.document.getElementById('terminal-input')).value = command;
                /* ns.asleep(10);
                simulateKey("Space", ?);simulateKey("Enter", 13); */
            }
            if(ui.isUserActive()) await autoEnter(ns)
            return !ns.getServer(previousServer).isConnectedTo;
        });
        if (!(await serverPing(true))) {
            while (ns.getServer(previousServer).isConnectedTo) {
                ns.toast("Backdoor finished, start new backdoor!", "error");
                await waitr(ns, 1, "Waiting for command to be executed", function () {
                    let terminal = ui.document.getElementById('terminal-input');
                    if (terminal === null)
                        throw new Error("No terminal")
                    if ((<HTMLInputElement>ui.document.getElementById('terminal-input')).value.trim() === "" || " ") {
                        // @ts-ignore
                        (<HTMLInputElement>ui.document.getElementById('terminal-input')).value = command;
                    }
                    return false;
                });
                // ns.run("beep.js", 1, 1440);
                if (await serverPing(true) && ui.isUserActive())
                    await autoEnter(ns);
            }
        } else while ( ui.document.getElementById('terminal-input') !== undefined && ns.getServer(previousServer).isConnectedTo)
            if(ui.isUserActive()) {
                await autoEnter(ns)
        }
        while (!ns.getServer(i).backdoorInstalled) {
            ns.toast("Waiting on backdoor for " + i + "...", "info");
            await waitr(ns, 11, "Waiting during installation", function () {
                return ns.getServer(i).backdoorInstalled ?? true;
            });
        }
        ns.toast("Backdoor finished!", "success");
        // ns.run("beep.js", 1, 440); TODO: This generates a mega freeze. Let's fix it.
        previousServer = i;
    }
    /* if (serversWithoutBackdoors.length === 0) { */
    ns.tprint("All servers backdoored!");
    /* } */
    ns.write("lastHackingAtLevel.txt", ns.getHackingLevel().toString(), "w");
}

/** @param {String} text */
export function copyToClipboard(text: string) {
    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(text)
        .then(() => {
            // Display success message
            // alert('Text copied to clipboard!');
        })
        .catch(err => {
            // Handle errors
            console.error('Failed to copy: ', err);
        });
}

// noinspection JSUnusedLocalSymbols
/**
 * @deprecated
 */
function pasteFromClipboard() {
    // Use the Clipboard API to read text from the clipboard
    navigator.clipboard.readText()
        .then(text => {
            // Set the pasted text into the textarea
            let s = <HTMLInputElement|null> document.getElementById('terminal-input');
            if (s !== null) s.value = text;
        })
        .catch(err => {
            // Handle any errors (e.g., permission denied)
            console.error('Failed to read clipboard: ', err);
        });
}

// noinspection JSUnusedLocalSymbols
/**
 * @deprecated
 */
function onSpace(ns: NS, event: { keyCode: number; }) {
    //simulateKey("Space",32)
    if (event.keyCode === 32) {
        simulateKey(ns, "Enter", 13, true).then(() => {
            return
        });
    }
}

// noinspection JSUnusedLocalSymbols
/**
 * @param {String} keyToPress
 * @param {Number} keysCode
 */
function simulateKeyV1(keyToPress: string, keysCode: number) {
    // Create a new KeyboardEvent for the 'Enter' key
    const enterKeyEvent = new KeyboardEvent('keydown', {
        key: keyToPress,
        keyCode: keysCode,
        code: keyToPress,
        which: keysCode,
        //type: string,
        metaKey: false,
        altKey: false,
        //cancelBubble: false,
        cancelable: true,
        charCode: 0,
        //timeStamp: 3208093,
        ctrlKey: false,
        //currentTarget: null,
        //defaultPrevented: true,
        detail: 0,
        //eventPhase: 0,
        isComposing: false,
        repeat: false,
        //returnValue: false,
        shiftKey: false,
        bubbles: true,
        //isTrusted: true,
        composed: true
    });
    // Find the input element and dispatch the event
    const inputElement = ui.document.getElementById('terminal-input');
    inputElement?.dispatchEvent(enterKeyEvent);
}

/** @param {NS} ns
 * @param {String} keyToPress
 * @param {Number} keysCode
 * @param {boolean} upPress
 */
export async function simulateKey(ns: NS, keyToPress: string, keysCode: number, upPress: boolean) {
    let initDict = {
        key: keyToPress,
        keyCode: keysCode,
        code: keyToPress,
        which: keysCode,
        type: "keydown",
        metaKey: false,
        altKey: false,
        // cancelBubble: false,
        cancelable: true,
        charCode: 0,
        // timeStamp: 3208093,
        ctrlKey: false,
        // currentTarget: null,
        // defaultPrevented: true,
        detail: 0,
        // eventPhase: 0,
        isComposing: false,
        repeat: false,
        // returnValue: false,
        shiftKey: false,
        bubbles: true,
        // isTrusted: true,
        composed: true
    };
    // Find the input element and dispatch the event
    document.body.dispatchEvent(new KeyboardEvent('keydown', initDict));
    initDict.type = "keypress";
    document.body.dispatchEvent(new KeyboardEvent('keypress', initDict));
    if (upPress) {
        await ns.asleep(5);
        initDict.type = "keyup";
        document.body.dispatchEvent(new KeyboardEvent('keyup', initDict));
    }
}

/*function triggerDivClick() {
    // Select the div using its class name
    const divElement = ui.document.querySelector('.MuiInputBase-root');
    // Create a new click event
    const clickEvent = new Event('click');
    // Dispatch the click event on the div element
    divElement?.dispatchEvent(clickEvent);
}*/

/* <div spellcheck="false" class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedStart css-1u3hywr-input"><p class="MuiTypography-root MuiTypography-body1 css-r3d8m1">[home&nbsp;/]&gt;&nbsp;</p><input aria-invalid="false" autocomplete="off" id="terminal-input" type="text" class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart css-1oaunmp" value=""></div> */
/**
 * @param {NS} ns
 * @param {Number} seconds
 * @param {String} reason
 * @param {Function} breaker - A function which, when returning true, will stop the wait
 */
async function waitr(ns: NS, seconds: number, reason: string, breaker: Function = function () {
    return false;
}) {
    for (let i = 0; i < seconds; i++) {
        await ns.asleep(1000);
        ns.print(reason);
        if (await breaker()) {
            break;
        }
    }
    return 1;
}

async function autoEnter(ns: NS) {
    if (!await serverPing())
        return;

    let terminal = ui.document.getElementById('terminal-input');
    if (terminal === null)
        throw Error("No terminal");
    (<HTMLInputElement>ui.document.getElementById('terminal-input')).focus()
    while ((<HTMLInputElement>ui.document.getElementById('terminal-input')).value.trim() === (<HTMLInputElement>ui.document.getElementById('terminal-input')).value) {
        await keyPressAPI(ns, "SPACE");
        await ns.sleep(50);
    }
    await keyPressAPI(ns, "ENTER");
}