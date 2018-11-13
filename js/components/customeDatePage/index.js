import React, { Component } from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View, Dimensions, Image, TextInput, ScrollView } from "react-native";
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
import moment from 'moment';
import { send_date } from "../../actions/user";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const person_icon = require("../../../images/person.png");
const insured_icon = require("../../../images/insured_icon.png");
const phone_icon = require("../../../images/phone.png");
const claim_icon = require("../../../images/claim.png");
const policy_icon = require("../../../images/policy.png");
const calendar_icon = require("../../../images/calendar.png");
const pin_icon = require("../../../images/pin_icon.png");
const camera_icon = require("../../../images/camera.png");
const arrow_icon = require("../../../images/arrow.png");


class CustomDatePage extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
    };
    this.DoSelectOne = this.DoSelectOne.bind(this);
  }

  componentWillMount() {
    
  }

  DoSelectOne(_counterFromChild) {
    var temp = moment(this.props.task_data.time_desc[_counterFromChild].date).format("MM/DD/YYYY")
    this.props.send_date(temp)
    this.props.navigation.navigate("TodayPage")
  }

  getDuration(duration) {
    var temp_minute = Math.floor(duration / 60) % 60
    var temp_second = duration % 60
    var temp_hour = Math.floor(duration /60 / 60)

    if (temp_hour <= 9) {
      hour = '0' + temp_hour.toString()
    } else {
      hour = temp_hour
    }

    if (temp_minute <= 9) {
      minute = '0' + temp_minute.toString()
    } else {
      minute = temp_minute
    }

    if (temp_second <= 9) {
      second = '0' + temp_second.toString()
    } else {
      second = temp_second
    }

    var sss = hour + ":" + minute + ":" + second

    return sss  
  }

  show_taskList() {
    var i=-1;
    return this.props.task_data.time_desc.map((data) => {
      i++;
      return (
        <Child_Task key={i} itemData={data} index={i} selectOne={this.DoSelectOne} />
      )
    })
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
            <Title>Task List</Title>
          </Body>

          <Right style={{ flex: 1,}} />
        </Header>

        <View style={{backgroundColor:'#ff4083', width:deviceWidth}}>
          <View style={{margin:deviceWidth/30}}>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 13}}>WEEK</Text>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 13}}>TOTAL</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: deviceHeight/150}}>
              <Text style={{color: 'white', fontWeight: '500', fontSize: 17}}>{moment(this.props.task_data.time_desc[0].date).format("DD MMM")} - {moment(this.props.task_data.time_desc[this.props.task_data.time_desc.length-1].date).format("DD MMM")}</Text>
              <Text style={{color: 'white', fontWeight: '500', fontSize: 17}}>{this.getDuration(this.props.task_data.total_time)} h</Text>
            </View>
          </View>
        </View>

        <ScrollView style={{marginTop:deviceHeight/70}}>
          {this.show_taskList()}
        </ScrollView>

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_date: data => dispatch(send_date(data)),
  };
}

const mapStateToProps = state => ({
  task_data: state.user.task_data
});

export default connect(mapStateToProps, bindAction)(CustomDatePage);


class Child_Task extends Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  getDuration(duration) {
    var temp_minute = Math.floor(duration / 60) % 60
    var temp_second = duration % 60
    var temp_hour = Math.floor(duration /60 / 60)

    if (temp_hour <= 9) {
      hour = '0' + temp_hour.toString()
    } else {
      hour = temp_hour
    }

    if (temp_minute <= 9) {
      minute = '0' + temp_minute.toString()
    } else {
      minute = temp_minute
    }

    if (temp_second <= 9) {
      second = '0' + temp_second.toString()
    } else {
      second = temp_second
    }

    var sss = hour + ":" + minute + ":" + second

    return sss  
  }


  testFunction(i) {
    this.props.selectOne(i)
  }

  render() {
    return (
      <TouchableOpacity style={{width:deviceWidth}} onPress={() => this.testFunction(this.props.index)}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:deviceWidth/30, marginRight:deviceWidth/30}}>
          <Text style={{color:'#515151', fontSize:15, fontWeight:'400'}}>{moment(this.props.itemData.date).format("ddd, MMM DD")}</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            {this.props.itemData.is_clocked_in == false ?
              <Text style={{color:'#515151', fontSize:14, fontWeight:'400'}}>OFF</Text>
            : <Text style={{color:'#515151', fontSize:15, fontWeight:'400'}}>{this.getDuration(this.props.itemData.time_diff)} h</Text>
            }
            <Image source={arrow_icon} style={{width:deviceWidth/70, height:deviceWidth*69/39/70, marginLeft:deviceWidth/50}} />
          </View>
        </View>

        <View style={{backgroundColor:'#acacac', height:1, width:deviceWidth, marginTop:deviceHeight/70, marginBottom:deviceHeight/70}} />
      </TouchableOpacity>
    );
  }
}