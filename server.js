
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001; // Using a different port from the Vite dev server

app.use(cors());
app.use(express.json());

// In-memory storage for tickets
const tickets = [];

// Endpoint to submit a new ticket
app.post('/api/tickets', (req, res) => {
  const { name, email, plateNumber } = req.body;

  // Basic validation
  if (!name || !email || !plateNumber) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newTicket = {
    id: tickets.length + 1,
    name,
    email,
    plateNumber,
    purchasedAt: new Date(),
  };

  tickets.push(newTicket);
  console.log('Ticket submitted:', newTicket);
  res.status(201).json(newTicket);
});

// Endpoint to get all tickets for the admin dashboard
app.get('/api/tickets', (req, res) => {
  res.json(tickets);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
