# 🎫 Minecraft Ticket Bot

Bot Discord de gestion de tickets pour serveur Minecraft — **discord.js v14**

---

## ✨ Fonctionnalités

### 📂 Catégories de tickets
| Catégorie | Sous-types | Formulaire |
|-----------|-----------|------------|
| 📋 Recrutement | Dev / Staff / Autre 
| 🐛 Bug | 
| 🆘 Soutien | 
| ❓ Questions | 
| 📬 Autres | 

### ⚡ Commandes
| Commande | Description |
|----------|-------------|
| `/setup-tickets` | Envoie le panneau d'ouverture de tickets (Admin) |
| `/close` | Ferme le ticket → déplace en catégorie **Fermés** |
| `/save-candid` | Déplace la candidature en catégorie **RC (candidatures retenues)** |
| `/later` | Met le ticket en attente + poste un embed dans **#on-a-retenu** |
| `/give-soutien` |attribue role si conditions remplies |

### 📋 Logs automatiques
Chaque action est loggée dans le salon `#logs` :
- Ouverture de ticket
- Fermeture de ticket
- Réouverture
- Suppression
- Candidature retenue
- Mise en attente

### 🎛️ Boutons dans les tickets fermés
- 🔓 **Réouvrir** → Replace le ticket dans sa catégorie d'origine
- 🗑️ **Supprimer** → Supprime le salon définitivement

---

## 🚀 Installation

### 1. Prérequis
- [Node.js](https://nodejs.org/) **v18 ou supérieur**
- Un bot Discord créé sur le [Developer Portal](https://discord.com/developers/applications)

### 2. Installer les dépendances
```bash
cd minecraft-ticket-bot
npm install
```

### 3. Configurer le fichier `.env`
Copie `.env.example` en `.env` :
```bash
cp .env.example .env
```

Puis remplis toutes les valeurs :

```env
DISCORD_TOKEN=ton_token_ici
CLIENT_ID=id_application_bot
GUILD_ID=id_ton_serveur

# Catégories (crée-les dans Discord d'abord !)
CATEGORY_RECRUTEMENT=id_categorie
CATEGORY_BUG=id_categorie
CATEGORY_SOUTIEN=id_categorie
CATEGORY_QUESTIONS=id_categorie
CATEGORY_AUTRES=id_categorie
CATEGORY_FERMES=id_categorie
CATEGORY_CANDIDATURES=id_categorie
CATEGORY_ATTENTE=id_categorie

# Salons
CHANNEL_LOGS=id_salon_logs
CHANNEL_ON_A_RETENU=id_salon_on_a_retenu
CHANNEL_OPEN_TICKET=id_salon_tickets

# Rôle staff
ROLE_STAFF=id_role_staff

ROLE_SOUTIEN=role soutien
SOUTIEN_STATUS_TEXT=discord.gg/aotsmp
RCON_HOST=ip serveur
RCON_PORT=port serveur
RCON_PASSWORD=ton_mdp_rcon
```

### 4. Récupérer les IDs Discord
Active le **Mode développeur** dans les paramètres Discord :  
`Paramètres → Avancé → Mode développeur`

Ensuite, fais **clic droit** sur :
- Ton serveur → *Copier l'ID du serveur* → `GUILD_ID`
- Chaque catégorie → *Copier l'ID* → `CATEGORY_*`
- Chaque salon → *Copier l'ID* → `CHANNEL_*`
- Le rôle staff → *Copier l'ID* → `ROLE_STAFF`

Pour `CLIENT_ID` : Discord Developer Portal → ton app → onglet *General Information* → *Application ID*

### 5. Permissions du bot
Sur le Developer Portal → *Bot* → **Privileged Gateway Intents** :
- ✅ Server Members Intent
- ✅ Message Content Intent

Permissions requises pour le bot sur ton serveur :
- ✅ Gérer les salons
- ✅ Gérer les rôles
- ✅ Voir les salons
- ✅ Envoyer des messages
- ✅ Intégrer des liens
- ✅ Joindre des fichiers
- ✅ Lire l'historique des messages
- ✅ Gérer les messages

### 6. Créer les catégories dans Discord
Crée **8 catégories** dans ton serveur :
```
📋 Recrutement
🐛 Bug
🆘 Soutien
❓ Questions
📬 Autres
🔒 Fermés
💾 Candidatures Retenues
⏳ En Attente
```

### 7. Déployer les commandes slash
```bash
npm run deploy
```
> Cette commande enregistre les slash commands sur ton serveur. A faire une seule fois (ou si tu ajoutes des commandes).

### 8. Lancer le bot
```bash
npm start
```

### 9. Afficher le panneau de tickets
Dans ton salon de tickets, tape :
```
/setup-tickets
```

---

## 📁 Structure du projet

```
minecraft-ticket-bot/
├── src/
│   ├── index.js                  # Point d'entrée du bot
│   ├── config.js                 # Configuration centralisée
│   ├── deploy-commands.js        # Script déploiement slash commands
│   ├── commands/
│   │   ├── index.js              # Définition des slash commands
│   │   └── handler.js            # Logique des commandes
│   ├── events/
│   │   └── interactionCreate.js  # Gestion de toutes les interactions
│   └── utils/
│       ├── forms.js              # Définition des formulaires (questions)
│       ├── logger.js             # Système de logs Discord
│       ├── rcon.js             
│       ├── soutienManager.js            
│       └── ticketManager.js      # Gestion des tickets (création, déplacement)
├── .env                          # Variables d'environnement (à créer)
├── .env.example                  # Modèle de configuration
└── package.json
```

---

## 🔧 Personnalisation

### Modifier les questions d'un formulaire
Édite `src/utils/forms.js`. Chaque ticket peut avoir **jusqu'à 5 questions**.

```js
// Exemple : ajouter une question à "Recrutement Dev"
recrutement_dev: {
  fields: [
    // ... questions existantes
    {
      customId: 'ma_question',
      label: 'Ma nouvelle question',
      style: TextInputStyle.Short, // ou Paragraph
      placeholder: 'Indication...',
      required: true,
      maxLength: 200,
    },
  ],
},
```

### Modifier les couleurs
Édite les valeurs hex dans `src/config.js` → `colors`.

---

## ❓ Problèmes fréquents

| Erreur | Solution |
|--------|----------|
| `Missing Access` | Le bot n'a pas les permissions sur la catégorie. Vérifie les perms. |
| `Unknown Channel` | L'ID de catégorie dans `.env` est incorrect. |
| Les commandes n'apparaissent pas | Relance `npm run deploy` et attends 1-2 min. |
| Le bot ne voit pas les catégories | Vérifie que le bot a le rôle avec accès aux catégories. |

---

## 📜 Licence
MIT — Libre d'utilisation et de modification.
