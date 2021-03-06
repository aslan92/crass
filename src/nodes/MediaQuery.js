var optimization = require('../optimization');
var utils = require('../utils');


/**
 * @constructor
 * @param {string} type
 * @param {string} prefix
 * @param {MediaExpression} expression
 */
function MediaQuery(type, prefix, expression) {
    this.type = type;
    this.prefix = prefix;
    this.expression = expression || [];
}

/**
 * @return {string}
 */
MediaQuery.prototype.toString = function toString() {
    var output = [];
    if (this.type) {
        if (this.prefix) {
            output.push(this.prefix);
        }
        output.push(this.type);
    }
    if (this.type && this.expression.length) {
        output.push('and');
    }
    if (this.expression.length) {
        output.push(utils.joinAll(this.expression, ' and '));
    }
    return output.join(' ');
};

/**
 * @return {string}
 */
MediaQuery.prototype.pretty = function pretty(indent) {
    var output = [];
    if (this.type) {
        if (this.prefix) {
            output.push(this.prefix);
        }
        output.push(this.type);
    }
    if (this.type && this.expression.length) {
        output.push('and');
    }
    if (this.expression.length) {
        output.push(utils.joinAll(this.expression, ' and ', utils.prettyMap(indent)));
    }
    return output.join(' ');
};

/**
 * @param {object} kw
 * @return {MediaQuery}
 */
MediaQuery.prototype.optimize = function optimize(kw) {
    // TODO(opt): sort expressions
    // TODO(opt): filter bunk expressions
    // OPT: Remove duplicate media expressions
    this.expression = utils.uniq(null, this.expression);
    this.expression = optimization.optimizeList(this.expression, kw);

    // OPT: Remove unsupported media queries.
    if (kw.browser_min && kw.browser_min.ie >= 10) {
        this.expression = this.expression.filter(function(expr) {
            return !expr.ieCrap.slashZero;
        });
        if (!this.expression.length) {
            return null;
        }
    }

    return this;
};

module.exports = MediaQuery;
