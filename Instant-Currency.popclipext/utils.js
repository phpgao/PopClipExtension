const axios = require("axios");
const options = require("./options.js");
const currencyData = options.currencyData;

exports.fetchExchangeRates = async (baseCurrency) => {
    const response = await axios.get(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
    return response.data;
};

exports.fetchOpenExchangeRates = async (convertOptions, selectedCurrencies) => {
    const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${convertOptions.tokenString}&base=USD&symbols=${selectedCurrencies.join(",")},${convertOptions.base}`);
    return response.data;
};

exports.getUniqueCurrencies = (convertOptions, shortName) => {
    return Object.values(convertOptions)
        .filter((currency) => currency && currency !== convertOptions.base && shortName.includes(currency));
};

exports.formatConversionOutput = (exchangeRates, amount, base, selectedCurrencies) => {
    return selectedCurrencies.map((currency) => {
        if (exchangeRates[currency] && exchangeRates[currency] !== 0) {
            return `${currency} ≈ ${(amount / exchangeRates[currency]).toFixed(2)}${currencyData[base].symbol}`;
        } else {
            return `${currency} = N/A`;
        }
    }).join("\n");
};

exports.formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};