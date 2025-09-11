import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listEvents = asyncHandler(async (_req, res) => {
  const events = await Event.find().populate('createdBy', 'name email').sort({ date: 1 });
  res.json({ events });
});

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location } = req.body;
  if (!title || !date || !location) return res.status(400).json({ message: 'Missing required fields' });
  const event = await Event.create({ title, description, date, location, createdBy: req.user._id });
  res.status(201).json({ event });
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json({ event });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(event, req.body);
  await event.save();
  res.json({ event });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  await Participant.deleteMany({ event: event._id });
  await event.deleteOne();
  res.json({ success: true });
});

export const listParticipantsForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  const participants = await Participant.find({ event: event._id }).sort({ createdAt: -1 });
  res.json({ participants });
});


