export const ui = {
    get doCument() : Document {
        return eval("document");
    },
    isUserActive() {
        return ui.doCument.visibilityState === "visible" && ui.doCument.hasFocus();
    }
};