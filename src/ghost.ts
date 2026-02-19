// noinspection InfiniteLoopJS
import type {NS, TIX} from "@ns";

// sharesLong, avgLongPrice, sharesShort, avgShortPrice, obtained from stock.getPosition()
type portfolio = [number, number, number, number];

// The list of my portfolios
let portfolioList: { [key: string]: portfolio } = {};

// The list of all symbols
let allSymbolsBank: string[];
let allStocks: Stock[];
let stockMoney: number = 0;

const tradingTax = 100000;

class Stock {

    /**
     * The stock's symbol.
     * @type {string}
     * @readonly
     */
    public readonly symbol: string;

    /**
     * The maximum number of shares the player can own at once.
     * @type {number}
     * @readonly
     */
    public readonly maxStocks: number;

    /**
     * The static instance of ns shared among all Stock instances.
     * @type {NS}
     * @private
     * @static
     */
    static #ns: NS;

    /**
     * The volatility rate of the stock. Believed to be constant.
     * @type {number}
     * @readonly
     */
    public readonly volatility: number;

    /**
     * The constructor of the Stock class.
     * @param {string} symbol The stock's symbol.
     * @param {NS} [ns] A way to actualise the static ns instance stored in the Stock class.
     * @param {boolean} [noSell = false] If true, will not sell any share even if they go against the current trend.
     */
    constructor(symbol: string, ns?: NS, noSell: boolean = false) {

        if(ns) Stock.#ns = ns;

        this.symbol = symbol;

        this.maxStocks = this.tix.getMaxShares(this.symbol);

        if (!noSell)
            this.sellBadStock();

        this.volatility = this.tix.getVolatility(this.symbol);
    }

    public static set ns(ns: NS) {
        Stock.#ns = ns;
    }

