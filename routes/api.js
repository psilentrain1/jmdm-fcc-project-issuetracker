"use strict";
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// SCHEMAS
const issueSchema = new mongoose.Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  assigned_to: String,
  status_text: String,
  open: { type: Boolean, default: true },
  project: { type: String, required: true },
});

// MODELS
const Issue = mongoose.model("Issue", issueSchema);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      const project = req.params.project;
      const filter = req.query;

      Issue.find({ project: project, ...filter })
        .then((issues) => {
          if (issues.length === 0) {
            return res.status(204).json("No issues found");
          }
          res.json(issues);
        })
        .catch((error) => {
          console.error("Error retrieving issues:", error);
          res.status(500).json({ error: "Internal server error" });
        });
    })

    .post(async function (req, res) {
      const project = req.params.project;

      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.status(400).json({ error: "required field(s) missing" });
      }

      const newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        project: project,
      });
      try {
        const savedIssue = await newIssue.save();
        res.status(201).json(savedIssue);
      } catch (error) {
        res.status(400).json({ error: "Error saving issue" });
      }
    })

    .put(function (req, res) {
      const project = req.params.project;
    })

    .delete(function (req, res) {
      const project = req.params.project;
    });
};
