import { useState } from "react";
import { read, utils } from "xlsx";
import { DataContext } from "./excel.ctx";

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
      const data = utils.sheet_to_json(wb.Sheets[sheet]);

      localStorage.setItem("cashFlow", JSON.stringify(data));
      setData(data);
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
