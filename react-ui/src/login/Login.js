import React from 'react';
import axios from "axios";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Navigate } from "react-router-dom";

export default class Login extends React.Component {
    state = {
        username: "",
        password: "",
        token: "",
        validUser: false
    }

    handleUsernameInput = (event) => {
        this.setState({ token: "" });
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = (event) => {
        this.setState({ token: "" });
        this.setState({ password: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        
        axios({
            method: "post",
            url: "http://localhost:8000/auth",
            data: {
                username: this.state.username,
                password: this.state.password
            },
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http:/localhost:3000"
            }
        })
        .then(res => {
            console.log(res.data);
            this.setState({ token: res.data.auth_token })
            this.setState({ validUser: true });
        })
        .catch(ex => {
            this.setState({ validUser: false });
            this.setState({ token: null })
        });
    }

    render() {
        return(
            <div className="d-flex align-items-center justify-content-center vh-100">
                <Form onSubmit={this.handleSubmit} style={{ width: "100%" }}>
                    <FloatingLabel
                        controlId="formUsername"
                        label="Enter Username"
                        className="mb-3 col-sm-8 offset-sm-2"
                    >
                        <Form.Control type="text" placeholder="Enter Username" onChange={this.handleUsernameInput} />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="formPassword"
                        label="Enter Password"
                        className="mb-3 col-sm-8 offset-sm-2"
                    >
                        <Form.Control type="password" placeholder="Enter Password" onChange={this.handlePasswordChange} />
                    </FloatingLabel>

                    <Button variant="info" type="submit" className="submitButton">
                        Submit
                    </Button>
                    
                    {this.state.validUser ? (
                        <Navigate replace to="/project" state={{ token: this.state.token }} />
                    ) : null}
                    {
                        this.state.token === null ? (
                            <p className="errorMessage">Invalid auth</p>
                        ) : null
                    }
                </Form>
            </div>
        );
    }
}