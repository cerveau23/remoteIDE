import {NS} from "@ns";

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @returns{any[]} */
export function proper2ColoringOfAGraph(ns: NS, contractName: string, serverName: string): any[] {
    let [nbrOfVertex, edgesTemp] = ns.codingcontract.getData(contractName, serverName);
    let vertices = new Array(nbrOfVertex);
    let stringEdges = edgesTemp.toString();
    let tempEdges = stringEdges.split(",")
    let edges = [[0]];
    for (let i = 0; i < tempEdges.length; i += 2) edges[i / 2] = [parseInt(tempEdges[i]), parseInt(tempEdges[i + 1])];
    for (let i = 0; i < vertices.length; i++) vertices[i] = i;
    let colors = new Array(nbrOfVertex).fill(undefined);
    colors[edges[0][0]] = 0;
    do {
        if (coloring().length === 0) return [];
        if (colors.some(x => x === undefined)) colors[colors.indexOf(undefined)] = 0;
    } while (colors.some(x => x === undefined));
    return colors;

    /**
     * @returns {Number[]}
     */
    function coloring(): number[] {
        let didSomething = true;
        while (didSomething) {
            didSomething = false;
            for (let i of edges) {
                // ns.print(edges);
                // ns.print(edges.length);
                // ns.print(i); throw Error();
                let numberOfVerticesSet = 0;
                for (let j of i) if (colors[j] !== undefined) numberOfVerticesSet++;
                if ((numberOfVerticesSet === 2) && (colors[i[0]] === colors[i[1]])) {
                    ns.print("Proper coloring of a graph is bugged in " + contractName);
                    return [];
                } else if (numberOfVerticesSet === 1) {
                    if (colors[i[0]] === undefined) colors[i[0]] = 1 - colors[i[1]];
                    else colors[i[1]] = 1 - colors[i[0]];
                    didSomething = true;
                }
                // ns.print(i);
                // ns.print("" + i[0] + " : " + colors[i[0]] + "; " + i[1] + " : " + colors[i[1]] + "; ");
            }
            // let state = "";
            // for(let i of vertices)
            //     state += "" + i + " : " + colors[i] + "; ";
            // ns.print(state);
        }
        return [0];
    }
}

// noinspection JSUnusedGlobalSymbols
/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @returns {any[]}
 *  @deprecated */
export function proper2ColoringOfAGraphV0_1(ns: NS, contractName: string, serverName: string): any[] {
    let [nbrOfVertex, edges] = ns.codingcontract.getData(contractName, serverName);
    let vertices = new Array(nbrOfVertex).fill(undefined);
    let completionIndex = new Array(edges.length).fill(false);
    vertices[edges[0][0]] = 0
    let workInProgress = true;
    edges = edges.map((a: number[]) => {
        return [Number(a[0]), Number(a[1])]
    });
    while (completionIndex.includes(false)) {
        workInProgress = false;
        for (let i in vertices) if (vertices[i] !== undefined) {
            for (let b of edges.filter((value: number[], index: number) => {
                return (value.includes(Number(i))) && (!completionIndex[index])
            })) {
                if (b[1] === i) {
                    b = [b[1], b[0]]
                }//puts the value that is i at position 0
                // if (vertices[b[1]] === vertices[i]) {
                //     return []
                // }
                vertices[b[1]] = 1 - vertices[i]
                completionIndex[edges.indexOf(b)] = true;
                workInProgress = true;
            }
        }
        if (!workInProgress && completionIndex.includes(false)) {
            vertices[vertices.indexOf(undefined)] = 0 //Graph is split in two, so we need to initiate the second part
            workInProgress = true
        }
    }
    for (let i in vertices) if (vertices[i] === undefined) {
        vertices[i] = 0;
    }
    ns.print("Vertices: " + vertices.toString());
    return vertices;
}