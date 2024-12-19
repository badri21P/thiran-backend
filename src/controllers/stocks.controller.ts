import type { Request, Response } from "express";
import { stockService } from "../services/stocks.service";
import { z } from "zod";
import { COUNTRIES } from "../utils/constants.utils";

export const calculate = (req: Request, res: Response) => {
	try {
		const calculateSchema = z.object({
			country: z.enum(Object.values(COUNTRIES) as [string, ...string[]]),
			units: z.number().int().positive("Units must be greater than zero."),
		});
		const parseResult = calculateSchema.safeParse(req.body);

		if (!parseResult.success) {
			return res.status(400).json({ error: parseResult.error.errors });
		}
		const { country, units } = parseResult.data;
		const stock = stockService.getStock();

		if (units > stock.stockIndia + stock.stockSriLanka) { 
			return res
				.status(400)
				.json({ error: "Out of stock! Unable to fulfill the order." });
		}

		const totalCost = stockService.calculateTotalCost(country, units);
		stockService.updateStock(
			country,
			Math.min(units, stock.stockIndia),
			units - Math.min(units, stock.stockIndia),
		);
		const updateStock = {totalCost,...stockService.getStock()}
    stockService.resetStock();
    return res.json(updateStock);
	} catch (error) {
		console.error(error);
		return res.status(400).json({ message: "Something went wrong!" });
	}
};

export const resetStock = (req: Request, res: Response) => {
	try {
		stockService.resetStock();
		return res.json({ message: "Stocks have been reset." });
	} catch (error) {
		console.error(error);
		return res.status(400).json({ message: "Something went wrong!" });
	}
};

export const q2 = (req: Request, res: Response) => {
	try {
		const q2Schema = z.object({
			number: z.number().int().positive("Number must be greater than zero.").max(10),
		});
		const parseResult = q2Schema.safeParse(req.body);

		if (!parseResult.success) {
			return res.status(400).json({ error: parseResult.error.errors });
		}

		const { number } = parseResult.data;
		const result: string[] = [];
		function backtrack(current: string, open: number, close: number): void {
			if (current.length === 2 * number) {
				result.push(current);
				return;
			}

			if (open < number) {
				backtrack(`${current}(`, open + 1, close);
			}

			if (close < open) {
				backtrack(`${current})`, open, close + 1);
			}
		}
		backtrack("", 0, 0);
		return res.json({ result });
	} catch (error) {
		console.error(error);
		return res.status(400).json({ message: "Something went wrong!" });
	}
};
