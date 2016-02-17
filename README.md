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

###2) _00a-config.scss

Fichier de configuration incluant toutes les variables utilisées dans le projet. Vous pouvez laisser par défaut les valeurs prédéfinies mais il est conseillé d'éditer vos propres valeurs en fonction de votre charte graphique. 

Ce fichier se compose de plusieurs rubriques concernant les tailles des polices, les types de polices, les couleurs de texte, les couleurs de fond, les différentes marges, les tailles des éléments de formulaire, les points de rupture et les modèles de grille.

Voici quelques précisions concernant certaines variables :

* **$base-font-size** : correspond à taille de base de la police du site :
```css
$base-font-size: 1.5rem !default;
```

* **$line-height** : correspond à hauteur de ligne par défaut, en général elle se situe entre 1.5 et 1.6 :
```css
$line-height: 1.6 !default;
```

* **$field-height** : correspond à hauteur d'un champs de formulaire :
```css
$field-height: 3.6rem !default;
```

* **$grid-spacer** : correspond à la marge basse des colonnes d'une grille lorsque la grille passe sur plusieurs lignes :
```css
$grid-spacer: 1.2rem !default;
```

###3) _00b-functions.scss
