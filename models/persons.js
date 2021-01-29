const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log("connecting to...", url);
mongoose
  .connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected successfully :-)");
  })
  .catch((error) => {
    console.log("failed:", error.message);
  });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

// this will return individual person with id instead of _id, and __v
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("person", personSchema);

module.exports = Person;