    /**
     * A way to shorten the namespace.
     * @returns {TIX}
     * @private
     */
    private get tix(): TIX {return Stock.#ns.stock}

    /*-------------------------------------
                    Portfolio
     -------------------------------------*/
    /**
     * The number of long shares (Value up = gain).
     * @returns {number}
     */
    get sharesLong(): number {return this.tix.getPosition(this.symbol)[0]}
    /**
     * The average price of the long shares possessed at the time of purchase.
     * @returns {number}
     */
    get avgLongPrice(): number {return this.tix.getPosition(this.symbol)[1]}
    /**
     * The number of short shares (Value down = gain).
     * @returns {number}
     */
    get sharesShort(): number {return this.tix.getPosition(this.symbol)[2]}
    /**
     * The average price of the short shares possessed at the time of purchase.
     * @returns {number}
     */
    get avgShortPrice(): number {return this.tix.getPosition(this.symbol)[3]}

    /**
     * The forecast of the stock.
     * @returns {number}
     */
    get forecast(): number {return this.tix.getForecast(this.symbol)}
    /**
     * The multiplier of the stock's value. Is 1 + (forecast - 0.5)
     * @returns {number}
     */
    get forecastMultiplier(): number {return this.forecast - 0.5 + 1;}

    /*-------------------------------------
                 Market Prices
     -------------------------------------*/
    /**
     * The average price of the stock per share.
     * @returns {number}
     */
    get avgPrice(): number {return this.tix.getPrice(this.symbol)}
    /**
     * The asking price of the stock per share.
     * @returns {number}
     */
    get askPrice(): number {return this.tix.getAskPrice(this.symbol)}
    /**
     * The bidding price of the stock per share.
     * @returns {number}
     */
    get bidPrice(): number {return this.tix.getBidPrice(this.symbol)}

    /*-------------------------------------
                    Growth
     -------------------------------------*/
    /**
     * Whether the stock is growing or shrinking.
     * @returns {"positive" | "negative"}
     */
    get growth(): "positive" | "negative" {return (this.forecast > 0.50) ? "positive" : "negative"}
    /**
     * Gets the maximum growth in percentage of the stock price.
     * @returns {number}
     */
    get maxGrowthPc(): number {return (this.forecast - 0.5) * this.volatility}
    /**
     * Gets the most extreme growth multiplier of the stock price.
     * @returns {number}
     */
    get maxGrowthPcMultiplier(): number {return (this.forecastMultiplier) * this.volatility}
    /**
     * Gets the average growth (absolute) in dollars (according to the stock price).
     * @returns {number}
     */
    get avgGrowth$(): number {return Math.abs(this.maxGrowthPc / 2) * this.avgPrice}
    /**
     * Gets the average price in dollars (according to the stock price) at the next tick.
     * @returns {number}
     */
    get avgNextPrice(): number {return (this.maxGrowthPc / 2 + 1) * this.avgPrice}

    /*-------------------------------------
                  Stock Prices
     -------------------------------------*/
    /**
     * The price of buying the stock, depending on its forecast.
     * @returns {number}
     */
    get buyPrice(): number  {return (this.growth === "positive") ? this.askPrice : this.bidPrice}
    /**
     * The price of selling the stock, depending on its forecast.
     * @returns {number}
     */
    get sellPrice(): number  {return (this.growth === "negative") ? this.bidPrice : this.askPrice}

    /*-------------------------------------
                 Type coercion
     -------------------------------------*/
    [Symbol.toPrimitive](hint: string) {
        /*if (hint === "number") {
            return Math.sqrt(this.x ** 2 + this.y ** 2);
        }
        return `(${this.x}, ${this.y})`;*/
    }


    /**
     * Sells the stocks that will lose money.
     * @private
     */
    private sellBadStock() {
        if ((this.growth === "positive") && (this.sharesShort !== 0))
            this.tix.sellShort(this.symbol, this.maxStocks);
        if ((this.growth === "negative") && (this.sharesLong !== 0))
            this.tix.sellStock(this.symbol, this.maxStocks);
    }

    /**
     * Sells all stocks.
     */
    destroy(){
        this.tix.sellShort(this.symbol, this.maxStocks);
        this.tix.sellStock(this.symbol, this.maxStocks);
    }
}

function deltaAvgGrowth(a: Stock,b: Stock) {
    return b.avgGrowth$ - a.avgGrowth$
}
function deltaAvgGrowthWMostStocks(a: Stock,b: Stock) {
    return b.avgGrowth$ - a.avgGrowth$
}


/** @param {NS} ns */
export async function main(ns: NS) {

    function updateStockNS(){Stock.ns = ns;}

    // Ensuring we have the 4SData TIX API
    while (!ns.stock.has4SDataTIXAPI())
        await ns.asleep(60000); // Sleeping for 1 minute in wait of getting 4SData TIX API

    allSymbolsBank = ns.stock.getSymbols();
    allStocks = allSymbolsBank.map((symbol) => new Stock(symbol, ns));

    ns.atExit(function () {
        sellAll(allSymbolsBank, ns);
        // ns.scriptKill("stockPricesDisplay.js", "home");
        // ns.scriptKill("stockPricesDisplay.js", "Overseer");
        // ns.run("extraMuros.js", 1, "--script", "stockPricesDisplay.js", "--args", 0);
    });

    // Defines the minimum money to have in the bank before buying more stocks.
    let buyingLimit = 10000000;

    while (true) {
        updateStockNS();

        // Sort the stocks by the average growth expected
        allStocks.sort(deltaAvgGrowth);

        stockMoney = actualisePortfolio(ns);
        let stockMoneyWork = stockMoney;

        /** [Company symbol, Forecast, Volatility] */
        let up3Symbols: [string, number, number][] = new Array<[string, number, number]>();
        /** [Company symbol, Forecast, Volatility] */
        let up2Symbols: [string, number, number][] = new Array<[string, number, number]>();
        /** [Company symbol, Forecast, Volatility] */
        let up1Symbols: [string, number, number][] = new Array<[string, number, number]>();
        let down1Symbols: string[] = [];
        let down2Symbols: string[] = [];
        let down3Symbols: string[] = [];
        let allSymbolsWork = allSymbolsBank.toSpliced(0, 0);
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
                    let lowerShares = (
                        allGoodSymbolsSorted
                            .toSpliced(0, 0) // Copy
                            .slice(parseInt(i)) // Only take the groups after i
                            .map(
                                (subarray, index) =>
                                    subarray.filter((value, subindex) => {
                                            return subindex > parseInt(j) || index > parseInt(i);
                                        }  // Filter to only have the elements after what we're studying (for optimization (?))
                                        , {"j": j, "i": i, "index": index} // Passing j, i, and index to the function
                                    ).map((value) => value[0]) // Only keep the name of the stocks
                                , {"j": j, "i": i}) // Passing j and i to the function
                    );
                    let purchased = Math.floor((ns.getPlayer().money + stockMoneyWork - 100000 * (lowerShares.flat(1).length + 1)) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]));
                    let purchasedWithCash = Math.floor((ns.getPlayer().money - 100000) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]));
                    if (purchased > purchasedWithCash)
                        purchased = Math.floor((ns.getPlayer().money + stockMoneyWork - 200000) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0]));
                    if (purchased + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0] > ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]))
                        purchased = ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]) - ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0];
                    if (Math.min(Math.floor((ns.getPlayer().money + stockMoneyWork - 200000) / ns.stock.getAskPrice(allGoodSymbolsSorted[i][j][0])) + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0], ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]))
                        > Math.min(purchasedWithCash + ns.stock.getPosition(allGoodSymbolsSorted[i][j][0])[0], ns.stock.getMaxShares(allGoodSymbolsSorted[i][j][0]))) { // If we can still buy shares, but that it requires selling stock:
                        sellAll(lowerShares.flat(), ns);
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
        for (let iString in allBadSymbols) {
            let i = parseInt(iString)
            for (let jString in allBadSymbols[i]) {
                let j = parseInt(jString)
                if (portfolioList[allBadSymbols[i][j]][0] !== 0) {
                    ns.stock.sellStock(allBadSymbols[i][j], portfolioList[allBadSymbols[i][j]][0]);
                }
            }
        }
        stockMoney = actualisePortfolio(ns);
        // ns.run("extraMuros.js", 1, "--script", "stockPricesDisplay.js", "--args", stockMoney);
        await ns.stock.nextUpdate();
    }
}

