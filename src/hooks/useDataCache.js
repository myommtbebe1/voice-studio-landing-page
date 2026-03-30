import { useContext } from "react";
import { DataCacheContext } from "../contexts/dataCache.js";

export function useDataCache() {
  const context = useContext(DataCacheContext);

  if (!context) {
    throw new Error("useDataCache must be used within a DataCacheProvider");
  }

  return context;
}
