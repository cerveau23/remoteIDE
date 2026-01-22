import {portReceiver} from "functions";
import {dSe} from "depthScannerV2";
import {keyPressAPI, serverPing, initialization as serverInitialization} from "BBA_API_handler"
import {NS} from "@ns";
import {ui} from "/functional/UIGetter"

/** @param {NS} ns **/
export async function main(ns: NS) {

    // ---------------------------------
    //         Initialization
    // ---------------------------------

    await serverInitialization(ns, true);
    let mapp = await portReceiver(ns, "Server Map", 1, true);
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
        } else while ( ui.document.getElementById('terminal-input') !== undefined && ns.getServer(previousServer).isConnectedTo){
            await ns.sleep(50);
            if(ui.isUserActive())
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
    ns.tprint("All servers backdoored!");
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