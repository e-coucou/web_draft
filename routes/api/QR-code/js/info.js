function eCoucou() {
    return {version: 2.01, maj:'avril/25', release: 0};
}

function Clair () {
    return {
        Fond: '#F8F9F9',
        Texte: '#2C3E50',
        Vert_P : '#2ECC71',
        Vert_S : '#A3E4D7',
        Accent : '#1A7940'
    }
};

function Fonce() {
    return {
        Fond: '#1C1C1C',
        Texte: '#F8F9F9',
        Vert_P : '#2ECC71',
        Vert_S : '#58D68D',
        Accent : '#A3E4D7'
    }
}
function Terms() {
    const termsAndConditions = `
**Terms and Conditions**

This software and the associated map are provided under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions of the license.

**Disclaimer of Liability:**  
The user is solely responsible for the data, content, and information displayed, entered, or processed through this software and the associated map.  
Under no circumstances shall the author of this software be held liable for any damages, losses, or consequences arising from its use or the information it contains.

By using this software, you acknowledge and agree to these terms.

---

**Conditions Générales d’Utilisation**

Ce logiciel et la carte associée sont fournis sous la [licence MIT](https://opensource.org/licenses/MIT). Vous êtes libre d'utiliser, copier, modifier, fusionner, publier, distribuer, sous-licencier et/ou vendre des copies du logiciel, sous réserve des conditions de la licence.

**Clause de non-responsabilité :**  
L'utilisateur est seul responsable des données, contenus et informations affichées, saisies ou traitées via ce logiciel et la carte associée.  
En aucun cas l’auteur de ce logiciel ne pourra être tenu responsable des dommages, pertes ou conséquences résultant de son utilisation ou des informations qu’il contient.

En utilisant ce logiciel, vous reconnaissez et acceptez ces conditions.
`;
    return termsAndConditions;
}

module.exports = {eCoucou, Clair, Fonce, Terms};