import request from "supertest";
import express from "express";
import { preventSQLInjection } from "../../middlewares/sqlInjectionPreventer";

const app = express();
app.use(express.json());
app.use(preventSQLInjection);
app.post("/test", (req, res) => {
  res.status(200).send({ message: "No SQL Injection detected" });
});

describe("preventSQLInjection middleware", () => {
  it("should allow request without SQL injection", async () => {
    const res = await request(app).post("/test").send({ key: "value" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("No SQL Injection detected");
  });

  it("should block request with SQL injection in params", async () => {
    const res = await request(app).post("/test?key=select * from users").send();

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Bad Request");
  });

  it("should block request with SQL injection in query", async () => {
    const res = await request(app)
      .post("/test")
      .query({ key: "select * from users" })
      .send();

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Bad Request");
  });

  it("should block request with SQL injection in body", async () => {
    const res = await request(app)
      .post("/test")
      .send({ key: "select * from users" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Bad Request");
  });

  it("should block request with SQL injection in multiple fields", async () => {
    const res = await request(app)
      .post("/test?query=drop table users")
      .send({ key: "select * from users" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Bad Request");
  });
});
