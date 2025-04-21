// template-pass.js (ou directement dans votre code serveur)

const passTemplate = {
  formatVersion: 1,
  // --- À CONFIGURER IMPÉRATIVEMENT ---
//  passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID, // Ex: "pass.com.votreentreprise.vcard" - Mettez via variable d'environnement
//  teamIdentifier: process.env.APPLE_TEAM_ID,       // Votre Team ID Apple - Mettez via variable d'environnement
  passTypeIdentifier: 'pass.com.e-coucou.vcard', // Ex: "pass.com.votreentreprise.vcard" - Mettez via variable d'environnement
  teamIdentifier: 'ABCD1234XY',       // Votre Team ID Apple - Mettez via variable d'environnement

  // --- Informations générales (peuvent être personnalisées) ---
  organizationName: "eCoucou",
  description: "Carte de Visite Numérique",
  logoText: "Contact",

  // --- Apparence (personnalisable) ---
  foregroundColor: "rgb(255, 255, 255)",
  backgroundColor: "rgb(60, 60, 60)",
  labelColor: "rgb(200, 200, 200)",

  // --- Code-barres (sera rempli dynamiquement) ---
  barcode: {
    format: "PKBarcodeFormatQR",
    messageEncoding: "utf-8",
    // 'message' sera ajouté dynamiquement avec les données vCard
    // 'altText' peut être ajouté dynamiquement
  },

  // --- Structure du Pass (ici type 'generic', personnalisable) ---
  generic: {
    primaryFields: [
      {
        key: "nom", // Clé interne
        label: "Nom", // Étiquette affichée
        // 'value' sera ajouté dynamiquement
      }
    ],
    secondaryFields: [
       {
        key: "societe",
        label: "Société",
        // 'value' sera ajouté dynamiquement
      }
    ],
     auxiliaryFields: [
      {
        key: "info",
        label: "Scannez le QR Code",
        value: "Pour ajouter aux contacts"
      }
    ],
    // backFields: [ ... ] // Pour le verso du pass
  },

  // --- Données spécifiques (sera rempli dynamiquement) ---
  serialNumber: "" // Sera généré dynamiquement
  // Vous pourriez ajouter d'autres champs comme 'webServiceURL', 'authenticationToken' pour les mises à jour de pass
};

module.exports = passTemplate; // Exporte le modèle si dans un fichier séparé