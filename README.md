# Definition
This project is a polyfill for the CSS layout fraction (and other constructions in the future).

You can see a live demo of this project at https://wiris.github.io/mathbb/.

# Usage

The CSS style:

```css
.myfraction {
    --display: fraction;
}
```

The HTML:

```html
<script src="js/fraction.j"></script>
<span class="myfraction">
   <span>1</span>
   <span>2</span>
</span>
```

# Features 

The objective of the polyfill is that it behaves as much as possible as a regular CSS property:

* To keep a clean DOM (for that reason a shadow DOM is used)
* Dynamic update when the dom changes (listeners are added to detect content change)
* By default, does not add any styling
* That zooms well. Also when the page is converted to PDF

TODO

* Accessibility: use the Accessibility Object Model
* When the layout fraction style is removed, the layout is not updated 
* To use `display` instead of `--display`
* To add some tests
* To add more math constructions like subscripts, accents, stretchy characters, etc.