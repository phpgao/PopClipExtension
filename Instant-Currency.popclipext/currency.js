"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.options = exports.action = void 0;
const axios = require("axios");
const currencies = require("./currencies.json");

const fetchExchangeRates = async (baseCurrency) => {
    const response = await axios.get(
        `https://api.frankfurter.app/latest?from=${baseCurrency}`
    );
    return response.data;
};

const convert = async (amount, convertOptions) => {
    if (amount <= 0) {
        popclip.showFailure();
        return "";
    }
    const exchangeData = await fetchExchangeRates(convertOptions.base);
    const exchangeRates = exchangeData.rates;
    const selectedCurrencies = Object.values(convertOptions).filter(
        (currency) => currency && currency !== convertOptions.base
    );

    if (!selectedCurrencies.length) {
        popclip.showFailure();
        return "";
    }

    const conversionOutput = [...new Set(selectedCurrencies)]
        .map((currency) => {
            if (exchangeRates[currency] && exchangeRates[currency] !== 0) {
                return `${currency}=${(amount / exchangeRates[currency]).toFixed(2)}${convertOptions.base}`;
            } else {
                return `${currency}=N/A`;
            }
        })
        .join("\n");

    return `\n${conversionOutput}\nDate: ${exchangeData.date}\n`;
};

exports.action = async (input, options) => convert(input.text, options);

const currencyList = Object.entries(currencies).map(([key, value]) => ({
    short_name: key,
    description: `${key}/${value}`,
}));

const optionList = [
    {name: "base", en: "Base Currency", "zh-Hans": "基础货币为", default: "CNY"},
    {name: "first", en: "1st Currency", "zh-Hans": "第1种货币", default: "USD"},
    {name: "second", en: "2nd Currency", "zh-Hans": "第2种货币", default: "HKD"},
    {name: "third", en: "3rd Currency", "zh-Hans": "第3种货币", default: "JPY"},
    {name: "fourth", en: "4th Currency", "zh-Hans": "第4种货币", default: "THB"},
    {name: "fifth", en: "5th Currency", "zh-Hans": "第5种货币", default: "GBP"},
    {name: "sixth", en: "6th Currency", "zh-Hans": "第6种货币", default: "KRW"},
];

exports.options = optionList.map((option) => ({
    identifier: option.name,
    label: option,
    type: "multiple",
    valueLabels: currencyList.map((item) => item.description),
    values: currencyList.map((item) => item.short_name),
    defaultValue: option.default,
}));