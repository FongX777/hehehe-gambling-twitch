import React, { Component } from "react";
import { Button, ListGroup, Badge, Row, Col } from "react-bootstrap";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.fetchGame = this.fetchGame.bind(this);
    this.state = {
      title: "對面李星會死幾次呢？",
      countdown: "00 : 00",
      options: ["5次以下", "5~10次", "11~15次"]
    };
  }

  fetchGame() {
    fetch(`http://localhost:3000/game?streamerId=12345`, {
      method: "GET"
    })
      .then(r => r.json())
      .then(a => {
        this.setState({
          title: a.title,
          options: a.options
        });
      });
  }

  componentDidMount() {
    setInterval(this.fetchGame, 1000);
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
              倒數 {this.state.countdown}
            </h5>
          </Col>
        </Row>

        <Row>
          <Col>
            <ListGroup style={{ background: "transparent" }}>
              {this.state.options.map(o => {
                return (
                  <ListGroup.Item
                    style={{
                      background: "transparent",
                      borderColor: "white",
                      color: "white"
                    }}
                  >
                    <div
                      style={{
                        lineHeight: "36px"
                      }}
                    >
                      {o}
                      <Button
                        className={["fakebadge", "float-right"]}
                        variant="outline-light"
                        onClick={() => {}}
                      >
                        $ 36,000
                      </Button>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}
