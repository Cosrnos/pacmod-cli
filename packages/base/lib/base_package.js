module.exports = new basePackage();

function basePackage(mixin) {
    return Object.assign({}, this, mixin || {}, {
        extend: basePackage.bind(this),
        import: function (package) {
            return require('../../' + package + '/lib/index.js');
        }
    });
}
