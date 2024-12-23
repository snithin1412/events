import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Divider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { eventApi } from "../../store/eventSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Spinner from "react-bootstrap/Spinner";

export const Home = () => {
  const dispatch = useDispatch();
  const eventsDetails = useSelector((state) => state.events);
  const { status, events, hasMore, start, limit } = eventsDetails;
  const observerTarget = useRef(null);
  const navigate = useNavigate();
  const [price, setPrice] = React.useState([0, 500]);
  const [checked, setChecked] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState({ category: [], price: [0, 500] });
  const handlePrice = (event, newValue) => {
    setPrice(newValue);
  };

  const callbackFunction = (entries) => {
    if (entries[0].isIntersecting && hasMore) {
      if (status === "idle" || "completed") {
        console.log("bbb");
        dispatch(
          eventApi({ start: start, limit: 8, filter: filter, new: false })
        )
          .unwrap()
          .then((resp) => {
            console.log(resp);
          })
          .catch(() => {
            console.log("error");
          });
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, {
      threshold: 1,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, start, hasMore, filter]);

  const handleBooking = (id) => {
    navigate(`/booking/${id}`);
  };

  const handleCategory = (e) => {
    if (e.target.checked) {
      setChecked([...checked, e.target.value]);
    } else {
      setChecked(checked.filter((item) => item !== e.target.value));
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const applyFilter = () => {
    console.log(price);
    handleClose();
    setFilter((prev) => {
      return {
        ...prev,
        category: checked,
        price: price,
      };
    });
    dispatch(
      eventApi({
        start: 0,
        limit: 8,
        filter: { category: checked, price: price },
        new: true,
      })
    )
      .unwrap()
      .then((resp) => {
        console.log(resp);
      })
      .catch(() => {
        console.log("error");
      });
  };

  const removeFilter = () => {
    handleClose();
    setFilter(() => {
      setChecked(() => []);
      setPrice(() => [0, 500]);
      return {
        category: [],
        price: [0, 500],
      };
    });
    dispatch(
      eventApi({
        start: 0,
        limit: 8,
        filter: { category: [], price: [0, 500] },
        new: true,
      })
    )
      .unwrap()
      .then((resp) => {
        console.log(resp);
      })
      .catch(() => {
        console.log("error");
      });
  };

  return (
    <>
      {status && (
        <Container className="home-wrapper mb-4 pe-0 pb-60 ps-0">
          <Row className="home-banner mb-4">
            <Col>
              <Row className="banner-heading">Explore Events</Row>
            </Col>
          </Row>
          <Row></Row>
          <Row className="mb-4">
            <Col>
              <Row className="event-list mb-5 justify-content-start">
                <InputGroup className="mb-3 w-50">
                  <Form.Control className="w-50" placeholder="Search....." />
                  <Button variant="contained" onClick={handleClick}>
                    Filter
                  </Button>
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    sx={{
                      ".MuiPopover-paper": {
                        width: 300,
                        padding: "10px 20px 20px 20px",
                      },
                    }}
                  >
                    <Typography className="fw-bold text-decoration-underline mb-2">
                      By Category
                    </Typography>
                    <FormGroup className="mb-4">
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="concert"
                            checked={checked.includes("concert")}
                            onChange={handleCategory}
                          />
                        }
                        label="Concert"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="conferences"
                            checked={checked.includes("conferences")}
                            onChange={handleCategory}
                          />
                        }
                        label="Conferences"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="sports"
                            checked={checked.includes("sports")}
                            onChange={handleCategory}
                          />
                        }
                        label="Sports"
                      />
                    </FormGroup>
                    <Typography className="fw-bold text-decoration-underline mb-2">
                      By Price range
                    </Typography>
                    <Box>
                      <Slider
                        value={price}
                        onChange={handlePrice}
                        valueLabelDisplay="auto"
                        step={50}
                        min={0}
                        max={500}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                      }}
                    >
                      <Typography variant="body2" sx={{ cursor: "pointer" }}>
                        {0}
                      </Typography>
                      <Typography variant="body2" sx={{ cursor: "pointer" }}>
                        {500}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="outlined"
                        className="me-2"
                        onClick={applyFilter}
                      >
                        Apply Filter
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={removeFilter}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Popover>
                </InputGroup>

                <Divider className="mb-4 bdClrGrey" />
                {events.map((event, index) => {
                  return (
                    <Card className="card-width mb-4">
                      <Card.Body className="pb-1">
                        <Card.Title className="mb-1 fw-bold card-title-dimension text-capitalize">
                          {event.title}
                        </Card.Title>
                        <Card.Text className="fs-14 mb-1 text-muted text-capitalize">
                          {event.category}
                        </Card.Text>
                        <Card.Text className="fs-14 mb-1 text-muted text-capitalize">
                          {event.description}
                        </Card.Text>
                        <Row className="align-items-center mt-2">
                          <Card.Text className="event-desc text-start">
                            <span className="fs-14">
                              Total Seats: {event.seats.totalSeats}
                            </span>
                          </Card.Text>
                        </Row>
                        <Row>
                          <Card.Text className="event-desc text-start">
                            <span className="fs-14">
                              Available Seats: {event.seats.availableSeats}
                            </span>
                          </Card.Text>
                        </Row>
                        <Row>
                          <Card.Text className="event-desc text-start mt-3">
                            <span className="fs-14">Price: ₹{event.price}</span>
                          </Card.Text>
                        </Row>
                      </Card.Body>
                      <Card.Footer>
                        <Row className="justify-content-center">
                          <Col md="auto">
                            <Button
                              onClick={() => handleBooking(event.eventId)}
                              className="p-0 cursor-pointer"
                              variant="text"
                            >
                              <span className="me-2">{"Book Now"}</span>
                            </Button>
                          </Col>
                        </Row>
                      </Card.Footer>
                    </Card>
                  );
                })}
              </Row>
            </Col>
          </Row>
        </Container>
      )}

      {hasMore && (
        <div
          id="ref"
          className="mt-4 d-flex justify-content-center"
          ref={observerTarget}
        >
          <Spinner ref={observerTarget} animation="grow" />
        </div>
      )}
    </>
  );
};
