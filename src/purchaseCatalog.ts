import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const serverName = ns.args[0].toString();
  if(!ns.serverExists(serverName)) {
    if (await ns.prompt(`No server with the name ${serverName}. Do you want to create one:`, {type: "boolean"}))
      ns.purchaseServer(serverName,1);
    else
      ns.exit();
  }
  let i = ns.getServerMaxRam(serverName);
  let purchaseCost = 0;
  const blap = [];
  while (i <= ns.getPurchasedServerMaxRam()) {
    purchaseCost = Math.floor(ns.getPurchasedServerUpgradeCost(serverName, i));
    ns.tprint("" + i + " : " + purchaseCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'"));
    blap.push(`${i}`);
    i = i * 2;
  }
  let choice = await ns.prompt("Choose your upgrade size:", {type:"select", choices: blap});
  if (typeof choice !== "boolean" && choice !== ""){ ns.upgradePurchasedServer(serverName, parseInt(choice))}
}