"use client";
import { createContext, useContext, useState } from "react";
const AppContext = createContext();
export const AppProvider = ({ children }) => {
	const [data, setData] = useState([]);
	const value = {
		contextData: data,
		setContextData: setData,
	};
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => useContext(AppContext);
