import { ui } from "./UIGetter";

type functionCodes = "query"|"id"|"class"|"attribute"|"lastChild"

type getHTMLReturnType<T extends functionCodes> =
    T extends "query"|"lastChild" ? Element :
        T extends "class" ? Element[] :
            T extends "id" ? HTMLElement :
                T extends "attribute" ? string : null


export function getHTML<T extends "attribute"|"lastChild">(selector: string, desiredFunction: T , element: HTMLElement): getHTMLReturnType<T>
export function getHTML<T extends "query"|"id"|"class">(selector: string, desiredFunction: T): getHTMLReturnType<T>
/**
 * A function to get HTML elements/attributes without the risk of it being null.
 * @template T among "query", "id", "class", "attribute" and "lastChild"
 * @param {string} selector         The string to put in the selecting function.
 * @param {T} desiredFunction       The type we're using to search.
 * @param {HTMLElement} element     For the functions that search inside an element
 * @returns {getHTMLReturnType<T>}
 */
export function getHTML(selector: string, desiredFunction: functionCodes, element?: HTMLElement): Element|HTMLElement|Element[]|string {
    let el;
    switch(desiredFunction) {
        case "query":
            el = ui.doCument.querySelector(selector);
            break;

        case "class":
            el = Array.from(ui.doCument.getElementsByClassName(selector));
            break;

        case "id":
            el = ui.doCument.getElementById(selector);
            break;

        case "lastChild":
            if (!element) {
                throw new Error("Element is required for attribute lookup");
            }
            el = element.lastElementChild;
            break;

        case "attribute":
            if (!element) {
                throw new Error("Element is required for attribute lookup");
            }
            if(!("getAttribute" in element))
                throw Error("Element is not HTMLElement?")
            el = element.getAttribute(selector);
            break;

    }
    if (!el) {
        throw new Error(`Element not found: ${selector}`);
    }
    return el;
}