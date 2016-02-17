# Framework CSS
## Un Framework SASS léger et flexible basé sur [KNACSS](https://github.com/alsacreations/KNACSS)

Ce Framework CSS a pour but de démarrer un projet de zéro. Il inclut entre autre une feuille de reset, de print, de génération de grilles et de helpers. Tous les modules présents sont générés et pensés en suivant un rythme vertical définit par l'utilisateur. 

Pour rappel le rythme vertical correspond à la hauteur de ligne multipliée par la taille de la police. Par exemple, si la police du site est de 14px et que la hauteur de ligne est de 1.5 alors le rythme vertical sera de 21px. Par conséquent toutes les hauteurs ou marges des modules présents dans le site seront des multiples de 21px.


###1) Débuter un projet

Pour débuter un projet, il est recommandé d'éditer le fichier **_00a-config.scss**.

Ce fichier inclut toutes les variables du site, les polices utilisées, les tailles des titres, les principales couleurs du site, les points de rupture, le nombre de colonnes utilisées dans la grille, etc.

Par défaut les variable sont définies en unité fluide "rem". Si vous utilisez des pixels, la conversion pour passer en unités fluides est très simple, il suffit de diviser la valeur par 10. Par exemple 14px équivaut à 1.4rem.

**Ce Framework CSS est composé de 12 fichiers SCSS ainsi que du fichier généré en CSS natif :**

* _00a-config.scss
* _00b-functions.scss
* _01-normalize.scss
* _02-base.scss
* _03-layout.scss
* _04-grids.scss
* _05-tables.scss
* _06-forms.scss
* _07-helpers.scss
* _08-responsive.scss
* _09-print.scss
* styles.css
* styles.scss

**Vous trouverez ci dessous une description détaillée de chaque fichier :**

###2) Fonctions et mixins

Toutes les fonctions et mixins se trouvent dans le fichier **_00b-functions.scss**.

Ci dessous un descriptif de chaque fonction et mixin et leur cas d'utilisation :

####Fonctions

```scss
@function decimal-round($number, $digit: 4) {...}
```
Fonction permettant d'arrondir un nombre décimal. Par défaut il sera arrondi à 4 décimales si nécessaire, il est possible de définir le nombre de décimale souhaitées avec l'argument `$digit`.

**Argument obligatoire :** `$number`  
**Argument facultatif :** `$digit`  
**Exemples :** `decimal-round(33.333334%) => 33.3334%` `decimal-round(10.5269rem, 2) => 10.53rem` `decimal-round(12) => 12`