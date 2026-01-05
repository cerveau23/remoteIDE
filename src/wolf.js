// noinspection InfiniteLoopJS
/** @param {NS} ns */
let portfolio = {};
let allSymbolsBank;
let stockMoney = 0;

export async function main(ns) {
    if (!ns.stock.has4SDataTIXAPI())
        ns.exit();
    allSymbolsBank = ns.stock.getSymbols();
    let buyingLimit = 10000000;
    while (true) {
        stockMoney = actualisePortfolio(ns);
        let stockMoneyWork = stockMoney;
        let up3Symbols = [];
        let up2Symbols = [];
        let up1Symbols = [];
        let down1Symbols = [];
        let down2Symbols = [];
        let down3Symbols = [];
        let allSymbolsWork = [].concat(allSymbolsBank);
        for (let i in allSymbolsWork) { //sorting by forecast #1
            if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.70) {
                up3Symbols.push([allSymbolsWork[i], ns.stock.getForecast(allSymbolsWork[i]), ns.stock.getVolatility(allSymbolsWork[i])]);
            } else {
                if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.60) {
                    up2Symbols.push([allSymbolsWork[i], ns.stock.getForecast(allSymbolsWork[i]), ns.stock.getVolatility(allSymbolsWork[i])]);
                } else {
                    if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.50) {
                        up1Symbols.push([allSymbolsWork[i], ns.stock.getForecast(allSymbolsWork[i]), ns.stock.getVolatility(allSymbolsWork[i])]);
                    } else {
                        if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.40) {
                            down1Symbols.push(allSymbolsWork[i]);
                        } else {
                            if (ns.stock.getForecast(allSymbolsWork[i]) >= 0.30) {
                                down2Symbols.push(allSymbolsWork[i]);
                            } else {
                                if (ns.stock.getForecast(allSymbolsWork[i]) >= 0) {
                                    down3Symbols.push(allSymbolsWork[i]);
                                }
                            }
                        }
                    }
                }
            }
        }
        up3Symbols.sort(function (a, b) {
            return (b[1] - 0.5) * b[2] - (a[1] - 0.5) * a[2];
        }); //sorting by forecast and volatility#2
        up2Symbols.sort(function (a, b) {
            return (b[1] - 0.5) * b[2] - (a[1] - 0.5) * a[2];
        });
        up1Symbols.sort(function (a, b) {
            return (b[1] - 0.5) * b[2] - (a[1] - 0.5) * a[2];
        });
        // up3Symbols.reverse();
        // up2Symbols.reverse();
        // up1Symbols.reverse();
        let allGoodSymbolsSorted = [up3Symbols, up2Symbols, up1Symbols];
        for (let i in allGoodSymbolsSorted) {
            for (let j in allGoodSymbolsSorted[i]) {
                if (ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]) < ns.getPlayer().money + stockMoneyWork) {
                    let lowerShares = ([]).concat(allGoodSymbolsSorted).slice(i).map(
                        (subarray, index) => subarray.filter(
                            (value, subindex) => {
                                return subindex > j || index > i
                            },
                            {"j": j, "i": i, "index": index}
                        ),
                        {"j": j, "i": i}
                    );
                    let purchased = Math.floor((ns.getPlayer().money + stockMoneyWork - 100000 * (lowerShares.flat(1).length + 1)) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]));
                    let purchasedWithCash = Math.floor((ns.getPlayer().money - 100000) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]));
                    if (purchased > purchasedWithCash)
                        purchased = Math.floor((ns.getPlayer().money + stockMoneyWork - 200000) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]));
                    if (purchased + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0] > ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]))
                        purchased = ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]) - ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0];
                    if (Math.min(
                            Math.floor(
                                (ns.getPlayer().money + stockMoneyWork - 200000) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0])) + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0],
                            ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]))
                        > Math.min(
                            purchasedWithCash + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0],
                            ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]))) { // If we can still buy shares, but that it requires selling stock:
                        sellAll(lowerShares,ns);
                        stockMoneyWork = 0;
                        await ns.stock.nextUpdate();
                    } else {
                        stockMoneyWork -= (Math.max(purchased - purchasedWithCash, 0) + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0]) * ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]) + 100000;
                    }
                    /*ns.print(allGoodSymbolsSorted[i][j][0]);
                    ns.print(purchased);
                    ns.print(purchased * ns.stock.getPrice(allGoodSymbolsSorted[i][j][0]));
                    ns.print(ns.stock.getPurchaseCost(allGoodSymbolsSorted[i][j][0],purchased,"Long"));
                    ns.print((ns.stock.getPurchaseCost(allGoodSymbolsSorted[i][j][0],purchased,"Long")-100000)/purchased);
                    ns.print("Ask:"+ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0])+" Bid:"+ns.stock.getBidPrice(allGoodSymbolsSorted[i][j][0]));*/
                    if (!(purchased * ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]) < buyingLimit + 100000)) {
                        ns.stock.buyStock(allGoodSymbolsSorted[i][j][0], purchased);
                    }
                }
                if (ns.getPlayer().money < buyingLimit + 100000) {
                    break;
                }
            }
            if (ns.getPlayer().money < buyingLimit + 100000) {
                break;
            }
        }
        let allBadSymbols = [down3Symbols, down2Symbols, down1Symbols];
        for (let i in allBadSymbols) {
            for (let j in allBadSymbols[i]) {
                if (portfolio[allBadSymbols[i][j]][0] !== 0) {
                    ns.stock.sellStock(allBadSymbols[i][j], portfolio[allBadSymbols[i][j]][0]);
                }
            }
        }
        stockMoney = actualisePortfolio(ns)
        await ns.atExit(function () {
            sellAll(allSymbolsBank, ns);
            ns.scriptKill("stockPricesDisplay.js", "home");
            ns.scriptKill("stockPricesDisplay.js", "Overseer");
            ns.run("extraMuros.js", 1, "--script", "stockPricesDisplay.js", "--args", 0);
        });
        ns.run("extraMuros.js", 1, "--script", "stockPricesDisplay.js", "--args", stockMoney);
        await ns.stock.nextUpdate();
    }
}

function sellAll(symbolBank, ns) {
    for (let i in symbolBank) {
        ns.print(symbolBank[i])
        ns.print(portfolio);
        ns.print(portfolio[symbolBank[i]])
        if (portfolio[symbolBank[i]] !== undefined && portfolio[symbolBank[i]][0] !== 0) {
            //ns.stock.sellStock(symbolBank[i], Math.floor(portfolio[symbolBank[i]][0]));
            ns.stock.sellStock(symbolBank[i], ns.stock.getMaxShares(symbolBank[i]));
        }
    }
}

function actualisePortfolio(ns) {
    let stockMoney = 0;
    for (let i in allSymbolsBank) {
        portfolio[allSymbolsBank[i]] = ns.stock.getPosition(allSymbolsBank[i]);
        stockMoney += portfolio[allSymbolsBank[i]][0] * ns.stock.getBidPrice(allSymbolsBank[i]);
    }
    return stockMoney;
}