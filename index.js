require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Persons = require("./models/persons");
const app = express();
app.use(express.json());

// ex 3.9 to 3.11 required following cors and static('build') done.
app.use(cors());
app.use(express.static("build")); // to deploy frontend to heroku

// step7 & and step8 use of morgan middleware
morgan.token("body", (req, res) => JSON.stringify(res.req.body));
// morgan.token("method", (req, res) => console.log(res));
app.use(
  morgan(
    ":method :url :status :response-time ms -  :res[content-length]  :body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "12-43-234345",
  },
];

app.get("/", (request, response) => {
  response.send("welcome");
});

//step1
app.get("/api/persons", (request, response) => {
  Persons.find({}).then((persons) => {
    response.json(persons);
  });
});

//step2
const info = `<div>Phonebook has info for ${persons.length}</div>${Date()}`;
app.get("/info", (request, response) => {
  response.send(info);
});

//step3
app.get("/api/persons/:id", (request, response) => {
  Persons.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

//step4
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  const toDelete = persons.find((person) => person.id === id);
  persons = persons.filter((person) => person.id !== id);
  response.json({ deleted: toDelete });
});

//step5
app.post("/api/persons", (request, response) => {
  // const length = Math.max(...persons.map((person) => person.id));

  // const maxId = persons.length > 0 ? Math.floor(Math.random() * 1000) : 0;

  const body = request.body;
  // if there is no name in body send error
  if (!body.name || !body.number)
    return response.status(400).json({
      error: "name/number not found",
    });

  const personToAdd = new Persons({
    name: body.name,
    number: body.number,
  });

  const nameExists =
    persons.find((per) => per.name === personToAdd.name) || false;
  if (nameExists.name === personToAdd.name)
    return response.status(400).json({
      existing: nameExists,
    });
  // persons = persons.concat(personToAdd);
  // response.json({ added: personToAdd });
  personToAdd.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
