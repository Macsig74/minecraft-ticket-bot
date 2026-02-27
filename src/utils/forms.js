

const { TextInputStyle } = require('discord.js');

module.exports = {

  
  recrutement_dev: {
    label: '📋 Recrutement — Développeur',
    color: 0x5865F2,
    emoji: '💻',
    fields: [
      {
        customId: 'pseudo',
        label: 'Ton pseudo Minecraft',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Notch',
        required: true,
        maxLength: 32,
      },
      {
        customId: 'age_langages',
        label: 'Ton âge & langages maîtrisés',
        style: TextInputStyle.Short,
        placeholder: 'Ex: 20 ans — Java, Python, JavaScript',
        required: true,
        maxLength: 100,
      },
      {
        customId: 'realisations',
        label: 'Tes réalisations passées / portfolio',
        style: TextInputStyle.Paragraph,
        placeholder: 'Décris tes projets, lien GitHub, etc.',
        required: true,
        maxLength: 1000,
      },
      {
        customId: 'disponibilites',
        label: 'Disponibilités par semaine',
        style: TextInputStyle.Short,
        placeholder: 'Ex: 10h/semaine, soirs en semaine + week-end',
        required: true,
        maxLength: 200,
      },
      {
        customId: 'motivation',
        label: 'Pourquoi veux-tu nous rejoindre ?',
        style: TextInputStyle.Paragraph,
        placeholder: 'Explique ta motivation...',
        required: true,
        maxLength: 1000,
      },
    ],
  },

  
  recrutement_staff: {
    label: '📋 Recrutement — Staff',
    color: 0x57F287,
    emoji: '🛡️',
    fields: [
      {
        customId: 'pseudo',
        label: 'Ton pseudo Minecraft',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Notch',
        required: true,
        maxLength: 32,
      },
      {
        customId: 'age_experience',
        label: 'Ton âge & expérience staff',
        style: TextInputStyle.Short,
        placeholder: 'Ex: 18 ans — Modérateur 2 ans sur XYZ',
        required: true,
        maxLength: 150,
      },
      {
        customId: 'disponibilites',
        label: 'Disponibilités par semaine',
        style: TextInputStyle.Short,
        placeholder: 'Ex: 15h/semaine, tous les soirs',
        required: true,
        maxLength: 200,
      },
      {
        customId: 'points_forts',
        label: 'Tes points forts pour ce poste',
        style: TextInputStyle.Paragraph,
        placeholder: 'Patience, gestion des conflits, connaissance des règles...',
        required: true,
        maxLength: 800,
      },
      {
        customId: 'sanction_motivation',
        label: 'Déjà sanctionné ? & Pourquoi ce poste ?',
        style: TextInputStyle.Paragraph,
        placeholder: 'Oui/Non + détails si oui. Ensuite ta motivation.',
        required: true,
        maxLength: 800,
      },
    ],
  },

  
  recrutement_autre: {
    label: '📋 Recrutement — Autre poste',
    color: 0xFEE75C,
    emoji: '📝',
    fields: [
      {
        customId: 'pseudo',
        label: 'Ton pseudo Minecraft',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Notch',
        required: true,
        maxLength: 32,
      },
      {
        customId: 'age_poste',
        label: 'Ton âge & poste visé',
        style: TextInputStyle.Short,
        placeholder: 'Ex: 17 ans — Builder',
        required: true,
        maxLength: 100,
      },
      {
        customId: 'experiences',
        label: 'Tes expériences en lien avec ce poste',
        style: TextInputStyle.Paragraph,
        placeholder: 'Décris ce que tu as déjà fait...',
        required: true,
        maxLength: 800,
      },
      {
        customId: 'disponibilites',
        label: 'Disponibilités par semaine',
        style: TextInputStyle.Short,
        placeholder: 'Ex: 8h/semaine',
        required: true,
        maxLength: 150,
      },
      {
        customId: 'motivation',
        label: 'Ta motivation',
        style: TextInputStyle.Paragraph,
        placeholder: 'Pourquoi veux-tu rejoindre l\'équipe ?',
        required: true,
        maxLength: 800,
      },
    ],
  },

 
  bug: {
    label: '🐛 Rapport de bug',
    color: 0xED4245,
    emoji: '🐛',
    fields: [
      {
        customId: 'pseudo',
        label: 'Ton pseudo Minecraft',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Notch',
        required: true,
        maxLength: 32,
      },
      {
        customId: 'serveur_mode',
        label: 'Serveur / mode de jeu concerné',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Survie, SkyBlock, Factions...',
        required: true,
        maxLength: 100,
      },
      {
        customId: 'description',
        label: 'Description du bug',
        style: TextInputStyle.Paragraph,
        placeholder: 'Décris précisément ce qui se passe...',
        required: true,
        maxLength: 1000,
      },
      {
        customId: 'reproduction',
        label: 'Comment reproduire le bug ?',
        style: TextInputStyle.Paragraph,
        placeholder: 'Étapes pour reproduire le problème...',
        required: true,
        maxLength: 800,
      },
      {
        customId: 'quand_screenshot',
        label: 'Quand c\'est arrivé & screenshot dispo ?',
        style: TextInputStyle.Short,
        placeholder: 'Ex: 25/02/2025 à 20h — Oui (je l\'enverrai ici)',
        required: true,
        maxLength: 200,
      },
    ],
  },

  
  soutien: {
    label: '🆘 Demande de soutien',
    color: 0xEB459E,
    emoji: '🆘',
    fields: [
      {
        customId: 'pseudo',
        label: 'Ton pseudo Minecraft',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Notch',
        required: true,
        maxLength: 32,
      },
      {
        customId: 'demarches',
        label: 'Démarches déjà effectuées ?',
        style: TextInputStyle.Paragraph,
        placeholder: 'As-tu déjà mis le discord.gg/aotsmp en statut ?',
        required: false,
        maxLength: 500,
      },
    ],
  },


  questions: {
    label: '❓ Question',
    color: 0x00B0F4,
    emoji: '❓',
    fields: [
      {
        customId: 'pseudo',
        label: 'Ton pseudo Minecraft',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Notch',
        required: true,
        maxLength: 32,
      },
      {
        customId: 'question',
        label: 'Ta question',
        style: TextInputStyle.Paragraph,
        placeholder: 'Pose ta question clairement...',
        required: true,
        maxLength: 1000,
      },
      {
        customId: 'details',
        label: 'Plus de détails (facultatif)',
        style: TextInputStyle.Paragraph,
        placeholder: 'Contexte supplémentaire si nécessaire...',
        required: false,
        maxLength: 500,
      },
    ],
  },

 
  autres: {
    label: '📬 Autre demande',
    color: 0x99AAB5,
    emoji: '📬',
    fields: [
      {
        customId: 'pseudo',
        label: 'Ton pseudo Minecraft',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Notch',
        required: true,
        maxLength: 32,
      },
      {
        customId: 'sujet',
        label: 'Sujet de ta demande',
        style: TextInputStyle.Short,
        placeholder: 'Résumé en quelques mots...',
        required: true,
        maxLength: 150,
      },
      {
        customId: 'description',
        label: 'Description complète',
        style: TextInputStyle.Paragraph,
        placeholder: 'Explique ta demande en détail...',
        required: true,
        maxLength: 1000,
      },
      {
        customId: 'urgence',
        label: 'Urgence de la demande',
        style: TextInputStyle.Short,
        placeholder: 'Ex: Faible / Normale / Urgente',
        required: true,
        maxLength: 50,
      },
    ],
  },
};
