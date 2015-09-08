var counter = 0;

export class Utils {
    static message(message: string) {
        alert((counter++) + " " + message);
    }
}


