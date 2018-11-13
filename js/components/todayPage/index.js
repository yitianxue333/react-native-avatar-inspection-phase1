import React, { Component } from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View, Dimensions, Image, TextInput, ScrollView, Modal } from "react-native";
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
import CalendarStrip from "react-native-calendar-strip";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
import {URLclass} from '../lib/';

const pin_icon = require("../../../images/pin_icon.png");

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;


class TodayPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      spinner_visible: false,
      today_date: moment(new Date()).format("MMM, YYYY"),
      selected_date: moment(new Date()).format("ddd, MMM DD"),
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      markers: [],
      markerRegion: {
        latitude: 37.78825,
        longitude: -122.4324
      },
      task_list: [],
      total_duration: "",
      modalVisible_map: false,
    };
    this.DoSelectImage = this.DoSelectImage.bind(this);
  }

  componentWillMount() {
    this.setState({selected_date: moment(this.props.custom_date).format("ddd, MMM DD")})
    this.setState({today_date: moment(this.props.custom_date).format("MMM, YYYY")})

    {this.call_api(this.props.custom_date)}
  }

  call_api(date) {
    this.setState({spinner_visible:true})
    var task_url = URLclass.url + 'getTaskDetails'
    var formData = new FormData();
    formData.append("user_id", this.props.login_data.user_id)
    formData.append("date", date)
    fetch(task_url, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('++++++++++++++++++++++++++++++', responseData)
      this.setState({spinner_visible:false})
      this.setState({task_list: responseData.time_desc})
      this.setState({total_duration: responseData.total_time})
    })
    .catch(function(error) {
      return error;
    })
  }

  DoSelectImage(_counterFromChild) {
    this.setModalVisible_map(true)
    var temp_map_location = {
      latitude: parseFloat(this.state.task_list[_counterFromChild].clock_in_loc[0]),
      longitude: parseFloat(this.state.task_list[_counterFromChild].clock_in_loc[1]),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
    this.setState({region: temp_map_location})

    var temp_pin_location1 = {
      latitude: parseFloat(this.state.task_list[_counterFromChild].clock_in_loc[0]),
      longitude: parseFloat(this.state.task_list[_counterFromChild].clock_in_loc[1])
    }

    var temp_pin_location2 = {
      latitude: parseFloat(this.state.task_list[_counterFromChild].clock_out_loc[0]),
      longitude: parseFloat(this.state.task_list[_counterFromChild].clock_out_loc[1])
    }

    var temp = []
    temp.push(temp_pin_location1);
    temp.push(temp_pin_location2);

    this.setState({markers: temp})
  }

  setModalVisible_map(visible) {
    this.setState({modalVisible_map: visible})
  }


  change_date(day) {
    var temp_selectedDay=moment(day.toString()).format("ddd, MMM DD")
    var temp_selectedDay1=moment(day.toString()).format("MM/DD/YYYY")
    var temp_selectedDay2=moment(day.toString()).format("MMM, YYYY")
    this.setState({selected_date: temp_selectedDay})
    this.setState({today_date: temp_selectedDay2})
    {this.call_api(temp_selectedDay1)}
  }

  show_task() {
    if (this.state.task_list.length != 0) {
      var i=-1;
      return this.state.task_list.map((data) => {
        i++;
        return (
          <Child_Task key={i} itemData={data} index={i} selectImage={this.DoSelectImage} />
        )
      })
    }
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
            <Title>{this.state.today_date}</Title>
          </Body>

          <Right style={{ flex: 1,}} />
        </Header>

        <CalendarStrip
          style={{width:deviceWidth, height:deviceHeight/6, backgroundColor:'#fafafa', marginTop:-1}}
          calendarAnimation={{type: 'sequence', duration: 100}}
          daySelectionAnimation={{type: 'background', duration: 200, highlightColor:'rgba(255,64,131,1)'}}
          calendarHeaderStyle={{color: 'white'}}
          dateNumberStyle={{color: '#515151'}}
          dateNameStyle={{color: '#515151'}}
          selectedDate = {this.state.selected_date}
          startingDate = {new Date()}
          onDateSelected = {(day) => this.change_date(day)}
        />

        <View style={{backgroundColor:'#ff4083', width:deviceWidth}}>
          <View style={{margin:deviceWidth/30}}>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 13}}>Day</Text>
              <Text style={{color: 'white', fontWeight: '400', fontSize: 13}}>Total</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: deviceHeight/150}}>
              <Text style={{color: 'white', fontWeight: '500', fontSize: 17}}>{this.state.selected_date}</Text>
              <Text style={{color: 'white', fontWeight: '500', fontSize: 17}}>{this.state.total_duration} h</Text>
            </View>
          </View>
        </View>

        <ScrollView style={{margin:deviceWidth/20, marginBottom:deviceHeight/50, marginTop:deviceHeight/50}}>
          {this.show_task()}
        </ScrollView>


        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible_map}
          onRequestClose={() => this.setModalVisible_map(false)}
          >

          <View style={{width:deviceWidth, height:deviceHeight/10, backgroundColor:'#f3f3f3', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:18, fontWeight:'700', color:'#515151', marginLeft:deviceWidth/30}}>Map</Text>
            <TouchableOpacity style={{marginRight:deviceWidth/30}} onPress={() => this.setModalVisible_map(false)}>
                <Text style={{fontSize:15, fontWeight:'600', color:'#ff4083'}}>CANCEL</Text>
            </TouchableOpacity>
          </View>

          <MapView
            style={{width:deviceWidth, height:deviceHeight*8.6/10, backgroundColor:'#a3ccff'}}
            initialRegion={this.state.region}
          >
            {this.state.markers.map(marker => (
              <Marker
                coordinate={marker}
                image={pin_icon}
              />
            ))}
          </MapView>

        </Modal>

        <Spinner visible={this.state.spinner_visible} overlayColor='rgba(0,0,0,0.3)' />


      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {

  };
}

