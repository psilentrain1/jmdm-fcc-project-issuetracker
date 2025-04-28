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
  assigned_to: { type: String, default: "" },
  status_text: { type: String, default: "" },
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
          res.status(500).json({ error: "Internal server error" });
        });
    })

    .post(async function (req, res) {
      const project = req.params.project;

      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.status(200).json({ error: "required field(s) missing" });
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

    .put(async function (req, res) {
      const project = req.params.project;

      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text) {
        return res.json({ error: "no update field(s) sent", _id: req.body._id });
      }

      const issue = await Issue.findById(req.body._id);
      if (!issue) {
        return res.json({ error: `could not update`, _id: req.body._id });
      }

      req.body.issue_title && (issue.issue_title = req.body.issue_title);
      req.body.issue_text && (issue.issue_text = req.body.issue_text);
      req.body.created_by && (issue.created_by = req.body.created_by);
      req.body.assigned_to && (issue.assigned_to = req.body.assigned_to);
      req.body.status_text && (issue.status_text = req.body.status_text);
      issue.updated_on = new Date();
      try {
        const updatedIssue = await issue.save();
        res.json({ result: "successfully updated", _id: updatedIssue._id });
      } catch (error) {
        res.json({ error: `could not update`, _id: req.body._id });
      }
    })

    .delete(async function (req, res) {
      const project = req.params.project;

      if (!req.body._id) return res.status(200).json({ error: "missing _id" });

      try {
        const deletedIssue = await Issue.findByIdAndDelete(req.body._id);
        if (!deletedIssue) return res.status(200).json({ error: "could not delete", _id: req.body._id });

        res.status(200).json({ result: "successfully deleted", _id: deletedIssue._id });
      } catch (error) {
        res.status(400).json({ error: "could not delete", _id: req.body._id });
      }
    });
};
