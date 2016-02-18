# Framework SASS
### Un framework SASS léger, flexible et responsive basé sur [KNACSS](https://github.com/alsacreations/KNACSS)

Ce framework SASS ultra léger *(20 Ko)* permet de démarrer facilement et rapidement un projet en partant sur des bases saines. Il regroupe l'ensemble des bonnes pratiques en matière de **reset CSS**, de génération de **grilles fluides** et de **[rythme vertical](https://larlet.fr/david/biologeek/archives/20070819-l-importance-du-rythme-vertical-en-design-css/)**.

La syntaxe CSS de ce framework suit une **[méthodologie BEM](https://en.bem.info/method/)**.

***

##Bien débuter
L'ensemble des variables du projet se trouvent dans le fichier `_00a-config.scss`.  
Il est conseillé de modifier dans un premier temps ces variables, par défaut les unités de taille sont exprimées en *"rem"*. Si vous travaillez avec des unités en pixels il suffira simplement de diviser vos valeurs par dix pour obtenir leur équivalent en *"rem"*.  

**Exemples :** `15px => 1.5rem` `8px => .8rem`

Vous pourrez personnaliser entre autres les valeurs de tailles de polices, de titres, de couleurs, de marges, de points de rupture et de grilles.

##Quelques astuces

####Fonctions et mixins

Toutes les fonctions et mixins se trouvent dans le fichier `_00b-functions.scss`.  

Il est déconseillé de les modifier, vous pourrez néanmoins si vous le souhaitez en rajouter à la suite de cette feuille.

####Feuille de reset CSS

La feuille de reset CSS `_01-normalize.scss` inclue les principales règles de **Bootstrap** et **Knacss**, testées et approuvées :-)

####Les grilles

Vous pouvez générer n'importe quelle grille dans le fichier `_04-grids.scss` grâce au mixin `@include grid-childs()`.  
Par défaut si aucun argument n'est renseigné, la grille sera automatiquement générée en fonction de la largeur du wrapper, du nombre de colonnes et des gouttières (toutes ces variables étant présentes dans le fichier `_00a-config.scss`). 

En gardant les valeurs par défaut, voila à quoi ressemblera le fichier CSS compilé avec ce mixin :
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
Vous remarquerez que seules les valeurs entières divisibles par la taille de la grille sont générées, pour rappel il s'agissait d'une grille de 12 colonnes, les valeurs 2, 3, 4 et 6 sont donc générées.  

Il est également possible de renseigner des arguments, notamment une gouttière différente, un modificateur de classe, une colonne à générer ou même une plage de colonnes à générer.   

**Exemple :** `@include grid-childs($modifier: "small", $start: 1, $end: 4)` sera compilé en :

```css
.grid--small-1 > .grid__item {
    width: calc(100% - 1.2rem);
}
.grid--small-2 > .grid__item {
    width: calc(50% - 1.2rem);
}
.grid--small-3 > .grid__item {
    width: calc(33.3334% - 1.2rem);
}
.grid--small-4 > .grid__item {
    width: calc(25% - 1.2rem);
}

```
**Exemple :** `@include grid-childs(2, "gl", $gutter: 2.4rem)` sera compilé en :
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

Si vous mettez à jour la gouttière de base et que vous oubliez de rajouter un modificateur de grille, celui ci sera créé automatiquement avec le label `secondary`.

Vous pouvez également générer des grilles de colonnes inégales selon le même principe que précédemment en utilisant cette fois ci le mixin `@include grid-uneven-childs()`.
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

Vous constaterez que les grilles `grid--2-12` `grid--3-12` et `grid--4-12` sont nommées respectivement en `grid--1-6` `grid--1-4` et `grid--1-3` grâce à une fonction calculant le plus grand dénominateur commun : `@function gcd()`.

####Les classes automatiques

Le fichier `_07-helpers.scss` possède quelques mixins fort utiles :  
`@include percentage-width()` va générer des tailles en pourcentages de 10% à 100% (la valeur de l'incrémentation par défaut étant de 10). Il est possible de modifier cette valeur d'incrémentation `@include percentage-width(5)` (de 5 en 5 par exemple).  

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