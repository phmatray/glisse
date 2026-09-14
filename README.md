# Glisse — synthé de phrases au pad XY (Web Audio)

Recréation, inspirée du Korg Kaossilator KO-1 (2007), dans le navigateur. « Kaossilator » est une marque Korg : le projet s'appelle **Glisse** (nom de travail). Deux fichiers, zéro dépendance :

- `engine.js` — moteur (100 programmes, 31 gammes + OFF, 50 motifs gate arp, boucleur, transport). Aucune référence au DOM.
- `index.html` — l'instrument : pad XY avec colonnes de gamme, quatre groupes colorés (Sound, Scale·Key·Tempo, Gate arp, Loop), tactile et souris.

Servir le dossier (`python3 -m http.server 8765`), ouvrir `http://localhost:8765/`, cliquer pour allumer.
L'ouverture directe en `file://` n'a pas été vérifiée (l'AudioWorklet est chargé depuis une URL blob).

`index.html?test` lance l'auto-test (115 vérifications) ; `node selftest.mjs "http://localhost:8765/index.html?test&auto"` le fait en Chrome headless.

## Ce qui est reproduit

| Fonction KO-1 | Ici |
|---|---|
| 100 programmes (L/a/b/c/S/d/P), axes X/Y du manuel | oui — timbres synthétisés (approximations, pas les samples Korg) |
| 31 gammes + OFF, clé C3…C5 | fiche Korg transcrite |
| Gate arp G.00–G.49 (1, 3/4, 5/4, 6/4, 2, 4 beats, swing) | extrait pixel par pixel de la fiche |
| Boucleur 1/16…8 beats, overdub, Fix / Cancel / Clear, Erase (REC+SCALE), règle BPM<37.5 → ÷4, <75 → ÷2 | AudioWorklet, deux couches (saved/new) |
| BPM 20–300, tap tempo | oui |
| Bords du pad inactifs | marge 4 % |

## Ajouts web (au-delà du KO-1)

- 4 banques de boucles A–D (longueur, mute, niveau par banque), export WAV d'une banque ou du mix.
- Enregistrement de la performance (MediaRecorder, webm/opus ou m4a selon le navigateur).
- Métronome (accent au début de boucle) et count-in : REC démarre au prochain tour de boucle.
- REC et ERASE : clic court = on / off (verrouillé), appui long = momentané comme sur l'appareil. Touches R / E identiques.
- Sur mobile, une barre de transport fixe en bas (REC, PLAY, position, son précédent / suivant) reste sous le pouce pendant qu'on joue le pad.
- Nom de la note sous le doigt, LATCH pour tenir un son.
- Clavier d'ordinateur : A…L ; ' = degrés de la gamme, Z/X octave, ↑↓ = Y. Web MIDI : notes, CC 1/74 = Y, program change = son.

Les pas des 10 drum patterns (P.90–P.99) ne sont pas documentés par Korg : ils sont inventés.

## VST ?

Une page Web Audio ne se charge pas comme VST3/AU. Pistes :
1. Dès maintenant : router l'onglet vers la DAW avec un périphérique audio virtuel (BlackHole sur macOS).
2. Web Audio Modules (WAM 2.0) pour les DAW web — le moteur est déjà sans DOM, il reste à écrire le wrapper.
3. Vrai plugin : porter le DSP en Cmajor ou JUCE 8 (UI HTML réutilisable en WebView).
