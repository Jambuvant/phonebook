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

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malformed id",
    });
  }

  next(error);
};
app.use(errorHandler);

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
const info = `<div>Phonebook has info for ${
  Persons.find({}).length
}</div>${Date()}`;
app.get("/info", (request, response) => {
  response.send(info);
});

//step3
app.get("/api/persons/:id", (request, response, next) => {
  Persons.findById(request.params.id)
    .then((person) => {
      if (person) response.json(person);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

//step4
app.delete("/api/persons/:id", (request, response, next) => {
  Persons.findByIdAndRemove(request.params.id)
    .then((personToDelete) => {
      console.log("deleted", personToDelete);
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
      console.log(error);
    });
});

//step5
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const person = Persons.find({}).then((res) => res.data);
  console.log(person);
  // if there is no name in body send error
  if (!body.name || !body.number)
    return response.status(400).json({
      error: "name/number not found",
    });

  const personToAdd = new Persons({
    name: body.name,
    number: body.number,
  });

  Persons.find({}).then((persons) => {
    const nameExists =
      persons.find((per) => per.name === personToAdd.name) || false;

    if (nameExists.name === personToAdd.name)
      return response.status(400).json({
        existing: nameExists,
      });
    else {
      personToAdd.save().then((savedPerson) => {
        response.json(savedPerson);
      });
    }
  });
});

// ex 3.17
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Persons.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
