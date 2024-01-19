"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.options = exports.action = void 0;
const utils = require("./utils.js");
const options = require("./options.js");

async function convertUsingFrankfurter(convertOptions, amount) {
    const selectedCurrencies = utils.getUniqueCurrencies(
        convertOptions,
        options.currencyShortNames
    );

    if (!selectedCurrencies.length) {
        return "Empty selected Currencies";
    }

    const exchangeData = await utils.fetchExchangeRates(convertOptions.base, );
    const exchangeRates = exchangeData.rates;

    const conversionOutput = utils.formatConversionOutput(
        exchangeRates,
        amount,
        convertOptions.base,
        selectedCurrencies,
    );

    return `\n${conversionOutput}\nDate: ${exchangeData.date}\n`;
};

async function convertUsingOpenexchangerates(convertOptions, amount) {
    if (convertOptions.tokenString === "") {
        return "Empty token";
    }

    const selectedCurrencies = utils.getUniqueCurrencies(
        convertOptions,
        options.currencyShortNames
    );

    if (!selectedCurrencies.length) {
        return "Empty selected Currencies";
    }

    const response = await utils.fetchOpenExchangeRates(
        convertOptions,
        selectedCurrencies
    );
    const formattedTime = utils.formatTimestamp(
        Math.floor(response.timestamp)
    );

    const exchangeRates = response.rates;
    var basePrice = exchangeRates[convertOptions.base];
    if (response.base !== convertOptions.base) {
        for (let key in exchangeRates) {
            exchangeRates[key] = exchangeRates[key] / basePrice;
        }
    }
    
    const conversionOutput = utils.formatConversionOutput(
        exchangeRates,
        amount,
        convertOptions.base,
        selectedCurrencies,
    );

    return `\n${conversionOutput}\nDate: ${formattedTime}\n`;
}

const convert = async (amount, convertOptions) => {
    if (amount <= 0) {
        return "0?";
    }
    switch (convertOptions.apiName) {
        case "frankfurter":
            return await convertUsingFrankfurter(convertOptions, amount);
        case "openexchangerates":
            return await convertUsingOpenexchangerates(convertOptions, amount);
        default:
            return `???`;
    }
};

exports.action = async (input, options) => convert(input.text, options);

exports.options = options.options;