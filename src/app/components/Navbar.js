"use client";

import { Layout, Menu } from "antd";
import Search from "antd/es/input/Search";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAppContext } from "../../context/AppContext";

const { Header } = Layout;

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Navbar() {
	const [inputValue, setInputValue] = useState("");
	const { contextData, setContextData } = useAppContext();
	const onSearch = (value) => setInputValue(value);
	const { data, error, isLoading } = useSWR(
		`https://www.googleapis.com/books/v1/volumes?q=${inputValue}`,
		fetcher
	);
	setContextData(data);
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const query = params.get("query") || "";
		setInputValue(query);
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		params.set("query", inputValue);
		const newUrl = `${window.location.pathname}?${params.toString()}`;
		window.history.replaceState({}, "", newUrl);
	}, [inputValue]);
	return (
		<Header
			style={{
				position: "sticky",
				top: 0,
				zIndex: 1,
				width: "100%",
				display: "flex",
				alignItems: "center",
				background: "white",
			}}
		>
			<Menu
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={["2"]}
				items={["travelio books", "favorites"].map((value) => ({
					key: value,
					label: (
						<Link
							href={`/${value !== "travelio books" ? value : ""}`}
							style={{
								display: "flex",
								alignItems: "center",
								textDecoration: "none",
							}}
						>
							<h4>{value}</h4>
						</Link>
					),
				}))}
			/>
			{isLoading ? (
				<Search
					placeholder="searching..."
					defaultValue={inputValue}
					style={{
						width: 400,
					}}
					disabled
					loading
				/>
			) : (
				<Search
					placeholder="Harry Potter"
					allowClear
					onSearch={onSearch}
					defaultValue={inputValue}
					style={{
						width: 400,
					}}
				/>
			)}
		</Header>
	);
}
