import Plant from '../models/Plant.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listPlants = asyncHandler(async (req, res) => {
  const { type } = req.query; // optional: indoor/outdoor filter
  const query = {};
  if (type) query.type = type;
  const plants = await Plant.find(query).sort({ createdAt: -1 });
  res.json({ plants });
});

export const createPlant = asyncHandler(async (req, res) => {
  const { name, description, type, imageUrl, careTips } = req.body;
  if (!name || !type) return res.status(400).json({ message: 'Name and type are required' });
  const plant = await Plant.create({ name, description, type, imageUrl, careTips });
  res.status(201).json({ plant });
});

export const getPlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json({ plant });
});

export const updatePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json({ plant });
});

export const deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json({ success: true });
});


