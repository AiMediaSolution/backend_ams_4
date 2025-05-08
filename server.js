const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/contact", async (req, res) => {
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
        user: "khanhqvj@gmail.com",
        pass: "uhaz yjdy vegu glhn",
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

    res.status(200).json({ success: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
