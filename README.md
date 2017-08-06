<p align="center">
    <img src="http://jonathanlevaillant.fr/img/atomic-builder-logo.svg" width=72 height=72 alt="Atomic Builder" />
</p>
<h3 align="center">Atomic Builder</h3>

---

Atomic Builder a été conçu avant tout comme une boîte à outils permettant de démarrer un projet Front-End avec le juste nécessaire.

Il est principalement destiné aux Intégrateurs Web et Développeurs Front-End soucieux d'un code CSS de qualité et désirant débuter 
leurs projets par de bonnes pratiques, des conventions de nommage solides et une modularité à toute épreuve.

Atomic Builder se base sur l'architecture **ITCSS** d'[Harry Roberts](https://csswizardry.com/) et la 
méthodologie **BEM** élaborée par [Yandex](https://en.bem.info/methodology/).
 
**BEM** + **ITCSS** = **[BEMIT](https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)**

Seuls des sélecteurs de classe (niveau 2) ont été utilisés dans ce Framework.

## Fonctionnalités

- Fichier de configuration personnalisable.
- Gestion avancée de la typographie.
- Mise en place automatique d'un rythme vertical.
- Génération de grilles flexibles et responsives.
- Mise en place simplifiée des éléments de formulaire.
- Accessibilité renforcée. (Unités fluides en "em", "rem" et "%".)
- Génération automatique de classes utilitaires. (Approche DRY.)

## Installation

Plusieurs options s'offrent à vous :

- [Télécharger la dernière version](https://github.com/jonathanlevaillant/atomic-builder/archive/master.zip).
- Cloner le dépôt : `https://github.com/jonathanlevaillant/atomic-builder.git`
- Installation avec [NPM](https://www.npmjs.com/) : `npm install atomic-builder`
- Installation avec [Yarn](https://yarnpkg.com/lang/en/) : `yarn add atomic-builder`
- Installation avec [Bower](https://bower.io/) : `bower install atomic-builder`

## Compatibilité

Atomic Builder est compatible avec l'ensemble des navigateurs de bureau et mobiles à partir d'IE10 inclus.

## Technologies

- Préprocesseur CSS : [Sass](http://sass-lang.com/).
- Automatiseur de tâches : [Gulp](http://gulpjs.com/).

## Scripts

Trois scripts sont disponibles dans le fichier `package.json`, ils font référence aux tâches Gulp définies dans le 
fichier de configuration `gulpfile.js` :

- Tâche **watch** (HTML, CSS et JS) : `yarn run watch`.
- Tâche **build** (compilation Sass, copie du JS, des images, des fonts et des icônes SVG) : `yarn run build`.
- Tâche **prod** (minification et optimisation du CSS, du JS et des images) : `yarn run prod`.

Il s'agit d'un Workflow Front-End classique mais il est bien évidemment possible de mettre à jour ces fichiers de configuration
selon les besoins de vos projets.

## Architecture

Atomic Builder est constitué d'un dossier source `/src` et d'un dossier destination `/dist`.

Le dossier `/dist` est généré à chaque build, il ne faut donc pas éditer les fichiers se trouvant dans ce dossier.  
Le dossier `/src` contient les assets du projet, à savoir les fonts, les images, les icônes SVG, le JS et le CSS, ce 
dernier point va nous intéresser plus particulièrement.

L'architecture ITCSS se compose de sept sections bien distinctes :

- **Settings** : Contient les variables globales de configuration, comme les couleurs, les polices, etc.
- **Tools** : Contient les fonctions et mixins Sass. (Ces deux premières sections ne doivent pas générer de CSS.)
- **Generic** : Contient les styles destinés au reset/[normalize](https://necolas.github.io/normalize.css/).
- **Elements** : Contient les styles par défaut des éléments HTML comme les titres, les paragraphes, les champs de 
formulaire, etc. (Seuls des sélecteurs de type doivent être présents.)
- **Objects** : Contient les classes orientées objets (OOCSS) comme les grilles, les conteneurs, les médias. 
(Sélecteurs de classe.)
- **Components** : Contient les composants d'UI spécifiques au projet. (Sélecteurs de classe.)
- **Trumps** : Contient les classes utilitaires réutilisables et à fortes spécificités.

## Conventions de nommage

L'architecture BEMIT propose un système de nommage intuitif permettant aux développeurs intervenant en cours de projet
de comprendre facilement le rôle de tel ou tel composant grâce à un système de préfixes et suffixes.

### Préfixes

- Composants : `c-`.
- Objets : `o-`.
- Classes utilitaires : `u-`.
- Conditions, états : `is-`, `has-`.
- Ciblage JS : `js-`.

### Suffixes (si nécessaire)

La classe sera effective pour le média ciblé `class@media` :

- `u-hidden@print` : Classe utilitaire permettant de cacher un élément lors de l'impression.
- `u-txt-center@sm` : Classe utilitaire permettant de centrer un élément textuel pour les résolutions d'écran inférieures
ou égales à 768px et supérieures à 640px. (Configuration par défaut.)

### Méthodologie BEM

La méthodologie BEM propose une nomenclature simple basée sur un concept de blocs, d'éléments et de modificateurs :

- **Bloc** : Le bloc fait référence à un composant d'UI autonome (`c-component`).
- **Élément** : L'élément est une partie d'un bloc, le contexte d'un élément est celui de son bloc (`c-component__element`).
- **Modificateur** : Le modificateur est une propriété qui sert à créer des variantes d'un bloc (`c-component--modifier`).

## Configuration d'un nouveau projet

La première étape en débutant un nouveau projet est de mettre à jour les **trois fichiers de configuration** situés dans 
le dossier `/src/scss/settings`.

### 1) `_global.scss`

Ce fichier permet de configurer les éléments typographiques (paragraphes, titres, etc.), 
les grilles, les éléments de formulaire, les espacements, les points de rupture ainsi que
les options à activer pour le projet.

---

#### Typographie

##### Polices de caractères

```
$font-family-base       : "Trebuchet MS", Helvetica, sans-serif !default;
$font-family-headings   : Bitter, Georgia, serif !default;
$font-family-monospace  : "Courier New", Courier, monospace !default;
```
   
Ces variables définissent les polices de caractères utilisées pour les éléments textuels, les titres et les 
éléments à chasse fixe.

##### Taille de police par défaut

```
$font-size-base         : 1.6rem !default;
$line-height-base       : 1.5 !default; // auto => 1.2
```

Ces variables définissent la taille de la police de base ainsi que l'interligne relative à celle-ci.

*Astuce : La valeur "auto" dans Photoshop correspond à une interligne d'environ 1.2.*  

*Important : L'interligne étant relative à la taille de la police de base, elle doit toujours être renseignée sans unité.*

##### Graisses

```
$font-weight-normal     : 400 !default;
$font-weight-bold       : 700 !default;
```

Ces variables définissent les différentes graisses utilisées pour le texte.   

Il est possible d'en rajouter ou d'en supprimer selon les besoins du projet.

##### Baseline

```
$baseline               : $font-size-base * $line-height-base !default;
```

Cette variable correspond à la ligne de base ou "baseline" et est nécessaire au calcul du rythme vertical.

Cette "baseline" est calculée automatiquement en fonction de la taille de la police de base et de son interligne relative.

Il est également possible de renseigner une valeur personnalisée comme 8, 12 ou 24 pixels.  
Cette valeur personnalisée servira de nouvelle référence pour le calcul du rythme vertical et l'interligne relative 
définie précédemment ne sera plus effective.

*Astuce : Si votre projet ne se base pas sur un rythme vertical, il vous est possible de désactiver cette option dans ce 
même fichier de configuration.    
Dans ce cas, l'interligne relative servira de référence et la "baseline" ne sera plus prise en compte.*

##### Titres

```
$ratio-major-third      : 1.25 !default;
$ratio-major-second     : 1.125 !default;

$font-size-h6           : $font-size-base / $ratio-major-third !default;
$font-size-h5           : $font-size-base !default;
$font-size-h4           : $font-size-base * $ratio-major-third !default;
$font-size-h3           : $font-size-h4 * $ratio-major-third !default;
$font-size-h2           : $font-size-h3 * $ratio-major-third !default;
$font-size-h1           : $font-size-h2 * $ratio-major-third !default;
```

Ces variables permettent de configurer les différentes tailles de polices de titres, (six niveaux de titres).

*Astuce : Il est conseillé d'utiliser un **[ratio normalisé](http://www.modularscale.com/)** comme 1.125, 1.25, 1.33, 1.5 
ou 1.6125 (golden ratio).  
Vous pouvez néanmoins, si vous le souhaitez, utiliser des valeurs personnalisées sans prendre en compte ces ratios*

##### Taille de polices responsives

```
$font-sizes-rwd: (
    h1: (
        default         : $font-size-h1,
        sm              : $font-size-h1 / $ratio-major-second
    ),
    h2: (
        default         : $font-size-h2,
        sm              : $font-size-h2 / $ratio-major-second
    ),
    h3: (
        default         : $font-size-h3,
        sm              : $font-size-h3 / $ratio-major-second
    ),
    h4: (
        default         : $font-size-h4,
        sm              : $font-size-h4 / $ratio-major-second
    ),
    h5: (
        default         : $font-size-h5,
        sm              : $font-size-h5 / $ratio-major-second
    ),
    h6: (
        default         : $font-size-h6,
        sm              : $font-size-h6 / $ratio-major-second
    ),
    default: (
        default         : $font-size-base,
        sm              : $font-size-base / $ratio-major-second
    )
) !default;
```

Ces variables permettent de configurer les différentes tailles de polices responsives. 

Chaque clé est une "map" Sass qui comprend comme premier paramètre obligatoire, la valeur par défaut de la taille de la police.  

Les autres paramètres sont facultatifs et correspondent aux points de rupture utilisés dans le projet (définis un peu plus
loin dans ce même fichier de configuration) et à la nouvelle taille de police associée à ceux-ci.  

Il est également possible de rajouter un paramètre correspondant à la hauteur de ligne pour chaque taille de police :

```
$font-sizes-rwd: (
    h1: (
        default         : ($font-size-h1, 1.5),
        sm              : ($font-size-h1 / $ratio-major-second, 1.4)
    )
) !default;
```

Si une taille de police reste fixe, vous pouvez aussi l'écrire de cette façon :

```
$font-sizes-rwd: (
    h1                  : ($font-size-h1, 1.5),
    h2                  : $font-size-h2
) !default;
```

Ces variables étant de types "maps", vous pourrez y accéder via un mixin `@include rhythm-rwd(key)`.

Ce mixin générera la taille de police correspondante, sa hauteur de ligne et les points de rupture liés à celle-ci (s'ils sont renseignés).

##### Taille de polices utilitaires

```
$font-sizes: (
    sm                  : $font-size-h6,
    md                  : $font-size-h5,
    lg                  : $font-size-h4,
) !default;
```

Ces variables définissent les différentes tailles de polices utilitaires utilisées dans le projet.   

Par défaut, trois valeurs sont renseignées, de la plus petite `sm` à la plus grande `lg`.   

Il est possible d'en rajouter ou d'en supprimer selon les besoins du projet.

Il est également possible de rajouter un paramètre correspondant à la hauteur de ligne pour chaque taille de police :

```
$font-sizes: (
    sm                  : ($font-size-h6, 1.5),
) !default;
```

Ces variables étant de types "maps", vous pourrez y accéder de deux façons, via une fonction ou un mixin :

**Fonction `font-size(key)`**

```
small {
    font-size: font-size(sm);
}
```

**sera compilé en :**

```
small {
    font-size: 1.28rem;
}
```

**Mixin `@include rhythm-helper(key)`**

```
small {
    @include rhythm-helper(sm)
}
```

**sera compilé en :**

```
small {
    font-size: 1.28rem;
    line-height: 1.875;
}
```

Le mixin permettra de générer la taille de police et sa hauteur de ligne (la hauteur de ligne étant calculée en fonction
du rythme vertical ou de sa valeur personnalisée renseignée).

*Astuce : Ces classes utilitaires sont générées automatiquement en CSS, leurs noms correspondront aux clés de la "map"
, `.u-txt-sm`, `.u-txt-md`, etc.*

---

#### Grilles

```
$container-width        : $baseline * 40 !default;
$grid-columns           : 12 !default;
$grid-gutter-width      : $baseline !default;
$grid-offset-width      : $baseline !default;
```

Ces variables définissent les caractéristiques de la grille utilisée dans le projet, à savoir la largeur du conteneur, 
le nombre de colonnes (en général 12, 16 ou 24 colonnes), la largeur des gouttières et des marges latérales.

*Astuce : Il est possible d'utiliser différentes grilles au sein d'un même projet en définissant un modificateur de grille
avec de nouvelles propriétés.   
Un exemple d'une grille sans gouttière se trouve dans le dossier `/src/scss/objects/_grids.scss`.*

---

#### Éléments de formulaire

##### Champs

```
$field-height           : $baseline * 2 !default;
$field-padding-x        : $baseline / 2 !default;
$field-font-size        : $font-size-base !default;
$label-font-size        : $font-size-base !default;
```

Ces variables contrôlent les dimensions et les tailles de polices des champs de formulaire, boutons radios, 
cases à cocher et labels.

##### Boutons

```
$btn-height             : $baseline * 2 !default;
$btn-padding-x          : $baseline !default;
$btn-font-size          : $font-size-base !default;
```

Ces variables contrôlent les dimensions et les tailles de polices des champs de validation de formulaire et des boutons.

---

#### Espacements

```
$spacers: (
    n                   : 0,
    xs                  : $baseline / 3,
    sm                  : $baseline / 2,
    md                  : $baseline,
    lg                  : $baseline * 2,
    xl                  : $baseline * 3
) !default;
```

Ces variables définissent les différentes valeurs d'espacement utilisées dans le projet.   

Par défaut, six valeurs sont renseignées, de la plus petite `n` à la plus grande `xl`.  

Il est possible d'en rajouter ou d'en supprimer selon les besoins du projet.

Ces variables étant de types "maps", vous pourrez y accéder via une fonction `spacer(key)`.

**Par exemple :**

```
.c-demo__box {
    padding: calc(#{spacer(sm)} - 1px);
}
```

**sera compilé en :**

```
.c-demo__box {
    padding: calc(1.2rem - 1px);
}
```

*Astuce : Ces classes utilitaires sont générées automatiquement en CSS, leurs noms correspondront aux clés de la "map"
, `.u-mt-sm`, `.u-mr-md`, etc.*

---

#### Points de rupture

```
$breakpoints: (
    sm                  : 40em, // 640px => phones
    md                  : 48em, // 768px => tablets
    lg                  : 64em  // 1024px => desktops
) !default;
```

Ces variables définissent les points de rupture utilisés dans le projet.  
   
Par défaut, trois valeurs sont renseignées, elles correspondent aux résolutions pour mobiles, tablettes et écrans larges.  

Il est possible d'en rajouter ou d'en supprimer selon les besoins du projet.

Ces variables étant de types "maps", vous pourrez y accéder via une fonction `bp(key)`.

*Astuce : Un script ajoute automatiquement les valeurs supérieures pour chacun des points de rupture définie dans la "map", 
pour accéder à ces nouvelles clés, la syntaxe est la suivante : `<key-plus>`.*   

*Convention : Pour éviter que les intervalles ne se chevauchent, les points de rupture doivent suivre ce format :   
`@media (min-width: bp(key-plus)) and (max-width: bp(key)) { ... }`.*

**Par exemple :**

```
@media (min-width: bp(md-plus)) and (max-width: bp(lg)) {
    .u-txt-center\@md {
        text-align: center;
    }
}
```

**sera compilé en :**

```
@media (min-width: 48.0625em) and (max-width: 64em) {
    .u-txt-center\@md {
        text-align: center;
    }
}
```

---

#### Options

```
$enable-rhythm          : true !default;
$enable-utilities       : true !default;
$enable-hyphens         : true !default;
$enable-print-styles    : true !default;
```

Ces variables permettent d'activer ou de désactiver certaines options :

- `$enable-rhythm` : Active la gestion du rythme vertical basé sur la variable `$baseline`.
- `$enable-utilities` : Active la génération des classes utilitaires responsives.
- `$enable-hyphens` : Active la gestion des césures sur mobiles.
- `$enable-print-styles` : Active la génération d'une feuille de style CSS destinée à l'impression.

### 2) `_colors.scss`

```
$colors: (
    black               : #000,
    grey                : #333,
    silver              : #ccc,
    white               : #fff,
    steel-blue          : #4876C3
) !default;
```

Ce fichier permet de définir la palette de couleurs utilisée dans le projet.

Il est possible d'ajouter ou de supprimer des couleurs selon les besoins du projet.

Ces variables étant de types "maps", vous pourrez y accéder via une fonction `color(key)`.

**Par exemple :**

```
a {
    color: color(steel-blue);
}
```

**sera compilé en :**

```
a {
    color: #4876C3;
}
```

*Astuce : Ces classes utilitaires sont générées automatiquement en CSS, leurs noms correspondront aux clés de la "map"
, `.u-color-steel-blue`, `.u-color-silver`, etc.*

### 3) `_fonts.scss`

```
@font-face {
    font-family: Bitter;
    src: url("../fonts/bitter/bitter-400.woff2") format("woff2"),
         url("../fonts/bitter/bitter-400.woff") format("woff");
    font-weight: $font-weight-normal;
    font-style: normal;
}

@font-face {
    font-family: Bitter;
    src: url("../fonts/bitter/bitter-700.woff2") format("woff2"),
         url("../fonts/bitter/bitter-700.woff") format("woff");
    font-weight: $font-weight-bold;
    font-style: normal;
}
```

Ce fichier permet de définir les différentes polices de caractères utilisées dans le projet.

Il est conseillé de ne pas utiliser plus de deux polices de caractères différentes pour des raisons de performance.

*Astuce : Les formats des polices de caractères `recommandés pour le web sont le "woff" et "woff2"*

## Et maintenant ?

Il est vivement recommandé de parcourir les différentes fonctions et mixins disponibles dans le dossier `/src/scss/tools`, 
notamment les mixins destinés au calcul du rythme vertical `@include rhythm()`, à la génération des grilles et les fonctions de conversions 
d'unités.

Vous trouverez également un guide de style à la racine du dossier `/src` regroupant tous les composants par défaut d'Atomic Builder.

Maintenant que le projet est correctement configuré, il est temps de créer vos nouveaux composants, à vous de jouer ! 

## Ils nous font confiance

- [Vinci Autoroutes](https://www.vinci-autoroutes.com/fr)
- [Happyview](https://www.happyview.fr/)
- [Afflelou](https://www.afflelou.com/)
