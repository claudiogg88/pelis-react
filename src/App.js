import React, {useState} from 'react';

import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Pelis from './Pelis';
import NavBar from "./NavBar";
import './App.css';
import {Col, Row} from "react-bootstrap";


const App = () => (

    <Container className="p-2">
        <Row>
            <Col>
                <NavBar/>
            </Col>

        </Row>

        <Row className="mt-5">

            <Col>
                <Pelis/>
            </Col>

        </Row>

    </Container>
);

export default App;
