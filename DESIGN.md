---
name: Glisse
description: Façade de groovebox en charbon thermolaqué, quatre couleurs de signal, touches caoutchouc à LED et puits noirs pour les afficheurs.
colors:
  bg: "#1a1a1a"
  panel: "#2a2a2a"
  well: "#111111"
  rule: "#484848"
  seam-dark: "#141414"
  seam-light: "#3a3a3a"
  ink: "#ece7da"
  ink-2: "#b9b3a5"
  ink-3: "#9c9789"
  orange: "#f06a1f"
  cream: "#e9e2d0"
  yellow: "#f2c832"
  red: "#ea4a3c"
  green: "#5fd47a"
  led: "#ff3b30"
  led-off: "#4a201c"
  led-cream: "#ffe9b8"
  led-cream-off: "#4a4436"
  led-green: "#4cd964"
  btn: "#3b3b3b"
  btn-edge: "#1f1f1f"
  btn-hi: "#474747"
  grid-line: "#333333"
  grid-row: "#262626"
  display-bg: "#1c0d02"
  display-amber: "#ffb37a"
  display-amber-dim: "#c47a4a"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.26em"
  title:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "normal"
  body:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
  numeric:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.16em"
  label-key:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.12em"
  label-head:
    fontFamily: "Barlow Condensed, Arial Narrow, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.2em"
rounded:
  hairline: "3px"
  sm: "4px"
  md: "5px"
  pad: "6px"
  panel: "10px"
  lamp: "50%"
spacing:
  "1": "4px"
  "2": "5px"
  "3": "6px"
  "4": "8px"
  "5": "10px"
  "6": "12px"
  "7": "14px"
  "8": "16px"
  "9": "18px"
  "10": "22px"
components:
  key:
    backgroundColor: "{colors.btn}"
    textColor: "{colors.ink}"
    typography: "{typography.label-key}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  key-hover:
    backgroundColor: "{colors.btn-hi}"
  key-held:
    backgroundColor: "{colors.btn-hi}"
  power-key:
    backgroundColor: "{colors.btn}"
    textColor: "{colors.ink}"
    typography: "{typography.label-key}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
    height: "44px"
  select-well:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.numeric}"
    rounded: "{rounded.md}"
    padding: "8px 30px 8px 10px"
    height: "44px"
  number-well:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.numeric}"
    rounded: "{rounded.md}"
    padding: "8px 10px"
    height: "44px"
  group-box:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "12px 12px 14px"
  group-head:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.well}"
    typography: "{typography.label-head}"
    rounded: "4px 4px 0 0"
    padding: "6px 10px"
  sound-display:
    backgroundColor: "{colors.display-bg}"
    textColor: "{colors.orange}"
    typography: "{typography.display}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  meter-well:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label-key}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  lamp:
    backgroundColor: "{colors.led-off}"
    rounded: "{rounded.lamp}"
    size: "8px"
  lamp-md:
    backgroundColor: "{colors.led-off}"
    rounded: "{rounded.lamp}"
    size: "12px"
  lamp-on:
    backgroundColor: "{colors.led}"
    rounded: "{rounded.lamp}"
    size: "8px"
  kbd:
    backgroundColor: "{colors.btn}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.hairline}"
    padding: "0 5px"
  pad-well:
    backgroundColor: "{colors.well}"
    rounded: "{rounded.pad}"
  fader-thumb:
    backgroundColor: "{colors.btn}"
    rounded: "{rounded.hairline}"
    width: "22px"
    height: "30px"
---

# Design System: Glisse

## Overview

**Creative North Star: "La façade de groovebox"**

Glisse est un panneau, pas une page. La surface entière est une plaque de charbon (`bg` sous `panel`) sur laquelle sont vissés un pad noir mat et quatre boîtes de groupe ; chaque groupe porte sa propre couleur de signal dans un onglet-titre plein, comme les sections d'une TR-808 : orange SOUND, crème SCALE · KEY · TEMPO, jaune GATE ARP, rouge LOOP. Tout ce qui est actionnable est une touche caoutchouc grise à rebord inférieur de 3 px ; tout ce qui affiche est un puits noir encaissé. L'état ne se devine jamais : il est écrit dans l'onglet du groupe, et confirmé par une LED sur la touche.

