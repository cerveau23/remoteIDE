import type {NS} from "@ns";
import {ReactElement, useEffect, useState} from "react";
import {ui} from "./functional/UIGetter";

type scriptObject = {
    name: string,
    running: boolean,
    instances?: number,
    arguments?: string[]
}

const favoriteScripts = ["beholder.js", "the_spy.js", "codingContractVirus.js"] as const;

export async function main(ns: NS) {
    const React = eval("window.React");
    const ReactDOM = eval("window.ReactDOM");
    if (!React || !ReactDOM) {
        ns.tprint("React not found");
        return;
    }
    // const root = eval('document.getElementById("root")');
    // if (!root) {
    //     ns.tprint("Root not found")
    //     return;
    // }
    // useEffect(() => {
    //     const container = eval('document.createElement("div")');
    //     container.style.padding = "10px";
    //     container.style.background = "yellow";
    //     container.style.border = "4px solid red";
    //     container.style.margin = "12px";
    //     container.style.color = "black";
    //     container.style.zIndex = "9999";
    //     root.appendChild(container);
    //     return () => {
    //         container.remove();
    //     }
    // }, [])

    let scripts: scriptObject[] = [];
    for (const script of favoriteScripts) {
        scripts.push({
            name: script,
            running: ns.ps("home").some((process) => process.filename === script), // @ts-ignore
            instances: this.running ? ns.ps("home").reduce((previousValue, currentValue) => previousValue + (currentValue.filename === script ? currentValue.threads : 0), 0) : undefined,
        })
    }

    // Create button to display panel
    let panelVisible: boolean = false;

    const buttonParent =
        ui.doCument.querySelector(
            "#root > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-elevation1.react-draggable.react-draggable-dragged.css-zqk033-overviewContainer > div.MuiCollapse-root.MuiCollapse-vertical.MuiCollapse-entered.css-1iz2152-collapse > div > div > div")

    const container = ui.doCument.createElement("div")
    buttonParent?.firstChild?.after(container)
    const rootButton = ReactDOM.createRoot(container);
    if (!rootButton) {
        ns.tprint("Root not found")
        return;
    }
    ns.atExit(() => {
        rootButton.unmount()
    })

    function button(): ReactElement<any, any> {
        const [visible, setVisible] = useState(panelVisible);

        useEffect(() => {
            // This effect runs when the component is mounted
            ns.print("Mounted!");

            const interval = setInterval(() => {
                if (!container.isConnected) {
                    // Parent disappeared, unmount
                    rootButton.unmount();
                }
            }, 500);


            return () => {
                // This cleanup runs automatically on unmount
                ns.print("Unmounting…");

                // Optional: remove container from DOM if you created it manually
                container.remove();
            };
        }, [container]);

        return (
            <div className="MuiBox-root">
                <button className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-jhk36g"
                        tabIndex={0}
                        type="button" aria-label="Display fav scripts"
                        onClick={() => setVisible((visible: boolean) => !visible)}>
                    Display scripts
                    <span className="MuiTouchRipple-root css-w0pj6f"></span>
                </button>
            </div>
        )
    }

    rootButton.render(<button/>)

    // Create panel

    /** The element that makes the backdrop of prompts. Add a click event listener to remove the panel.
     * <div
            aria-hidden="true"
            class="MuiBackdrop-root MuiModal-backdrop css-919eu4"
            style="
                opacity: 1;
                transition:
                    opacity 225ms
                    cubic-bezier(0.4, 0, 0.2, 1) 0ms;">
       </div>
     */
    // Each script is another useEffect and function --> Same function, but loop for
}