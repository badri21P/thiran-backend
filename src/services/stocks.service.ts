import { COUNTRIES } from "../utils/constants.utils";

const [initial, priceIndia, priceSriLanka, transportCostPerBlock] = [
	100, 30000, 25000, 5000,
];
let stockIndia = initial;
let stockSriLanka = initial;
export const stockService = {
	getStock: () => ({ stockIndia, stockSriLanka }),

	updateStock: (country: string, localUnits: number, importedUnits: number) => {
		if (country === COUNTRIES.INDIA) {
			stockIndia -= localUnits;
			stockSriLanka -= importedUnits;
		} else if (country === COUNTRIES.SRI_LANKA) {
			stockSriLanka -= localUnits;
			stockIndia -= importedUnits;
		}
	},

	resetStock: () => {
		stockIndia = initial;
		stockSriLanka = initial;
	},
	calculateTotalCost: (country: string, units: number) => {
		if (country === COUNTRIES.INDIA) {
			if (units <= stockIndia) return units * priceIndia;

			const localUnits = stockIndia;
			const importedUnits = units - localUnits;
			const transportCost =
				Math.ceil(importedUnits / 10) * transportCostPerBlock;

			return (
				localUnits * priceIndia + importedUnits * priceSriLanka + transportCost
			);
		}
    if (country === COUNTRIES.SRI_LANKA) {
			if (units <= stockSriLanka) return units * priceSriLanka;

			const localUnits = stockSriLanka;
			const importedUnits = units - localUnits;
			const transportCost =
				Math.ceil(importedUnits / 10) * transportCostPerBlock;

			return (
				localUnits * priceSriLanka + importedUnits * priceIndia + transportCost
			);
		}

		throw new Error("Invalid country");
	},
};
