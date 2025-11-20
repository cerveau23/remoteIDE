/**
 * Requires: 6.2 GB of ram (self), Overseer server
 * Automatically tries to hack into available servers and boots up the VaultOverseer and
 *  darklightFarmV2 programs on the Overseer server
 * Upgrade of awaken.js
 * Should be launched by beholder.js if possible
 * @param {NS} ns
 * */
export async function main(ns) {
  //ns.tail();

  let file = ns.read("targetsNew.txt");
  let business_list = file.split(',');
  business_list = business_list.map(element => element.trim());
  business_list = business_list.filter(element => element !== "");
  //ns.tprint(business_list);
  if (!ns.serverExists("Overseer")) { ns.exit() }
  ns.scp(["darklightFarmV2.js", "VaultOverseer.js"], "Overseer", "home");
  ns.exec("darklightFarmV2.js", "Overseer", { preventDuplicates: true })
  for (let i in business_list) {
    let tServer = ns.getServer(business_list[i]);
    if (!tServer.hasAdminRights) {
      if (tServer.requiredHackingSkill <= ns.getHackingLevel()) {
        if (ns.fileExists("Brutessh.exe")) { ns.brutessh(tServer.hostname); }
        if (ns.fileExists("FTPcrack.exe")) { ns.ftpcrack(tServer.hostname); }
        if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(tServer.hostname); }
        if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(tServer.hostname); }
        if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(tServer.hostname); }
        if (tServer.numOpenPortsRequired <= ns.getServer(tServer.hostname).openPortCount) {
          ns.nuke(tServer.hostname);
        } else { continue; }
      }
      else {
        continue;
      }
    }
    if (ns.getServerMaxRam(business_list[i]) === 0 || ns.getServerMoneyAvailable(business_list[i]) === 0) { continue; }
    ns.exec("VaultOverseer.js", "Overseer", { preventDuplicates: true }, '-v', business_list[i]);
  }
}