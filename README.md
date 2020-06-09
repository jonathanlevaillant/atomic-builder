<img src="http://jonathanlevaillant.fr/img/atomic-builder-logo.svg" width=72 height=72 alt="Atomic Builder" />

# Atomic Builder

Atomic Builder is a lightweight and flexible CSS front-end framework based on [ITCSS](https://itcss.io/) architecture
and built with [Sass](https://sass-lang.com/).

Atomic Builder does its best to provide zero cosmetic styling. That means Atomic Builder can be used on any and all
types of project without suggesting a look-and-feel. If you do require a UI out of the box, then Atomic Builder is
probably not the best tool for you. I’d recommend looking at a UI Toolkit such as
[Bootstrap](https://getbootstrap.com/).

## Browser support

All modern browsers are supported (except Internet Explorer).

## Installation

**You can use Atomic Builder in your project by installing it using a package manager (recommended):**

[npm](https://www.npmjs.com/):

```
$ npm install atomic-builder
```

[yarn](https://yarnpkg.com/):

```
$ yarn add atomic-builder
```

**Copy/paste (not recommended):**

You can download [Atomic Builder](https://github.com/jonathanlevaillant/atomic-builder/archive/master.zip) and save it
into your project’s `css/` directory. This method is not recommended because you lose the ability to easily and quickly
manage and update Atomic Builder as a dependency.

## Philosophy

### Architecture

Atomic Builder follows a specific folder structure based on ITCSS, which you should follow as well in your own CSS
directory:

- `settings/`: Used with Sass and contain global variables, colors definitions, etc.
- `tools/`: Globally used mixins and functions.
- `generic/`: Reset and normalize styles.
- `elements/`: Unclassed HTML elements (like `<h1>`, `<a>`, etc.).
- `objects/`: Class-based selectors which define undecorated design patterns.
- `components/`: Specific UI components. Because Atomic Builder does no cosmetic styling, it is up to you to author this
  layer.
- `utilities/`: Helper classes with high-specificity.

### Methodology and namespaces

Atomic Builder is written using [BEM](https://en.bem.info/methodology/) (Block, Element, Modifier) methodology for
building component-based user interfaces.

**It also provides some classes with specific namespace:**

- `.o-`: Signify that something is an Object, and that it may be used in any number of unrelated contexts to the one you
  can currently see it in.
- `.c-`: Signify that something is a Component. This is a concrete, implementation-specific piece of UI.
- `.u-`: Signify that this class is a Utility class. It has very specific role and should not be bound onto or changed.
  It can be reused and is not tied to any specific piece of UI.

Every class in either of these three directories (layers) gets the appropriate prefix in its class name. Be sure to
follow this convention in your own code as well to keep a consistent naming convention across your code base.

## Getting started

### Importing

As much as possible, avoid modifying Atomic Builder’s core files. The best way to do this is to import Atomic Builder’s
source Sass files in your own project.

**You have two options** : include all of Atomic Builder, or pick the parts you need.

We encourage the latter, though be aware that `settings/` and `tools/` folders are required.

```
// Settings (required)
@import 'node_modules/atomic-builder/scss/settings/colors';
@import 'node_modules/atomic-builder/scss/settings/global';

// Tools (required)
@import 'node_modules/atomic-builder/scss/tools/functions';
@import 'node_modules/atomic-builder/scss/tools/mixins';

// Generic (optional)
@import 'node_modules/atomic-builder/scss/generic/normalize';
@import 'node_modules/atomic-builder/scss/generic/box-sizing';
@import 'node_modules/atomic-builder/scss/generic/reset';
@import 'node_modules/atomic-builder/scss/generic/shared';

// Elements (optional)
@import 'node_modules/atomic-builder/scss/elements/root';
@import 'node_modules/atomic-builder/scss/elements/page';
@import 'node_modules/atomic-builder/scss/elements/heading';
@import 'node_modules/atomic-builder/scss/elements/forms';
@import 'node_modules/atomic-builder/scss/elements/tables';

// Objects (optional)
@import 'node_modules/atomic-builder/scss/objects/grid';
@import 'node_modules/atomic-builder/scss/objects/container';

// Utilities (optional)
@import 'node_modules/atomic-builder/scss/utilities/position';
@import 'node_modules/atomic-builder/scss/utilities/display';
@import 'node_modules/atomic-builder/scss/utilities/flex';
@import 'node_modules/atomic-builder/scss/utilities/alignment';
@import 'node_modules/atomic-builder/scss/utilities/float';
@import 'node_modules/atomic-builder/scss/utilities/clear';
@import 'node_modules/atomic-builder/scss/utilities/sizing';
@import 'node_modules/atomic-builder/scss/utilities/spacing';
@import 'node_modules/atomic-builder/scss/utilities/overflow';
@import 'node_modules/atomic-builder/scss/utilities/colors';
@import 'node_modules/atomic-builder/scss/utilities/text';
@import 'node_modules/atomic-builder/scss/utilities/visibility';
@import 'node_modules/atomic-builder/scss/utilities/reset';
@import 'node_modules/atomic-builder/scss/utilities/helper';
```

### Theming

Every Sass variable in Atomic Builder includes the `!default` flag allowing you to override the variable’s default value
in your own Sass file without modifying Atomic Builder’s source code. Your overrides must come before you import Atomic
Builder’s setting files.

You will find the complete list of Atomic Builder’s variables in
[`scss/settings/_colors.scss`](https://github.com/jonathanlevaillant/atomic-builder/blob/master/scss/settings/_colors.scss)
and
[`scss/settings/_global.scss`](https://github.com/jonathanlevaillant/atomic-builder/blob/master/scss/settings/_global.scss).

#### Overriding variable

To modify an existing variable `$container-max-width`, add the following to your custom Sass file:

```
$container-max-width: 96rem;
```

#### Overriding map

To modify an existing key in our `$spacers` map, add the following to your custom Sass file:

```
$spacers: (
  'base': 2rem,
);
```

To add a new key and value to `$spacers` map, add the following to your custom Sass file:

```
$spacers: (
  'custom-spacer': 1rem,
);
```

To remove an existing key from `$spacers` map, add the following to your custom Sass file:

```
$spacers: (
  'base': null,
);
```

## Pro Tips

Atomic builder also provides some features and tools that should be of great help to you.

### CSS Custom properties

CSS custom properties allow you to store and retrieve values from properties you define yourself.

They follow the same rules as other CSS properties, so you are able to define and use them at multiple levels, following
standard CSS cascading and specificity rules.

Atomic Builder includes CSS custom properties in it’s compiled CSS. These CSS custom properties are based on Atomic
Builder’s variables in
[`scss/settings/_colors.scss`](https://github.com/jonathanlevaillant/atomic-builder/blob/master/scss/settings/_colors.scss)
and
[`scss/settings/_global.scss`](https://github.com/jonathanlevaillant/atomic-builder/blob/master/scss/settings/_global.scss)
and are generated in our
[`scss/elements/_root.scss`](https://github.com/jonathanlevaillant/atomic-builder/blob/master/scss/elements/_root.scss)
file.

For example, this Sass map:

```
$spacers: (
  'lg': 4.8rem,
  'base': 2.4rem,
  'sm': 1.2rem,
);
```

will automatically add these custom properties in the root element:

```
:root {
  --spacer-lg: 4.8rem;
  --spacer-base: 2.4rem;
  --spacer-sm: 1.2rem;
}
```

You can now retrieve these custom properties like this:

```
.c-custom-component {
  margin: var(--spacer-base);
  padding: var(--spacer-sm);
}
```

### Responsive breakpoints

You may have noticed that Atomic Builder provides a default map of breakpoint values:

```
$breakpoints: (
  'phone': 47.9375em,
  'tablet': 64em,
);
```

Like any other Atomic Builder’s variables, it is possible to override this Sass map to modify, add or remove some
responsive breakpoint keys:

```
$breakpoints: (
  'phone': null,
  'tablet': null,
  'sm': 47.9375em,
);
```

It is even possible to delete all responsive breakpoint keys if your website doesn’t require to be responsive:

```
$breakpoints: ();
```

These responsive breakpoints are available via Sass mixin `@mixin media($keys...)` by adding optional suffixes: `-up` or
`-down`.

**It is important to note that the suffix `-up` is exclusive while the suffix `-down` is inclusive.**

This Sass mixin with `($key)` name:

```
@include media('tablet') {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}
```

will generate these responsive breakpoints:

```
@media (max-width: 64em) and (min-width: 48em) {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}
```

This Sass mixin with `($key-up)` name:

```
@include media('tablet-up') {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}
```

will generate this responsive breakpoint:

```
@media (min-width: 64.0625em) {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}
```

This Sass mixin with `($key-down)` name:

```
@include media('tablet-down') {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}
```

will generate this responsive breakpoint:

```
@media (max-width: 64em) {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}

```

This Sass mixin with multiple `($key1, $key2)` names:

```
@include media('phone', 'tablet-up') {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}
```

will generate these responsive breakpoints:

```
@media (max-width: 47.9375em) {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}

@media (min-width: 64.0625em) {
  .c-custom-component {
    margin: var(--spacer-base);
  }
}
```

#### Summary table (Atomic Builder’s default settings)

| Key           | Phone | Tablet | Desktop |
| ------------- | ----- | ------ | ------- |
| `phone`       | ✓     | ✗      | ✗       |
| `tablet-down` | ✓     | ✓      | ✗       |
| `tablet`      | ✗     | ✓      | ✗       |
| `phone-up`    | ✗     | ✓      | ✓       |
| `tablet-up`   | ✗     | ✗      | ✓       |

### Grid system

Atomic Builder includes a lightweight and fully responsive grid system built with flexbox.

This grid system uses custom properties based on Atomic Builder’s variables in
[`scss/settings/_global.scss`](https://github.com/jonathanlevaillant/atomic-builder/blob/master/scss/settings/_global.scss).
(The following examples are based on 12-column grids.)

To declare a grid, the syntax is really easy:

```
<div class="o-grid">
  <div class="o-grid__col">Column one (auto)</div>
  <div class="o-grid__col">Column two (auto)</div>
</div>
```

By default, the columns are based on the width of their content, but it’s also possible to define a grid with regular
column widths:

```
<div class="o-grid">
  <div class="o-grid__col o-grid__col--6">1/2</div>
  <div class="o-grid__col o-grid__col--6">1/2</div>
</div>
```

...or even with irregular column widths:

```
<div class="o-grid">
  <div class="o-grid__col o-grid__col--4">1/3</div>
  <div class="o-grid__col o-grid__col--8">2/3</div>
</div>
```

Finally, to declare a responsive grid, just add a suffix based on breakpoint key name, as noted above, in the column
class name:

```
<div class="o-grid">
  <div class="o-grid__col o-grid__col--6 o-grid__col--4@phone-up">
    1/1 and 1/3 for tablets and desktops
  </div>
  <div class="o-grid__col o-grid__col--6 o-grid__col--8@phone-up">
    1/1 and 2/3 for tablets and desktops
  </div>
</div>
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/jonathanlevaillant/atomic-builder/blob/master/CONTRIBUTING.md) for
details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the
[tags on this repository](https://github.com/jonathanlevaillant/atomic-builder/tags).

## Authors

**Jonathan Levaillant** - _Initial work_ - [jonathanlevaillant](https://github.com/jonathanlevaillant).

See also the list of [contributors](https://github.com/jonathanlevaillant/atomic-builder/graphs/contributors) who
participated in this project.

## Licence

This project is licensed under the MIT License - see the
[LICENSE.md](https://github.com/jonathanlevaillant/atomic-builder/blob/master/LICENSE.md) file for details.

## Acknowledgement

<a href="https://jolicode.com/"><img src="https://jolicode.com/images/logo.svg" width=200 height=46 alt="JoliCode" /></a>

Open Source time sponsored by JoliCode
