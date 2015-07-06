var thy = require('thy')();

function doStuffToThings(instance){
    thy(instance).things = 'stuff';
}

var coolThingProto = {
    stuff: function(value){
        if(!arguments.length){
            return thy(this).stuff;
        }

        thy(this).stuff = value;
        return this;
    },
    things: function(value){
        if(!arguments.length){
            return thy(this).things;
        }

        thy(this).things = value;
        return this;
    },
    majiggers: function(value){
        if(!arguments.length){
            return thy(this).majiggers;
        }

        thy(this).majiggers = value;
        return this;
    }
}

function coolThingFactory(){
    return Object.create(coolThingProto);
}

var coolThing = coolThingFactory();

console.log(coolThing);

coolThing.stuff('whatever');

console.log(coolThing);

console.log(coolThing.stuff());
