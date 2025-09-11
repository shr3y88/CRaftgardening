import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const registerParticipant = asyncHandler(async (req, res) => {
  const { eventId, name, age, phone } = req.body;
  if (!eventId || !name || !age || !phone) return res.status(400).json({ message: 'All fields are required' });
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  const participant = await Participant.create({ event: eventId, name, age, phone, createdBy: req.user?._id });
  res.status(201).json({ participant });
});

export const deleteParticipant = asyncHandler(async (req, res) => {
  const participant = await Participant.findById(req.params.id);
  if (!participant) return res.status(404).json({ message: 'Participant not found' });
  // Allow event owner or creator of participant to delete
  const event = await Event.findById(participant.event);
  const isOwner = event && event.createdBy.toString() === req.user?._id?.toString();
  const isCreator = participant.createdBy && participant.createdBy.toString() === req.user?._id?.toString();
  if (!isOwner && !isCreator) return res.status(403).json({ message: 'Forbidden' });
  await participant.deleteOne();
  res.json({ success: true });
});


