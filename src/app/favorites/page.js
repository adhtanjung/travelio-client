"use client";

import { Card, Col, Layout, Rate, Row } from "antd";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
const { Content } = Layout;

const manipulateString = (inputString) => {
	if (typeof inputString !== "string") {
		throw new Error("Input must be a string.");
	}

	if (inputString.length > 22) {
		return inputString.substring(0, 22) + "...";
	}

	return inputString;
};
export default function Favorites() {
	const [favoData, setFavoData] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		try {
			const storedClientId = localStorage.getItem("clientId");
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}${storedClientId}`
			);
			setFavoData(res?.data?.existingFavorite);
			setLoading(false);
		} catch (e) {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);
	if (loading) return "Loading...";
	return (
		<Content
			style={{
				padding: "0 50px",
			}}
		>
			<Row gutter={24}>
				{favoData?.map((v, i) => (
					<Col
						className="gutter-row"
						span={6}
						key={i}
						style={{ marginBottom: "16px" }}
					>
						<Card
							hoverable
							style={{ width: 260 }}
							cover={
								<Image
									alt="example"
									src={v?.thumbnail}
									width={200}
									height={340}
								/>
							}
						>
							<Row>
								<Col span={24}>
									<Row>
										<h3>{manipulateString(v?.title ?? "")}</h3>
									</Row>
									<Row>
										<Row>by: {manipulateString(v?.author ?? "")}</Row>
									</Row>
									<Row>
										<Rate
											disabled
											defaultValue={v?.rating ?? 0}
											allowHalf
											style={{
												fontSize: 14,
											}}
										/>
									</Row>
								</Col>
							</Row>
						</Card>
					</Col>
				))}
			</Row>
		</Content>
	);
}
