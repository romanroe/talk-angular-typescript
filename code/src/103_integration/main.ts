interface Person4 {
    name: string;
    age?: number;
}


var p1: Person4 = {name: "Max", age: 123};


interface Alerter {
    (message: string): void;
    defaultMessage: string;
}


interface List {
    [index: number]: string;
    aProperty: string;
}


interface Options {
    args: string|string[];
}

var o1: Options = {
    args: "a"
};

var o2: Options = {
    args: ["a", "b", "c"]
};

function useFirstArg(o: Options) {
    var a = o.args;
    if(typeof a === 'string') {
        return a.substring(5);
    } else {
        return a[0].substring(5);
    }
}

