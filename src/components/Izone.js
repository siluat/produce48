import React, { Component } from "react";
import { Segment } from "semantic-ui-react";

class Izone extends Component {
  render() {
    return (
      <div>
        <Segment
          attached
          textAlign="center"
          style={{ backgroundColor: "#ff50a0", padding: "0" }}
        >
          <img src="images/izone.png" style={{ width: "300px" }} alt="IZONE" />
        </Segment>
        <img src="images/heartiz-violeta-izone.jpg" style={{ width: "100%" }} />
      </div>
    );
  }
}

export default Izone;
