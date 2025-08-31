export const formatNumber = (value) => {
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

  return `${formattedInteger}.${decimal} €`;
};
