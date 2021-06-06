function tryTo(func, defaultResult) {
    let res = defaultResult;
    try {
        const r = func();
        if (!!r) {
            res = r;
        }
    } catch (e) { }

    return res;
}

module.exports = {
    tryTo
}
