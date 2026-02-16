import {NS, TIX} from "@ns";
import {ui} from "/functional/UIGetter";
import {getHTML} from "/functional/HtmlGetter";

/** @param {NS} ns */
export async function main(ns: NS) {

    const PARASITE_ID = "bb-stocks-row";
    const HOOK_ID = "overview-money-hook";
    const PARASITE_HOOK_ID = "overview-stock-hook";
    const TEXT_ID = "Stonks-Text";
    const STONKS_ID = "Stonks-Count";

    const React = eval("window.React") as typeof import("react");
    const ReactDOM = eval("window.ReactDOM") as typeof import("react-dom");
    if(!React || !ReactDOM){
        ns.tprint("React or Babel not found");
        return;
    }

    let running = true;

    const moneyElement = getHTML(HOOK_ID, "id").closest('tr');
    if (moneyElement == null)
        throw new Error("No element with id " + HOOK_ID);

    const parent: HTMLTableSectionElement | null = moneyElement.closest("tbody");
    if (parent == null)
        throw new Error("No parent to element of money!");

    /**
     * The overall container of the stocks line, cloned from the money line to carry over the formatting.
     * @type {HTMLTableRowElement}
     */
    const template: HTMLTableRowElement = moneyElement.cloneNode(true) as HTMLTableRowElement;

    /** Changing the hook id */
    template.querySelector("#" + HOOK_ID)?.setAttribute("id", PARASITE_HOOK_ID);

    /**
     * @param {String} ID           The ID to give the chosen Element
     * @param {String} [textB4]       The text to change
     * @param {String} textAfter    The text to add instead
     * @param {Number} number       The index of the chosen Element in the list of children
     */
    function cloneModifier(ID: string, textAfter: string, number: number, textB4?: string) {
        /**
         * Contains a reference to the `<p>` with the text.
         * @type {HTMLParagraphElement | null | undefined}
         */
        const StonksPart: HTMLParagraphElement | null | undefined = template.children[number].querySelector("p");
        if (!StonksPart)
            throw new Error(`No ${ID} paragraph!`);

        // Sets an id
        StonksPart.setAttribute("id", ID);

        // Sets the text
        if(textB4)
            StonksPart.innerHTML = StonksPart.innerHTML.replace(textB4, textAfter);
        else{
            StonksPart.innerHTML = textAfter;
        }
    }

    cloneModifier(TEXT_ID, "Stocks", 0, "Money");
    cloneModifier(STONKS_ID, "", 1);

    template.setAttribute("data-parasite",  "stocks");

    /** Finished creating the template */

    //ns.tprintRaw(StockAmountDisplay({html : html, ns : ns}));
    //ns.tprintRaw(<StockAmountDisplay element={template} ns={ns} />);

    function mount(parent: HTMLTableSectionElement, ns: NS): [HTMLTableRowElement, HTMLElement] {
        const rootEl = ui.doCument.createElement("tr")
        if (!moneyElement)
            throw new Error("No money element");
        parent.insertBefore(rootEl, moneyElement.nextSibling);

        rootEl.outerHTML = template.outerHTML;

        const targetEl = getHTML(STONKS_ID, "id") as HTMLParagraphElement;
        const parentEl = targetEl.parentElement;
        if(!parentEl) throw new Error("No parent to STONKS");
        getHTML(STONKS_ID, "id").remove();

        ReactDOM.render(<StockAmountDisplay element={targetEl} ns={ns} />, parentEl)
        return [rootEl, parentEl];
        // const root = ReactDOM.createRoot(rootEl);
        // root.render(
        //     <StockAmountDisplay html={html} ns={ns} />
        // )
        // return root;
    }

    let root = mount(parent, ns);

    /*if (!root) {
        ns.tprint("Root not found")
        return;
    }*/

    function exitFunction() {
        ReactDOM.unmountComponentAtNode(root[1]);
        ui.doCument
            .querySelectorAll('tr[data-parasite="stocks"]')
            .forEach(tr => tr.remove());
    }

    ns.atExit(() => {
        running = false;
        if(observer)
            observer.disconnect();
        exitFunction();
    });

    const tix: TIX = ns.stock as TIX;

    function StockAmountDisplay({element, ns}: { element: HTMLParagraphElement, ns: NS }) {
        // ns.tprint("Starting");
        const [tick, setTick] = React.useState(0);

        // ns.tprint("Set tick");
        const [price, setPrice] = React.useState(0);
        console.count("StockAmountDisplay render");

        // ns.tprint("Made states")

        React.useEffect(() => {
            console.count("stockAnalysis effect");
            // ns.tprint("[1st]Starting 1st useEffect")
            let working = true;
            // ns.tprint("[1st]Set constants")

            async function loop() {
                while (working && running) {
                    const symbols = tix.getSymbols();
                    let portfolioState = symbols.map((symbol) => {
                        const positions = tix.getPosition(symbol);
                        return (positions[0] ? tix.getSaleGain(symbol, positions[0], "Long") : 0)
                            + (positions[2] ? tix.getSaleGain(symbol, positions[2], "Short") : 0);
                    });
                    let sum = portfolioState.reduce((previous, current) => previous + current, 0);

                    setPrice(sum);
                    setTick(prev => prev + 1);

                    await tix.nextUpdate();
                }
            }
            // ns.tprint("[1st]Starting loop");
            loop();
            // ns.tprint("[1st]Started loop");

            return () => {
                // ns.tprint("[1st] Returning");
                working = false;
            };
        });
        // ns.tprint("Set 1st useEffect");
        React.useEffect(() => {
            if(!running)
                return;
            console.count("priceChange effect");
            // ns.tprint("[2nd] Starting second useEffect");
            const el = getHTML(STONKS_ID, "id")
            // ns.tprint("[2nd] Got the element");
            el.innerText = "$" + ns.formatNumber(price);
            // ns.tprint("[2nd]Set a new avgPrice");
        }, [tick]);
        // ns.tprint("Set 2nd useEffect");

        return (
            <p className={element.className} id={STONKS_ID}></p>
        )
    }

    let suppresser = false;

    function ensureStocksRow() {
        /*if (ui.doCument.getElementById(PARASITE_ID)) return;*/
        const observer = new MutationObserver(() => {
            if(suppresser || !running) return;
            console.count("MutationObserver fired");
            const hook = ui.doCument.getElementById(HOOK_ID);
            if (!hook || !parent) return; // React not ready yet

            if(ui.doCument.getElementById(PARASITE_HOOK_ID)) return; // Element still exists

            // create row
            suppresser = true;
            exitFunction();
            /*root = */mount(parent, ns);
            suppresser = false;
        })
        if (parent)
            observer.observe(parent, {
                childList: true,
                subtree: false
            })
        return observer;
    }

    await ns.asleep(10);
    const observer = ensureStocksRow();

    while (running) {
        await ns.asleep(60000000);
    }
}

/*
<tr class="MuiTableRow-root css-1dix92e">
    <th class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-6f2pp2-cell" scope="row">
        <p class="MuiTypography-root MuiTypography-body1 css-17bjo4m">
            Money&nbsp;
        </p>
    </th>
    <td class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell">
        <p class="MuiTypography-root MuiTypography-body1 css-17bjo4m">
            $18.570b
        </p>
    </td>
    <td class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell">
        <p class="MuiTypography-root MuiTypography-body1 css-17bjo4m" id="overview-money-hook"></p>
    </td>
</tr>
<tr class="MuiTableRow-root css-1dix92e">
    <th class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-6f2pp2-cell" scope="row">
        <p id="Stonks" class="MuiTypography-root MuiTypography-body1 css-17bjo4m">
            Stocks
        </p>
    </th>
    <td class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium MuiTableCell-alignRight css-d7dwfk-cell">
        <p class="MuiTypography-root MuiTypography-body1 css-17bjo4m css-01010101010101">
            $0.000
        </p>
    </td>
    <td class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium MuiTableCell-alignRight css-d7dwfk-cell">
        <p class="MuiTypography-root MuiTypography-body1 css-17bjo4m " id="overview-stock-hook"></p>
    </td>
</tr>
*/