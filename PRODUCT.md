# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Philippe (auteur), qui jamme chez lui, au casque ou sur enceintes, sur ordinateur (souris/trackpad, raccourcis clavier) autant que sur écran tactile (iPad, téléphone). Les deux appareils comptent à égalité.
- Des visiteurs inconnus qui arrivent sur la démo web sans manuel : ils doivent comprendre seuls, en quelques secondes, qu'on joue en glissant sur le pad et que le reste (programme, gamme, boucleur) se découvre ensuite.

## Product Purpose

Un instrument web qui recrée tout ce que le Korg Kaossilator KO-1 (2007) savait faire : 100 programmes joués sur un pad XY (X = note ou paramètre, Y = modulation), 31 gammes + OFF avec choix de la clé, tempo 20–300 BPM avec tap, gate arpeggiator à 50 motifs, boucleur audio de 1/16 à 8 temps avec overdub, Fix / Cancel / Clear et effacement. Succès : un nouveau venu sort un son en un geste et une boucle en une minute ; Philippe y revient pour jouer, pas pour se battre avec l'interface.

## Positioning

Instrument inspiré et modernisé, pas une réplique. Les 100 sons, les gammes, le boucleur et le gate arp restent ceux du KO-1 (données transcrites du manuel et des fiches Korg), mais l'interface expose tout directement et clairement au lieu des gestes chordés de l'appareil (maintenir REC + tourner la molette, REC + SCALE…). Ce qu'un clone visuel de l'appareil ne peut pas offrir : lisibilité immédiate des états (gamme, clé, motif, longueur, couche de boucle) et une prise en main sans manuel.

## Operating Context

- Ouvert dans un navigateur, en local ou hébergé en statique ; l'audio ne démarre qu'après un geste utilisateur (politique autoplay).
- Le pad se joue au doigt (tactile) ou à la souris ; un seul pointeur à la fois, marge extérieure inactive comme sur l'appareil.
- Le boucleur tourne en continu sur le transport ; on enregistre en maintenant, on relâche pour écouter. Les gestes clavier (R, Espace, S, A, T, flèches) existent déjà.

## Capabilities and Constraints

- Deux fichiers sans dépendance : `engine.js` (moteur Web Audio, sans DOM, pensé pour un futur portage plugin) et `index.html` (interface). Pas de framework, pas de build.
- Les timbres sont des approximations synthétisées des presets Korg ; les pas des drum patterns P.90–P.99 sont inventés (Korg ne les documente pas). Ne pas présenter ces sons comme les originaux.
- Terminologie Korg conservée : identifiants de programme (L.00 … P.99), catégories LEAD / ACOUSTIC / BASS / CHORD / SE / DRUM / DRUM PATTERN, abréviations de gammes (ION, DOR…), motifs G.00–G.49, Fix / Cancel / Clear.
- Contrainte plateforme : les boucles de feedback Web Audio ont un plancher de 128 échantillons (S.62, S.77 plafonnent vers 375 Hz).
- Hébergement public : GitHub Pages depuis `phmatray/glisse`. Export WAV et MIDI livrés le 2026-09-14.

## Brand Commitments

- Nom : **Glisse** (proposé et retenu le 2026-09-14, dépôt public `phmatray/glisse`). « Kaossilator » est une marque Korg et ne doit pas nommer le projet ; la mention « inspiré du Korg Kaossilator KO-1 » reste en pied de page à titre de référence.

## Evidence on Hand

- Manuel KO-1 et fiches Korg (gammes, motifs gate arp) transcrits dans `engine.js` ; auto-test de 125 vérifications (`index.html?test`, `selftest.mjs`).
- Aucun logo, aucun visuel de marque, aucune capture d'écran de l'original à réutiliser. Ne pas fabriquer de témoignages ni de claims commerciaux.

## Product Principles

1. Un geste, un son : le pad est l'instrument, tout le reste lui est subordonné.
2. Chaque état se lit sans mémoire : programme, gamme, clé, tempo, motif, état de la boucle sont toujours visibles, jamais cachés derrière un mode.
3. Fidèle au fond, libre sur la forme : données Korg exactes, interface qui n'imite pas la façade.
4. Tactile et souris à égalité : cibles larges, aucune interaction qui n'existe qu'au survol.
5. Compréhensible sans manuel : un inconnu doit sortir un son en un geste.
