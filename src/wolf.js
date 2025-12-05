// noinspection InfiniteLoopJS

/** @param {NS} ns */
let portfolio = {};
export async function main(ns) {
    if(!ns.stock.has4SDataTIXAPI())
        ns.exit();
  const allSymbolsBank = ns.stock.getSymbols();
  let buyingLimit = 10000000;
  while (true) {
    let up3Symbols = [];
    let up2Symbols = [];
    let up1Symbols = [];
    let down1Symbols = [];
    let down2Symbols = [];
    let down3Symbols = [];
    let allSymbolsWork = allSymbolsBank;
    for (let i in allSymbolsWork) {//sorting by forecast #1
      if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.70) { up3Symbols.push([allSymbolsWork[i], ns.stock.getForecast(allSymbolsWork[i])]); }
      else {
        if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.60) { up2Symbols.push([allSymbolsWork[i], ns.stock.getForecast(allSymbolsWork[i])]); }
        else {
          if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.50) { up1Symbols.push([allSymbolsWork[i], ns.stock.getForecast(allSymbolsWork[i])]); }
          else {
            if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.40) { down1Symbols.push(allSymbolsWork[i]); }
            else {
              if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.30) { down2Symbols.push(allSymbolsWork[i]); }
              else {
                if (ns.stock.getForecast(allSymbolsWork[i]) >= 0) { down3Symbols.push(allSymbolsWork[i]); }
              }
            }
          }
        }
      }
    }
    up3Symbols.sort(function (a, b) { return a[1] - b[1] });//sorting by forecast#2
    up2Symbols.sort(function (a, b) { return a[1] - b[1] });
    up1Symbols.sort(function (a, b) { return a[1] - b[1] });
    up3Symbols.reverse();
    up2Symbols.reverse();
    up1Symbols.reverse();
    let allGoodSymbolsSorted = [up3Symbols, up2Symbols, up1Symbols];
    for (let i in allGoodSymbolsSorted) {
      for (let j in allGoodSymbolsSorted[i]) {
        if (ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]) < ns.getPlayer().money) {
          let purchased = Math.floor((ns.getPlayer().money - 100000) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]))
          if (purchased + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0] > ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0])) [purchased = ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]) - ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0]]
          /*ns.print(allGoodSymbolsSorted[i][j][0]);
          ns.print(purchased);
          ns.print(purchased * ns.stock.getPrice(allGoodSymbolsSorted[i][j][0]));
          ns.print(ns.stock.getPurchaseCost(allGoodSymbolsSorted[i][j][0],purchased,"Long"));
          ns.print((ns.stock.getPurchaseCost(allGoodSymbolsSorted[i][j][0],purchased,"Long")-100000)/purchased);
          ns.print("Ask:"+ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0])+" Bid:"+ns.stock.getBidPrice(allGoodSymbolsSorted[i][j][0]));*/
          if (purchased * ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]) < buyingLimit + 100000) { continue; }
          ns.stock.buyStock(allGoodSymbolsSorted[i][j][0], purchased);
        }
        if (ns.getPlayer().money < buyingLimit + 100000) { break; }
      }
      if (ns.getPlayer().money < buyingLimit + 100000) { break; }
    }
    let stockMoney = 0
    for (let i in allSymbolsBank) {
      portfolio[allSymbolsBank[i]] = ns.stock.getPosition(allSymbolsBank[i])
      stockMoney += portfolio[allSymbolsBank[i]][0]*ns.stock.getBidPrice(allSymbolsBank[i])
    }
    let allBadSymbols = [down3Symbols, down2Symbols, down1Symbols];
    for (let i in allBadSymbols) {
      for (let j in allBadSymbols[i]) {
        if (portfolio[allBadSymbols[i][j]][0] !== 0) { ns.stock.sellStock(allBadSymbols[i][j], portfolio[allBadSymbols[i][j]][0]); }
      }
    }
    await ns.atExit(function() {sellAll(allSymbolsBank,ns);
    ns.run("extraMuros.js",1,"--script","stockPricesDisplay.js","--args",0)});
    ns.run("extraMuros.js",1,"--script","stockPricesDisplay.js","--args",stockMoney)
    await ns.stock.nextUpdate();
  }
}
function sellAll(symbolBank,ns) {
  for (let i in symbolBank) {
    if (portfolio[symbolBank[i]][0] !== 0) {
      ns.stock.sellStock(symbolBank[i], portfolio[symbolBank[i]][0]);
    }
  }
}