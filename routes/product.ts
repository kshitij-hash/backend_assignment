import express from 'express';
import { authenticateJwt } from "../middleware/index";
import {z} from 'zod'
import { Product } from "../db";
const router = express.Router();

interface productType {
  name: string;
  price: number;
  description: string;
  image: string;
}

const zodProductInputSchema = z.object({
  name: z.string().min(5).max(50),
  price: z.number().min(0),
  description: z.string().min(10).max(1000),
  image: z.string().url(),
})

router.post('/new_product', authenticateJwt, (req, res) => {
  const inputs: productType = zodProductInputSchema.parse(req.body);
  const userId = req.headers["userId"];

  const newProduct = new Product({
    name: inputs.name, 
    price: inputs.price, 
    description: inputs.description, 
    image: inputs.image, 
    userId 
  });

  newProduct.save()
    .then((savedProduct) => {
      res.status(201).json(savedProduct);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to create a new product' });
    });
})

router.get('/products', authenticateJwt, (req, res) => {
  const userId = req.headers["userId"];

  Product.find({ userId })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve products' });
    });
})

export default router