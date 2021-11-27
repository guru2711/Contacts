const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Contact = require("../models/contact");
const auth = require("../middleware/auth");

// read
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id });
    // console.log(req.user.id);
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).send("server error");
  }
});

// create
router.post(
  "/",
  [auth, [check("name", "name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, phone, type } = req.body;

      const newContact = new Contact({
        name,
        email,
        type,
        phone,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

// update
router.put("/:id", async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    // if (contact.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: "Not authorized" });
    // }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).send("server Error");
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    // if (!contact) return res.status(404).json({ msg: "Contact not found" });
    // if (contact.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: "Not authorized" });
    // }

    contact = await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "contact Removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("server Error");
  }
});

module.exports = router;
