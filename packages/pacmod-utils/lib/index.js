module.exports = {
    DEFINE_GET_PROPERTY: (target, value, getFunc) => {
        return Object.defineProperty(target, value, {
            get: getFunc
        });
    }
};
