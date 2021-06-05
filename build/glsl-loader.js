module.exports = function (source, sourceMap, meta) {
    return 'export default ' + JSON.stringify(source);
}