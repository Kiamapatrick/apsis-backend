const express = require('express');
const router = express.Router();
const Client = require('../models/clients'); // Mongoose model

// GET all clients
router.get('/', async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

// GET one client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST add new client
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const client = new Client({ firstName, lastName, email, phone });
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update a client
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone },
      { new: true, runValidators: true }
    );
    if (!updatedClient) return res.status(404).json({ error: 'Client not found' });
    res.json(updatedClient);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE a client
router.delete('/:id', async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
