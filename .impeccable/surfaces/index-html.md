---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — index.html (l'instrument)

Scope : la seule surface du produit, mode **Operate**. Le visiteur joue : pad XY, choix du son, gamme/clé/tempo, gate arp, boucleur à quatre banques, session (enregistrement de la performance, entrée MIDI).
Audience : Philippe (jam, souris et tactile à égalité, clavier d'ordinateur ou contrôleur MIDI) et des inconnus sans manuel. Tâche : sortir un son en un geste, une boucle en une minute.
Contenu : données Korg exactes (100 programmes, 32 gammes, 50 motifs). Contraintes : deux fichiers sans build, audio après geste, un seul pointeur sur le pad, marge inactive 4 %.
Résolu depuis : MIDI (notes → pad, CC 1 / 74 → Y, program change), export WAV par banque et mix, enregistrement de la performance, clavier d'ordinateur comme notes. Hébergement public : GitHub Pages, dépôt phmatray/glisse.

## Direction contract

THESIS: Chaque groupe de commandes porte sa couleur de signal sur charbon, comme une façade TR-808 : le pad est une section de panneau parmi les autres, et l'état de chaque groupe se lit sans mémoire. Refuse : l'appli synthé sombre à un seul accent néon, boutons arrondis lumineux et réglages cachés derrière un mode.

OWN-WORLD: Charbon thermolaqué (#262626 / bande panneau #303030), légendes sérigraphiées en petites capitales espacées, boîtes de groupe filetées avec onglet-titre. Cinq couleurs de signal, une par groupe : orange SOUND, rouge LOOP, jaune GATE ARP, crème SCALE·KEY·TEMPO, vert SESSION. Boutons caoutchouc rectangulaires à LED rouge ; pad caoutchouc noir mat avec les colonnes de gamme imprimées et une bague orange sous le doigt. Une seule sans condensée (Barlow) pour tout ; chiffres tabulaires.

STORY: Le visiteur voit un panneau, pas une page : un grand pad et cinq groupes nommés. Il touche, ça sonne, les colonnes s'allument sur la note. Il lit LOOP en rouge, clique REC, joue, clique à nouveau, la boucle tourne et le compteur de temps bat (l'appui long reste momentané comme sur l'appareil). Sur téléphone, REC et PLAY restent sous le pouce dans le dock fixe en bas d'écran. Il feuillette les sons dans le groupe orange.

FIRST VIEWPORT: Bandeau fin : wordmark GLISSE à gauche, interrupteur POWER à droite. Dessous, pad carré à gauche (~55 % de la largeur) avec ses colonnes de gamme et les libellés X/Y imprimés sur le cadre ; colonne droite empilant SOUND (afficheur LED orange id + nom, ◀ ▶, liste par catégorie), SCALE·KEY·TEMPO (trois sélecteurs + TAP), GATE ARP (interrupteur, motif, barre du motif avec tête de lecture), LOOP (banques A–D, REC clic-ou-maintien, PLAY/STOP, longueur, FIX/CANCEL/CLEAR/ERASE, couches saved/new, mètre de temps à LED, mute, niveau, Save WAV / Save mix), SESSION en vert (Rec perf, entrée MIDI, prises). Mobile : pad pleine largeur en haut, groupes empilés dessous dans le même ordre, dock transport fixe en bas (REC, PLAY, position, ◀ ▶ son). Action principale = le pad lui-même.

FORM: Panneau de groovebox, candidat 1 de ma liste (carte IMPECCABLE’S PICK, choisie par l'utilisateur), seed 563fc3dc. Interaction signature : les colonnes de gamme du pad s'allument sous le doigt, la ligne Y suit avec sa valeur, et le motif gate défile en temps réel ; motion 150 ms, LED instantanées.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
