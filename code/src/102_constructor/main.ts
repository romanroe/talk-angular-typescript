
class Person3 {
    constructor(public firstname: string, public lastname: string) {
    }

    sayHello() {
        alert(this.firstname);
    }
}

var person3: Person3 = new Person3("Max", "Mustermann");


enum Color {Red, Green, Blue}
var c: Color = Color.Blue;
