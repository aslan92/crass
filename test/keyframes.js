var assert = require("assert");

var crass = require('../crass');

var filler = 'from{x:y}to{a:b}';
var parity = function(data) {
	data = data.replace(/\$\$/g, filler);
	assert.equal(crass.parse(data).toString(), data);
    assert.equal(crass.parse(crass.parse(data).pretty()).toString(), data);
}


describe('@keyframes', function() {
    it('should parse keyframes blocks', function() {
        parity('@keyframes foo{$$}');
    });

    it('should parse keyframes blocks with a prefix', function() {
        parity('@-webkit-keyframes foo{$$}');
    });

    it('should parse keyframe selectors', function() {
        parity('@-webkit-keyframes foo{0%{a:b}100%{c:d}}');
    });

    it('should parse multiple keyframe selectors', function() {
        parity('@-webkit-keyframes foo{0%,100%{c:d}}');
    });

    it('should optimize keyframe contents', function() {
        assert.equal(
            crass.parse(
                '@-webkit-keyframes foo{to{bbb:foo;aaa:bar;}from{ccc:zip;ddd:zap}}'
            ).optimize().toString(),
            '@-webkit-keyframes foo{from{ccc:zip;ddd:zap}to{aaa:bar;bbb:foo}}'
        );
    });

    it('should not optimize keyframe selectors', function() {
        assert.equal(
            crass.parse('@-webkit-keyframes foo{0%{a:b}100%{c:d}}').optimize().toString(),
            '@-webkit-keyframes foo{0%{a:b}100%{c:d}}'
        );
    });

});