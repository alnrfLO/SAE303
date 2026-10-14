# SAÉ 303 · Baromètre du changement climatique par département

Carte interactive de la France qui permet d'explorer, département par département, les réponses au **Baromètre des représentations sociales du changement climatique** (données ouvertes de data.gouv.fr).

Projet réalisé dans le cadre de la **SAÉ 303** du BUT Métiers du Multimédia et de l'Internet (MMI), IUT de Bobigny, Université Sorbonne Paris Nord.

## Fonctionnalités

- **Carte SVG interactive** des départements français : un clic sur un département affiche ses données.
- **Recherche avec autocomplétion** par nom ou par numéro de département.
- **4 graphiques générés avec D3.js** pour chaque département :
  - Genre (graphique en anneau)
  - Âge (histogramme)
  - Type d'habitat (camembert)
  - Statut locataire / propriétaire (camembert)
- **Mise en évidence** du département sélectionné sur la carte.
- **Fond étoilé animé** en canvas.
- Message de chargement pendant la lecture du CSV (environ 5,7 Mo).

## Technologies

- HTML5 / CSS3
- JavaScript (vanilla)
- [D3.js v4](https://d3js.org/) pour le chargement du CSV et les graphiques
- Canvas API pour l'animation du fond

## Structure

```text
├── index.html                  # Page principale + carte SVG
├── franceDepartmentsHigh.svg   # Carte des départements
├── css/
│   └── style.css
├── js/
│   ├── script.js               # Chargement des données, graphiques, recherche, interactions
│   └── etoile.js               # Animation du fond étoilé
├── data/
│   └── barometre-representations-sociales-du-changement-climatique.csv
└── Pages/
    └── mentionsLegales.html
```

## Lancer le projet

Le CSV est chargé avec `d3.csv()`. Si tu ouvres `index.html` directement en `file://`, le navigateur bloque le chargement : il faut passer par un serveur local.

```bash
# Avec Python
python -m http.server 8000
```

Ensuite, ouvre `http://localhost:8000`.

Autres options : l'extension **Live Server** de VS Code, ou `npx serve`.

## Données

- **Source :** [data.gouv.fr](https://www.data.gouv.fr/), Baromètre des représentations sociales du changement climatique
- **Licence :** Licence Ouverte / Open Licence (Etalab)
- Les départements Corse-du-Sud et Haute-Corse sont regroupés sous « Corse » pour correspondre à la carte.

## Utilisation de l'IA

Certaines parties ont été faites avec l'aide d'une IA. Le détail est indiqué en commentaire dans le code :
- la fonction du graphique en anneau (`renderDonut`) ;
- le message de chargement ;
- le choix des colonnes du CSV à exploiter (le code lui-même est fait à la main) ;
- la base des mentions légales.

## Auteur

**Rafael Antunes Oliveira**, étudiant en BUT MMI, parcours Développement Web
[Portfolio](https://rafatns.vercel.app) · [LinkedIn](https://linkedin.com/in/rafatns) · [GitHub](https://github.com/alnrfLO)

---

Projet pédagogique, sans but commercial.
