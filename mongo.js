const mongoose = require("mongoose");

if (process.argv.length === 3);

if (process.argv.length < 5) {
  if (process.argv.length === 3);
  else {
    console.log(
      "Use the following format\nnode mongo.js passwd <name> <number>"
    );
    process.exit(1);
  }
}

if (process.argv.length > 5) {
  console.log("Use quotes for names with spaces");
  process.exit(1);
}

const passwd = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const personToAdd = {
  name,
  number,
};

const url = `mongodb+srv://jdk:${passwd}@cluster0.ufgox.mongodb.net/phonebook-app?retryWrites=true&w=majority`;
mongoose
  .connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("CONNECTED TO MONGO ATLAS"));

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  new Person(personToAdd).save().then((result) => {
    console.log("added", name, number, "to phonebook");
    mongoose.connection.close();
  });
}
