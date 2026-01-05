/** @param {NS} ns */
export async function main(ns) {
    //ns.exploit()
    //ns.openDevMenu()
    //ns.bypass(document)
    /*    let player = ns.getPlayer();
        ns.print("Test");
        ns.print(player.factions);
        for (let i in player) {
            ns.print(i);
        }
    let pingResult = await fetch("http://127.0.0.1:8123/ping", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": "BoredAndReadyToCodeForGlory"
        }
    });
    ns.tprint(pingResult.statusText);*/
    let arrayTest = [[[0,1],[1,2]],[["a","b"],["c","d"]]];
    ns.tprint(arrayTest.flat(1));
}
/*void ((function () {
    var e = document.createElement('script');
    let lc = new Date().getDate();
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src', 'https://www.milirose.com/scriptphp/applet/lanceur-applet.js?lc=%27+lc');
    document.body.appendChild(e);
})());*/