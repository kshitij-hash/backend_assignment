import jwt from "jsonwebtoken";
import express from 'express';
import {z} from 'zod'

import { authenticateJwt, SECRET } from "../middleware/";
import { User } from "../db";

const router = express.Router();

type userType = {
  name: string;
  email: string;
  password: string;
}

const zodUserInputSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-zA-Z ]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^[a-zA-Z0-9!@#$%^&*()_+]+$/),
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password }: userType = zodUserInputSchema.parse(req.body);
    const user = await User.findOne({ email });

    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ name, email, password });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  } catch(err) {
    res.status(400).json({ error: err });
  }
});

type loginType = {
  email: string;
  password: string;
}

const zodLoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^[a-zA-Z0-9!@#$%^&*()_+]+$/),
})

router.post('/login', async (req, res) => {
  try {
    const { email, password }: loginType = zodLoginInputSchema.parse(req.body);
    const user = await User.findOne({ email, password });

    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  } catch(err) {
    res.status(400).json({ error: err });
  }
});

type editType = {
  name: string;
}

const zodEditInputSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[a-zA-Z ]+$/),
})

router.patch('/edit', authenticateJwt, async (req, res) => {
  const { name }: editType = zodEditInputSchema.parse(req.body);
  const userId = req.headers["userId"];
  const user = await User.findOne({ _id: userId });

  if(user) {
    user.name = name;
    await user.save();
    res.json({ message: 'Name updated successfully' });
  } else {
    res.status(403).json({ message: 'User not logged in' });
  }
})

export default router