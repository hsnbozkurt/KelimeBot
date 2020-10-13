const fetch = require('node-fetch')
const sozluk = require("sozlukjs");

sozluk.TDKDictionary.getMeaningData("sözlük1")
    .then(data => console.log(data));