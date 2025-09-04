import dayjs from "dayjs";

export const formatNumber = (value, euro = true) => {
  const number = Number(value);

  if (isNaN(number)) return "0.00";

  const [integer, decimal] = number.toFixed(2).split(".");

  const reversedNumArray = integer.split("").reverse();
  const numberWithDots = [];

  for (let i = 0; i < reversedNumArray.length; i++) {
    if (i > 0 && i % 3 === 0) {
      numberWithDots.push(",");
    }
    numberWithDots.push(reversedNumArray[i]);
  }

  const formattedInteger = numberWithDots.reverse().join("");

  if (euro) return `${formattedInteger}.${decimal} €`;
  if (!euro) return `${formattedInteger}.${decimal}`;
};

export const getAllTransactions = () => {
  return JSON.parse(localStorage.getItem("cashFlow")) || [];
};

export const getIncomes = () => {
  return JSON.parse(localStorage.getItem("cashFlow"))
    ? JSON.parse(localStorage.getItem("cashFlow")).filter(
        (item) => item.type === "income"
      ) || []
    : [];
};

export const getExpenses = () => {
  return JSON.parse(localStorage.getItem("cashFlow"))
    ? JSON.parse(localStorage.getItem("cashFlow")).filter(
        (item) => item.type === "expense"
      ) || []
    : [];
};

export const getIncomeDates = () => {
  return getIncomes().map((item) => {
    const utc_days = Math.floor(item.date - 25569);
    const utc_value = utc_days * 86400;
    return dayjs(utc_value * 1000).format("DD/MM/YYYY");
  });
};

export const getIncomeAmount = () => {
  return getIncomes().map((item) => item.amount);
};

export const getBalance = () => {
  return (
    getIncomes().reduce((sum, val) => sum + Number(val.amount), 0) -
    getExpenses().reduce((sum, val) => sum + Number(val.amount), 0)
  );
};