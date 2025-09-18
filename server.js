const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let users = [
  { id: 1, name: "Admin", email: "admin@portal.com", password: "admin123", role: "admin" },
];
let sosRequests = [];
let medicalRequests = [];
let incidentReports = [];

// --- Registration ---
app.post("/register", (req, res) => {
  const { name, age, gender, mobile, lang, email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists!" });
  }
  const id = users.length + 1;
  users.push({ id, name, age, gender, mobile, lang, email, password, role: "user" });
  res.json({ message: "Registered successfully!", id });
});

// --- Login ---
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ user });
});

// --- SOS ---
app.post("/sos", (req, res) => {
  sosRequests.push({ userId: req.body.id, time: new Date() });
  res.json({ message: "SOS logged" });
});

// --- Medical ---
app.post("/medical", (req, res) => {
  medicalRequests.push({ userId: req.body.id, time: new Date() });
  res.json({ message: "Medical request logged" });
});

// --- Incident ---
app.post("/incident", (req, res) => {
  incidentReports.push({ userId: req.body.id, text: req.body.text, time: new Date() });
  res.json({ message: "Incident logged" });
});

const PORT = 3000;
// ============ Admin APIs ============

// Get all users
app.get("/admin/users", (req, res) => {
  res.json(users);
});

// Get SOS requests
app.get("/admin/sos", (req, res) => {
  res.json(sosRequests);
});

// Get medical requests
app.get("/admin/medical", (req, res) => {
  res.json(medicalRequests);
});

// Get incidents
app.get("/admin/incidents", (req, res) => {
  res.json(incidentReports);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
