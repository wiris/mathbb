
/**
 * 
 * 
 */
export class RuleWalker {
    static walk(iterator,context) {
        new RuleWalkerPrivate(iterator, context).walk();
    }
}

class RuleWalkerPrivate {
    constructor(itarator,context) {
        this.iterator=itarator;
        this.context=context;
    }

    walk() {
        let sheets = document.styleSheets; // CCStyleSheetList
    
        for (let i=0; i < sheets.length; i++) {
            let sheet = sheets[i]; // CSSStyleSheet
            let node = sheet.ownerNode;
            if (node.$$isNew==null) {
                //node.$$isNew=false;
                if (node.href) {
                    // The css is a remote file with <link>
                    this.walkRemote(node);
                } else {
                    this.walkSheet(sheet);
                }
            }
        }
    }
    
    walkSheet(sheet) {
        //console.log(sheet.ownerNode.innerHTML);
        let cssRules = sheet.cssRules;
        for (let i=0; i<cssRules.length; i++) {
            let rule=cssRules[i];
            let selector = rule.selectorText;
            this.iterator(rule, this.context);
        }
    }
    
    walkRemote(node) {
        let self=this;
        this.fetchText(node.href, function(css) {self.processRemoteSheet(css);});
    }

    processRemoteSheet(css) {
        let style = document.createElement('style');
        style.disabled = true; // avoid conflict with existing styles
        style.appendChild(document.createTextNode(css));
        let head = document.head || document.createElement('head');
        head.appendChild(style);
        this.walkSheet(style.sheet);
        head.removeChild(style); // not needed anymore
    }

    fetchText(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState===4) {
                callback(xhr.responseText);
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }
    
}
