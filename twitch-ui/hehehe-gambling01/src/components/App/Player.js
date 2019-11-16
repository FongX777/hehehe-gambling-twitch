import React, { Component } from "react";
import { Button, ListGroup, Badge, Row, Col } from "react-bootstrap";
import moment from "moment";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.fetchGame = this.fetchGame.bind(this);
    this.renderCountdown = this.renderCountdown.bind(this);
    this.state = {
      title: "對面李星會死幾次呢？",
      countdown: "00 : 00",
      options: [
        {
          option: "5次以下",
          total: 30
        },
        {
          option: "5~10次",
          total: 100
        },
        {
          option: "11~15次",
          total: 200
        }
      ]
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
          countdown: a.countdown,
          options: a.options,
          createdAt: a.createdAt
        });
      });
  }

  renderCountdown() {
    const createdAt = moment(this.state.createdAt);
    const now = moment(new Date());

    const diff = now.diff(createdAt, "seconds");

    const countdown = this.state.countdown - diff;
    if (countdown >= 0) {
      const formatted = moment.utc(countdown*1000).format('mm : ss');
      return (
        <h3><b>{formatted}</b></h3>
      );
    } else {
      return (
        <h2><b>下注時間到</b></h2>
      );
    }
  }

  componentDidMount() {
    setInterval(this.fetchGame, 1000);
  }

  render() {
    return (
      <div style={{ margin: 30 }}>
        <Row>
          <Col>
            <h2
              className="text-center"
              style={{ marginBottom: 0, fontWeight: "bold", color: "white" }}
            >
              {this.state.title}
            </h2>
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
              {this.renderCountdown()}
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
                      {o.option}
                      <Button
                        className={["fakebadge", "float-right"]}
                        variant="outline-light"
                        onClick={() => {}}
                      >
                        $ {o.total}
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
