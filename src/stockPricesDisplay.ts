import {NS} from "@ns";
import {ui} from "/functional/UIGetter";

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** @param {NS} ns */
export async function main(ns: NS) {
    ns.print(ns.getHostname());
    let stockMoney = parseInt(ns.args[0].toString());
    if (ns.getHostname() === "Overseer") {
        let clones = ns.ps("Overseer").filter((a) => {
            return a.filename === ns.getScriptName();
        });
        for (let i of clones)
            if (i.pid !== ns.pid) {
                if (ns.kill(i.pid))
                    ns.print("Killed " + i.pid);
                else
                    ns.print("Failed to kill " + i.pid);
            }
    }
    if (ui.doCument.getElementsByClassName("css-01010101010101").length === 0) {
        addElementV4();
    }
    ui.doCument.getElementsByClassName("css-01010101010101")[0].innerHTML = ns.formatNumber(stockMoney);
    if ((ns.getHostname() === "Overseer") && ((ns.ps("Overseer").filter((a) => {
        return a.filename === ns.getScriptName();
    }).length === 1) || stockMoney === 0)) {
        function killer(ns: NS) {
            ns.print("killer");
            if (ns.kill("wolf.js", "home")) {
                ns.scriptKill("wolf.js", "home");
            } else {
                ns.exec("wolf.js", "home");
            }
        }

        console.log(ui.doCument.getElementById("Stonks")?.innerHTML);
        (<HTMLElement>ui.doCument.getElementById("Stonks")).onclick = () => killer(ns);
        // noinspection InfiniteLoopJS
        while (true)
            await ns.asleep(1000);
        // ui.doCument.getElementById("Stonks").addEventListener("click",killer)
        // async function waitingTime() { while (!killinTime) { await sleep(500) } }
        // await waitingTime()
        // ui.doCument.getElementById("Stonks").removeEventListener("click",killer)
    }
} /*
function addElementV1() {
    let overviewWindow = doCument.getElementsByClassName("MuiTableBody-root", "css-1xnox0e")[0].innerHTML.slice(0)
    let arrayWindow = overviewWindow.split("<tr").map((a) => { return "<tr" + a })
    arrayWindow.shift()
    let workingString = arrayWindow[1]
    workingString = workingString.replace("Money", "Stocks")
    workingString = workingString.replace("<td class=\"MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell\"><p class=\"MuiTypography-root MuiTypography-body1 css-17bjo4m\">", "<td class=\"MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell\"><p class=\"MuiTypography-root MuiTypography-body1 css-17bjo4m css-01010101010101\">")
    arrayWindow.splice(2, 0, workingString)
    doCument.getElementsByClassName("MuiTableBody-root", "css-1xnox0e")[0].innerHTML = arrayToString(arrayWindow);
}
function addElementV2() {
    doCument.getElementsByClassName("MuiTableBody-root", "css-1xnox0e")[0].innerHTML = arrayToString(doCument.getElementsByClassName("MuiTableBody-root", "css-1xnox0e")[0].innerHTML.split("<tr").map((a) => { return "<tr" + a }).slice(1).toSpliced(2, 0, doCument.getElementsByClassName("MuiTableBody-root", "css-1xnox0e")[0].innerHTML.split("<tr").map((a) => { return "<tr" + a }).slice(1)[1].replace("Money", "Stocks").replace("<td class=\"MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell\"><p class=\"MuiTypography-root MuiTypography-body1 css-17bjo4m\">", "<td class=\"MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight MuiTableCell-sizeMedium css-d7dwfk-cell\"><p class=\"MuiTypography-root MuiTypography-body1 css-17bjo4m css-01010101010101\">")))
}
function addElementV3() {
    // Get the table element by ID
    let table = doCument.getElementsByClassName("MuiTableBody-root", "css-1xnox0e")[0];
    // Insert a new row
    let newRow = table.insertRow(2);
    newRow.classList.add("MuiTableRow-root", "css-1dix92e");
    // Create an empty <thead> element and add it to the table:
    let header = newRow.insertCell(0);
    header.outerHTML = `<th class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-6f2pp2-cell" scope="row"><p id="Stonks" class="MuiTypography-root MuiTypography-body1 css-17bjo4m">` + "Stocks" + `</p></th>`;
    let cellInnerClass = ["css-01010101010101", ""]
    // Loop through cellValues array and add each cell to the new row
    cellInnerClass.forEach((value, index) => {
        let newCell;
        // Insert a new cell for each value
        newCell = newRow.insertCell(index + 1);
        // Set the text content of the cell
        newCell.innerHTML = `<p class="MuiTypography-root MuiTypography-body1 css-17bjo4m ` + value + `"></p>`;
        newCell.classList.add("MuiTableCell-root", "MuiTableCell-body", "MuiTableCell-sizeMedium", "MuiTableCell-alignRight", "css-d7dwfk-cell");
    });
}*/
function addElementV4() {
    // Get the table element by ID
    let table = ui.doCument.getElementsByClassName(/*"MuiTableBody-root",*/ "css-1xnox0e")[0] as HTMLTableElement;
    // Insert a new row
    let newRow = table.insertRow(2);
    newRow.classList.add("MuiTableRow-root", "css-1dix92e");
    // Create an empty <thead> element and add it to the table:
    let header = newRow.insertCell(0);
    header.outerHTML = `<th class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium css-6f2pp2-cell" scope="row"><p id="Stonks" class="MuiTypography-root MuiTypography-body1 css-17bjo4m">` + "Stocks" + `</p></th>`;
    let cellInnerClass = ["css-01010101010101", ""];
    // Loop through cellValues array and add each cell to the new row
    cellInnerClass.forEach((value, index) => {
        let newCell;
        // Insert a new cell for each value
        newCell = newRow.insertCell(index + 1);
        // Set the text content of the cell
        newCell.innerHTML = `<p class="MuiTypography-root MuiTypography-body1 css-17bjo4m ` + value + `"></p>`;
        newCell.classList.add("MuiTableCell-root", "MuiTableCell-body", "MuiTableCell-sizeMedium", "MuiTableCell-alignRight", "css-d7dwfk-cell");
    });
}