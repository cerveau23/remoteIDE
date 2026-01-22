// noinspection InfiniteLoopJS

import {GoOpponent, NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
    let z = 0;
    let maxTry = 20;
    let boardSize: 5 | 7 | 9 | 13 = 13;
    let data = ns.flags([["o", "-"]]) as {o: GoOpponent};
    ns.tprint(data);
    if (["-", "", false].includes(data.o)) {
        let choice;
        do{
            choice = await ns.prompt("Opponent:", {
                type: "select",
                choices: ["No AI", "Netburners", "Slum Snakes", "The Black Hand", "Tetrads", "Daedalus", "Illuminati", "????????????"]
            });
        }while (typeof choice === "boolean")
        data.o = <GoOpponent>choice;
    }
    if (["-", "", false].includes(data.o)) {
        ns.exit();
    }
    try {
        while (true) {
            if (ns.go.getCurrentPlayer() === "None") {
                ns.go.resetBoardState(data["o"], boardSize);
            }
            if (data.o === "No AI") {
                await ns.asleep(10000);
                continue;
            }
            let x = 0;
            let y = 2;
            do {
                if (x > boardSize - 1) {
                    y = Math.floor(Math.random() * boardSize);
                    x = 0;
                } else {
                    x++;
                }
                if (ns.go.getBoardState()[y][x] === "." && ns.go.analysis.getControlledEmptyNodes()[y].charAt(x) === "?" && ns.go.analysis.getValidMoves()[y][x]) {
                    await ns.go.makeMove(y, x);
                    z = 0;
                } else {
                    //        if (ns.go.cheat.getCheatSuccessChance() > 95) { ns.go.cheat.removeRouter(x, y); await ns.go.makeMove(x, y); z = 0; }
                    //        else {
                    z++;
                    //        }
                }
            } while (ns.go.getCurrentPlayer() !== "None" && z < maxTry && ns.go.getGameState().previousMove != null);
            if (z >= maxTry || ns.go.getGameState().previousMove == null) {
                await ns.go.passTurn();
            }
        }
    } catch (err) {
        ns.toast("Restarting goPlayer.js", "error", 3000);
        if (!["-", "", false].includes(data.o)) {
            ns.spawn(ns.getScriptName(), {threads: 1, spawnDelay: 100}, ...ns.args);
        }
    }
}