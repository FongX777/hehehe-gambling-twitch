import React, { Component } from "react";
import { Button, ListGroup, Badge, Row, Col } from "react-bootstrap";
import moment from "moment";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.fetchGame = this.fetchGame.bind(this);
    this.renderCountdown = this.renderCountdown.bind(this);
    this.exchangeBits = this.exchangeBits.bind(this);
    this.state = {
      start: false,
      title: "對面李星會死幾次呢？",
      countdown: "00 : 00",
      winner: null,
      options: [
        {
          option: "5次以下",
          total: 30,
          people: {}
        },
        {
          option: "5~10次",
          total: 100,
          people: {}
        },
        {
          option: "11~15次",
          total: 200,
          people: {}
        }
      ],
      winners: {}
    };
    Twitch.ext.bits.onTransactionComplete(function(transaction) {
      const userId = props.authentication.getUserId();
      const amount = transaction.product.cost.amount;
      console.log("onTransactionComplete", userId, amount);
      fetch(`http://127.0.0.1:3000/cash-in`, {
        method: "POST",
        body: JSON.stringify({
          twitchWatcherId: userId,
          amount
        }),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      });
    });
  }

  fetchGame() {
    fetch(`http://localhost:3000/game?streamerId=12345`, {
      method: "GET"
    })
      .then(r => r.json())
      .then(a => {
        if (a) {
          this.setState({
            start: true,
            title: a.title,
            countdown: a.countdown,
            options: a.options,
            createdAt: a.createdAt,
            winner: a.winner,
            winners: a.winners || {}
          });
        }
      });
  }

  exchangeBits() {
    Twitch.ext.bits.getProducts().then(function(products) {
      console.log(products[0]);
      Twitch.ext.bits.useBits(products[0].sku);
    });
  }

  renderCountdown() {
    const createdAt = moment(this.state.createdAt);
    const now = moment(new Date());

    const diff = now.diff(createdAt, "seconds");

    const countdown = this.state.countdown - diff;
    if (countdown >= 0) {
      const formatted = moment.utc(countdown * 1000).format("mm : ss");
      return (
        <h3>
          <b>{formatted}</b>
        </h3>
      );
    } else {
      return (
        <h2>
          <b>下注時間到</b>
        </h2>
      );
    }
  }

  componentDidMount() {
    setInterval(this.fetchGame, 1000);
  }

  render() {
    const winAmount =
      this.state.winners[this.props.authentication.getUserId()] || 0;
    if (this.state.start) {
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
                style={{ fontWeight: "bold", color: "white" }}
              >
                {this.state.winner == null ? (
                  this.renderCountdown()
                ) : (
                  <div>
                    <h3>
                      <b>
                        答案為 {this.state.options[this.state.winner].option}
                      </b>
                    </h3>
                    <h3>
                      <b>您獲得了 {winAmount} 元</b>
                    </h3>
                  </div>
                )}
              </h5>
            </Col>
          </Row>

          <Row>
            <Col>
              <ListGroup style={{ background: "transparent" }}>
                {this.state.options.map((o, i) => {
                  return (
                    <ListGroup.Item
                      style={{
                        borderColor: "white",
                        color: "white"
                      }}
                      className={
                        i == this.state.winner
                          ? "winnerActive"
                          : "transparentBg"
                      }
                    >
                      <div
                        style={{
                          lineHeight: "36px"
                        }}
                      >
                        {o.option}
                        {`   -   `}
                        {Object.keys(o.people).length} 人下注
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
          <Row>
            <Col>
              <Button
                className="submitform"
                variant="outline-light"
                style={{ marginTop: "1rem" }}
                onClick={this.exchangeBits}
              >
                儲存小奇點
              </Button>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <Row>
            <Col>
              <h1
                style={{
                  marginTop: 105,
                  marginBottom: 100,
                  color: "white",
                  fontWeight: "bold"
                }}
                className="text-center"
              >
                遊戲尚未開始
              </h1>
            </Col>
          </Row>
        </div>
      );
    }
  }
}
