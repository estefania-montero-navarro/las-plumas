import RequestSender from "./requestSender";

export class SessionManager {
  constructor() {
    // this.authContext = useContext(AuthContext);
    this.checkSessionRoute = "session_status";
  }

  async getSessionStatus() {
    const requestSender = new RequestSender();
    const response = await requestSender.sendRequest(
      this.checkSessionRoute,
      "get"
    );
    const responseStatus = response.status;
    return responseStatus;
  }
}

export default SessionManager;
