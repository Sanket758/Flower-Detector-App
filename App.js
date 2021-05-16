import React, {Component} from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Tflite from 'tflite-react-native';

let tflite = new Tflite();
var modelFile = 'models/flower_model.tflite';
var labelsFile = 'models/labels.txt';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      predictions: null,
      source: null,
    };
    tflite.loadModel({ model: modelFile, labels: labelsFile}, (err, res) =>{
      if (err) console.log(err);
      else console.log(res);
    });
  }

  selectImage() {
    const options = {};
    ImagePicker.launchImageLibrary(options, (res) => {
      if (res.didCancel) console.log('user clicked cancel');
      else if (res.error) console.log('error occured' + res.error);
      else if (res.customButton) console.log('user clicked a custom button');
      else {
        // console.log('Successfully selected an image!');
        this.setState({source: {uri: res.uri}});
        tflite.runModelOnImage({
          path: res.path,
          imageMean: 128,
          imageStd: 128,
          numResults: 5,
          threshold: 0.7,
        },
        (err, res) => {
          if (err) console.log(err);
          else {
            console.log(res[res.length - 1]);
            this.setState({predictions: res[res.length - 1]});
          }
        });
      }
    })
  }

  takePhoto() {
    const options = {};
    ImagePicker.launchCamera(options, (res) => {
      if (res.didCancel) console.log('user clicked cancel');
      else if (res.error) console.log('error occured' + res.error);
      else if (res.customButton) console.log('user clicked a custom button');
      else {
        // console.log('Successfully selected an image!');
        this.setState({source: {uri: res.uri}});
        tflite.runModelOnImage({
          path: res.path,
          imageMean: 128,
          imageStd: 128,
          numResults: 5,
          threshold: 0.7,
        },
        (err, res) => {
          if (err) console.log(err);
          else {
            console.log(res[res.length - 1]);
            this.setState({predictions: res[res.length - 1]});
          }
        });
      }
    })
  }

  render(){
    const {source, predictions} = this.state;

    return (
      <LinearGradient colors={['#a8e063', '#56ab2f']} style={styles.lineargradient}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}> Flower Detector App </Text>
          <Text style={styles.subtitle}> Find which flower is it? </Text>
        </View>
        <View style={styles.outputContainer}>
          {predictions ?
            <View>
              <Image source={source} style={styles.flowerImage}></Image>
              <Text style={styles.output}> { predictions['label'] + ' - ' + (predictions['confidence'] * 100).toFixed() + '%' } </Text>
            </View>
           :
           <Image source={require('./assets/flower.png')} style={styles.flowerImage}></Image>
          }    
        </View>
        <View style={styles.buttonContainer}>
          <Button   
            title='Camera' 
            buttonStyle={styles.button} 
            containerStyle={{margin: 5}}
            titleStyle={{fontSize: 18 }}
            onPress={this.takePhoto.bind(this)}></Button>

          <Button title='Choose from Gallery' 
            buttonStyle={styles.button} 
            containerStyle={{margin: 5}}
            titleStyle={{fontSize: 18}}
            onPress={this.selectImage.bind(this)}></Button>
        </View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  lineargradient:{
    flex:1,
  },
  titleContainer:{
    marginTop: 55,
    alignItems:'center',
    justifyContent: 'center',
  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black'
  },
  subtitle:{
    fontSize: 18,
    color: 'black',
  },
  buttonContainer:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,  
  },
  button:{
    backgroundColor: 'black',
    width: 220, 
    height: 50,
    borderRadius: 10,
  },
  outputContainer:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  output:{
    color: 'white',
    fontSize: 20,
    paddingTop: 20, 
    textAlign: 'center',
  },
  flowerImage:{
    width: 250,
    height: 250,
  },
})
