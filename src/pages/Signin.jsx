import React, { Component, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { theme, ButtonPrimary } from "./Style.jsx";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "./Navbar.jsx";

import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";

export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.userType = props.userType;
    this.handleUserSignIn = props.handleUserSignIn;
    this.state = {
      errorMessage: "",
    };
  }

  handleSubmit(event) {
    // TODO: handle error
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    this.handleUserSignIn(email, password, this.userType);
  }

  render() {
    const userType = this.userType;
    const alternativeSigninHref =
      this.userType == "tenant" ? "/signin/landlord" : "/signin/tenant";
    const alternativeSigninText =
      this.userType == "tenant" ? "Sign in as landlord" : "Sign in as tenant";
    const errorMessage = this.state.errorMessage;

    return (
      <ThemeProvider theme={theme}>
        <Navbar shouldShowSignIn={false} ></Navbar>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in as {userType}
            </Typography>
            <Box
              component="form"
              onSubmit={this.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <ButtonPrimary
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, width: "100%" }}
              >
                Sign In
              </ButtonPrimary>
              <Typography
                id="signin-error"
                sx={{ color: "red", textDecoration: "underline" }}
              >
                {errorMessage}
              </Typography>
              <Grid container>
                <Grid item xs>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
                <Grid item>
                  <Link href={alternativeSigninHref} variant="body2">
                    {alternativeSigninText}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