La densité est celle d'un instrument : cibles de 44 px minimum, gouttières de 8–14 px, aucune interaction qui n'existe qu'au survol (souris et tactile à égalité). Le relief est mécanique et non « élevé » : lignes de couture claire/sombre entre les sections, encaissement des puits, rebord des touches. Rien ne flotte, rien ne brille sauf les LED et la bague orange sous le doigt.

Le contrat de direction visait un charbon `#262626` / `#303030` ; le build a atterri sur `bg` / `panel` (`#1a1a1a` / `#2a2a2a`). Le wordmark est GLISSE (engagement de marque de PRODUCT.md), pas KAOSSILATOR. La typographie est une superfamille (Barlow + Barlow Condensed) plutôt qu'une seule face : condensée pour tout ce qui est sérigraphié, droite pour ce qui se lit.

**Key Characteristics:**
- Une couleur de signal par groupe, portée par un onglet-titre plein à texte noir ; jamais deux couleurs de signal dans le même groupe.
- Touches caoutchouc rectangulaires (`btn`, rebord 3 px `btn-edge`, rayon 5 px) qui s'enfoncent de 2 px à l'appui.
- Puits noirs (`well`, ombre interne) pour tout afficheur, sélecteur, champ, mètre et le pad lui-même.
- Une seule rampe de lampes : 8 px sur les touches, 12 px sur le mètre et POWER.
- Légendes sérigraphiées : Barlow Condensed 600/700, capitales, espacement 0.12–0.26em.
- Motion à 150 ms, LED instantanées.

## Colors

Un charbon presque neutre en trois marches (fond, panneau, puits), une encre crème pour le texte, et quatre couleurs de signal saturées qui n'apparaissent que là où elles identifient un groupe ou un état.

### Primary
- **Orange signal** (`orange`) : identité du groupe SOUND (onglet), chiffres de l'afficheur, bague et point sous le doigt sur le pad, colonne de gamme allumée (`rgba(240,106,31,.22)` de remplissage + filets orange), curseur de saisie, sélection de texte, bande centrale du curseur de volume, lampe du mètre en enregistrement. C'est la couleur de « ça sonne ».

### Secondary
- **Crème panneau** (`cream`) : onglet SCALE · KEY · TEMPO. Sa version lumineuse **LED crème** (`led-cream` / éteinte `led-cream-off`) sert aux lampes non-critiques : POWER, TAP, couche SAVED. Sert aussi de couleur de focus clavier (`outline: 2px solid`).
- **Jaune signal** (`yellow`) : onglet GATE ARP, lampe ON / OFF, segments du motif (opacité 0.3 éteint, 1 allumé).
- **Rouge signal** (`red`) : onglet LOOP uniquement. Les lampes d'enregistrement utilisent la **LED rouge** (`led`, éteinte `led-off`), plus vive que l'onglet.

### Tertiary
- **LED verte transport** (`led-green`) : une seule lampe, celle de PLAY. Ce n'est pas une couleur de groupe ; elle n'apparaît nulle part ailleurs.
- **Afficheur ambré** (`display-bg`, `display-amber`, `display-amber-dim`) : les trois valeurs de l'afficheur SOUND (fond brun-noir, nom du programme, catégorie). Réservées à cet afficheur.

### Neutral
- **Charbon fond** (`bg`) : page derrière le panneau.
- **Charbon panneau** (`panel`) : plaque principale et fond des boîtes de groupe.
- **Puits** (`well`) : tout ce qui est encaissé : pad, selects, champs, barre de gate, mètre, pistes de curseur, pre de test. Bord toujours `#000`.
- **Filet** (`rule`) : bordure des boîtes de groupe, bordure au survol des selects, couleur de la scrollbar.
- **Couture** (`seam-dark` / `seam-light`) : paire ligne sombre + ligne claire sur 1 px, qui sépare bandeau, pad et pied du reste (toujours ensemble).
- **Grille du pad** (`grid-line` colonnes / `grid-row` lignes) : sérigraphie des colonnes de gamme et des quarts de hauteur.
- **Encre** (`ink`, `ink-2`, `ink-3`) : texte principal, légendes/valeurs secondaires, notes et pied de page.
- **Caoutchouc** (`btn`, `btn-edge`, `btn-hi`) : corps de touche, rebord et survol/enfoncé.

