import "BBA_API_handler"

/** @param {NS} ns */
export async function main(ns) {
    while(true){
        if(Array.from(document.getElementsByClassName("css-1d6cey9")).some((value)=>value.innerText.includes("Infiltrate"))){
            ns.tprint(Array.from(document.getElementsByClassName("css-1d6cey9")).filter((value)=>value.innerText.includes("Infiltrate")).toString() )
            Array.from(document.getElementsByClassName("css-1d6cey9")).filter((value)=>value.innerText.includes("Infiltrate"))[0].click()
            break;
        }
        await ns.sleep(100)
    }
    //ns.exploit()
    //ns.openDevMenu()
    //ns.bypass(doCument)
    /*    let player = ns.getPlayer();
        ns.print("Test");
        ns.print(player.factions);
        for (let i in player) {
            ns.print(i);
        }
    let pingResult = await fetch("http://127.0.0.1:8123/ping", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": "BoredAndReadyToCodeForGlory"
        }
    });
    ns.tprint(pingResult.statusText);
    let arrayTest = [[[0, 1], [1, 2]], [["a", "b"], ["c", "d"]]];
    ns.tprint(arrayTest.flat(1));
    if(true&&ns.print("Nope"))
        ns.print("Finished")
    await ns.grafting.waitForOngoingGrafting();
    ns.grafting.graftAugmentation("Neurotrainer III")
    for(let augm of ns.grafting.getGraftableAugmentations().filter((value)=>{return value.includes("Bionic")||value.includes("Graphene")})){
        await ns.grafting.waitForOngoingGrafting();
        ns.grafting.graftAugmentation(augm);
    }
    //window.location.href = "BBA://launch";
    //while (!(await serverPing()))
    //    await ns.sleep(100);
    /*await ns.sleep(2000);
    ns.tprint(await (await fetch("http://127.0.0.1:8123/press", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth": "BoredAndReadyToCodeForGlory"
        },
        body: JSON.stringify({ key: ">" })
    })).text()); /*.then((r) => {
        ns.tprint(r.body);
    }));*/
    ns.tprint(ns.bladeburner.getActionEstimatedSuccessChance("General", "Recruitment"))
    let Noise = Date.now();
    let before = Date.now()
    await serverPing()
    let after = Date.now();
    ns.tprint("Base delay: " + (before - Noise))
    ns.tprint("Ping: " + (after - before))
    let infiltrationsPlaces = ns.infiltration.getPossibleLocations();
    let stats = [];
    let max = 0;
    let maxPlace
    for (let place of infiltrationsPlaces) {
        stats.push([place, ns.infiltration.getInfiltration(place.name)])
        if ((ns.infiltration.getInfiltration(place.name).reward.tradeRep / ns.infiltration.getInfiltration(place.name).maxClearanceLevel) > max) {
            max = (ns.infiltration.getInfiltration(place.name).reward.tradeRep / ns.infiltration.getInfiltration(place.name).maxClearanceLevel);
            maxPlace = place;
        }
    }
    ns.tprint("Rep : City: " + maxPlace.city + " Place: " + maxPlace.name + " Gain: " + max);
    for (let place of infiltrationsPlaces) {
        stats.push([place, ns.infiltration.getInfiltration(place.name)])
        if ((ns.infiltration.getInfiltration(place.name).reward.sellCash / ns.infiltration.getInfiltration(place.name).maxClearanceLevel) > max) {
            max = (ns.infiltration.getInfiltration(place.name).reward.sellCash / ns.infiltration.getInfiltration(place.name).maxClearanceLevel);
            maxPlace = place;
        }
    }
    ns.tprint("Money : City: " + maxPlace.city + " Place: " + maxPlace.name + " Gain: " + max);
    let response = (await serverPing(true));
    ns.tprint(response.ok.toString());
    ns.tprint(response.text());
    ns.tprint(response);
    async function serverPing() { 
        try {
            let pingResult = await fetch("http://127.0.0.1:8123/ping", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth": "BoredAndReadyToCodeForGlory"
                },
                signal: AbortSignal.timeout(1000)
            });
            return pingResult;
        } catch (e) {
            ns.print(e)
            return false;
        }
    }
}

/*void ((function () {
    var e = doCument.createElement('script');
    let lc = new Date().getDate();
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src', 'https://www.milirose.com/scriptphp/applet/lanceur-applet.js?lc=%27+lc');
    doCument.body.appendChild(e);
})());*/