const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let issueId1;
let issueId2;
let issueId3;

suite("Functional Tests", function () {
  this.timeout(5000);
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/testproject")
      .send({
        issue_title: "#1 - Test issue",
        issue_text: "#1 - Testing issue text",
        created_by: "Test user 1",
        assigned_to: "Another tester",
        status_text: "Testing status",
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
        project: "testproject",
      })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        issueId1 = res.body._id;
        done();
      });
  });
  test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/testproject")
      .send({
        issue_title: "#2 - Test issue",
        issue_text: "#2 - Testing issue text",
        created_by: "Test user",
        project: "testproject",
      })
      .end(function (err, res) {
        assert.equal(res.status, 201);
        issueId2 = res.body._id;
        done();
      });
  });
  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/testproject")
      .send({
        issue_title: "#3 - Test issue",
        assigned_to: "Another tester",
        status_text: "Testing status",
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
        project: "testproject",
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, "required field(s) missing");
        issueId3 = res.body._id;
        done();
      });
  });
  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/testproject")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/testproject")
      .query({ open: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/testproject")
      .query({ open: true, assigned_to: "Another tester" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .send({
        _id: issueId1,
        assigned_to: "Tier 2 tester",
      })
      .end(function (err, res) {
        console.log("issueId1", issueId1), assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });
  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .send({
        _id: issueId2,
        issue_text: "Adding some addition details to text",
        status_text: "Escalated to another team",
        assigned_to: "Tier 3 tester",
      })
      .end(function (err, res) {
        console.log("issueId2", issueId2), assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });
  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .send({
        issue_text: "Adding some addition details to text",
        status_text: "Escalated to another team",
        assigned_to: "Tier 3 tester",
      })
      .end(function (err, res) {
        assert.equal(res.status, 400);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .send({
        _id: issueId3,
      })
      .end(function (err, res) {
        console.log("issueId3", issueId3);
        assert.equal(res.status, 400);
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
  });
  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/testproject")
      .send({
        _id: "123a456bcd78e901f23gab4c",
        issue_text: "Adding more details to this issue",
        status_text: "Escalated to manager",
        assigned_to: "Team manager",
      })
      .end(function (err, res) {
        assert.equal(res.status, 500);
        assert.equal(res.body.error, "could not update");
        done();
      });
  });
  //   test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {});
  //   test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {});
  //   test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {});
});
