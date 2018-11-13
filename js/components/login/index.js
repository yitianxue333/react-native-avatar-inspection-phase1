import React, { Component } from "react";
import { Image, Dimensions, TextInput, TouchableOpacity, Alert, NetInfo, AsyncStorage } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Header,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text, Form, Label
} from "native-base";
import { Field, reduxForm } from "redux-form";
import { setUser, login } from "../../actions/user";
import styles from "./styles";
import {URLclass} from '../lib/';
import Spinner from 'react-native-loading-spinner-overlay';
import {requestPermission, checkPermission} from 'react-native-android-permissions';


const background = require("../../../images/shadow.png");
const logo = require("../../../images/logo.png");
const checker_yes = require("../../../images/checker_yes.png");
const checker_no = require("../../../images/checker_no.png");
const show_password_icon = require("../../../images/show_password.png");
const hide_password_icon = require("../../../images/hide_ps.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user_name: "",
      password: "",
      is_checker: false,
      is_showPassword: true,
      spinner_visible: false,
      is_allow_login: false,
    };
  }

  componentWillMount() {
    AsyncStorage.getItem("saved_username").then((value) => {
      if (value != null) {
        this.setState({user_name: value})
      }
    }).done();
    AsyncStorage.getItem("saved_password").then((value) => {
      if (value != null) {
        this.setState({password: value})
      }
    }).done();

    AsyncStorage.getItem("saved_remember_userID").then((value) => {
      if (value != null) {
        if (value != "no") {
          NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
              this.setState({spinner_visible:true})
              var login_url = URLclass.url + 'checkLogin'
              var formData = new FormData();
              formData.append("user_name", this.state.user_name)
              formData.append("password", this.state.password)
              fetch(login_url, {
                method: 'POST',
                body: formData
              })
              .then((response) => response.json())
              .then((responseData) => {
                if (responseData.status == 1) {
                  this.setState({spinner_visible:false})
                  this.props.login(responseData)
                  this.props.navigation.navigate("Home")
                } else {
                  var self=this
                  self.setState({spinner_visible:false})
                  setTimeout(function(){
                    Alert.alert("Can't login now. Please try later.")
                    }, 300); 
                  }
                })
              .catch(function(error) {
                return error;
              })
            }
          })
        }
      }
    }).done();
  }

  componentDidMount() {
    checkPermission("android.permission.ACCESS_FINE_LOCATION").then((result) => {
    }, (result) => {
    });


    setTimeout(() => {
      requestPermission("android.permission.ACCESS_FINE_LOCATION").then((result) => {
        this.setState({is_allow_login: true})
      }, (result) => {
        this.setState({is_allow_login: false})
      });
    }, 0);
  }

  clickOKBtn() {
    setTimeout(() => {
      requestPermission("android.permission.ACCESS_FINE_LOCATION").then((result) => {
        this.setState({is_allow_login: true})
      }, (result) => {
        this.setState({is_allow_login: false})
      });
    }, 0);
  }

  clickOK_offlineBtn() {
    this.props.navigation.navigate("Home")
  }


  clickLoginBtn() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected) {
        if (this.state.is_allow_login == true) {
          if (this.state.user_name == "" || this.state.password == "") {
            Alert.alert("Please enter the fields.")
          } else {
            this.setState({spinner_visible:true})
            var login_url = URLclass.url + 'checkLogin'
            var formData = new FormData();
            formData.append("user_name", this.state.user_name)
            formData.append("password", this.state.password)
            fetch(login_url, {
              method: 'POST',
              body: formData
            })
            .then((response) => response.json())
            .then((responseData) => {
              if (responseData.status == 1) {
                this.setState({spinner_visible:false})
                this.props.login(responseData)
                if (this.state.is_checker == true) {
                  AsyncStorage.setItem('saved_remember_userID', responseData.user_id);  
                } else {
                  AsyncStorage.setItem('saved_remember_userID', "no");
                }                
                AsyncStorage.setItem('saved_userID', responseData.user_id);
                AsyncStorage.setItem('saved_username', this.state.user_name);
                AsyncStorage.setItem('saved_password', this.state.password);
                this.props.navigation.navigate("Home")
              } else {
                var self=this
                self.setState({spinner_visible:false})
                setTimeout(function(){
                  Alert.alert("Invalid username or password.")
                  }, 300); 
                }
              })
            .catch(function(error) {
              return error;
            })
          }
        } else {
          Alert.alert(
            'Location permission',
            'You cannot login without location permission.',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
              {text: 'OK', onPress: this.clickOKBtn()},
            ],
            { cancelable: false }
          )
        }
      } else {
        var temp_username;
        var temp_password;
        AsyncStorage.getItem("saved_username").then((value) => {
          if (value != null) {
            temp_username = value
            AsyncStorage.getItem("saved_password").then((value) => {
              if (value != null) {
                temp_password = value
                if (temp_username == this.state.user_name && temp_password == this.state.password) {
                  Alert.alert(
                    'Offline mode',
                    'You can see only claims what you visited at least once time in online.',
                    [
                      {text: 'OK', onPress: this.clickOK_offlineBtn()},
                    ],
                    { cancelable: true }
                  )
                  
                } else {
                  Alert.alert("Wrong username or password.")
                }
              }
            }).done();
          }
        }).done();
        

        
      }
    })
  }

  clickCheckerBtn() {
    if (this.state.is_checker == false) {
      this.setState({is_checker: true})
    } else {
      this.setState({is_checker: false})
    }
  }

  click_showPasswordBtn() {
    if (this.state.is_showPassword == true) {
      this.setState({is_showPassword: false})
    } else {
      this.setState({is_showPassword: true})
    }
  }

  clickHelpBtn() {
    this.props.navigation.navigate("HelpPage")
  }

  render() {
    return (
      <Container>
        <Image source={background} style={styles.shadow}>
          <Content style={{alignSelf:'center'}}>
            <View style={{width:deviceWidth*18/20, height:deviceHeight*8/10, backgroundColor:'white', marginTop:deviceHeight/12, borderRadius:10, alignItems:'center'}}>
              <Image source={logo} style={styles.logoStyle} />

              <Form style={{marginTop:deviceHeight/50}}>
                <Item stackedLabel style={{width:deviceWidth*14/20, marginLeft:0, height:deviceHeight/9}}>
                  <Label>username</Label>
                  <Input value={this.state.user_name} autoCapitalize = 'none' onChangeText={user_name => this.setState({user_name})} />
                </Item>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:deviceHeight/50}}>
                  <Item stackedLabel style={{width:deviceWidth*14/20, marginLeft:0, height:deviceHeight/9}}>
                    <Label>password</Label>
                    <Input style={{marginRight:deviceWidth/7}} value={this.state.password} secureTextEntry={this.state.is_showPassword} onChangeText={password => this.setState({password})} />
                  </Item>
                  <TouchableOpacity style={{marginTop:deviceHeight/30, marginLeft:-deviceWidth/10}} onPress={() => this.click_showPasswordBtn()}>
                    {this.state.is_showPassword == true ?
                      <Image source={hide_password_icon} style={{width:deviceWidth/15, height:deviceWidth*0.86/15}} />
                    : <Image source={show_password_icon} style={{width:deviceWidth/15, height:deviceWidth*0.73/15}} />
                    }
                    
                  </TouchableOpacity>
                </View>
              </Form>

              <TouchableOpacity style={{backgroundColor:'#ff4083', width:deviceWidth*14/20, height:deviceHeight/15, marginTop:deviceHeight/20, alignItems:'center', justifyContent:'center'}} onPress={() => this.clickLoginBtn()}>
                <Text style={{color: '#fff', fontSize: 15, fontWeight: '400'}}>LOGIN</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{marginTop:deviceHeight/20, flexDirection:'row', alignItems:'center'}} onPress={() => this.clickCheckerBtn()}>
                {this.state.is_checker == true ? <Image source={checker_yes} style={styles.checkerStyle} />
                : <Image source={checker_no} style={styles.checkerStyle} />}
                
                <Text style={{color: '#818181', fontSize: 16, fontWeight: '400', marginLeft:5}}>Remember Credential</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{marginTop:deviceHeight/15}} onPress={() => this.clickHelpBtn()}>
                <Text style={{color: 'blue', fontSize: 16, fontWeight: '400'}}>Help?</Text>
              </TouchableOpacity>

            </View>

            <Spinner visible={this.state.spinner_visible} overlayColor='rgba(0,0,0,0.3)' />

          </Content>
        </Image>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    login: data => dispatch(login(data)),
  };
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, bindAction)(Login);
