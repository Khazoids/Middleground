import { TestProducts, SingleTestProduct } from "../../debugging/DummyData"

export const debugSearchProducts = async (req: any, res: any) => {
    res.status(200).json({ results: TestProducts }); 
}

export const debugSearchProductById = async (req: any, res: any) => {
    res.status(200).json(SingleTestProduct);
}
