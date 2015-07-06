var observable = require('./observable'),
    crel = require('crel');

module.exports = function(data){
    var label = crel('label');

    observable.on(data, 'things', function(value){
        label.textContent = value;
    });

    return label;
};