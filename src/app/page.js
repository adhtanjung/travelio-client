"use client";
import { HeartOutlined, LoadingOutlined } from "@ant-design/icons";
import { Alert, Breadcrumb, Card, Col, Layout, Rate, Row } from "antd";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "../context/AppContext";
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

export default function Home() {
	const [clientId, setClientId] = useState("");
	const [uploadId, setUploadId] = useState("");
	const [uploadLoading, setUploadLoading] = useState(false);
	const [error, setError] = useState({
		message: "",
		isError: false,
	});
	const [success, setSuccess] = useState({
		message: "",
		isSuccess: false,
	});
	const { contextData, setContextData } = useAppContext();

	useEffect(() => {
		const storedClientId = localStorage.getItem("clientId");
		if (storedClientId) {
			setClientId(storedClientId);
		} else {
			const newClientId = uuidv4();
			setClientId(newClientId);
			localStorage.setItem("clientId", newClientId);
		}
	}, []);
	const postData = async (uploadData) => {
		try {
			setError({
				message: "",
				isError: false,
			});
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;

			setUploadLoading(true);
			setUploadId(uploadData.bookId);
			await axios.post(apiUrl, uploadData);
			setUploadLoading(false);
			setUploadId("");
			setSuccess({
				message: "book has been added to your favorite",
				isSuccess: true,
			});
		} catch (error) {
			setUploadId("");
			setSuccess({
				message: "",
				isSuccess: false,
			});
			setUploadLoading(false);
			setError({
				message: error?.response?.data?.message ?? "something went wrong",
				isError: true,
			});
			// Handle errors
			console.error("Error making POST request:", error.message);
		}
	};

	return (
		<Layout>
			{error.isError && (
				<Alert message={error.message} type="error" showIcon closable />
			)}
			{success.isSuccess && (
				<Alert message={success.message} type="success" showIcon closable />
			)}
			<Content
				className="site-layout"
				style={{
					padding: "0 50px",
				}}
			>
				<Breadcrumb
					style={{
						margin: "16px 0",
					}}
				>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>List</Breadcrumb.Item>
					<Breadcrumb.Item>App</Breadcrumb.Item>
				</Breadcrumb>
				<Row gutter={24}>
					{contextData?.items?.map((v, i) => (
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
										src={v?.volumeInfo?.imageLinks?.thumbnail}
										width={200}
										height={340}
									/>
								}
								actions={[
									uploadLoading && uploadId === v?.id ? (
										<LoadingOutlined />
									) : (
										<HeartOutlined
											key="heart"
											disabled={true}
											onClick={() =>
												postData({
													title: v?.volumeInfo?.title,
													author: v?.volumeInfo?.authors?.[0] ?? "-",
													thumbnail: v?.volumeInfo?.imageLinks?.thumbnail,
													rating: v?.volumeInfo?.ratingsCount ?? 0,
													userId: clientId,
													bookId: v?.id,
												})
											}
										/>
									),
								]}
							>
								<Row>
									<Col span={24}>
										<Row>
											<h3>{manipulateString(v?.volumeInfo?.title ?? "")}</h3>
										</Row>
										<Row>
											<Row>
												by:{" "}
												{manipulateString(v?.volumeInfo?.authors?.[0] ?? "")}
											</Row>
										</Row>
										<Row>
											<Rate
												disabled
												defaultValue={v?.volumeInfo?.ratingsCount ?? 0}
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
		</Layout>
	);
}
