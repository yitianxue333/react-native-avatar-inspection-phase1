import React, { Component } from "react";
import { AsyncStorage,TouchableOpacity, View, Dimensions, Image, TextInput, ScrollView, Modal, Alert, NetInfo } from "react-native";
import { connect } from "react-redux";
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
import { Grid, Row } from "react-native-easy-grid";
import { send_claimList, send_claimDetailData, send_claimNumber, send_taskList, send_date, send_claimStatus } from "../../actions/user";
import { openDrawer } from "../../actions/drawer";
import styles from "./styles";
import moment from 'moment';
import {URLclass} from '../lib/';
import Spinner from 'react-native-loading-spinner-overlay';
import CalendarPicker from 'react-native-calendar-picker';
import {requestPermission, checkPermission} from 'react-native-android-permissions';
import CalendarStrip from "react-native-calendar-strip";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const search_icon = require("../../../images/search_icon.png");
const arrow_down_icon = require("../../../images/arrow-down.png");
const arrow_down_white_icon = require("../../../images/arrow-down-white.png");
const double_arrow_down_icon = require("../../../images/double_arrow.png");

class Home extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      claim_number: "",
      timesheet_date: moment(new Date()).format("MMM DD, YYYY"),
      is_clockIn: false,
      duration: 0,
      modalVisible: false,
      spinner_visible: false,
      claim_array: [],
      longitude: 0,
      latitude: 0,
      selectedStartDate: null,
      selectedEndDate: null,
      modalVisible: false,
      
    };
    this.DoSelectClaim = this.DoSelectClaim.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentWillMount() {

    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({spinner_visible:true})

        var claim_url = URLclass.url + 'searchClaim'
        var formData = new FormData();
        formData.append("user_id", this.props.login_data.user_id)
        fetch(claim_url, {
          method: 'POST',
          body: formData
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 1) {
            this.setState({spinner_visible:false})
            this.props.send_claimList(responseData)
            AsyncStorage.setItem('saved_data', JSON.stringify(responseData));
            this.setState({claim_array: responseData.claim_list})
            {this.getTimeDuration_api()}
          } else {
            var self=this
            self.setState({spinner_visible:false})
            setTimeout(function(){
              Alert.alert("There is no claim data.")
              }, 300); 
            }
          })
        .catch(function(error) {
          return error;
        })
      } else {
        AsyncStorage.getItem("saved_data").then((value) => {
          if (value == null) {
            Alert.alert("There are no any data in local.")    
          } else {
            var temp = JSON.parse(value)
            this.setState({claim_array: temp.claim_list})
          }
        }).done();
      }
    })
  }

  componentDidMount() {
    AsyncStorage.getItem("saved_username").then((value) => {
    }).done();

  }

  getTimeDuration_api() {
    this.setState({spinner_visible:true})
    var duration_url = URLclass.url + 'isAllreadyClockIn'
    var formData = new FormData();
    formData.append("user_id", this.props.login_data.user_id)
    fetch(duration_url, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({spinner_visible:false})
      if (responseData.status == 1) {
        this.setState({is_clockIn: true})
        this.setState({duration: responseData.seconds})
        {this.click_ClockInBtn()}
      } else {
        this.setState({is_clockIn: false})
      }
    })
    .catch(function(error) {
      return error;
    })
  }



  DoSelectClaim(_counterFromChild) {
    NetInfo.isConnected.fetch().then(isConnected => { 
      if (isConnected) {
        this.setState({spinner_visible:true})
        var claim_url = URLclass.url + 'getContact'
        var formData = new FormData();
        formData.append("user_id", this.props.login_data.user_id)
        formData.append("inspectionDetail_PK", this.props.claim_data.claim_list[_counterFromChild].InspBatchDetailId_PK)
        fetch(claim_url, {
          method: 'POST',
          body: formData
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 1) {
            this.setState({spinner_visible:false})
            this.props.send_claimDetailData(responseData)
            var temp_key = "saved_claimDetailData" + this.props.claim_data.claim_list[_counterFromChild].InspBatchDetailId_PK.toString()
            AsyncStorage.setItem(temp_key, JSON.stringify(responseData));
            this.props.send_claimNumber(_counterFromChild)
            AsyncStorage.setItem('saved_claimNumber', this.props.claim_data.claim_list[_counterFromChild].InspBatchDetailId_PK.toString());
            if (this.props.claim_data.claim_list[_counterFromChild].Inspection_Last_Status == "CLOSE") {
              this.props.send_claimStatus("no")
            } else {
              this.props.send_claimStatus("yes")
            }
            this.props.navigation.navigate("DetailPage")
          } else {
            var self=this
            self.setState({spinner_visible:false})
            setTimeout(function(){
              Alert.alert("Please try later.")
              }, 300); 
            }
          })
        .catch(function(error) {
          return error;
        })
      } else {
         AsyncStorage.getItem("saved_data").then((value) => {
          if (value == null) {
            Alert.alert("There are no any data in local.")    
          } else {
            var temp = JSON.parse(value)
            AsyncStorage.setItem('saved_claimNumber', temp.claim_list[_counterFromChild].InspBatchDetailId_PK.toString());
            if (temp.claim_list[_counterFromChild].Inspection_Last_Status == "CLOSE") {
              this.props.send_claimStatus("no")
            } else {
              this.props.send_claimStatus("yes")
            }
          }
        }).done();
        this.props.send_claimNumber(_counterFromChild)
        this.props.navigation.navigate("BlankPage")
      }
    })
  }


  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: moment(date).format("MMM DD, YYYY"),
      });
    } else {
      this.setState({
        selectedStartDate: moment(date).format("MMM DD, YYYY"),
        selectedEndDate: null,
      });
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  click_ClockInBtn() {

    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({spinner_visible:true})
            this.setState({is_clockIn: true})
    
            var temp = this.state.duration;
            this._interval = setInterval( () => {
              temp += 1;
              this.setState({duration: temp})
            }, 1000)

            
            var duration_url = URLclass.url + 'checkInOut'

            var formData = new FormData();
            formData.append("user_id", this.props.login_data.user_id)
            formData.append("inspectioninfo_pk", " ")
            formData.append("action", "CLOCK_IN")
            formData.append("latitude", position.coords.latitude)
            formData.append("longitude", position.coords.longitude)
            fetch(duration_url, {
              method: 'POST',
              body: formData
            })
            .then((response) => response.json())
            .then((responseData) => {
              this.setState({spinner_visible:false})
              
            })
            .catch(function(error) {
              return error;
            })

          },
          (error) => Alert.alert('To continu, turn on device location, which uses Google\'s location service.'),
          { enableHighAccuracy: false, timeout: 20000 },
        );
      } else {
        Alert.alert("You can't use this function in offline mode.")
      }
    })
  }

  click_ColciOutBtn() {    
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        

        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({spinner_visible:true})
            this.setState({is_clockIn: false})
            clearInterval(this._interval);

            var duration_url = URLclass.url + 'checkInOut'

            var formData = new FormData();
            formData.append("user_id", this.props.login_data.user_id)
            formData.append("inspectioninfo_pk", "3")
            formData.append("action", "CLOCK_OUT")
            formData.append("latitude", position.coords.latitude)
            formData.append("longitude", position.coords.longitude)
            fetch(duration_url, {
              method: 'POST',
              body: formData
            })
            .then((response) => response.json())
            .then((responseData) => {
              this.setState({spinner_visible:false})
              
            })
            .catch(function(error) {
              return error;
            })
          },
          (error) => Alert.alert('GPS is off. Turn it on.'),
          { enableHighAccuracy: false, timeout: 20000 },
        );
      } else {
        Alert.alert("You can't use this function in offline mode.")
      }
    })
  }

  click_todayBtn() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.props.send_date(moment(new Date()).format("MM/DD/YYYY"))
        this.props.navigation.navigate("TodayPage")
      } else {
        Alert.alert("You can't use this function in offline mode.")
      }
    })
    
  }
  
  click_customDateBtn() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setModalVisible(true)
      } else {
        Alert.alert("You can't use this function in offline mode.")
      }
    })
  }

  click_OKBtn() {
    

    var startDate = new Date(this.state.selectedStartDate); //YYYY-MM-DD
    var endDate = new Date(this.state.selectedEndDate); //YYYY-MM-DD

     ////////////// GET DATE array between 2 days
    var getDateArray = function(start, end) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }
    var dateArr = getDateArray(startDate, endDate);


    if (this.state.selectedEndDate == null) {
      Alert.alert("Please select the days.")
      return;
    } else {
      this.setState({spinner_visible:true})
      var list_url = URLclass.url + 'getTaskListDetails'
      var formData = new FormData();
      formData.append("user_id", this.props.login_data.user_id)
      formData.append("from_date", moment(this.state.selectedStartDate).format("YYYY-MM-DD"))
      formData.append("to_date", moment(this.state.selectedEndDate).format("YYYY-MM-DD"))
      fetch(list_url, {
        method: 'POST',
        body: formData
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({spinner_visible:false})
        this.props.send_taskList(responseData)
        this.props.navigation.navigate("CustomDatePage")        
      })
      .catch(function(error) {
        return error;
      })
      this.setModalVisible(false)
    }

  }

  click_searchBtn() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({spinner_visible:true})
        var claim_url = URLclass.url + 'searchClaim'
        var formData = new FormData();
        formData.append("user_id", this.props.login_data.user_id)
        formData.append("claim_number", this.state.claim_number)
        fetch(claim_url, {
          method: 'POST',
          body: formData
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.status == 1) {
            this.setState({spinner_visible:false})
            this.props.send_claimList(responseData)
            this.setState({claim_array: responseData.claim_list})
          } else {
            var self=this
            self.setState({spinner_visible:false})
            setTimeout(function(){
              Alert.alert("There is no claim data.")
              }, 300); 
            }
          })
        .catch(function(error) {
          return error;
        })
      } else {
        Alert.alert("You can't search claims in offline mode.")
      }
    })
  }

  showClaim_searchPage() {
    return (
      <View style={{backgroundColor:'#224258', width:deviceWidth, height:deviceHeight/12, alignItems:'center', justifyContent:'center'}}>
        <View style={{backgroundColor:'white', width:deviceWidth*19.2/20, height:deviceHeight/16, borderRadius:3, justifyContent:'space-between', alignSelf:'center', flexDirection:'row'}}>
          <TextInput underlineColorAndroid='rgba(0,0,0,0)' style={{height:deviceHeight/15, width:deviceWidth*17/20, paddingLeft:deviceWidth/40}} placeholder='Enter Claim Number' onChangeText={claim_number => this.setState({ claim_number })} />
          <TouchableOpacity style={{height:deviceHeight/16, width:deviceHeight/16, justifyContent:'center'}} onPress={() => this.click_searchBtn()}>
            <Image source={search_icon} style={styles.searchIconStyle} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  showClaimPage() {
    if (this.state.claim_array.length != 0) {
      var i=-1;
      return this.state.claim_array.map((data) => {
        i++;
        return (
          <Child_Claim key={i} itemData={data} index={i} selectClaim={this.DoSelectClaim} />
        )
      })
    }
  }

  show_timeDuration() {
    var temp_minute = Math.floor(this.state.duration / 60) % 60
    var temp_second = this.state.duration % 60
    var temp_hour = Math.floor(this.state.duration /60 / 60)

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

    return (
      <Text style={{color:'#616161', fontSize:55, fontWeight:'400'}}>{hour}:{minute}:{second}
      </Text>
    )
  }

  showTimesheetPage() {
    return (
      <View>
        <View style={{backgroundColor:'#eceff1', height:deviceHeight/5, alignItems:'center'}}>
          <Text style={{color:'#717171', fontSize:20, fontWeight:'400', marginTop:deviceHeight/30}}>{this.state.timesheet_date}</Text>
          {this.show_timeDuration()}
        </View>
        <View style={{margin:deviceWidth/30}}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            {this.state.is_clockIn == false ?
              <TouchableOpacity style={{backgroundColor:'#ff4083', width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.click_ClockInBtn()}>
                <Text style={{color: '#fff', fontSize: 15, fontWeight: '400'}}>CLOCK IN</Text>
              </TouchableOpacity>
            : <View style={{backgroundColor:'#eceff1', width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}}>
                <Text style={{color: '#818181', fontSize: 15, fontWeight: '400'}}>CLOCK IN</Text>
              </View>
            }
            {this.state.is_clockIn == true ?
              <TouchableOpacity style={{backgroundColor:'#ff4083', width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}} onPress={() => this.click_ColciOutBtn()}>
                <Text style={{color: '#fff', fontSize: 15, fontWeight: '400'}}>CLOCK OUT</Text>
              </TouchableOpacity>
            : <View style={{backgroundColor:'#eceff1', width:deviceWidth/2.3, height:deviceHeight/15, alignItems:'center', justifyContent:'center'}}>
                <Text style={{color: '#818181', fontSize: 15, fontWeight: '400'}}>CLOCK OUT</Text>
              </View>
            }
            
            
          </View>

          <TouchableOpacity style={{marginTop:deviceHeight/20}} onPress={() => this.click_todayBtn()}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: '400', marginLeft:deviceWidth/50}}>Today</Text>
            <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/100}} />
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop:deviceHeight/40}} onPress={() => this.click_customDateBtn()}>
            <Text style={{color: 'black', fontSize: 15, fontWeight: '400', marginLeft:deviceWidth/50}}>Custom date</Text>
            <View style={{backgroundColor:'#acacac', height:1, marginTop:deviceHeight/100}} />
          </TouchableOpacity>
        </View>
        
      </View>
    )
  }

  clickBackBtn() {
    AsyncStorage.setItem('saved_remember_userID', "no");
    this.props.navigation.goBack(null)
  }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const startDate  =  selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';

    return (
      <Container style={styles.container}>
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
            <Title>Avatar Claim Inspection</Title>
          </Body>

          <Right style={{ flex: 1,}}>
          </Right>
        </Header>

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
          >
          <View style={{width:deviceWidth, height:deviceHeight, backgroundColor:'rgba(0,0,0,0.7)', alignItems:'center'}}>
            <View style={{backgroundColor: '#FFF', marginTop: deviceHeight/15, width:deviceWidth/1.15, height:deviceHeight*8/10, borderWidth:1, borderColor:'#acacac', borderRadius:3}}>
              <View style={{marginTop:deviceHeight/30}}>
                <CalendarPicker
                  width = {deviceWidth/1.15}
                  startFromMonday={true}
                  allowRangeSelection={true}
                  todayBackgroundColor="#f2e6ff"
                  selectedDayColor="#ff4083"
                  selectedDayTextColor="#FFFFFF"
                  onDateChange={this.onDateChange}
                />
         
                <View style={{marginTop:deviceHeight/10, marginLeft:deviceWidth/20}}>
                  <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>From Date :  { startDate }</Text>
                  <Text style={{fontSize:15, fontWeight:'400', color:'#515151'}}>To Date :  { endDate }</Text>
                </View>
              </View>

              <View style={{marginTop:deviceHeight/10, flexDirection:'row', justifyContent:'space-between', marginBottom:deviceHeight/30}}>
                <TouchableOpacity style={{marginLeft:deviceWidth/6}} onPress={() => this.setModalVisible(false)}>
                    <Text style={{fontSize:15, fontWeight:'600', color:'#ff4083'}}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight:deviceWidth/6}} onPress={() => this.click_OKBtn()}>
                    <Text style={{fontSize:15, fontWeight:'600', color:'#ff4083'}}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        
        <Tabs initialPage={1} tabBarPosition='overlayBottom' tabBarUnderlineStyle={{backgroundColor:'#ff4083'}}>
          <Tab heading="TIMESHEET" tabStyle={{backgroundColor:'#fafafa'}} activeTabStyle={{backgroundColor:'#fafafa'}} activeTextStyle={{color:'#515151'}} textStyle={{color:'#818181'}}>
            {this.showTimesheetPage()}
          </Tab>
          <Tab heading="SEARCH CLAIM" tabStyle={{backgroundColor:'#fafafa'}} activeTabStyle={{backgroundColor:'#fafafa'}} activeTextStyle={{color:'#515151', fontSize:15}} textStyle={{color:'#818181'}}>
            <View>
              {this.showClaim_searchPage()}
              <ScrollView style={{width:deviceWidth, height:deviceHeight*2/3}}>
                {this.showClaimPage()}
              </ScrollView>
            </View>
          </Tab>
        </Tabs>

        <Spinner visible={this.state.spinner_visible} overlayColor='rgba(0,0,0,0.3)' />

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_claimList: data => dispatch(send_claimList(data)),
    send_date: data => dispatch(send_date(data)),
    send_claimDetailData: data => dispatch(send_claimDetailData(data)),
    send_claimNumber: data => dispatch(send_claimNumber(data)),
    send_taskList: data => dispatch(send_taskList(data)),
    send_claimStatus: data => dispatch(send_claimStatus(data)),
    openDrawer: () => dispatch(openDrawer())
  };
}
const mapStateToProps = state => ({
  name: state.user.name,
  list: state.list.list,
  login_data: state.user.login_data,
  claim_data: state.user.claim_data
});

export default connect(mapStateToProps, bindAction)(Home);




class Child_Claim extends Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }

  testFunction(i) {
    this.props.selectClaim(i)
  }

  render() {
    return (
      <TouchableOpacity style={{width:deviceWidth}} onPress={() => this.testFunction(this.props.index)}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:deviceHeight/50, marginRight: deviceWidth/40, marginLeft:deviceWidth/40}}>
          <Text style={{color:'black', fontSize:17, fontWeight:'500'}}>{this.props.itemData.Claim_No}</Text>
          <Text style={{color:'#818181', fontSize:15, fontWeight:'400'}}>{this.props.itemData.ContractInspTypeDisplay}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginRight: deviceWidth/40, marginLeft:deviceWidth/40}}>
          <Text style={{color:'#818181', fontSize:15, fontWeight:'400'}}>{this.props.itemData.Insured_FullLegalName}</Text>
          <Text style={{color:'#818181', fontSize:15, fontWeight:'400', marginRight:deviceWidth/20}}>{this.props.itemData.Inspection_Last_Status}</Text>
        </View>
        <View style={{height:1, backgroundColor:'#acacac', width:deviceWidth, marginTop:deviceWidth/50}} />
      </TouchableOpacity>
    );
  }
}