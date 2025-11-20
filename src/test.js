/** @param {NS} ns */
export async function main(ns) {
	//ns.exploit()
	//ns.openDevMenu()
	//ns.bypass(document)
    let player = ns.getPlayer()
    ns.print("Test")
    ns.print(player.factions)
    for(let i in player){
        ns.print(i)
    }
}