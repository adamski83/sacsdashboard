import React from "react";
import shipmentData from "./list";
import ShipmentTable from "./ShipmentTabele";
import "./App.css";

function App() {
	return (
		<div className='app-container'>
			<header>
				<h1>SACS Dashboard</h1>
			</header>
			<main>
				<ShipmentTable data={shipmentData} />
			</main>
		</div>
	);
}

export default App;
