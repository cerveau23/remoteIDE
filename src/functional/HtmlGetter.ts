import { ui } from "./UIGetter";

type functionCodes = "query"|"id"|"class"|"attribute"

type getHTMLReturnType<T> =
    T extends "query" ? Element :
        T extends "attribute" ? string : null


function getHTML(selector: string, desiredFunction: "attribute", element: HTMLElement): getHTMLReturnType<"attribute">
function getHTML<T extends functionCodes>(selector: string, desiredFunction: T, element?: HTMLElement): getHTMLReturnType<T> {
    let el;
    switch(desiredFunction) {
        case "query":
            el = ui.document.querySelector(selector);
            break;

        case "class":
            el = ui.document.getElementsByClassName(selector);
            break;

        case "id":
            el = ui.document.getElementById(selector);
            break;

        case "attribute":
            if (!element) {
                throw new Error("Element is required for attribute lookup");
            }
            el = element.getAttribute(selector);
            break

    }
    if (!el) {
        throw new Error(`Element not found: ${selector}`);
    }
    return el as getHTMLReturnType<T>;
}