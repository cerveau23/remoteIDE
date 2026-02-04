import { NS } from "@ns"
import * as awaken from "../awaken"
import * as awakenV2 from "../awakenV2"
import * as beep from "../beep"
import * as beholder from "../beholder"
import * as bTS from "../bestTrainingServers"
import * as bTS2 from "../bestTrainingServersV2"
import * as buySkills from "../buySkills"
import * as BBA from "../BladeburnerAutomation"
import * as ccvt from "../cCVTester"
import * as cCV from "../codingContractVirus"
import * as cT from "../contractTester"
import * as dlf from "../darklightFarm"
import * as dlf2 from "../darklightFarmV2"
import * as dataS from "../dataScruber"
import * as depthS from "../Deprecated/depthScanner"
import * as depthS2 from "../depthScannerV2"
import * as eM from "../extraMuros"
import * as gardener from "../gardener"
import * as googleMaps from "../googleMaps"
import * as goPlayer from "../goPlayer"
import * as grower from "../grower"
import * as hacker from "../hacker"
import * as insiderTrader from "../insiderTrader"
import * as mitosis from "../mitosis"
import * as n00dles from "../n00dles"
import * as netGrowth from "../netGrowth"
import * as onlineFileFinder from "../onlineFileFinder"
import * as openAllScripts from "../openAllScripts"
import * as purchaseCatalog from "../purchaseCatalog"
import * as r4men from "../r4men"
import * as semiAutoBackdoorer from "../Deprecated/semiAutoBackdoorer"
import * as semiAutoBackdoorerV2 from "../semiAutoBackdoorerV2"
import * as SharingIsCaring from "../SharingIsCaring"
import * as sleeveAutomation from "../sleeveAutomation"
import * as start from "../start"
import * as statistics from "../statistics"
import * as stockPricesDisplay from "../stockPricesDisplay"
import * as taskKilla from "../taskKilla"
import * as template from "../template"
import * as test from "../test"
import * as the_Spy from "../the_Spy"
import * as treeOfInternet from "../treeOfInternet"
import * as Vault11Overseer from "../Vault11Overseer"
import * as VaultOverseer from "../VaultOverseer"
import * as weaker from "../weaker"
import * as WeaknessPotion from "../WeaknessPotion"
import * as wolf from "../wolf"

export async function main(ns:NS, recurse = 0){
    await awaken.main(ns)
    await awakenV2.main(ns)
    await beep.main(ns)
    await beholder.main(ns)
    await bTS.main(ns)
    await bTS2.main(ns)
    await buySkills.main(ns)
    await BBA.main(ns)
    await ccvt.main(ns)
    await cCV.main(ns)
    await cT.main(ns)
    await dlf.main(ns)
    await dlf2.main(ns)
    await dataS.main(ns)
    depthS.main(ns)
    depthS2.main(ns)
    await eM.main(ns)
    await gardener.main(ns)
    await googleMaps.main(ns)
    await goPlayer.main(ns)
    await grower.main(ns)
    await hacker.main(ns)
    await insiderTrader.main(ns)
    await mitosis.main(ns)
    await n00dles.main(ns)
    await netGrowth.main(ns)
    await onlineFileFinder.main(ns)
    await openAllScripts.main(ns)
    await purchaseCatalog.main(ns)
    await r4men.main(ns)
    await semiAutoBackdoorer.main(ns)
    await semiAutoBackdoorerV2.main(ns)
    await SharingIsCaring.main(ns)
    await sleeveAutomation.main(ns)
    await statistics.main(ns)
    await start.main(ns)
    await stockPricesDisplay.main(ns)
    await taskKilla.main(ns)
    await template.main(ns)
    await test.main(ns)
    await the_Spy.main(ns)
    await treeOfInternet.main(ns)
    await VaultOverseer.main(ns)
    await Vault11Overseer.main(ns)
    await weaker.main(ns)
    await WeaknessPotion.main(ns)
    await wolf.main(ns)
    self(ns,recurse)
}
function self(ns:NS, recurse:number){
    main(ns, ++recurse);
}