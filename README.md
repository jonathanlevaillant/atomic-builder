# Atomic Builder : Le micro-framework CSS ultra léger pour débuter vos projets front-end avec classe !

Atomic Builder a pour volonté de se détacher des framework "usines à gaz" que sont Bootstrap et Foundation, en proposant un condensé de bonnes pratiques pour débuter vos projets front-end sereinement.

Atomic Builder se base une architecture **BEMIT = BEM + ITCSS**. Un excellent article d'[Harry Roberts](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/) vous présente cette méthodologie.

Ce framework a été pensé pour être utilisé avec le préprocesseur **Sass** et "l'automatiseur de tâches" **Gulp**.

Atomic Builder était initialement basé sur le framework de Raphaël Goetter : [KNACSS](http://knacss.com/).
Avec le temps, mon expérience d'intégrateur depuis huit ans et pour répondre à mes besoins professionnels, j'ai décidé de créer mon propre framework que j'utilise quotidiennement depuis plus d'un an.

En voici les principales fonctionnalités :

- Génération automatique des grilles.
- Gestion avancée de la typographie.
- Gestion et optimisation du rythme vertical.
- Création simplifiée des éléments de formulaire.
- Génération automatique des polices d'icônes.
- Collection de classes utilitaires (approche DRY).
- Adapté à toutes les tailles d'écran (responsive).

## Installation

- Si vous ne souhaitez récupérer que la feuille de style en [CSS natif](https://raw.githubusercontent.com/jonathanlevaillant/atomic-builder/master/dist/css/styles.css).
- Si vous utilisez un préprocesseur Sass mais que vous ne souhaitez pas utiliser "d'automatiseur de tâches", vous pourrez récupérer la [version Sass](https://github.com/jonathanlevaillant/atomic-builder/tree/master/src/css).
- Si vous souhaitez utiliser tout le potentiel d'Atomic Builder, vous pourrez installer le projet via **Bower** : `bower install atomic-builder`.

## Compatibilité

Atomic Builder est compatible avec l'ensemble des navigateurs à partir d'IE10 inclus.

## Structure

Votre projet est constitué de deux dossiers **src** (dossier de travail) et **dist** (dossier de production, où seront créés les fichiers produits par Gulp).

Atomic Builder se basant sur l'architecture BEMIT, le dossier CSS se compose de six sous-dossiers :

- settings : Ce dossier est destiné aux fichiers de configuration du projet, variables globales, couleurs et polices de caractères.
- tools : Pour les utilisateurs de Sass, c'est ici que vous devrez rajouter vos fonctions et vos mixins.
- generic : Il s'agit du célèbre reset CSS [normalize](http://necolas.github.io/normalize.css/), utilisé par Twitter, Github, etc. Il n'est pas nécessaire de le modifier.
- base : Ce dossier comprend tous les styles permettant de mettre en forme les éléments de base comme les éléments typographiques, tableaux, formulaires, etc.
- objects : Dans ce dossier se trouve tous les objets abstraits et réutilisables comme les grilles, les conteneurs, les classes utilitaires, etc.
- components : C'est dans ce dossier que vous devrez créer vos nouveaux composants spécifiques à votre projet.

*PS : Vous avez peut-être remarqué qu'il manque le sous-dossier "trumps" qui est censé contenir les classes utilitaires. Pour une raison de simplicité j'ai préféré regrouper ces classes dans le dossier "objects", ce qui me semblait plus pertinent étant donné que ce sont également des classes réutilisables.*

## Conventions de nommage

En suivant la logique d'architecture BEMIT, un système de nommage a été mis en place :

**Préfixes :**

- Les classes utilitaires : `u-`.
- Les objets : `o-`.
- Les composants : `c-`.
- Les nouveaux contextes de mise en forme (scope) : `s-`.
- Les états ou conditions : `is-`, `has-`.
- Les composants ciblés en JavaScript : `js-`.

**Suffixes :**

- Le responsive : `@breakpoint`.
- Les éléments : `__element`.
- Les modificateurs : `--modifier`.

## Bien débuter

L'étape la plus important quand vous débuterez un projet sera de mettre à jour les variables globales dans le fichier ```_global-variables.scss```. Vous pourrez définir la taille des différents titres, du corps du texte, des boutons et des champs de formulaires, du nombre de colonnes dans la grille, de la largeur des gouttières, etc.

Une fois ces variables renseignées, il suffira de compléter le dernier fichier de configuration correspondant aux couleurs utilisées dans votre projet ```_color-variables.scss```.

Pour résumé, vous n'aurez besoin de modifier que ces deux fichiers pour générer automatiquement la feuille de styles CSS de base qui correspondra à votre projet. En effet, toute la typographie, les grilles, les éléments de formulaires, les points de rupture, etc. seront générés en fonction de ces variables.
Adieu les heures passées à configurer les tailles de polices, les marges externes, internes, les boutons, les champs de formulaires, les grilles, les gouttières, etc. Tout sera administrable via ces deux fichiers.

Voici quelques exemples d'automatisation :

```css
$base-font-size         : 1.5rem !default;
$line-height            : 1.6 !default;
```

**=> La taille de la police de base sera de 1.5rem soit 15px et sa hauteur de ligne de 1.6 (le rythme vertical sera calculé automatiquement : 1.5rem * 1.6 = 2.4rem soit 24px).**

```css
$field-height   : 48px !default;
$btn-height     : 48px !default;
```

**=> La hauteur des champs et des boutons de formulaires sera de 4.8rem soit 48px (les marges internes et les hauteurs de ligne des champs et des boutons seront calculés automatiquement).**

```css
$grid-number    : 12 !default;
$grid-gutter    : 2.4rem !default;
```

**=> La grille sera composée de 12 colonnes avec des gouttières de largeur 2.4rem (il est possible de mettre directement l'unité en rem).**

```css
$h1-size        : 6.4rem !default;
$h2-size        : 3.9rem !default;
$h3-size        : 2.4rem !default;
```

**=> Les tailles des titres h1, h2, h3 seront définis respectivement à 6.4rem, 3.9rem et 2.4rem (la hauteur de ligne des titres sera calculée automatiquement pour suivre le rythme vertical calculé précédemment).**

## Et ensuite ?

Une fois la base du projet mis en place, tous les modules spécifiques devront être implémentés dans le dossier **components**.
C'est normalement à cette étape que vous devrez commencer à produire du code CSS :)

## Bonus

Voici la description des tâches Gulp que vous utiliserez régulièrement :

- `gulp` : Compile les fichiers Sass en CSS natif (propriétés auto-préfixées, ordonnées et indentées), les images sont optimisées et les polices de caractères ttf sont converties en woff et woff2.
- `gulp icon` : Les icônes svg dans le dossier "fonts/icons/" sont converties en police de caractères (le code CSS d'appel des icônes est généré automatiquement dans le fichier ```_icons.scss```, **il ne faut donc pas l'éditer**).
- `gulp prod` : Les fichiers CSS, HTML et JS sont minifiés, un chemin critique CSS est rajouté dans chaque fichier HTML, les fichiers JS sont concaténés.