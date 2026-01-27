import { NS } from "@ns";
import {ReactNode, useEffect} from "react";

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.disableLog("ALL");
    const React = eval("window.React");
    const ReactDOM = eval("window.ReactDOM");
    // const Babel = eval("window.Babel");
    if(!React || !ReactDOM /*|| !Babel*/){
        ns.tprint("React or Babel not found");
        return;
    }
    const root = eval('document.getElementById("root")');
    if(!root){
        ns.tprint("Root not found")
        return;
    }
    useEffect(() =>{
        const container = eval('document.createElement("div")');
        container.style.padding = "10px";
        container.style.background = "yellow";
        container.style.border = "4px solid red";
        container.style.margin = "12px";
        container.style.color = "black";
        container.style.zIndex = "9999";
        root.appendChild(container);
        return () => {
            container.remove();
        }
    },[])

    ns.atExit(()=> {
        root.unmount();
    });

    function Counter(){
        const [count, setCount] = React.useState(0);
        return (
            <div>
                <h2> JSX is working </h2>
                <button onClick={() => setCount((c: number) => c + 1)}>
                    Clicked {count} times
                </button>
            </div>
        );
    }
    root.render(
        <Counter />
    );

    // const compiled = Babel.transform(jsxCode,
    //     {
    //         presets: ["react"]
    //     }).code;
    //eval(jsxCode);
    // ns.tprintRaw(jsxCode);

    while(true){
        await ns.sleep(1000);
    }
}