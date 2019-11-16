import React, { Component } from "react";
import {
  ButtonToolbar,
  Button,
  Container,
  Row,
  Col,
  Form
} from "react-bootstrap";
import { MdAdd, MdClose } from "react-icons/md";

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.addOption = this.addOption.bind(this);
    this.createGame = this.createGame.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.Authentication = this.props.authentication;
    this.state = {
      streamerId: 12345, /*this.Authentication.getUserId(),*/
      title: "",
      countdown: "30",
      options: [],
      option: ""
    };
  }

  createGame() {
    fetch(`http://127.0.0.1:3000/game/create`, {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(r => r.json())
      .then(a => {
        window.Twitch.ext.rig.log(a);
      });
  }

  removeOption(i, e) {
    let options = this.state.options;
    options.splice(i, 1);
    this.setState({
      options: options
    });
  }

  addOption() {
    window.Twitch.ext.rig.log(this.state.streamerId);
    if (this.state.option === "") return;
    let options = this.state.options;
    options.push(this.state.option);
    this.setState({
      options: options,
      option: ""
    });
  }

  handleChange(n, e) {
    window.Twitch.ext.rig.log(e.target.value);
    e.preventDefault();
    this.setState({
      [n]: e.target.value
    });
  }

  render() {
    return (
      <div style={{ margin: 30 }}>
        <Form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <Form.Group>
            <Form.Label style={{ color: "white" }}>題目</Form.Label>
            <Form.Control
              className="customizefocus"
              type="text"
              placeholder="這場對面李星會死幾次呢？"
              value={this.state.title}
              onChange={e => this.handleChange("title", e)}
            />
          </Form.Group>

          <hr
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
              border: 0,
              borderTop: "1px solid rgba(255, 255, 255)"
            }}
          />

          <Form.Group>
            <Form.Label style={{ color: "white" }}>下注倒數時間</Form.Label>
            <Form.Control
              className="customizefocus"
              as="select"
              value={this.state.countdown}
              onChange={e => this.handleChange("countdown", e)}
            >
              <option value="30">30秒</option>
              <option value="60">1分鐘</option>
              <option value="180">3分鐘</option>
              <option value="300">5分鐘</option>
              <option value="600">10分鐘</option>
              <option value="1200">20分鐘</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="asdf" style={{ marginBottom: 0 }}>
            <Form.Label style={{ color: "white" }}>選項</Form.Label>
          </Form.Group>

          <Form.Group controlId="asdf" style={{ marginBottom: 0 }}>
            {this.state.options.map((o, i) => (
              <Row style={{ marginBottom: 5 }}>
                <Col sm={10}>
                  <Form.Label style={{ color: "white", fontWeight: "bold" }}>
                    選項 {i+1}. {o}
                  </Form.Label>
                </Col>
                <Col sm={2}>
                  <Button
                    className="submitform"
                    variant="outline-light"
                    onClick={e => this.removeOption(i, e)}
                  >
                    <MdClose />
                  </Button>
                </Col>
              </Row>
            ))}
          </Form.Group>

          <Form.Group>
            <Row>
              <Col sm={10}>
                <Form.Control
                  className="customizefocus"
                  type="text"
                  placeholder="選項"
                  value={this.state.option}
                  onKeyPress={this.addOption}
                  onChange={e => this.handleChange("option", e)}
                />
              </Col>
              <Col sm={2}>
                <Button
                  className="submitform"
                  variant="outline-light"
                  onClick={this.addOption}
                >
                  <MdAdd />
                </Button>
              </Col>
            </Row>
          </Form.Group>

          <Button
            className="submitform"
            variant="outline-light"
            onClick={this.createGame}
          >
            開始發問
          </Button>
        </Form>
      </div>
    );
  }
}
