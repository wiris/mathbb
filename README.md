# Definition
This project is a polyfill for the CSS layout fraction.

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

* Keep a clean dom (for that reason a shadow dom is used)
* Dynamic update when the dom changes (listeners are added to detect content change)
* By default, does not add any styling

TODO

* Accessibility: use the Accessibility Object Model
* When the layout fraction style is removed, the layout is not updated 
* Use `display` instead of `--display`
* Add some tests