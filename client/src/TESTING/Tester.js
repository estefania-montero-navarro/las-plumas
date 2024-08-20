// Use instructions
// 1. Import the Tester class in the file where the test will take place
// 2. Create an instance of the Tester class
// 3. Call the test method with the following parameters:
//   a. testName: string
//   b. expectedResult: string
//   c. actualResult: string
// 4. The test method will display an alert with the test results

// Example
// const testContext = () => {
//   const tester = Tester.getInstance();
//   const expectedUser = {
//     email: "genericEmployee@user.com",
//     name: "Generic Employee",
//     role: "employee",
//     uuid: "1A6D729D-BBEF-46E9-B5ED-C6A05D22524A",
//   };

//   tester.test(
//     "Contexto se crea correctamente",
//     JSON.stringify(expectedUser),
//     JSON.stringify(user)
//   );
// };

// This method is called after the context is created in login
import React from "react";
import { useNavigate } from "react-router-dom";

class Tester extends React.Component {
  constructor(props) {
    super(props);
    if (Tester.instance) {
      return Tester.instance;
    }
    sessionStorage.setItem("testData", JSON.stringify([]));
    Tester.instance = this;
  }

  static getInstance() {
    if (!Tester.instance) {
      Tester.instance = new Tester();
    }
    return Tester.instance;
  }

  test = (testName, expectedResult, actualResult) => {
    const passed = expectedResult === actualResult;
    const status = passed ? "Passed" : "Failed";
    const test = { testName, expectedResult, actualResult, status };
    alert(
      "Test: " +
        testName +
        "\nStatus: " +
        status +
        "\nExpected result: " +
        expectedResult +
        "\nActual result: " +
        actualResult
    );
  };
}

export default Tester;