### Named Rules
**The Une Couleur Par Groupe Rule.** Une couleur de signal identifie un groupe et ses états, rien d'autre. L'orange ne sort de SOUND que pour le pad (le pad est l'instrument que SOUND configure). Un nouveau groupe reçoit sa propre couleur ou du crème ; il n'emprunte jamais celle d'un voisin.

**The Texte Noir Sur Signal Rule.** Sur un onglet de couleur de signal, le texte est `#111`, jamais blanc, jamais l'encre crème.

**The LED N'est Pas Décor Rule.** Une lampe n'existe que sur une commande qui a un état (POWER, TAP, ON / OFF, REC, PLAY, SAVED, NEW LAYER, mètre). Les touches sans état (◀ ▶, FIX, CANCEL, CLEAR, ERASE) n'en portent pas.

## Typography

**Display Font:** Barlow Condensed (avec Arial Narrow, Helvetica Neue, Arial)
**Body Font:** Barlow (avec Helvetica Neue, Arial)
**Label/Mono Font:** Barlow Condensed pour toutes les légendes ; `ui-monospace, Menlo` uniquement dans le pre de test, hors système.

**Character:** Une superfamille industrielle. Le condensé, en capitales espacées, est la sérigraphie de la façade ; le droit, en 400–600, est ce que l'utilisateur lit (noms de programme, valeurs, aide). Les chiffres sont toujours tabulaires là où ils changent (afficheur, BPM, compteur de temps).

### Hierarchy
- **Display** (700, 34px, 1, 0.06em, tabulaire) : l'identifiant de programme (« L.00 ») dans l'afficheur SOUND. Passe à 28px sous 440px.
- **Headline** (700, 26px, 1, 0.26em) : le wordmark GLISSE, seule occurrence.
- **Title** (600, 17px, 1.15) : nom du programme dans l'afficheur (ambré).
- **Body** (400, 15px, 1.35) : base ; les libellés d'axe X/Y utilisent Barlow 600 13px, l'aide du pad Barlow 500 12px/1.4, le pied Barlow 500 12px/1.6.
- **Numeric** (500, 15px, 1.2, tabulaire) : champ BPM ; les selects utilisent la même face à 14px.
- **Label** (600, 11px, 0.16em, capitales) : légendes de champ (SCALE, KEY, BPM 20–300, VOLUME), catégorie de l'afficheur (0.18em), couches SAVED / NEW LAYER (0.14em), lettres X/Y de la liste d'axes.
- **Label-key** (600, 13px, 0.12em, capitales) : texte des touches ; POWER à 0.14em ; compteur de temps à 0.1em.
- **Label-head** (700, 12px, 0.2em, capitales) : titre d'onglet de groupe ; la valeur d'état à droite passe à 600 / 0.1em.
- **Pad hint** (Condensed 600, 15px/1.5, 0.16em, capitales) : « TOUCHEZ LE PAD », disparaît au premier geste.

### Named Rules
**The Sérigraphie Rule.** Tout texte en Barlow Condensed est en capitales et espacé d'au moins 0.1em. Tout texte en Barlow droit est en casse normale, jamais espacé. Une chaîne ne mélange pas les deux.

**The Tabulaire Rule.** Toute valeur qui peut changer sous les yeux (identifiant, BPM, temps) porte `font-variant-numeric: tabular-nums`.

## Layout

Le panneau est une grille CSS de largeur maximale 1180px centrée, avec un padding de page `clamp(8px, 2vw, 24px)`. Trois zones : `top` (bandeau pleine largeur), `pad` / `stack` (deux colonnes `minmax(0,1.15fr) minmax(320px,1fr)`), `foot` (pleine largeur). La section pad est `position: sticky; top: 0` : elle reste sous les yeux pendant qu'on fait défiler les groupes.

Rythme : le bandeau a 14px 22px, la section pad 22px 18px 22px 22px, la pile 18px 22px 22px 18px avec 14px entre les groupes. Dans un groupe : onglet 6px 10px, corps 12px 12px 14px avec 10px entre les rangées ; une rangée (`row`) est une grille à colonnes égales (`grid-auto-columns: 1fr`, gap 8px) ou à colonnes explicites en inline (`auto 1fr auto`, `1fr auto`, `1.3fr 1fr auto`). Un champ (`field`) empile légende + contrôle avec 5px.

Le pad est un carré (`aspect-ratio: 1`) dont la zone jouable est en retrait de 4 % (`inset: 4%`) ; cette marge morte est matérialisée par un cadre `#161616` de 4 %. Les libellés d'axe sont imprimés au-dessus (Y) et en dessous (X) du pad, hors du puits.

Responsive :
- **≤ 820px** : une colonne (`top` / `pad` / `stack` / `foot`), pad non sticky, padding de page 8px, section pad 16px 16px 6px, pile 12px 16px 18px, bandeau 12px 16px ; le sous-titre du wordmark et les raccourcis clavier du pied disparaissent (le crédit reste).
- **≤ 440px** : les rangées `r4` et `r3` passent en deux colonnes ; dans `r3` le champ LENGTH prend toute la largeur ; l'identifiant de l'afficheur passe à 28px.

**The 44 Rule.** Toute commande (touche, select, champ, curseur, POWER) a `min-height: 44px`. Les lampes et les liens de pied ne sont pas des commandes.

## Elevation & Depth

Pas d'élévation. Le système ne connaît que deux profondeurs par rapport à la plaque : en creux (puits) et en relief (touches, lampes allumées). Aucune surface, boîte ou touche ne porte d'ombre portée : le relief des touches est un bord (`border-bottom-width: 3px`), pas une ombre. Les seules ombres externes sont courtes (≤ 6px) et réservées aux indicateurs d'état : lampe allumée, bague sous le doigt, bouton du curseur.

### Shadow Vocabulary
- **Puits profond** (`box-shadow: inset 0 2px 8px #000`) : pad et afficheur SOUND.
- **Puits** (`box-shadow: inset 0 1px 4px #000`) : selects, champ BPM, barre de gate, mètre. Pistes de curseur : `inset 0 1px 3px #000`.
- **Couture** (`box-shadow: 0 1px 0 #3a3a3a` sous une `border-bottom: 1px solid #141414`, ou `1px 0 0` / `inset 0 1px 0` selon le côté) : arête usinée entre bandeau, pad, pile et pied. Le panneau lui-même porte `inset 0 1px 0 #3d3d3d` comme reflet de son bord supérieur.
- **Lampe** (`inset 0 0 0 1px #0007` éteinte ; `+ 0 1px 2px #0009` et reflet `radial-gradient(circle at 35% 30%, #fff9 0, transparent 45%)` allumée) : le dôme d'une LED.
- **Bague** (`0 0 0 1px #0008, 0 2px 6px #0009`) : la bague orange sous le doigt, seul élément qui « flotte » au-dessus du pad.
- **Curseur** (`0 2px 3px #0009`) : bouton du curseur de volume.

### Named Rules
**The Creux Ou Rebord Rule.** Une surface est soit un puits (fond `well`, bord `#000`, ombre interne), soit une touche (fond `btn`, rebord bas 3 px). Seuls les indicateurs d'état (lampe, bague, bouton de curseur) portent une ombre externe, jamais une surface.

## Shapes

Rectangles à coins à peine cassés, comme des touches moulées. Rayon 10px pour la plaque, 6px pour le pad, 5px pour les touches, boîtes de groupe, puits et afficheurs, 4px pour le haut des onglets (`4px 4px 0 0`) et la barre de gate, 3px pour les pistes/boutons de curseur et les touches `kbd`. Les lampes, la bague et son point sont ronds (50 %). Toute bordure est de 1px : `#0c0c0c` pour la plaque, `#000` pour les puits, `btn-edge` pour les touches, `rule` pour les groupes.

Le curseur de volume est un bouton rectangulaire vertical (22×30px) marqué d'une bande orange de 2px au centre, sur une piste de 6px. Le motif de gate est une suite de rectangles pleins (hauteur 12 sur 22) séparés par des filets de temps `#3a3a3a`. Les icônes sont des SVG inline à trait de 2px, 11–12px, arrondis (`stroke-linecap: round`), jamais des glyphes de police.

## Components

### Touche caoutchouc (`.btn`)
Une touche de groovebox : grise, plate, avec un rebord inférieur plus sombre qui s'écrase à l'appui.
- **Shape :** rayon 5px, bordure 1px `btn-edge`, rebord bas 3px.
- **Style :** fond `btn`, texte `ink` en Label-key (Condensed 600 13px, 0.12em, capitales), padding 8px 12px, min-height 44px, gap 8px, contenu centré, `white-space: nowrap`.
- **Hover :** fond `btn-hi` (cosmétique ; aucune fonction n'est liée au survol).
- **Active / held :** `translateY(2px)`, rebord bas 1px, `margin-bottom: 2px` (la touche s'enfonce sans bouger le layout), fond `btn-hi`. `.held` est posé par le moteur pour REC, ERASE et ON / OFF en position maintenue.
- **Disabled :** opacité 0.38, curseur `not-allowed`.
- **Lampe :** 8px en haut à gauche (`top: 6px; left: 6px`), couleur par rôle : `rec` → `led`, `play` → `led-green`, `arp` → `yellow`, `tap` → `led-cream`.
- **Variante POWER (`.power`) :** même touche, padding 8px 14px, 0.14em, lampe 12px crème en ligne avant le texte, `aria-pressed`.
- **Transition :** `background`, `transform` 150ms `cubic-bezier(.2,.8,.2,1)`.

### Lampe (`.lamp`)
- **Ramp :** 8px par défaut, 12px avec `.md` (POWER, mètre de temps). Pas de troisième taille.
- **Off :** fond `led-off` (ou `led-cream-off` via `--off`), anneau interne `#0007`.
- **On :** fond `led` (ou `--c`), reflet radial, ombre 1px. Bascule en 150ms.

### Puits de sélection (`.sel select`)
- **Style :** fond `well`, bordure 1px `#000`, rayon 5px, ombre interne, padding 8px 30px 8px 10px, Barlow 500 14px, chevron SVG `ink-2` (12×8) encodé en data URI, `appearance: none`.
- **Hover :** bordure `rule`. **Disabled :** opacité 0.38.

### Champ numérique (`.num`)
- **Style :** même puits, padding 8px 10px, Barlow 500 15px tabulaire, caret `orange`, spin buttons masqués.

### Curseur (`.range`)
- **Piste :** 6px, `well`, bordure `#000`, rayon 3px, ombre interne. **Bouton :** 22×30px, `btn`, bande orange centrale, ombre `0 2px 3px #0009`. Zone de saisie 44px.

### Boîte de groupe (`.grp`)
- **Style :** `fieldset` à bordure 1px `rule`, rayon 5px, fond `panel`, `legend` masqué visuellement.
- **Onglet (`.head`) :** fond `--gc` (la couleur de signal du groupe : `.sound` orange, `.scale` crème, `.gate` jaune, `.loop` rouge), texte `#111`, Label-head à gauche, valeur d'état à droite (600, 0.1em, ellipsée).
- **Corps (`.body`) :** padding 12px 12px 14px, grille verticale gap 10px ; opacité 0.5 quand le panneau est `off`.

### Afficheur SOUND (`.disp`)
- **Style :** puits brun-noir `display-bg`, rayon 5px, ombre `inset 0 2px 8px #000`, padding 8px 12px, grille `auto 1fr`. Identifiant en Display orange sur deux lignes, nom en Title `display-amber`, catégorie en Label 0.18em `display-amber-dim`. `aria-live="polite"`.

### Pad (`#pad`)
Le composant signature. Puits carré `well`, bordure `#000`, rayon 6px, ombre `inset 0 2px 8px #000, 0 1px 0 #3a3a3a`, curseur `crosshair` (`pointer` hors tension). À l'intérieur, en retrait de 4 % : lignes de quart `grid-row` (`repeating-linear-gradient`), colonnes de gamme `grid-line` avec un tick de 6px en bas ; la colonne sous le doigt reçoit `rgba(240,106,31,.22)` et deux filets orange en 120ms. La bague `#dot` (38px, bordure 3px `orange`, point central 6px) suit le pointeur. L'aide centrale en capitales condensées s'efface en 250ms au premier geste.

### Barre de gate (`.gbar`) et mètre (`.meter`)
- **Gate :** puits de 22px, rayon 4px ; segments SVG `yellow` à 0.3 (0.3 → 1 quand le groupe est ON), filets de temps `#3a3a3a`, tête de lecture `ink` 2px visible seulement en jeu.
- **Mètre :** puits, padding 10px 12px ; une lampe 12px par temps (gap 9px), allumée en `led` sur le temps courant, `orange` en enregistrement ; compteur « BEAT n / N » en Label-key `ink-2` tabulaire.

### Touche clavier (`kbd`)
- Mini-touche : `btn`, rebord bas 2px, rayon 3px, Condensed 600 11px `ink-2`, min-width 1.6em, padding 0 5px. Pied de page uniquement.

### Navigation
Pas de navigation : une seule surface. Le bandeau porte le wordmark et POWER ; le pied porte les raccourcis (`kbd`) et le crédit.

## Do's and Don'ts

### Do:
- **Do** donner à tout nouveau groupe un onglet plein dans sa couleur de signal avec texte `#111` et une valeur d'état à droite ; l'état se lit dans l'onglet avant tout.
- **Do** construire toute commande sur `.btn` (44px, rebord 3px, enfoncement 2px) et tout afficheur sur un puits `well` à ombre interne.
- **Do** ajouter une lampe (8px sur touche, 12px sur mètre) uniquement quand la commande a un état, dans la couleur de ce rôle.
- **Do** écrire les légendes en Barlow Condensed capitales espacées et les valeurs en Barlow droit, chiffres tabulaires.
- **Do** garder les transitions à 150ms `cubic-bezier(.2,.8,.2,1)` et respecter `prefers-reduced-motion` (toutes coupées).
- **Do** séparer les sections par la couture `seam-dark` / `seam-light` plutôt que par un espace vide.

### Don't:
- **Don't** utiliser une couleur de signal hors de son groupe (l'orange sur le pad est l'unique exception, déjà établie).
- **Don't** ajouter une ombre portée ou une lueur à une surface, une boîte ou une touche ; le relief est un rebord ou un creux, et les ombres courtes (≤ 6px) restent réservées aux indicateurs d'état (lampe, bague, bouton de curseur).
- **Don't** arrondir une touche au-delà de 5px ni la rendre lumineuse ; les touches sont grises, seule la LED s'allume.
- **Don't** lier une fonction au survol : le survol ne fait que teinter en `btn-hi`.
- **Don't** cacher un réglage derrière un mode ou un menu ; chaque état reste visible en permanence.
- **Don't** nommer le produit ou le wordmark « Kaossilator » ; la référence Korg reste une ligne de crédit en pied.
- **Don't** introduire une troisième taille de lampe ni un glyphe de police pour une icône ; les icônes sont des SVG inline à trait de 2px.


## Ajout 2026-09-14 : groupe SESSION et touches de banque

- Cinquième couleur de signal `green #5fd47a` pour le groupe SESSION (enregistrement de la performance, entrée MIDI) ; texte `#111` dessus, même bandeau-onglet que les autres groupes.
- Touches de banque A–D : touche caoutchouc en colonne (lettre Barlow Condensed 700 18px + longueur en 10px), lampe crème = contenu gravé, rouge = couche non gravée ; état `muted` = lettre barrée à 40 %. Sélectionnée = état `held`.
- Bouton REC en état `armed` (count-in) : lampe clignotante `steps(2)` 0,5 s.
- Niveau de banque : fader `.range.sm` (32 px de haut), même capuchon.
- Nom de note sous le pad : `.notebig` Barlow Condensed 700 22px orange, tabulaire, tiret `ink-3` à vide.

## Ajout 2026-09-14 (2) : dock transport mobile et REC clic-ou-maintien

- `.dock` : barre fixe en bas d'écran, uniquement ≤ 820 px, même charbon `panel`, rebord 1px `#0c0c0c`, rayon `panel` 10px, ombre courte `0 4px 6px` (surface flottante, seule exception au « pas d'ombre sur les surfaces »). Contenu : REC, PLAY/STOP, position `A · beat 7 / 8` en orange tabulaire + nom du son en légende, ◀ ▶ son. Masqué quand le panneau est éteint ; `padding-bottom` du body réservé avec `env(safe-area-inset-bottom)`.
- REC et ERASE : appui court (< 300 ms) = verrouillé, appui long = momentané, appui pendant l'état actif = arrêt. L'état vient du moteur, jamais d'un drapeau local : touche, dock et raccourcis R / E restent synchrones. Le count-in devient clic → armé (lampe clignotante) → départ au tour suivant → clic pour arrêter.
- Le conseil clavier `.tip` est masqué sur `(hover:none) and (pointer:coarse)`.
- Libellés : « Rec » et « Erase » sans « · hold » ; « Save WAV » / « Save mix ».
