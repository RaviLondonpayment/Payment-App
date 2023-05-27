// const nodemailer = require("nodemailer");
// const handlebars = require("handlebars");
// const fs = require("fs");
// const path = require("path");
import nodemailer from "nodemailer";
import HandleBars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const sendEmail = async (email, subject, payload, template) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // console.log(
    //   "username & pwd",
    //   process.env.EMAIL_USERNAME,
    //   process.env.EMAIL_PASSWORD
    // );
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = HandleBars.compile(source);
    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      // console.log("mailfn triggered", info, error);
      if (error) {
        return error;
      } else {
        console.log("success", info);
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/
