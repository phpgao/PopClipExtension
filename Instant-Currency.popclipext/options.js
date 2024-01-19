const currencyData = require("./currencies.json");

const currencyShortNames = Object.keys(currencyData);
const currencyList = currencyShortNames.map(key => ({
    shortName: key,
    description: `${key}/${currencyData[key].desc}`,
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

const createOption = (currencyOption) => ({
    identifier: currencyOption.name,
    label: currencyOption,
    type: "multiple",
    valueLabels: currencyList.map((item) => currencyData[item.shortName].symbol + " " + item.description),
    values: currencyShortNames,
    defaultValue: currencyOption.default,
});

const options = optionList.map(createOption);

options.push({
    identifier: "apiName",
    label: {en: "Which api?"},
    type: "multiple",
    valueLabels: ["frankfurter", "openexchangerates", 'no more'],
    values: ["frankfurter", "openexchangerates", 'noMore'],
    defaultValue: "frankfurter",
});

options.push({
    identifier: "tokenString",
    label: {en: "token"},
    type: "string",
    defaultValue: "",
});

module.exports = {
    options,
    currencyShortNames,
    currencyData,
};