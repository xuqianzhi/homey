import logo from "./logo.svg";
import "./App.css";
import Landing from "./pages/Landing.jsx";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import DashboardLandlord from "./pages/landlord/DashboardLandlord.jsx";
import DashboardTenant from "./pages/tenant/DashboardTenant.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Component } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDx0Mevlnf4oDjDYidM2EzkOiOpXHoiZBo",
  authDomain: "xqz-cs5356.firebaseapp.com",
  projectId: "xqz-cs5356",
  storageBucket: "xqz-cs5356.appspot.com",
  messagingSenderId: "748563665138",
  appId: "1:748563665138:web:8a7fbbfcecedf8a0b0006b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

class App extends Component {
  constructor() {
    super();
    this.handleUserSignIn = this.handleUserSignIn.bind(this);
    this.handleUserSignOut = this.handleUserSignOut.bind(this);
    this.handleUserSignUp = this.handleUserSignUp.bind(this);

    this.signinElement = React.createRef();
    this.signupElement = React.createRef();

    const signInType = window.localStorage.getItem("signInType");
    this.state = {
      signInType: signInType,
      userEmail: ""
    };
  }

  handleUserSignIn(email, password, signInType) {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        this.signinElement.current.setState({ errorMessage: "" });
        // Signed in
        const user = userCredential.user;
        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const role = data.role;
          if (role === signInType) {
            // perform signin
            window.localStorage.setItem("signInType", signInType);
            window.localStorage.setItem("userEmail", email);
            this.setState({ signInType: signInType, userEmail: email });
            window.location.href = `/dashboard/${signInType}`;
          } else {
            throw { message: "Sign in role does not match your actual role" };
          }
        } else {
          throw { message: "User not found" };
        }
      })
      .catch((error) => {
        const msg = error.message;
        console.log("error signing in: ", msg);
        this.signinElement.current.setState({ errorMessage: msg });
      });
  }

  handleUserSignUp(email, password, signUpType) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        this.signupElement.current.setState({ errorMessage: "" });
        const user = userCredential.user;
        const uid = user.uid;
        console.log(user.email, uid);
        const userDoc = doc(db, "users", uid);
        await setDoc(userDoc, {
          email: email,
          role: signUpType,
        });
        // sign in user
        window.localStorage.setItem("signInType", signUpType);
        window.localStorage.setItem("userEmail", email);
        this.setState({ signInType: signUpType, userEmail: email });
        window.location.href = `/dashboard/${signUpType}`;
      })
      .catch((error) => {
        const msg = error.message;
        console.log("error signing up: ", msg);
        this.signupElement.current.setState({ errorMessage: msg });
      });
  }

  handleUserSignOut() {
    const type = window.localStorage.getItem("signInType");
    window.localStorage.removeItem("signInType");
    window.localStorage.removeItem("userEmail");
    this.setState({ signInType: null, userEmail: "" });
    window.location.href = `/signin/${type}`;
  }

  ifUserSignedIn(Component, userType) {
    const signInType = this.state.signInType;
    if (signInType && signInType == userType) {
      return <Component handleUserSignOut={this.handleUserSignOut} />;
    } else {
      return (
        <Signin userType={userType} handleUserSignIn={this.handleUserSignIn} />
      );
    }
  }

  render() {
    const handleUserSignIn = this.handleUserSignIn;
    const handleUserSignUp = this.handleUserSignUp;
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="signin/tenant"
              element={
                <Signin
                  userType="tenant"
                  handleUserSignIn={handleUserSignIn}
                  ref={this.signinElement}
                />
              }
            />
            <Route
              path="signin/landlord"
              element={
                <Signin
                  userType="landlord"
                  handleUserSignIn={handleUserSignIn}
                  ref={this.signinElement}
                />
              }
            />
            <Route
              path="signup"
              element={
                <Signup
                  handleUserSignUp={handleUserSignUp}
                  ref={this.signupElement}
                />
              }
            />
            <Route
              path="dashboard/landlord"
              element={this.ifUserSignedIn(DashboardLandlord, "landlord")}
            />
            <Route
              path="dashboard/tenant"
              element={this.ifUserSignedIn(DashboardTenant, "tenant")}
            />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
