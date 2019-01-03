import {Polyfill} from "./polyfill.js";

var fractionTemplate = `
<template id="fraction-template"><style>
        .mathbb-fraction {
            display: inline-flex;
            flex-direction: column;
        }
        .mfrac-under {
            display:inline-flex;
            flex-flow:column;
            align-items:center;
            margin-bottom:0.1em;
        }
        
        .mfrac-over > span:nth-child(1) {
            line-height: 15%;
            letter-spacing:-0.5ex;
            --margin-bottom: -0.2ex;
            display:inline-flex;
            overflow:hidden;
            white-space: nowrap;
        }

        .mfrac-over > span:nth-child(1) > span {
            display:flex;
        }
        
        .mfrac-over > span:nth-child(1) > span > span {
            display:inline-block;
            overflow:hidden;
            white-space: nowrap;
        }

        .mfrac-over > span:nth-child(1) > span > span > span {
            margin-left:-0.2ex;
        }

        .mfrac-over {
            display: inline-flex;
            flex-flow: column-reverse;
            align-items:center;
        }        

        .mfrac-line-part {
            display:inline-block;
            overflow:hidden;
            white-space: nowrap;
            --margin-left:-0.1ex;
        }
    </style><span class="mathbb-fraction, mfrac-under">
        <span class="mfrac-over">
            <span><span>&minus;</span></span>
            <slot name="numerator"></slot>
        </span>
        <slot name="denominator"></slot>
    </span></template>
`;

function doFraction(elem) {
    var style = window.getComputedStyle(elem);
    //var style = elem.style;
    console.log("mystyle="+style.getPropertyValue("--display"));
    if (style.getPropertyValue("--display")=="fraction") {
        let shadow = elem.shadowRoot;
        if (shadow==null) {
            elem.firstElementChild.slot="numerator";
            elem.firstElementChild.nextSibling.slot="denominator";
            let parser = new DOMParser();
            let doc = parser.parseFromString(fractionTemplate, "text/html");
            let template = doc.getElementsByTagName("template")[0];
            let templateContent = template.content;
            let content = templateContent.cloneNode(true);
            elem.attachShadow({mode: 'open'}).appendChild(content);
            shadow = elem.shadowRoot;
        }

        // Add fraction line
        let frac = shadow.querySelector("span");
        let line = shadow.querySelector("span > span > span");
        let lineContent = shadow.querySelector("span > span > span > span");
        // Remove the fraction line from the next "offsetWidth"
        lineContent.innerHTML="";
        line.style.width="0px"; 
        let w = frac.getBoundingClientRect().width;
        let fs = parseInt(style.getPropertyValue("font-size"));
        let m = Math.floor((4*fs)/16);
        let n = Math.ceil(w/m);
        let str="";
        let even="";
        for (let i=0;i<n;i++) {
            even = ""; // i%2==0 ? ";color:red":"";
            str+="<span style='width:"+m+"px"+even+"'><span>&minus;</span></span>";
        }
        /*for (let i=0;i<n;i++) {
            str+="&minus;";
        }*/
        line.style.width=w+"px";
        lineContent.innerHTML = str;
    }
}


Polyfill.addHandler("--display",doFraction );
