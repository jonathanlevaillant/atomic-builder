# Framework SASS
### Un framework SASS léger, flexible et responsive basé sur [KNACSS](https://github.com/alsacreations/KNACSS)

Ce framework SASS ultra léger *(20Ko)* permet de démarrer facilement et rapidement un projet en partant sur des bases saines. Il regroupe l'ensemble des bonnes pratiques en matière de **reset CSS**, de génération de **grilles fluides** et de **[rythme vertical](https://larlet.fr/david/biologeek/archives/20070819-l-importance-du-rythme-vertical-en-design-css/)**.

La syntaxe CSS de ce framework suit une **[méthodologie BEM](https://en.bem.info/method/)**.

***

##Bien débuter
L'ensemble des variables du projet se trouvent dans le fichier `_00a-config.scss`.  
Il est vivement conseillé de modifier ces variables en fonction de vos projets. Par défaut les unités sont exprimées en *"rem"*. Si vous travaillez avec des unités en pixels, il vous suffira simplement de diviser vos valeurs par dix pour obtenir leur équivalent en *"rem"* :

* `15px => 1.5rem`
* `8px => .8rem` 

Vous pourrez personnaliser entre autres les valeurs de tailles de polices, de titres, de couleurs, de marges, de points de rupture et de grilles.

Ce framework se base sur un rythme vertical calculé automatiquement, le principe étant celui-ci : 

Le rythme vertical est le produit de la taille de la police de base par sa hauteur de ligne. Dans notre cas, la taille de la police est de 1.5rem et sa hauteur de ligne est de 1.6, le rythme vertical sera donc de 2.4rem soit 24px. 

Le texte et l'ensemble des modules du framework suivront ce rythme comme les marges, les hauteurs, les titres, les champs de formulaire, etc. Ces éléments seront des multiples de 24px.

##Usage

####Les fonctions et mixins

Toutes les fonctions et mixins se trouvent dans le fichier `_00b-functions.scss`.  

Il est déconseillé de les modifier, vous pourrez néanmoins si vous le souhaitez en rajouter à la suite de cette feuille.

####Reset CSS

La feuille de reset CSS `_01-normalize.scss` inclue les principales règles de **Bootstrap** et **Knacss**, testées et approuvées !

####Les grilles

Vous pouvez générer n'importe quelle grille dans le fichier `_04-grids.scss` grâce à l'appel du mixin `@include grid-childs()`.  
Par défaut, si aucun argument n'est renseigné, la grille sera automatiquement générée en fonction de la largeur du conteneur, du nombre de colonnes et des gouttières (toutes ces variables étant présentes dans le fichier `_00a-config.scss`). 

En conservant les valeurs par défaut, `@include grid-childs()` sera complilé en :

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

Il est possible de renseigner un ou plusieurs arguments, comme une nouvelle gouttière, un modificateur de classe ou des colonnes spécifiques. Voici quelques exemples pour illustrer :

**Générer une grille à 4 colonnes** :

`@include grid-childs(4)` sera compilé en :

```css
.grid--4 > .grid__item {
    width: calc(25% - 1.2rem);
}
```

**Générer une grille "small" pour les colonnes 3 à 4** :

`@include grid-childs($modifier: "small", $start: 3, $end: 4)` sera compilé en :

```css
.grid--small-3 > .grid__item {
    width: calc(33.3334% - 1.2rem);
}
.grid--small-4 > .grid__item {
    width: calc(25% - 1.2rem);
}
```

**Générer une grille "gl" à 2 colonnes de gouttière 2.4rem** :

`@include grid-childs(2, "gl", 2.4rem)` sera compilé en :

```css
[class*="grid--gl"] {
    margin-bottom: -2.4rem;
    margin-left: -2.4rem;
}
[class*="grid--gl"] > .grid__item {
    margin-left: 2.4rem;
}
.grid--gl-2 > .grid__item {
    width: calc(50% - 2.4rem);
}
```

**Générer une grille de gouttière 2.4rem** :

`@include grid-childs($new-gutter: 2.4rem)` sera compilé en :

```css
[class*="grid--secondary"] {
    margin-bottom: -2.4rem;
    margin-left: -2.4rem;
}
[class*="grid--secondary"] > .grid__item {
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

*Note: Une nouvelle gouttière a été définie en oubliant le modificateur de classe, le label `secondary` a été rajouté automatiquement pour surcharger la grille de base*

**Les grilles à 2 colonnes inégales**

Vous pouvez si vous le souhaitez générer des grilles à 2 colonnes inégales. Le principe est le même que précédemment, seul l'appel au mixin change :

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

*Note: Vous constaterez que les grilles `grid--2-12`, `grid--3-12` et `grid--4-12` ont été renommées respectivement en `grid--1-6`, `grid--1-4` et `grid--1-3` grâce à une fonction calculant le plus grand dénominateur commun `@function gcd()`.*

####Les classes visuelles

Le fichier CSS `_07-helpers.scss` contient toutes les classes visuelles gérant les dimensions et les marges.

L'appel au mixin `@include percentage-width()` va générer des largeurs en pourcentage de 10% à 100%, la valeur d'incrémentation étant de 10. Il est possible de modifier cette valeur d'incrémentation et même de renseigner une plage de pourcentages :

**Générer des largeurs en pourcentage autocrémentées de 5% entre 50% et 100%**

`@include percentage-width(5, 50, 100)`

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

*Note: les valeurs 25%, 33.3334%, 66.6667% et 75% sont générées automatiquement du fait qu'elles soient très souvent utilisées au sein d'un projet.*







`@include spacing-helpers("margin", "padding")` va générer des marges externes et internes selon les différentes valeurs renseignées dans le fichier `_00a-config.scss`.  `tiny-value: .6rem` `small-value: 1.2rem` `medium-value: 2.4rem` et `large-value: 4.8rem` générera :  

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

Il est possible de renseigner uniquement la marge externe ou interne `@include spacing-helpers("padding")` :

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

####Feuille CSS native

La version CSS native après compilation est également disponible sur Github `styles.css`.  
Elle a été générée via le task manager **Gulp**, vous trouverez quelques optimisations CSS. (Auto préfixe, ordonnancement des propriétés CSS, etc.)  
Pour les plus curieux, j'ai mis à disposition mes fichiers [gulpfile.js](https://github.com/jonathanlevaillant/gulp/blob/master/gulpfile.js) et [package.json](https://github.com/jonathanlevaillant/gulp/blob/master/package.json).

***

###Amusez-vous bien !