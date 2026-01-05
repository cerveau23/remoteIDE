/** @param {NS} ns */
export async function main(ns) {
    let documentFree = eval("document");
    // We wait until the "Start infiltration" page appears
    while (!Array.from(documentFree.getElementsByClassName("css-1ro0679")).some((value) => { return value.innerHTML.includes("Infiltrating"); })) {
        await ns.sleep(100);
        documentFree = eval("document");
    }
    window.location.href = "BBA://launch";
    window.open("BBA://launch");
    while (!(await serverPing().ok))
        await ns.sleep(100);
    documentFree.getElementsByClassName("css-1d6cey9")[0].click();
    // We wait for the "Get Ready!" page
    while (!Array.from(documentFree.getElementsByClassName("css-1qsxih2")).some((value) => {
        return value.innerHTML.includes("Get Ready!");
    })) {
        await ns.sleep(10);
        documentFree = eval("document");
    }
    // We wait during the "Get Ready!" page
    while (documentFree.getElementsByClassName("css-1qsxih2").length !== 0) {
        while (Array.from(documentFree.body.getElementsByClassName("css-1qsxih2")).some(
            // while (Array.from(document.children) === null ? true : Array.from(document.children).some(
            (value) => {
                return value === null ? true : value.innerHTML.includes("Get Ready!");
            })) {
            await ns.sleep(100);
            documentFree = eval("document");
            // ns.tprint(document.textContent);
            // if(document.body.textContent.includes("wires")) {
            //     copyToClipboard(document.getRootNode().textContent)
            //     ns.tprint("Document: ")
            //     ns.tprint(document);
            //     ns.tprint(document.body.innerHTML);
            //     ns.tprint(documentFree.getElementsByClassName("css-1bfln7c").innerHTML);
            //     return;
            // }
        }
        // copyToClipboard("Test");
        // copyToClipboard(Array.from(documentFree.getElementsByClassName("css-1qsxih2")).filter((
        //     (value) => {
        //         return value.innerHTML.includes("Cancel Infiltration")
        //     }))[0].innerHTML)
        await ns.sleep(100);
        // ns.tprint(Array.from(documentFree.body.getElementsByClassName("css-1qsxih2")).length);
        // ns.tprint(Array.from(documentFree.body.getElementsByClassName("css-1qsxih2")).filter((
        //     (value) => {
        //         return value.innerHTML.includes("Cancel Infiltration")
        //     }))[0].innerHTML);
        // let documentNow = document.getRootNode().innerHTML;
        // ns.write("HTML_"+new Date(Date.now()).toDateString().replaceAll(" ","")+".txt",documentNow);
        // return;
        document.body.getElementsByClassName("css-jhk36g")[0].click();
        let challengeList = ["Attack after the sentinel drops his guard", "Close the brackets", "Type it backward", "Say something nice about the guard.", "Enter the Code!", "Match the symbols!", "Remember all the mines!", "Cut the wires"];
        let page;
        if (documentFree.body.getElementsByClassName("css-1qsxih2").length === 1
            && documentFree.body.getElementsByClassName("css-1qsxih2")[0].innerHTML.includes("Cancel Infiltration"))
            page = document.body.getElementsByClassName("css-1qsxih2")[0];
        else if (documentFree.body.getElementsByClassName("css-1qsxih2").length === 0)
            throw Error("Wrong window, does not have css-1qsxih2!");
        else
            page = Array.from(document.body.getElementsByClassName("css-1qsxih2")).filter(((value) => {
                return value.innerHTML.includes("Cancel Infiltration");
            }))[0];
        // Find the right child that has the task
        let taskNode = Array.from(page.children).find((value) => {
            return value.classList.toString().match(/css-9bcezy|css-12f8zm3/) === null;
        });
        if (taskNode === undefined)
            continue;
        let taskTitle = taskNode.children[0];
        ns.tprint(taskTitle.innerHTML);
        // enumerate through the task types to find the one to be done
        let correctType = "";
        for (let type of challengeList)
            if (taskTitle.innerHTML.includes(type)) {
                correctType = type;
                break;
            }
        ns.tprint("Type: " + correctType);
        ns.toast("Type: " + correctType, "info");
        // ns.tprint(document);
        // ns.tprint(document.body.innerHTML);
        if (correctType === "") {
            await ns.sleep(10);
            continue;
        }
        //Switch through the tasks algorithms
        switch (correctType) {
            case "Attack after the sentinel drops his guard":
                ns.print("Found a guard!");
                while (!taskNode.textContent.includes("Distracted")) {
                    await ns.sleep(10);
                }
                ns.print("Distracted! Will press!");
                ns.tprint("Distracted! Will press!");
                //await simulateKey(ns, "Space", 32, true);
                keyPressAPI(ns, "Space");
                ns.print("Pressed!");
                break;
            default:
                break;
        }
        //Do the task
        ns.print("Prout");
    }
}
//css-1ro0679 -> Start infiltration (entre autres)
//css-1qsxih2 ->
/**
 * @param {NS} ns
 * @param {string} key2press
 */
function keyPressAPI(ns, key2press) {
    fetch("http://127.0.0.1:8765/press", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": "BoredAndReadyToCodeForGlory"
        },
        body: JSON.stringify({ key: key2press })
    }).then((r) => {
        ns.print(r);
    });
}
/**
 * @return {Promise<Response>} The response to pinging the server
 */
async function serverPing() {
    let pingResult = await fetch("http://127.0.0.1:8765/ping", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": "BoredAndReadyToCodeForGlory"
        },
        signal: AbortSignal.timeout(1000)
    });
    return pingResult;
}