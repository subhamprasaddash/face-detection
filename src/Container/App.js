import React, { Component } from "react";
import "./App.css";
import Particles from "react-tsparticles";
import Navigation from "../Components/Navigation/Navigation";
import Logo from "../Components/Logo/Logo";
import ImageLinkForm from "../Components/ImageLinkForm/ImageLinkForm";
import Rank from "../Components/Rank/Rank";
import FaceDetection from "../Components/FaceDetection/FaceDetection";
import SignIn from "../Components/SignInForm/SignIn";
import Register from "../Components/RegisterForm/Register";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: `${process.env.REACT_APP_API_KEY}`,
});

const initialState = {
  input: "",
  imageURL: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  userProfile: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();

    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
    this.state = initialState;
  }

  addUserProfile = (user) => {
    this.setState({
      userProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
      },
    });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        if (response) {
          fetch("http://localhost:3002/imageRank", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.userProfile.id,
            }),
          })
            .then((response) => response.json())
            // Object.assign is a javascript param : Syntax : Object.assign(target, sources)
            .then((count) => {
              this.setState(
                Object.assign(this.state.userProfile, { entries: count })
              ); //this is done so that only entries get updated every time count changes, the remaining userProfile will remain same
            })
            .catch(console.log);
        }

        this.displayBox(this.claculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  claculateFaceLocation = (resp) => {
    const clarifaiFace =
      resp.outputs[0].data.regions[0].region_info.bounding_box;
    const getImage = document.getElementById("inputImage");
    const height = Number(getImage.height);
    const width = Number(getImage.width);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayBox = (facebox) => {
    this.setState({ box: facebox });
  };

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({ isSignedIn: true });
    } else {
      this.setState(initialState);
    }
    this.setState({ route: route });
  };

  particlesInit(main) {}

  particlesLoaded(container) {}

  render() {
    return (
      <div className="App">
        <Particles
          className="particles01"
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={{
            fpsLimit: 144,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 4,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 800,
                },
                value: 150,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />

        {this.state.route === "signin" ? (
          <SignIn
            onRouteChange={this.onRouteChange}
            addUserProfile={this.addUserProfile}
          />
        ) : this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.userProfile.name}
              entries={this.state.userProfile.entries}
            />
            {/* Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.*/}
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceDetection
              imageURL={this.state.imageURL}
              box={this.state.box}
            />
          </div>
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            addUserProfile={this.addUserProfile}
          />
        )}
      </div>
    );
  }
}
export default App;
