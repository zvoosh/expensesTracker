import { useState } from "react";
import { read, utils } from "xlsx";
import { DataContext } from "./excel.ctx";
import dayjs from "dayjs";

export const DataProvider = ({ children }) => {
  const [sheetName, setSheetName] = useState("");
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("cashFlow")) || []
  );

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = read(e.target.result, { type: "binary" });
      const sheet = wb.SheetNames[0];
      const importedData = utils.sheet_to_json(wb.Sheets[sheet]);
      importedData.forEach((item, index) => {
        if (typeof item.date === "number") {
          const utc_days = Math.floor(item.date - 25569);
          const utc_value = utc_days * 86400;
          item.date = dayjs(utc_value * 1000);
        } else {
          item.date = dayjs(item.date);
        }
        item.index =
          (JSON.parse(localStorage.getItem("cashFlow")) || []).length + index;
      });

      localStorage.setItem(
        "cashFlow",
        JSON.stringify([...data, ...importedData])
      );
      setData((prev) => {
        return [...prev, ...importedData];
      });
      setSheetName(sheet);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <DataContext.Provider value={{ sheetName, handleImport, data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
