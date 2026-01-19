import {NS} from "@ns";

/**
 * Requires: 7.25 GB of ram (self), no other program needed on home
 * A basic function that will launch automatic and simple hacking processes on all backdoored servers
 * It will also attempt to boot more advanced hacking managers and a few accessory programs
 * Should be replaced by awakenV2.js as soon as possible
 * @param {NS} ns
 * */
export async function main(ns: NS) {
  let file = ns.read("targetsNew.txt");
  let business_list = file.split(',');
  business_list = business_list.map(element => element.trim());
  business_list = business_list.filter(element => element !== "");
  for (let i in business_list) {
    ns.run("mitosis.js", 1, business_list[i])
    for (let o of ns.ps()) {
      if (o.filename === "mitosis.js") { await ns.sleep(10) }
    }
  }
  if (ns.serverExists("Darklight_Farm") && ns.getServer("darkweb").hasAdminRights) { ns.run("start.js", 1, "darklightFarm", "Darklight_Farm", "yes") }
  for (let i of ["wolf.js", "goPlayer.js", "codingContractVirus.js"]) {
    if ((ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) >= ns.getScriptRam(i))) {
      ns.run(i, { preventDuplicates: true, temporary: true })
    }
    else if (ns.serverExists("Overseer")) if ((!ns.ps().map((a) => { return a.filename }).includes(i)) && (!ns.ps("Overseer").map((a) => { return a.filename }).includes(i))) {
      if (!ns.ls("Overseer").includes(i)) { ns.scp(i, "Overseer") }
      ns.exec(i, "Overseer", { preventDuplicates: true, temporary: true })
      await ns.sleep(10)
    }
  }
}