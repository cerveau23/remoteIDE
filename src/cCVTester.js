import {testing} from "codingContractVirus"
import { average, sum } from "functions"
/** @param {NS} ns */
export async function main(ns) {
  let data = ns.flags([["type", "-"], ["massTest", false], ["ultimateTest", false]]);
  //ns.tprint(data);
  if (data.type === "-") {
    data.type = await ns.prompt("Type:", { type: "select", choices: ns.codingcontract.getContractTypes() })
  }
  if (data.massTest === false) {
    data.massTest = await ns.prompt("Mass Testing?", { type: "boolean" })
  }
  ns.tprintRaw("run cCVTester.js --type \"" + data.type + "\" " + (data.massTest ? "--massTest ":"") + (data.ultimateTest ? "--ultimateTest":""))
  if (data.massTest) {
    let lastTimePercent = Date.now();
    let allTimesPercent = [];
    let lastTime = Date.now();
    for (let i = 0; i < 1000; i++) {
      let CC = ns.codingcontract.createDummyContract(data.type);
      //ns.run("codingContractVirus.js",1,CC,"home");
      await testing(ns, CC, "home");
      //if(i%10==0){await ns.sleep();}
      if ((i % 100 === 0) && (i !== 0)) {
        allTimesPercent.push(Date.now() - lastTimePercent);
        ns.print(average(allTimesPercent) * (100 - i / 10) / 1000)
        ns.tprint(i / 10 + "% finished, Time used: " + ns.formatNumber((Date.now() - lastTimePercent) / 1000) + "s, Estimated time remaining: " + ns.formatNumber(average(allTimesPercent) * (10 - i / 100) / 1000) + "s");
        lastTimePercent = Date.now();
      }
      if ((Date.now() - lastTime) > 10) {
        await ns.asleep(Date.now() - lastTime);
        lastTime = Date.now();
      }
      //await ns.sleep();
    }
    ns.tprint("Success! Total time: " + ns.formatNumber(sum(allTimesPercent) / 1000) + "s");
  }
  
  else {
    let CC = ns.codingcontract.createDummyContract(data.type);
    await testing(ns, CC, "home");
  }
}