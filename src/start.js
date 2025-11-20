/** @param {NS} ns */
export async function main(ns) {
  while (ns.exec(ns.args[0] + ".js", ns.args[1] + "", 1000, ns.args[2]) !== 0) { await ns.sleep(1); }
  while (ns.exec(ns.args[0] + ".js", ns.args[1] + "", 100, ns.args[2]) !== 0) { await ns.sleep(1); }
  while (ns.exec(ns.args[0] + ".js", ns.args[1] + "", 10, ns.args[2]) !== 0) { await ns.sleep(1); }
  while (ns.exec(ns.args[0] + ".js", ns.args[1] + "", 1, ns.args[2]) !== 0) { await ns.sleep(1); }
}