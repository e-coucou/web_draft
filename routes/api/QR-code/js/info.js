function eCoucou() {
    return {version: 1.6, maj:'avril/25', release: 0};
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

module.exports = {eCoucou, Clair, Fonce};