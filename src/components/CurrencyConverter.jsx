import { useEffect, useState } from "react";
import CurrencyDropdown from "./CurrencyDropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(10);

  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");

  const [convertedAmount, setConvertedAmount] = useState(null);
  const [converting, setConverting] = useState(false);
  const [favs, setFavs] = useState(
    JSON.parse(localStorage.getItem("favs")) || ["INR", "EUR"]
  );

  const host = "api.frankfurter.app";
  // Coverted Currencies -> https://api.frankfurter.app/latest?amount=1&from=USD&to=INR
  // Currencies -> https://api.frankfurter.app/currencies

  const fetchCurrencies = async () => {
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(Object.keys(data));
    } catch (error) {
      console.log("Error while fetching: ", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const currencyConverter = async () => {
    if (!amount) return;
    setConverting(true);
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency] + " " + toCurrency);
    } catch (error) {
      console.log("Error while fetching: ", error);
    } finally {
      setConverting(false);
    }
  };

  const handleFav = (currency) => {
    let updatedFavorites = [...favs];
    if (favs.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }
    setFavs(updatedFavorites);
    localStorage.setItem("favs", JSON.stringify(updatedFavorites));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-2xl w-[480px] mx-auto my-5 p-5 bg-gray-200 rounded-lg shadow-xl">
      <h2 className="mb-5 text-2xl font-semibold text-gray-700">
        Currency Converter
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <CurrencyDropdown
          favorites={favs}
          currencies={currencies}
          title="From:"
          handleFav={handleFav}
          currency={fromCurrency}
          setCurrency={setFromCurrency}
        />
        <div className="flex justify-center -mb-5 sm:mb-0">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-400"
          >
            <HiArrowsRightLeft className="text-xl text-gray-700" />
          </button>
        </div>
        <CurrencyDropdown
          favorites={favs}
          currencies={currencies}
          title="To:"
          handleFav={handleFav}
          currency={toCurrency}
          setCurrency={setToCurrency}
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
        />
        <div className="flex justify-between mt-6">
          {convertedAmount && (
            <div className="mt-4 text-lg font-medium text-start text-green-500">
              Converted Amount: {convertedAmount}
            </div>
          )}
          <button
            className={`px-5 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
            focus:ring-offset-2 ${converting ? "animate-pulse" : ""}`}
            onClick={currencyConverter}
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
