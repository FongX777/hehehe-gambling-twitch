import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "對面李星會死幾次呢？",
      countdown: "1分鐘",
      options: ["5次以下", "5~10次", "11~15次"]
    };
  }

  render() {
    return (
      <div style={{ margin: 30 }}>
        <Row>
          <Col>
            <h3
              className="text-center"
              style={{ fontWeight: "bole", color: "white" }}
            >
              {this.state.title}
            </h3>
          </Col>
        </Row>

        <hr
          style={{
            border: 0,
            borderTop: "1px solid rgba(255, 255, 255)"
          }}
        />

        <Row>
          <Col>
            <h5
              className="text-center"
              style={{ fontWeight: "bole", color: "white" }}
            >
              倒數{this.state.countdown}
            </h5>
          </Col>
        </Row>

        {this.state.options.map(o => {
          return (
            <Row>
              <Col>
                <h5
                  className="text-center"
                  style={{ fontWeight: "bole", color: "white" }}
                >
                  {o}
                </h5>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}
