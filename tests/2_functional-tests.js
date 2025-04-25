const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

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
        done();
      });
  });
  //   test("View issues on a project: GET request to /api/issues/{project}", function (done) {});
  //   test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {});
  //   test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {});
  //   test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {});
  //   test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {});
  //   test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {});
  //   test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {});
  //   test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {});
  //   test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {});
  //   test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {});
  //   test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {});
});
