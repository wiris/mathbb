import {RuleWalker} from "./cssRuleWalker.js";

var handlerList = [];
var elementByDepth;

export class Polyfill {
    static addHandler(str,func) {
        handlerList.push({ "style" : str, "func" : func });
        Polyfill.update();
        init();
    }

    static update() {
        elementByDepth=[]; // clear
        
        RuleWalker.walk(processRule);

        // Process elements found in inverse order of depth
        for (let k in elementByDepth) {
            for (var j in handlerList) {
                if (elementByDepth[k][j]!=null) {
                    for (let l in elementByDepth[k][j]) {
                        handlerList[j].func(elementByDepth[k][j][l]);
                    }
                }
            }
        }
        //update(function (str) {console.log("Update: "+str);});
        /*elementList = [];
        console.log("Update");
        walk(document.body,function (elem) {
            var style = window.getComputedStyle(elem);
            for (var i in handlerList) {
                var handler = handlerList[i];
                var v = style.getPropertyValue(handler["style"]);
                if (v!=null && v.length>0) {
                    elementList.push(elem)
                    console.log(handler["style"]+"="+v);
                }
            }
        });
        console.log(elementList.length);
        for (var i in handlerList) {
            for (var j in elementList) {
                handlerList[i].func(elementList[j]);
                //elementList[i].style.color=handlerList;
            }
        }*/
    }
}

var lock;

var update=0;

function processRule(rule) {
    let style = rule.style;
    for (let i = 0; i<style.length; i++) {
        for (var j in handlerList) {
            if (handlerList[j].style==style[i]) {
                let elems = document.querySelectorAll(rule.selectorText);
                for (let k=0;k<elems.length;k++) {
                    let elem = elems.item(k);
                    // Compute depth
                    let depth=elementDepth(elem);
                    // Add elem to elementByDepth
                    rememberElement(depth,j,elem);
                }
            }
        }
    }
}

function rememberElement(depth,j,elem) {
    // Use 10000-depth to revert order
    if (elementByDepth[10000-depth]==null) {
        elementByDepth[10000-depth]=[];
    };
    if (elementByDepth[10000-depth][j]==null) {
        elementByDepth[10000-depth][j]=[];
    }
    elementByDepth[10000-depth][j].push(elem);
}

function elementDepth(elem) {
    let e = elem;
    let depth=0;
    while (e!=null) {
        e=e.parentElement;
        depth++;
    }
    return depth;
}


function init() {
    new MutationObserver(function (records) {
        if (lock === true) 
            { return; }
        lock = true;
        Polyfill.update();
        /*for (var i = 0;i < records.length; i++) {
            var record = records[i], added = (void 0);
            if (record.type === 'childList' && (added = record.addedNodes)) {
                for (var j = 0;j < added.length; j++) {
                    if (added[j].nodeType === 1) {
                        queueUpdate(added[j]);
                    }
                }
            } else if (record.type === 'attributes' && record.target.nodeType === 1) {
                if (record.target === a) {
                    supportsStyleMutations = true;
                } else {
                    walk(record.target, queueUpdate);
                }
            }
        }*/
        lock = false;
    }).observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true
    });
}

// Detect window zoom
window.addEventListener("resize", function () { Polyfill.update(); } );

function queueUpdate(elem) {

}

function walk(node, iterator) {
    iterator(node);
    var child = node.firstElementChild;
    while (child) {
        //iterator(child);
        walk(child, iterator);
        child = child.nextElementSibling;
    }
}

//var elem = document.getElementById("frac");
//let template = document.getElementById('my-paragraph');
//let templateContent = template.content;
//elem.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
 

setTimeout(() => {
    //walk(document.body,function (elem) { console.log(elem.tagName); });    
}, 1000);
