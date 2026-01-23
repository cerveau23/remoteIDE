import {portReceiver} from "functions";
import {dSe} from "depthScannerV2";
import {keyPressAPI, serverPing, initialization as serverInitialization} from "BBA_API_handler"
import {NS} from "@ns";
import {ui} from "/functional/UIGetter"
import {Geography} from "/typeLib";
import {SourceFile_State} from "/functional/Source-File_State";

/** @param {NS} ns **/
export async function main(ns: NS) {
    ns.ramOverride(13);

    // ---------------------------------
    //         Initialization
    // ---------------------------------

    let source_file_state = new SourceFile_State(ns, {singularity: true});

    if(!source_file_state.singularity || ((ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname())) < 77)) await serverInitialization(ns, true);
    else ns.ramOverride(77);

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
    if(!source_file_state.singularity || ((ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname())) < 77)){
        await loopNoSingularity(ns, mapp, serversWithoutBackdoors, previousServer);
    }
    else{
        for(let server of serversWithoutBackdoors){
            let path = dSe(ns, {d:server}, mapp);
            for(let step of path.split(",").filter((name) => name!==""))
                if(!ns.singularity.connect(step))
                    throw Error(step);
            ns.tprint("Starting backdoor on " + server)
            await ns.singularity.installBackdoor();
            ns.tprint("Installed backdoor")
        }
        ns.singularity.connect("home");
    }
    ns.tprint("All servers backdoored!");
    ns.write("lastHackingAtLevel.txt", ns.getHackingLevel().toString(), "w");
}

async function loopNoSingularity(ns : NS, mapp: Geography.Map, serversWithoutBackdoors: string[], previousServer: string) {
    for (let i of serversWithoutBackdoors) {
        ns.print(i);

        // Generate path command
        let command = dSe(ns, Object.fromEntries([["d", i], ["connector", true]]), mapp) + "; backdoor";
        ns.tprintRaw(command);
        copyToClipboard(command);
        await ns.sleep(1);

        if (i !== serversWithoutBackdoors[0])
            ns.print("Finished");

        await commandWaitr(ns, command, previousServer, 20, "Giving time to execute command");
        if (!(await serverPing(true))) {
            while (ns.getServer(previousServer).isConnectedTo) {
                ns.toast("Backdoor finished, start new backdoor!", "error");
                await commandWaitr(ns, command, previousServer, 1, "Waiting for command to be executed", true);
            }
        } else while (ui.doCument.getElementById('terminal-input') !== undefined && ns.getServer(previousServer).isConnectedTo) {
            await ns.sleep(50);
            if (ui.isUserActive())
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

/**
 * @param {NS} ns
 * @param {string} command
 * @param {string} previousServer
 * @param {number} delay
 * @param {string} reason
 */
async function commandWaitr(ns : NS, command: string, previousServer : string, delay: number, reason: string, beeper = false) {
    await waitr(ns, delay, reason, async function () {
        let terminal = ui.doCument.getElementById('terminal-input');
        if (terminal === null)
            throw new Error("No terminal")
        if ((<HTMLInputElement>ui.doCument.getElementById('terminal-input')).value.trim() === "" || " ") {
            (<HTMLInputElement>ui.doCument.getElementById('terminal-input')).value = command;
        }
        if (ui.isUserActive() && await serverPing(true)) await autoEnter(ns)
        // if(beeper) ns.run("beep.js", 1, 1440);
        return !ns.getServer(previousServer).isConnectedTo;
    });
}

async function autoEnter(ns: NS) {
    if (!await serverPing())
        return;

    let terminal = ui.doCument.getElementById('terminal-input');
    if (terminal === null)
        throw Error("No terminal");
    (<HTMLInputElement>ui.doCument.getElementById('terminal-input')).focus()
    while ((<HTMLInputElement>ui.doCument.getElementById('terminal-input')).value.trim() === (<HTMLInputElement>ui.doCument.getElementById('terminal-input')).value) {
        await keyPressAPI(ns, "SPACE");
        await ns.sleep(50);
    }
    await keyPressAPI(ns, "ENTER");
}

function async() {
    throw new Error("Function not implemented.");
}
