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
    template.querySelector(HOOK_ID)?.setAttribute("id", PARASITE_HOOK_ID);

    /**
     * @param {String} ID           The ID to give the chosen Element
     * @param {String} textContent  The text to add to it
     * @param {Number} number       The index of the chosen Element in the list of children
     */
    function cloneModifier(ID: string, textContent: string, number: number) {
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
        StonksPart.innerHTML = textContent;
    }

    cloneModifier(TEXT_ID, "Stocks&nbsp;", 0);
    cloneModifier(STONKS_ID, "", 1);

    // Finished creating the template
    const html = template.outerHTML;

    //ns.tprintRaw(OverviewRowShell({html : html, ns : ns}));
    ns.tprintRaw(<OverviewRowShell html={html} ns={ns} />);

    function mount(parent: HTMLTableSectionElement, html: string, ns: NS) {
        const rootEl = ui.doCument.createElement("div")
        if (!moneyElement)
            throw new Error("No money element");
        parent.insertBefore(rootEl, moneyElement.nextSibling);

        ReactDOM.render(<OverviewRowShell html={html} ns={ns} />, rootEl)
        return rootEl
        // const root = ReactDOM.createRoot(rootEl);
        // root.render(
        //     <OverviewRowShell html={html} ns={ns} />
        // )
        // return root;
    }

    let root = mount(parent, html, ns);

    /*if (!root) {
        ns.tprint("Root not found")
        return;
    }*/

    ns.atExit(() => {
        ReactDOM.unmountComponentAtNode(root);
        parent.removeChild(root);
    });

    const tix: TIX = ns.stock as TIX;

    function OverviewRowShell({html, ns}: { html: string, ns: NS }) {
        // ns.tprint("Starting");
        const [tick, setTick] = React.useState(0);
        // ns.tprint("Set tick");
        const [price, setPrice] = React.useState(0);
        console.count("OverviewRowShell render");

        // ns.tprint("Made states")

        React.useEffect(() => {
            console.count("stockAnalysis effect");
            // ns.tprint("[1st]Starting 1st useEffect")
            let working = true;
            const symbols = tix.getSymbols();
            // ns.tprint("[1st]Set constants")

            async function loop() {
                while (working) {
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
        }, []);
        // ns.tprint("Set 1st useEffect");
        React.useEffect(() => {
            console.count("priceChange effect");
            // ns.tprint("[2nd] Starting second useEffect");
            const el = getHTML(STONKS_ID, "id")
            // ns.tprint("[2nd] Got the element");
            if(el) el.innerText = "$" + ns.formatNumber(price);
            // ns.tprint("[2nd]Set a new price");
        }, [tick]);
        // ns.tprint("Set 2nd useEffect");

        return (
            <tr dangerouslySetInnerHTML={{__html: html}}></tr>
        )
    }

    let suppresser = false;

    function ensureStocksRow() {
        /*if (ui.doCument.getElementById(PARASITE_ID)) return;*/
        const observer = new MutationObserver(() => {
            if(suppresser) return;
            console.count("MutationObserver fired");
            const hook = ui.doCument.getElementById(HOOK_ID);
            if (!hook || !parent) return; // React not ready yet

            // create row
            suppresser = true;
            /*root = */mount(parent, html, ns);
            suppresser = false;
        })
        if (parent)
            observer.observe(parent, {
                childList: true,
                subtree: false
            })
    }
    await ns.asleep(10);
    ensureStocksRow();

    while (true) {
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