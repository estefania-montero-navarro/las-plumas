import axios from "axios";
import { useNavigate } from "react-router-dom";

// Use example:
// const requestSender = new RequestSender();
//     requestSender
//       .sendRequest("login", "POST", credentials) // considerar la mayuscula is falla
//       .then((response) => {}
export class RequestSender {
  constructor() {
    this.url = "http://localhost:3000/api/v1/";
  }
  // Note:
  // @endpoint is what goes after "/api/v1/"
  // if it has parameters they must be eincluded in the endpoint
  // @data gets accessed from the body of the request
  async sendRequest(endpoint, method, data) {
    const token = sessionStorage.getItem("token");
    let headers = {};
    if (token) {
      headers = { authorization: token };
    }
    try {
      const response = await axios({
        method: method,
        url: `${this.url}${endpoint}`,
        headers: headers,
        data: data,
      });

      return response;
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 400) {
        window.location.href = "/badRequest";
      }
      return error.response;
    }
  }
}

export default RequestSender;
