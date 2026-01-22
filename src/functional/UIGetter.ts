export const ui = {
    get document() : Document {
        return eval("document");
    },
    isUserActive() {
        return ui.document.visibilityState === "visible" && ui.document.hasFocus();
    }
};