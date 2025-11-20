/** @param {NS} ns */
export async function main(ns) {
  let target = ns.args[0];
  if(target === "darkweb" && !ns.hasTorRouter()){return}
  let tServer = ns.getServer(target);
  if (!tServer.hasAdminRights) {
    if (tServer.requiredHackingSkill <= ns.getHackingLevel()) {
      if (ns.fileExists("Brutessh.exe")) { ns.brutessh(target); }
      if (ns.fileExists("FTPcrack.exe")) { ns.ftpcrack(target); }
      if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(target); }
      if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(target); }
      if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(target); }
      if (tServer.numOpenPortsRequired <= ns.getServer(target).openPortCount) {
        ns.nuke(target);
      } else { ns.exit(); }
    }
    else {
      ns.exit();
    }
  }
  if (tServer.requiredHackingSkill <= ns.getHackingLevel()) {
    ns.scp("r4men.js", target);
    while (tServer.maxRam - ns.getServer(target).ramUsed >= ns.getScriptRam("r4men.js")) {
      ns.exec("r4men.js", target, 1, target);
    }
  }
}