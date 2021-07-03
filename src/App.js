import React, {Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Particles from 'react-tsparticles'; 
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceDetection from './Components/FaceDetection/FaceDetection';

const app = new Clarifai.App ({
  apiKey : '11d2455c79da467eb7abfff8d7efb9fe'
})

class App extends Component{ 

  constructor() {
    super();

    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
    this.state = {
      input: '',
      imageURL: '',
      box: {},
    }
  }

  onInputChange= (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit =()=> {
    this.setState ({imageURL: this.state.input});

    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {this.displayBox (this.claculateFaceLocation(response))
    console.log(response.outputs[0].data.regions[0].region_info.bounding_box)})
    .catch(err => console.log(err))
  }

  claculateFaceLocation = (resp) => {
    const clarifaiFace = resp.outputs[0].data.regions[0].region_info.bounding_box;
    const getImage = document.getElementById('inputImage');
    const height = Number(getImage.height);
    const width = Number(getImage.width);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayBox = (facebox) => {
    console.log(facebox)
    this.setState ({box: facebox});
  }

  particlesInit(main) {
    console.log(main);
  }

  particlesLoaded(container) {
    console.log(container);
  }

  render(){
  return (
    <div className="App">
      <Particles 
        className='particles01'
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
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange ={this.onInputChange} onButtonSubmit= {this.onButtonSubmit} />
      <FaceDetection imageURL= {this.state.imageURL} box = {this.state.box} />
    </div>
    );
  }
}
export default App
