
interface JQueryStaticX {
    (selector: string, context?: Element|JQuery): JQuery;
    (element: Element): JQuery;
    (html: string, ownerDocument?: Document): JQuery;
    // ...
}

declare var $X: JQueryStaticX;
