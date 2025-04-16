import React, { useState, useEffect } from "react";
import "./ShipmentTabele.css";

const ShipmentTable = ({ data }) => {
	const [sortedData, setSortedData] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: "data", // Domyślne sortowanie po dacie
		direction: "asc", // Rosnąco (najstarsze na górze)
	});
	const [filterValue, setFilterValue] = useState("");
	const [backgroundColor, setBackgroundColor] = useState(""); // Stan dla koloru tła

	// Funkcja sprawdzająca czy stosunek wskazuje na kompletność (np. 3/3, 2/2)
	const isComplete = (ratio) => {
		if (!ratio) return false;
		const [done, total] = ratio.split("/").map(Number);
		return done === total;
	};

	// Funkcja sprawdzająca czy przesyłka jest kompletna
	const isShipmentComplete = (shipment) => {
		// Przesyłka jest kompletna, gdy:
		// 1. Pozycje są kompletne (np. 3/3)
		// 2. Dokumenty są kompletne (np. 1/1) lub brak dokumentów (null)
		return (
			isComplete(shipment.iloscPozycji) &&
			(isComplete(shipment.dokumenty) || shipment.dokumenty === null)
		);
	};

	// Efekt sprawdzający kompletność dzisiejszych przesyłek
	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		const todayShipments = data.filter(
			(item) => new Date(item.data).toISOString().split("T")[0] === today
		);

		// Jeśli nie ma dzisiejszych przesyłek, zachowaj neutralne tło
		if (todayShipments.length === 0) {
			setBackgroundColor("");
			return;
		}

		// Sprawdź, czy wszystkie dzisiejsze przesyłki są kompletne
		const allComplete = todayShipments.every(isShipmentComplete);

		// Ustaw kolor tła na podstawie kompletności
		setBackgroundColor(allComplete ? "green-background" : "red-background");
	}, [data]);

	// Efekt sortowania i filtrowania danych
	useEffect(() => {
		let filteredData = [...data];

		// Filtrowanie danych
		if (filterValue) {
			filteredData = filteredData.filter((item) => {
				return (
					item.kodQR.toLowerCase().includes(filterValue.toLowerCase()) ||
					item.adresOdbiorcy
						.toLowerCase()
						.includes(filterValue.toLowerCase()) ||
					item.skrotOsoby.toLowerCase().includes(filterValue.toLowerCase())
				);
			});
		}

		// Sortowanie danych
		let sortableData = [...filteredData];
		if (sortConfig.key) {
			sortableData.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		// @ts-ignore
		setSortedData(sortableData);
	}, [data, sortConfig, filterValue]);

	// Funkcja do obsługi sortowania
	const requestSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	// Funkcja zwracająca klasę CSS dla nagłówka tabeli
	const getSortClass = (key) => {
		if (sortConfig.key !== key) return "";
		return sortConfig.direction === "asc" ? "sort-asc" : "sort-desc";
	};

	// Funkcja do ustawienia dzisiejszej daty jako pierwszej
	const sortByToday = () => {
		const today = new Date().toISOString().split("T")[0];
		setSortConfig({
			key: "data",
			direction: "custom",
			// @ts-ignore
			customSort: (a, b) => {
				if (a.data === today && b.data !== today) return -1;
				if (a.data !== today && b.data === today) return 1;
				// @ts-ignore
				return new Date(a.data) - new Date(b.data);
			},
		});
	};

	return (
		<div className={`shipment-table-container ${backgroundColor}`}>
			<div className='filters'>
				<input
					type='text'
					placeholder='Daten filtern... Adresse oder VMB'
					value={filterValue}
					onChange={(e) => setFilterValue(e.target.value)}
					className='filter-input'
				/>
				<button onClick={sortByToday} className='today-btn'>
					Heutige Sendungen nach oben sortieren
				</button>
			</div>

			<div className='table-wrapper'>
				<table className='shipment-table'>
					<thead>
						<tr>
							<th onClick={() => requestSort("id")}>
								ID <span className={getSortClass("id")}></span>
							</th>
							<th onClick={() => requestSort("data")}>
								Date <span className={getSortClass("data")}></span>
							</th>
							<th onClick={() => requestSort("kodQR")}>
								Kod QR <span className={getSortClass("kodQR")}></span>
							</th>
							<th onClick={() => requestSort("adresOdbiorcy")}>
								Adresse <span className={getSortClass("adresOdbiorcy")}></span>
							</th>
							<th onClick={() => requestSort("skrotOsoby")}>
								Vertrieb mitarbeiter{" "}
								<span className={getSortClass("skrotOsoby")}></span>
							</th>
							<th onClick={() => requestSort("iloscPozycji")}>
								Pozycje <span className={getSortClass("iloscPozycji")}></span>
							</th>
							<th onClick={() => requestSort("dokumenty")}>
								Dokumenty <span className={getSortClass("dokumenty")}></span>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedData.map((item) => (
							<tr
								// @ts-ignore
								key={item.id}
								className={
									// @ts-ignore
									new Date(item.data).toISOString().split("T")[0] ===
									new Date().toISOString().split("T")[0]
										? isShipmentComplete(item)
											? "today-row complete-row"
											: "today-row incomplete-row"
										: ""
								}>
								<td>
									{
										// @ts-ignore
										item.id
									}
								</td>
								<td>
									{
										// @ts-ignore
										item.data
									}
								</td>
								<td>
									{
										// @ts-ignore
										item.kodQR
									}
								</td>
								<td>
									{
										// @ts-ignore
										item.adresOdbiorcy
									}
								</td>
								<td>
									{
										// @ts-ignore
										item.skrotOsoby
									}
								</td>
								<td>
									{
										// @ts-ignore
										item.iloscPozycji
									}
								</td>
								<td>
									{// @ts-ignore
									item.dokumenty || "-"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ShipmentTable;
