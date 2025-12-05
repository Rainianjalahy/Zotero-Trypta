# Zotero Systematic Review Toolkit

Extension Zotero 7 ajoutant un menu **Revue systématique** pour créer en un clic la structure de travail d'un projet.

## Fonctionnalités
- Menu « Revue systématique » dans le menu Outils avec l'action « Nouveau projet ».
- Création automatique d'une collection racine nommée `Projet revue systématique – AAAA-MM-JJ`.
- Génération des sous-collections : Import brut, Déduplication, Criblage titres résumés, Texte intégral, Inclus final, Exclus final.
- Ajout des étiquettes standardisées `SR_TA_INCLUDE`, `SR_TA_EXCLUDE`, `SR_TA_MAYBE`.

## Installation
1. Construire l'extension :
   ```bash
   npm install
   npm run build
   ```
2. Dans Zotero 7, ouvrir le menu **Outils > Modules complémentaires** puis utiliser « Installer le module depuis un fichier… » pour charger l'archive `.xpi` générée dans `.scaffold/build`.
3. Redémarrer Zotero si nécessaire.

## Développement
- Lancer le rechargement automatique pendant le développement :
  ```bash
  npm install
  npm start
  ```
- Le code principal de l'extension se trouve dans `src/modules/systematicReview.ts` et `src/hooks.ts`.

## Licence
AGPL-3.0-or-later