function sellAll(symbolBank: string[], ns: NS) {
    for (let i in symbolBank) {
        ns.print(symbolBank[i]);
        ns.print(portfolioList);
        ns.print(portfolioList[symbolBank[i]]);
        if (portfolioList[symbolBank[i]] !== undefined && portfolioList[symbolBank[i]][0] !== 0) {
            //ns.stock.sellStock(symbolBank[i], Math.floor(portfolioList[symbolBank[i]][0]));
            ns.stock.sellStock(symbolBank[i], ns.stock.getMaxShares(symbolBank[i]));
        }
    }
}

/**
 * Actualizes the list of portfolios.
 *
 * @function actualisePortfolio
 * @param { NS } ns
 * @returns { number } The current amount we would get from selling all our shares right now.
 */
function actualisePortfolio(ns: NS): number {
    let stockMoney = 0;
    for (let i in allSymbolsBank) {
        portfolioList[allSymbolsBank[i]] = ns.stock.getPosition(allSymbolsBank[i]);
        stockMoney += (portfolioList[allSymbolsBank[i]][0] * ns.stock.getBidPrice(allSymbolsBank[i])
            + portfolioList[allSymbolsBank[i]][2] * ns.stock.getAskPrice(allSymbolsBank[i]));
        stockMoney -= (Number(portfolioList[allSymbolsBank[i]][0] !== 0) + Number(portfolioList[allSymbolsBank[i]][2] !== 0)) * tradingTax;
    }
    return stockMoney;
}