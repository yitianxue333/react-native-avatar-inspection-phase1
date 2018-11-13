
const React = require('react-native');
const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


export default{
  container: {
    backgroundColor: '#FBFAFA',
  },
  personIconStyle: {
  	width: deviceWidth/20,
  	height: deviceWidth*1.04/20
  },
  insuredIconStyle: {
  	width: deviceWidth/20,
  	height: deviceWidth/20
  }
};
