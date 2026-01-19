import {bigIntSquareRoot} from "./cCVExtension4/bigIntSquareRoot";
import * as Cypher from "./cCVExtension4/cyphers";
import * as CompressionAlgorithms from "./cCVExtension4/de-compression_Algorithms";
import {findLargestPrimeFactor} from "./cCVExtension4/findLargestPrimeFactor";
import * as HammingCodes from "./cCVExtension4/hammingCodes";
import {proper2ColoringOfAGraph} from "./cCVExtension4/proper2ColoringOfAGraph";
import {NS} from "@ns";

export interface CcvExtensionLib {
    bigIntSquareRoot(ns: NS, contractName: string, serverName: string, dev?: boolean): string;
    Cypher: Cypher.Cypher;
    CompressionAlgorithms: typeof CompressionAlgorithms;
    findLargestPrimeFactor(ns: NS, contractName: string, serverName: string): number;
    HammingCodes: typeof HammingCodes;
    proper2ColoringOfAGraph(ns: NS, contractName: string, serverName: string): any[];
}

export const Lib : CcvExtensionLib = {
    bigIntSquareRoot,
    Cypher,
    CompressionAlgorithms,
    findLargestPrimeFactor,
    HammingCodes,
    proper2ColoringOfAGraph
}