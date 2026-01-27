import { NS } from "../../nsdef/fixedNetscriptDefinitions"
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const React = eval("window.React");
    const ReactDOM = eval("window.ReactDOM");
    if(!React || !ReactDOM){
        ns.tprint("React not found");
        return;
    }
    const root = eval('document.getElementById("root")');
    if(!root){
        ns.tprint("Root not found")
        return;
    }
    const container = eval('document.createElement("div")');
    container.style.padding = "10px";
    container.style.background = "yellow";
    container.style.border = "4px solid red";
    container.style.margin = "12px";
    container.style.color = "black";
    container.style.zIndex = "9999";
    root.appendChild(container);

    function Counter(){
        const [count, setCount] = React.useState(0);
        return React.createElement(
            "button",
            {
                onClick: () => setCount(c => c + 1),
                style: {
                    fontSize: "16px",
                    padding: "8px",
                    cursor: "pointer"
                }
            },
            `Clicked ${count} times`
        );
    }

    ReactDOM.render(
        React.createElement(Counter),
        container
    );

    while(true){
        await ns.sleep(1000);
    }
}