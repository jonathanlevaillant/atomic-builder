# Atomic Builder
### Un Framework SASS léger, flexible et responsive basé sur [KNACSS](https://github.com/alsacreations/KNACSS)

Ce Framework SASS ultra léger *(20Ko)* permet de démarrer rapidement un projet en partant sur des bases saines. Il regroupe l'ensemble des bonnes pratiques en matière de **reset CSS**, de génération de **grilles fluides** et de **[rythme vertical](https://larlet.fr/david/biologeek/archives/20070819-l-importance-du-rythme-vertical-en-design-css/)**.

La syntaxe CSS de ce Framework suit une **[méthodologie BEM](https://en.bem.info/method/)**.

***

##Bien débuter
L'ensemble des variables du projet se trouvent dans le fichier CSS `_00a-config.scss`.  
Il est vivement conseillé de modifier ces variables en fonction de votre projet. Par défaut, les unités sont exprimées en *"rem"*. Si vous travaillez avec des unités en pixel, il suffira simplement de diviser vos valeurs par dix pour obtenir leur équivalent en *"rem"* :

* `15px => 1.5rem`
* `8px => .8rem` 

Vous pourrez personnaliser entre autres, les valeurs de taille des polices de caractères, de titres, de couleurs, de marges, de points de rupture et de grilles.

**Ce Framework se base sur un rythme vertical calculé automatiquement.**

Pour rappel, le rythme vertical est le produit de la taille de la police de caractères (par défaut) par sa hauteur de ligne relative. Dans notre cas, la taille de la police de caractères est de 1.5rem et sa hauteur de ligne est de 1.6, le rythme vertical sera donc de 2.4rem soit 24px. 

Le texte ainsi que l'ensemble des modules du Framework suivront ce rythme vertical comme les marges, les hauteurs de ligne des titres, les hauteurs des champs de formulaire, etc.

##Fonctions et mixins

Toutes les fonctions et mixins se trouvent dans le fichier CSS `_00b-functions.scss`.  

Il est déconseillé de les modifier, vous pourrez néanmoins si vous le souhaitez, en rajouter à la suite de cette feuille CSS.

##Reset CSS

La feuille de reset CSS `_01-normalize.scss` inclue les principales règles de **Bootstrap** et **Knacss**, testées et approuvées !

##Typographie

Les principales règles typographiques se trouvent  dans le fichier CSS `_02-base.scss`.

Les amoureux du rythme vertical ne pourront plus se passer du mixin `@include grid-childs()`. En effet, il permet de calculer automatiquement la hauteur de ligne relative d'une taille de police de caractères passée en paramètre en suivant le rythme vertical du projet. Il est également possible de renseigner d'autres paramètres comme sa graisse ou encore sa famille. En voici quelques exemples avec un rythme vertical de 2.4rem par défaut :

* **Hauteur de ligne relative d'une police de taille 1.9rem :**

`.title {@include font-rythm(1.9rem)}` sera compilé en :

```css
.title {
    line-height: 1.2632;
}
```

* **Hauteur de ligne relative d'une police de taille 2.4rem et de famille "Arial, sans-serif" :**

`.title {@include font-rythm(2.4rem, "Arial, sans-serif")}` sera compilé en :

```css
.title {
    font-family: "Arial, sans-serif";
    line-height: 1;
}
```

* **Hauteur de ligne relative d'une police de taille 6.4rem :**

`.title {@include font-rythm(6.4rem)}` sera compilé en :

```css
.title {
    line-height: 1.125;
}
```

*Note: Vous remarquerez dans le dernier exemple que la taille du titre (6.4rem) dépasse la hauteur par défaut du rythme vertical (2.4rem). Pour être précis, la taille du titre est comprise dans trois hauteurs de ligne soit 7.2rem (2.4rem x 3). Par conséquent le nouveau référentiel sera de 7.2rem et la valeur de la hauteur de ligne relative au titre sera de 1.125 (7.2rem / 6.4rem).*

##Les grilles

####Les grilles à colonnes égales

Vous pouvez générer n'importe quelle grille dans le fichier CSS `_04-grids.scss` grâce à l'appel du mixin `@include grid-childs()`.  
Par défaut, si aucun paramètre n'est renseigné, la grille sera automatiquement générée en fonction de la largeur du conteneur, du nombre de colonnes et des gouttières (toutes ces variables étant présentes dans le fichier CSS `_00a-config.scss`). 

En conservant les valeurs par défaut, `@include grid-childs()` sera compilé en :

```css
.grid--2 > .grid__item {
    width: calc(50% - 1.2rem);
}
.grid--3 > .grid__item {
    width: calc(33.3334% - 1.2rem);
}
.grid--4 > .grid__item {
    width: calc(25% - 1.2rem);
}
.grid--6 > .grid__item {
    width: calc(16.6667% - 1.2rem);
}
```

*Note: Vous remarquerez que seules les valeurs entières divisibles par le nombre de colonnes de la grille sont générées, pour rappel il s'agissait d'une grille à 12 colonnes, les valeurs 2, 3, 4 et 6 ont donc été créées.*

Il est également possible de renseigner un ou plusieurs paramètres, comme une nouvelle gouttière, un modificateur de classe ou des colonnes spécifiques. En voici quelques exemples :

* **Grille à 4 colonnes :**

`@include grid-childs(4)` sera compilé en :

```css
.grid--4 > .grid__item {
    width: calc(25% - 1.2rem);
}
```

* **Grille de label "small" pour les colonnes 3 à 6 :**

`@include grid-childs($modifier: "small", $start: 3, $end: 6)` sera compilé en :

```css
.grid--small-3 > .grid__item {
    width: calc(33.3334% - 1.2rem);
}
.grid--small-4 > .grid__item {
    width: calc(25% - 1.2rem);
}
.grid--small-6 > .grid__item {
    width: calc(16.6667% - 2.4rem);
}
```

* **Grille de label "gl" à 2 colonnes et de gouttière 2.4rem :**

`@include grid-childs(2, "gl", 2.4rem)` sera compilé en :

```css
[class*="grid--gl"] {
    margin-bottom: -2.4rem;
    margin-left: -2.4rem;
}
[class*="grid--gl"] > .grid__item {
    margin-bottom: 2.4rem;
    margin-left: 2.4rem;
}
.grid--gl-2 > .grid__item {
    width: calc(50% - 2.4rem);
}
```

* **Grille de gouttière 2.4rem :**

`@include grid-childs($new-gutter: 2.4rem)` sera compilé en :

```css
[class*="grid--secondary"] {
    margin-bottom: -2.4rem;
    margin-left: -2.4rem;
}
[class*="grid--secondary"] > .grid__item {
    margin-bottom: 2.4rem;
    margin-left: 2.4rem;
}
.grid--secondary-2 > .grid__item {
    width: calc(50% - 2.4rem);
}
.grid--secondary-3 > .grid__item {
    width: calc(33.3334% - 2.4rem);
}
.grid--secondary-4 > .grid__item {
    width: calc(25% - 2.4rem);
}
.grid--secondary-6 > .grid__item {
    width: calc(16.6667% - 2.4rem);
}
```

*Note: Dans cet exemple une nouvelle gouttière a été définie sans modificateur de classe, le label `secondary` a été rajouté automatiquement pour éviter un conflit de styles avec la grille par défaut.*

####Les grilles à colonnes inégales

Vous pouvez également générer des grilles à 2 colonnes inégales. Le principe est le même que précédemment, seul l'appel du mixin change :

`@include grid-uneven-childs()` sera compilé en :

```css
.grid--1-12 > *:nth-child(odd) {
    width: calc(8.3334% - 1.2rem);
}
.grid--1-12 > *:nth-child(even) {
    width: calc(91.6667% - 1.2rem);
}
.grid--11-12 > *:nth-child(odd) {
    width: calc(91.6667% - 1.2rem);
}
.grid--11-12 > *:nth-child(even) {
    width: calc(8.3334% - 1.2rem);
}
.grid--1-6 > *:nth-child(odd) {
    width: calc(16.6667% - 1.2rem);
}
.grid--1-6 > *:nth-child(even) {
    width: calc(83.3334% - 1.2rem);
}
.grid--5-6 > *:nth-child(odd) {
    width: calc(83.3334% - 1.2rem);
}
.grid--5-6 > *:nth-child(even) {
    width: calc(16.6667% - 1.2rem);
}
.grid--1-4 > *:nth-child(odd) {
    width: calc(25% - 1.2rem);
}
.grid--1-4 > *:nth-child(even) {
    width: calc(75% - 1.2rem);
}
.grid--3-4 > *:nth-child(odd) {
    width: calc(75% - 1.2rem);
}
.grid--3-4 > *:nth-child(even) {
    width: calc(25% - 1.2rem);
}
.grid--1-3 > *:nth-child(odd) {
    width: calc(33.3334% - 1.2rem);
}
.grid--1-3 > *:nth-child(even) {
    width: calc(66.6667% - 1.2rem);
}
.grid--2-3 > *:nth-child(odd) {
    width: calc(66.6667% - 1.2rem);
}
.grid--2-3 > *:nth-child(even) {
    width: calc(33.3334% - 1.2rem);
}
.grid--5-12 > *:nth-child(odd) {
    width: calc(41.6667% - 1.2rem);
}
.grid--5-12 > *:nth-child(even) {
    width: calc(58.3334% - 1.2rem);
}
.grid--7-12 > *:nth-child(odd) {
    width: calc(58.3334% - 1.2rem);
}
.grid--7-12 > *:nth-child(even) {
    width: calc(41.6667% - 1.2rem);
}
```

*Note: Vous remarquerez que les classes `grid--2-12`, `grid--3-12` et `grid--4-12` ont été renommées respectivement en `grid--1-6`, `grid--1-4` et `grid--1-3` grâce à une fonction calculant le plus grand diviseur commun `@function gcd($numerator, $denominator)`.*

##Les classes visuelles

Le fichier CSS `_07-helpers.scss` contient toutes les classes purement visuelles et utilitaires, elles sont très pratiques pour alléger le poids de vos feuilles de styles.

####Les largeurs fluides (en pourcentage)

L'appel du mixin `@include percentage-width()` va générer des largeurs fluides en pourcentage de 10% à 100%, la valeur d'incrémentation étant par défaut de 10. Il est possible de modifier cette valeur et même de se limiter à une plage de pourcentages :

* **Largeurs fluides auto-incrémentées de 5%, comprises entre 50% et 100% :**

`@include percentage-width(5, 50, 100)` sera compilé en :

```css
.w50 {
    width: 50%;
}
.w55 {
    width: 55%;
}
.w60 {
    width: 60%;
}
.w65 {
    width: 65%;
}
.w66 {
    width: 66.6667%;
}
...
.w100 {
    width: 100%;
}
```

*Note: les valeurs 25%, 33.3334%, 66.6667% et 75% sont générées automatiquement étant très souvent utilisées au sein d'un projet.*

* **Largeurs fluides auto-incrémentées de 1% :**

`@include percentage-width(1)` sera compilé en :

```css
.w1 {
    width: 1%;
}
.w2 {
    width: 2%;
}
.w3 {
    width: 3%;
}
.w4 {
    width: 4%;
}
.w5 {
    width: 5%;
}
...
.w100 {
    width: 100%;
}
```

####Les largeurs fixes (en *"rem"*)

L'appel du mixin `@include fixed-width-col()` va générer des largeurs fixes en *"rem"* pour chaque colonne de la grille utilisée. La largeur est calculée en fonction du nombre de colonnes, de la largeur du conteneur et des gouttières renseignées dans le fichier CSS de configuration `_00a-config.scss`.

`@include fixed-width-col()` sera par défaut compilé en :

```css
.w1col {
    width: 6.9rem;
}
.w2col {
    width: 15rem;
}
.w3col {
    width: 23.1rem;
}
.w4col {
    width: 31.2rem;
}
.w5col {
    width: 39.3rem;
}
.w6col {
    width: 47.4rem;
}
.w7col {
    width: 55.5rem;
}
.w8col {
    width: 63.6rem;
}
.w9col {
    width: 71.7rem;
}
.w10col {
    width: 79.8rem;
}
.w11col {
    width: 87.9rem;
}
.w12col {
    width: 96rem;
}
```

* **Il est possible de ne générer qu'une seule colonne :**

`@include fixed-width-col(6)` sera compilé en :

```css
.w6col {
    width: 47.4rem;
}
```

* **Ou bien une plage de colonnes :**

`@include fixed-width-col($start: 4, $end: 8)` sera compilé en :

```css
.w4col {
    width: 31.2rem;
}
.w5col {
    width: 39.3rem;
}
.w6col {
    width: 47.4rem;
}
.w7col {
    width: 55.5rem;
}
.w8col {
    width: 63.6rem;
}
```

####Les marges fixes

L'appel du mixin `@include spacing-helpers("margin", "padding")` va générer des marges fixes externes, internes ou les deux en fonction des valeurs d'espacement renseignées dans le fichier CSS de configuration `_00a-config.scss`. Les initiales de `margin-top`, `margin-right`, `margin-bottom` et `margin-left` sont respectivement `mt`, `mr`, `mb` et `ml`.  
Un suffixe concernant la largeur de la marge est ensuite ajouté. En voici quelques exemples :

* **Générer toutes les marges externes et internes en fonction des largeurs d'espacement renseignées**

`@include spacing-helpers("margin", "padding")` sera compilé en :

```css
...
.mts {
    margin-top: 1.2rem;
}
.mrs {
    margin-right: 1.2rem;
}
.mbs {
    margin-bottom: 1.2rem;
}
.mls {
    margin-left: 1.2rem;
}
.ptm {
    padding-top: 2.4rem;
}
.prm {
    padding-right: 2.4rem;
}
.pbm {
    padding-bottom: 2.4rem;
}
.plm {
    padding-left: 2.4rem;
}
...
```

* **Générer uniquement les marges internes (padding) en fonction des largeurs d'espacement renseignées**

`@include spacing-helpers("padding")` sera compilé en :

```css
...
.pts {
    padding-top: 1.2rem;
}
.prs {
    padding-right: 1.2rem;
}
.pbs {
    padding-bottom: 1.2rem;
}
.pls {
    padding-left: 1.2rem;
}
...
```

##CSS natif

Le CSS natif après compilation est également disponible sur Github `styles.css`.  
Il a été généré via le task manager **Gulp**, vous y trouverez quelques optimisations CSS. (Auto-préfixe, ordonnancement des propriétés CSS, etc.)  

Pour les plus curieux, j'ai mis à disposition mes fichiers [gulpfile.js](https://github.com/jonathanlevaillant/gulp/blob/master/gulpfile.js) et [package.json](https://github.com/jonathanlevaillant/gulp/blob/master/package.json) qui s'inspirent de ceux de [Raphaël Goetter](http://www.alsacreations.com/tuto/lire/1686-introduction-a-gulp.html).

***

###Amusez-vous bien :-)