const mapStateToProps = state => ({
  login_data: state.user.login_data,
  custom_date: state.user.custom_date
});

export default connect(mapStateToProps, bindAction)(TodayPage);


class Child_Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      markers: [],
    };
  }

  componentWillMount() {
    var temp_map_location = {
      latitude: parseFloat(this.props.itemData.clock_in_loc[0]),
      longitude: parseFloat(this.props.itemData.clock_in_loc[1]),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
    this.setState({region: temp_map_location})

    var temp_pin_location1 = {
      latitude: parseFloat(this.props.itemData.clock_in_loc[0]),
      longitude: parseFloat(this.props.itemData.clock_in_loc[1])
    }

    var temp_pin_location2 = {
      latitude: parseFloat(this.props.itemData.clock_out_loc[0]),
      longitude: parseFloat(this.props.itemData.clock_out_loc[1])
    }


    this.state.markers.push(temp_pin_location1)
    this.state.markers.push(temp_pin_location2)
  }

  testFunction(i) {
    this.props.selectImage(i)
  }

  render() {
    return (
      <TouchableOpacity style={{borderRadius:3, borderColor: '#acacac', borderWidth:1, marginBottom:deviceHeight/50}} onPress={() => this.testFunction(this.props.index)}>
        <MapView
          style={{width:deviceWidth*18/20, height:deviceHeight/4, backgroundColor:'#a3ccff'}}
          initialRegion={this.state.region}
          zoomEnabled = {false}
          scrollEnabled = {false}
        >
          {this.state.markers.map(marker => (
            <Marker
              coordinate={marker}
              image={pin_icon}
            />
          ))}
        </MapView>

        <View style={{height:deviceHeight/10, margin:deviceWidth/20}}>
          <Text style={{fontWeight:'400', fontSize:13, color:'#515151'}}>CLOCK IN: {this.props.itemData.clock_in_time} @ {this.props.itemData.clock_in_add}</Text>
          <Text style={{fontWeight:'400', fontSize:13, color:'#515151'}}>CLOCK OUT: {this.props.itemData.clock_out_time} @ {this.props.itemData.clock_out_add}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}