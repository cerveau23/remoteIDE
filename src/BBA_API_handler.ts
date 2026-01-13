import { NS } from "@ns";

/**
 * Contains whether the server has been launched at least once in this instance.
 * @type {boolean}
 */
let serverLaunched: boolean = false;

/**
 * Contains whether the server is known to be ready for work.
 * @type {boolean}
 */
let knownServerStatus: boolean = false;

/** ------------------------------------
 *          Initialisation
 * ------------------------------------ */
await initialisation();

/**
 * @param {null|NS} ns
 * @returns {Promise<void>}
 */
export async function initialisation(ns: null | NS = null): Promise<void> {
    if ( ! (await serverPing(true))) { // If we can't reach a server, we launch one.
        serverLauncher();
        if(ns !== null)
            ns.tprint("Launched a server")
    } else { // Else, we store that knowledge
        if(ns !== null)
            ns.tprint("Server already up")
        knownServerStatus = true;
        serverLaunched = true;
    }
}

/**
 * Launches the server
 */
export function serverLauncher() : void {
    let windowFree = eval("window");
    windowFree.location.href = "BBA://launch";
    serverLaunched = true;
    // windowFree.open("BBA://launch");
}

/**
 * Waits until the server has answered a ping. <br>
 * If the server hasn't been launched yet for some reason, it is launched.
 * @param {NS} ns
 * @returns {Promise<void>}
 */
export async function serverUpWaiter(ns : NS): Promise<void> {
    if(!serverLaunched)
        serverLauncher();
    while (!(await serverPing()))
        await ns.sleep(100);
    knownServerStatus = true;
}

/**
 * @param {NS} ns
 * @param {string} key2press
 * @returns {Promise<void>}
 */
export async function keyPressAPI( ns : NS, key2press : string): Promise<void> {
    if(!knownServerStatus)
        await serverUpWaiter(ns);
    return await fetch("http://127.0.0.1:8123/press", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": "BoredAndReadyToCodeForGlory"
        },
        body: JSON.stringify({key: key2press})
    }).then((r) => {
        //ns.print(r);
    });
}

/**
 * @param ns
 * @param {string} string2press
 */
export async function stringPressAPI( ns : NS, string2press : string) {
    if(!knownServerStatus)
        await serverUpWaiter(ns);
    return await fetch("http://127.0.0.1:8123/chain", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": "BoredAndReadyToCodeForGlory"
        },
        body: JSON.stringify({string: string2press})
    }).then((r) => {
        //ns.print(r);
    });
}

/**
 * @param   {boolean}     [serverExistTest=false]   If set to true, shortens the timeout significantly.
 *                                                      Useful for checking if a server already exists.
 * @return  {Promise<boolean>}                      The response to pinging the server
 */
export async function serverPing(serverExistTest: boolean = false) : Promise<boolean> {
    try {
        let pingResult = await fetch("http://127.0.0.1:8123/ping", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Auth": "BoredAndReadyToCodeForGlory"
            },
            signal: AbortSignal.timeout(serverExistTest ? 200 : 1000)
        });
        return pingResult.ok;
    } catch (e) {
        //ns.print()
        return false;
    }
}