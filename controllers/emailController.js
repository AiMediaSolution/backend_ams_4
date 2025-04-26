const nodemailer = require("nodemailer");
const { addMailContact } = require("../models/mailModel");

const sendMailContactHandler = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || name.length < 3) {
    return res
      .status(400)
      .json({ error: "Name must be at least 3 characters." });
  }
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  if (!message || message.length < 10) {
    return res
      .status(400)
      .json({ error: "Message must be at least 10 characters." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "vankhanhjj@gmail.com",
      subject: "Contact Form Submission",
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    addMailContact(name, email, message, (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res
          .status(500)
          .json({ error: "Message sent, but failed to save contact." });
      }

      return res
        .status(200)
        .json({ success: "Message sent and contact saved successfully!" });
    });
  } catch (err) {
    console.error("Mailer Error:", err);
    res.status(500).json({ error: "Failed to send message." });
  }
};

module.exports = { sendMailContactHandler };
