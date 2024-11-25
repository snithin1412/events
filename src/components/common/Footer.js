import React from "react";
import {Container, Row, Col} from 'react-bootstrap';

export const Footer = () => {

    return (
        <Container className = "footer-wrapper" fluid>
        <Container>
            <Row className="justify-content-between text-center mt-3">
                <Col>
                    <a href="#">
                        CopyRight 2024  © 
                    </a>                    
                </Col>
            </Row>
        </Container>
    </Container>
    );
}