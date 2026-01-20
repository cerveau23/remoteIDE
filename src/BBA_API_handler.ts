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

/**
 * Contains whether {@link ``initialization``} is currently being called
 * @type {boolean}
 */
let currentlyInitialising: boolean = false;

/** ------------------------------------
 *          Initialisation
 * ------------------------------------ */
await initialization();

/**
 * @param {null|NS} ns
 * @param {boolean} [waiting4ready = false]
 * @returns {Promise<void>}
 */
export async function initialization(ns?: NS, waiting4ready:boolean = false): Promise<void> {
    while(currentlyInitialising) // To prevent a script from calling this function while it is pinging, we set a lock
        await serverPing(true);
    currentlyInitialising = true; // Lock the function in this call only.
    if ( ! (await serverPing(true))) { // If we can't reach a server, we need to check if one is waking up.
        if(!serverLaunched) { // First call of this function, when we have not yet launched a server
            serverLauncher();
            ns?.tprint("Launched a server")
        }
        else { // Subsequent calls of this function, while the server is waking up (Should only be used to await server initialization)
            ns?.tprint("Server waking up")
            while((!(await serverPing(true))) && waiting4ready)
                await serverPing(true);
        }
    } else { // If a server can be reached, we store that knowledge
        ns?.tprint("Server already up")
        knownServerStatus = true;
    }
    serverLaunched = true;
    currentlyInitialising = false;
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