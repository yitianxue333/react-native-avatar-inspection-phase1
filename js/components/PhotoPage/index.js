import React, { Component } from "react";
import { AsyncStorage,TouchableOpacity, View, Dimensions, Image, TextInput, ScrollView, Modal, Alert, NetInfo } from "react-native";
import { connect } from "react-redux";
import { DrawerNavigator, NavigationActions } from "react-navigation";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right, Tab, Tabs
} from "native-base";
import {URLclass} from '../lib/';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const logo = require("../../../images/logo.png");

class PhotoPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  clickBackBtn() {
    this.props.navigation.goBack(null)
  }


  render() {
    return (
      <Container style={{backgroundColor:'#000'}}>
        <Header style={{backgroundColor: '#224259'}}>
          <Left style={{ flex: 1,}}>
            <Button
              transparent
              onPress={() => this.clickBackBtn()}
            >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>

          <Body style={{ flex:3,  justifyContent: 'center', alignItems: 'center' }}>
            <Title>Photo detail</Title>
          </Body>

          <Right style={{ flex: 1,}}>
          </Right>
        </Header>

        <View style={{backgroundColor:'black', alignSelf:'center'}}>
          <Image source={{uri: this.props.clicked_photo_data.docurl}} style={{width:deviceWidth, height:deviceWidth*0.8, marginTop:deviceHeight*0.15}} />
          {this.props.clicked_photo_data.description == "" ? null
          : <View style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
              <Text style={{margin:deviceWidth/50, fontSize:15, fontWeight:'400', color:'white'}}>{this.props.clicked_photo_data.description}</Text>
            </View>
          }
          
        </View>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
  };
}

const mapStateToProps = state => ({
  clicked_photo_data: state.user.clicked_photo_data
});

export default connect(mapStateToProps, bindAction)(PhotoPage);
