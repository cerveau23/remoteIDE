/** @param {NS} ns */
export async function main(ns) {
  let i = 1;
  let purchaseCost = 0;
  const blap = [];
  while (i <= 1048576) {
    purchaseCost = "" + ns.getPurchasedServerUpgradeCost(ns.args[0], i);
    ns.tprint("" + i + " : " + purchaseCost.replace(/\B(?=(\d{3})+(?!\d))/g, "'"));
    blap.push(i);
    i = i * 2;
  }
  let choice = await ns.prompt("Choose your upgrade size:", {type:"select", choices:blap});
  if (choice !== false && choice !== ""){ ns.upgradePurchasedServer(ns.args[0], choice)}
}