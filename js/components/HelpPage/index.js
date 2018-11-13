import React, { Component } from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View, Dimensions, Image, TextInput, ScrollView, Modal, WebView } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body, Tab, Tabs, TabHeading, Input, Picker, Form, Item
} from "native-base";
import styles from "./styles";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class HelpPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: '#224259'}}>
          <Left style={{ flex: 1,}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>

          <Body style={{ flex:3,  justifyContent: 'center', alignItems: 'center' }}>
            <Title>AVATAR</Title>
          </Body>

          <Right style={{ flex: 1,}} />
        </Header>

          <View style={{height:deviceHeight, width:deviceWidth}}>
            <WebView
              automaticallyAdjustContentInsets={true}
              scalesPageToFit={true}
              source = {{ uri: 'http://www.avatarins.com/contactus.php' }}
            />
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
});

export default connect(mapStateToProps, bindAction)(HelpPage);

