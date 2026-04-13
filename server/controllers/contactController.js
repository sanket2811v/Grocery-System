import ContactModel from "../models/contactModel.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const contact = await ContactModel.create({
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : "",
      message: String(message).trim(),
    });

    return res.json({
      success: true,
      message: "Thank you for contacting us",
      contact,
    });
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};