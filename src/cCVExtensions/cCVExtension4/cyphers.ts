// noinspection SpellCheckingInspection

import {NS} from "@ns";

export interface Cypher {
    caesarCypher(ns: NS, contractName: string, serverName: string): string;
    vigenereCypher(ns: NS, contractName: string, serverName: string): string;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
type AlphabetChar = typeof alphabet[number];
type EncryptedAlphabet = Record<AlphabetChar | " ", AlphabetChar | " ">;

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @returns {string} */
export function caesarCypher(ns: NS, contractName: string, serverName: string): string {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let [pT, shift] = contractData;
    let encryptedAlphabet: EncryptedAlphabet = {}
    for (let x = 0; x < 26; x++) {
        encryptedAlphabet[alphabet[x]] = alphabet[(26 - shift + x) % 26]
    }
    encryptedAlphabet[" "] = " "
    pT = pT.split("")
    let answer = "";
    for (let letter of pT) {
        answer += encryptedAlphabet[letter]
    }
    return answer;
}

/** @param {NS} ns
 *  @param {string} contractName
 *  @param {string} serverName
 *  @returns {string} */
export function vigenereCypher(ns: NS, contractName: string, serverName: string): string {
    let contractData = ns.codingcontract.getData(contractName, serverName);
    let [pT, key] = contractData;
    let encryptedAlphabet: Record<AlphabetChar | " ", EncryptedAlphabet> = {}
    for (let keyLetter of key.split("")) {
        encryptedAlphabet[keyLetter] = {};
        let shift = alphabet.indexOf(keyLetter);
        for (let x = 0; x < 26; x++) {
            encryptedAlphabet[keyLetter][alphabet[x]] = alphabet[(26 + shift + x) % 26]
        }
    }
    let answer = "";
    pT = pT.split("")
    for (let letter = 0; letter < pT.length; letter++) {
        answer += encryptedAlphabet[key[letter % key.length]][pT[letter]]
    }
    return answer;
}