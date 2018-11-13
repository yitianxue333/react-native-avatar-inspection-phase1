import React, { Component } from "react";
import { connect } from "react-redux";
import { TouchableOpacity, View, Dimensions, Image, TextInput, ScrollView, Alert, NetInfo, AsyncStorage } from "react-native";
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
  Body, Tab, Tabs, TabHeading, Input, Thumbnail
} from "native-base";
import styles from "./styles";
// import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import {URLclass} from '../lib/';
import moment from 'moment';
import { send_addedPhotoItem, send_editedPhotoItem } from "../../actions/user";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const ok_icon = require("../../../images/ok.png");
const camera_icon = require("../../../images/camera1.png");


class CameraPage extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      spinner_visible: false,
      is_homeExterior: true,
      is_homeRoof: false,
      is_homeInterior: false,
      avatarSource_array:[],
      description: "",
      type_list: [],
      tag_list: [],
      selected_type_index: 0,
      selected_tag_index: -1,
      selected_type_id: 1,
      selected_tag_id: 1,
      tag_title: "",

      is_photo_later: false,
      saved_insp_batchdetail_pk: 1,
      saved_inspectioninfo_pk: 1,
      saved_tag_pk: 1,
      saved_tag_group_pk: 1,
      saved_description: "",
      saved_Filedata: [],
      saved_userID: 1,
    };
    this.DoSelectType = this.DoSelectType.bind(this);
    this.DoSelectTag = this.DoSelectTag.bind(this);
  }

  componentWillMount() {
    if (this.props.edit_photo_data == null) {
      this.setState({description: ""})
    } else {
      this.setState({description: this.props.edit_photo_data.description})
    }

    // this.setState({type_list: this.props.type_list})
    // this.setState({tag_list: this.props.tag_list})
    this.state.type_list = this.props.type_list
    this.state.tag_list = this.props.tag_list
    if (this.props.edit_photo_data != null) {
      {this.getTypeIndex_editPhoto()}
      {this.getTagIndex_editPhoto()}
    }
    
  }



  getTypeIndex_editPhoto() {
    var i = -1
    return this.state.type_list.map((data) => {
      i ++
      if (data.insp_file_groupid_fk == this.props.edit_photo_data.group_tag_pk) {
        this.setState({selected_type_index: i})
        this.setState({selected_type_id: this.props.edit_photo_data.group_tag_pk})
      }
    })
  }

  getTagIndex_editPhoto() {
    var temp = []
    this.state.tag_list.map((data) => {
      if (data.insp_file_groupid_fk == this.props.edit_photo_data.group_tag_pk) {
        temp.push(data)
      }
    })

    var i = -1
    return temp.map((data) => {
      i ++
      if (data.insp_file_tagid_fk == this.props.edit_photo_data.tag_Pk) {
        this.setState({selected_tag_index: i})
        this.setState({selected_tag_id: this.props.edit_photo_data.tag_Pk})
      }
    })
  }


  DoSelectType(_countFromChild) {
    this.setState({selected_type_index: _countFromChild})
    this.setState({selected_tag_index: -1})
    this.setState({selected_type_id: this.state.type_list[_countFromChild].insp_file_groupid_fk})
  }

  DoSelectTag(_countFromChild, id) {
    console.log('=================', _countFromChild)
    console.log('=================', this.state.tag_list[_countFromChild])
    console.log('=================', this.state.selected_type_id)
    this.setState({selected_tag_index: _countFromChild})
    this.setState({selected_tag_id: id})

    var temp = []
    this.state.tag_list.map((data) => {
      if (data.insp_file_groupid_fk == this.state.selected_type_id) {
        temp.push(data)
      }
    })
    this.setState({tag_title: temp[_countFromChild].tag_display})
    console.log('++++++++++++++++++', temp[_countFromChild])

  }

  click_cameraCaptureBtn() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
          skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
      }
      else if (response.error) {
      }
      else if (response.customButton) {
      }
      else {
        var temp_array = this.state.avatarSource_array
        temp_array.push(response.uri)
        this.setState({avatarSource_array: temp_array})
      }
    });
  }


  show_type() {
    if (this.state.type_list.length != 0) {
      var i=-1;
      return this.state.type_list.map((data) => {
        i++;
        if (i % 2 == 0) {
          return (
            <View style={{width:deviceWidth/2.5, height:deviceHeight/14}} key={i}>
              <Child_Type itemData={data} index={i} selectedIndex={this.state.selected_type_index} selectType={this.DoSelectType} />
            </View>
          )
        } else {
          return (
            <View style={{width:deviceWidth/2.5, height:deviceHeight/14, marginLeft:deviceWidth/2.5, marginTop:-deviceHeight/14}} key={i}>
              <Child_Type itemData={data} index={i} selectedIndex={this.state.selected_type_index} selectType={this.DoSelectType} />
            </View>
          )
        }
      })
    }
  }

  show_tag() {
    if (this.state.tag_list.length != 0) {
      var temp = []
      this.state.tag_list.map((data) => {
        if (data.insp_file_groupid_fk == this.state.type_list[this.state.selected_type_index].insp_file_groupid_fk) {
          temp.push(data)
        }
      })

      var i=-1;
      return temp.map((data) => {
        i++;
        
        if (i % 2 == 0) {
          return (
            <View style={{width:deviceWidth/2.5, height:deviceHeight/14}} key={i}>
              <Child_Tag itemData={data} index={i} selectedIndex={this.state.selected_tag_index} selectedTypeID={this.state.type_list[this.state.selected_type_index].insp_file_groupid_fk} selectTag={this.DoSelectTag} />
            </View>
          )
        } else {
          return (
            <View style={{width:deviceWidth/2.5, height:deviceHeight/14, marginLeft:deviceWidth/2.5, marginTop:-deviceHeight/14}} key={i}>
              <Child_Tag itemData={data} index={i} selectedIndex={this.state.selected_tag_index} selectedTypeID={this.state.type_list[this.state.selected_type_index].insp_file_groupid_fk} selectTag={this.DoSelectTag} />
            </View>
          )
        }
      })
    }
  }

  show_capturedPhotos() {
    if (this.state.avatarSource_array.length != 0) {
      var i=-1;
      return this.state.avatarSource_array.map((data) => {
        i++;
        if (i % 3 == 0) {
          return (
            <View style={{width:deviceWidth*14/50, height:deviceWidth*0.75*14/50}} key={i}>
              <Child_Photo itemData={data} index={i} />
            </View>
          )
        } else if (i% 3 == 1) {
          return (
            <View style={{width:deviceWidth*14/50, height:deviceWidth*0.75*14/50, marginLeft:deviceWidth*14.5/50, marginTop:-deviceWidth*0.75*14/50}} key={i}>
              <Child_Photo itemData={data} index={i} />
            </View>
          )
        } else {
          return (
            <View style={{height:deviceWidth*0.75*14/50, width:deviceWidth*14/50, marginLeft:deviceWidth*29/50, marginTop:-deviceWidth*0.75*14/50}} key={i}>
              <Child_Photo itemData={data} index={i} />
            </View>
          )
        }
     })
    }
  }

  show_editPhoto() {
    return (
      <View style={{borderColor:'#acacac', borderWidth:1, width:deviceWidth*43/50, height:deviceWidth*28/50}}>
        <Image source={{uri: this.props.edit_photo_data.docurl}} style={{width:deviceWidth*46/50, height:deviceWidth*28/50}} />
      </View>
    );
  }

  click_OKBtn() {
    if (this.props.edit_photo_data == null) {
      if (this.state.avatarSource_array.length == 0) {
        Alert.alert("Please capture/upload the photos.")
      } else if (this.state.selected_tag_index == -1) {
        Alert.alert("Please select photo tag.")
      } else {

        var temp_index = 0

        NetInfo.isConnected.fetch().then(isConnected => {
          if (isConnected) {

            for (var i=0; i<this.state.avatarSource_array.length; i++) {
              this.setState({spinner_visible:true})
              var upload_url = URLclass.url + 'saveResizedImage'
              var formData = new FormData();
              formData.append("user_id", this.props.login_data.user_id)
              formData.append("insp_batchdetail_pk", this.props.claim_data.claim_list[this.props.claim_number].InspBatchDetailId_PK)
              formData.append("inspectioninfo_pk", this.props.claim_data.claim_list[this.props.claim_number].InspectionInfoId_PK)
              formData.append("tag_pk", this.state.selected_tag_id)
              formData.append("tag_group_pk", this.state.selected_type_id)
              formData.append("description", this.state.description)
              formData.append("Filedata", {uri: this.state.avatarSource_array[i], name: 'selfie.jpg', type: 'image/jpg'})
              fetch(upload_url, {
                method: 'POST',
                body: formData
              })
              .then((response) => response.json())
              .then((responseData) => {
                if (responseData.status == 0) {
                  var self=this
                  self.setState({spinner_visible:false})
                  AsyncStorage.setItem('is_photo_upload_later', "no");
                  setTimeout(function(){
                    Alert.alert(responseData.error_msg)
                    }, 300); 
                } else {

                  var tempppppp = {
                    "inspfileuploadid_pk" : responseData.inspfileupload_taggroupid_pk,
                    "title" : this.state.type_list[this.state.selected_type_index].group_display + "  " + this.state.tag_title,
                    "description" : this.state.description,
                    "tag_Pk" : this.state.selected_tag_id.toString(),
                    "group_tag_pk" : this.state.selected_type_id.toString(),
                    "file_group_tag_pk" : this.state.selected_type_id.toString(),
                    "docurl" : this.state.avatarSource_array[temp_index]
                  }
                  console.log('----------------------', tempppppp, '-----------------------', this.state.selected_tag_index, this.state.tag_list)
                  this.props.send_addedPhotoItem(tempppppp);


                  temp_index ++;
                  if (temp_index == this.state.avatarSource_array.length) {
                    AsyncStorage.setItem('is_photo_upload_later', "no");
                    this.setState({is_photo_later: false})
                    this.setState({spinner_visible:false})
                    this.props.navigation.state.params.onNavigateBack(this.state.foo)
                    this.props.navigation.goBack(null)
                  }
                }
              })
              .catch(function(error) {
                this.setState({spinner_visible:false})
                return error;
              })
            }
          } else {
            AsyncStorage.getItem("saved_claimNumber").then((value) => {
              if (value != null) {
                var temp_temp = "saved_claim_count" + value.toString()
                AsyncStorage.getItem(temp_temp).then((count) => {
                  if (count != null) {
                    var temp_count = parseInt(count) + 1;

                    var temp1 = "is_photo_upload_later" + value.toString()
                    AsyncStorage.setItem(temp1, "yes");

                    var temp2 = "saved_insp_batchdetail_pk" + value.toString()
                    AsyncStorage.setItem(temp2, value.toString());

                    var temp3 = "saved_inspectioninfo_pk" + value.toString()
                    AsyncStorage.setItem(temp3, value.toString());

                    var temp4 = "saved_tag_pk" + value.toString() + "_" + temp_count.toString()
                    AsyncStorage.setItem(temp4, this.state.selected_tag_id.toString());

                    var temp5 = "saved_tag_group_pk" + value.toString() + "_" + temp_count.toString()
                    AsyncStorage.setItem(temp5, this.state.selected_type_id.toString());

                    var temp6 = "saved_description" + value.toString() + "_" + temp_count.toString()
                    AsyncStorage.setItem(temp6, this.state.description);

                    var temp7 = "saved_Filedata" + value.toString() + "_" + temp_count.toString()
                    AsyncStorage.setItem(temp7, JSON.stringify(this.state.avatarSource_array));

                    AsyncStorage.setItem(temp_temp, temp_count.toString());

                    Alert.alert("Saved to local. Will upload when online.")
                    
                    this.props.navigation.state.params.onNavigateBack(this.state.foo)
                    this.props.navigation.goBack(null)
                  }
                }).done();                  
              } else {
                Alert.alert("You can't upload photo because this claim was not saved in local.")
              }
            }).done();
          }
        })
      }
    } else {
      this.setState({spinner_visible:true})
      var upload_url = URLclass.url + 'updateImage'
      var formData = new FormData();
      formData.append("user_id", this.props.login_data.user_id)
      formData.append("inspfileuploadtempid_pk", this.props.edit_photo_data.inspfileuploadid_pk)
      formData.append("tag_group_pk", this.state.selected_type_id)
      formData.append("tag_pk", this.state.selected_tag_id)
      formData.append("description", this.state.description)
      fetch(upload_url, {
        method: 'POST',
        body: formData
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == 0) {
          var self=this
          self.setState({spinner_visible:false})
        } else {
          this.setState({spinner_visible: false})


          var tempppppp = {
            "inspfileuploadid_pk" : this.props.edit_photo_data.inspfileuploadid_pk,
            "title" : this.state.type_list[this.state.selected_type_index].group_display + "  " + this.state.tag_title,
            "description" : this.state.description,
            "tag_Pk" : this.state.selected_tag_id.toString(),
            "group_tag_pk" : this.state.selected_type_id.toString(),
            "file_group_tag_pk" : this.state.selected_type_id.toString(),
            "docurl" : this.props.edit_photo_data.docurl
          }
          console.log('----------------------', tempppppp, '-----------------------', this.state.selected_tag_index, this.state.tag_list)
          this.props.send_editedPhotoItem(tempppppp);

          this.props.navigation.state.params.onNavigateBack(this.state.foo)
          this.props.navigation.goBack(null)
        }
      })
      .catch(function(error) {
        this.setState({spinner_visible:false})
        return error;
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
            <Title>Add Photos</Title>
          </Body>

          <Right style={{ flex: 1,}} />
        </Header>

        <Content style={{backgroundColor:'#fafafa'}}>
          <View style={{backgroundColor:'#fff', margin:deviceWidth/30, borderColor:'#e5e5e5', borderWidth:1, borderRadius:3}}>
            <Text style={{margin:deviceWidth/20, fontWeight:'400', fontSize:18}}>Photo Type</Text>
            <View style={{backgroundColor:'#657682', height:2, marginLeft:deviceWidth/50, marginRight:deviceWidth/50}} />

            <Text style={{margin:deviceWidth/20, fontWeight:'400', fontSize:13, color:'#818181'}}>Select Photo Type</Text>
            <View style={{marginLeft:deviceWidth/10, marginRight:deviceWidth/10}}>
              {this.show_type()}
            </View>

            <View style={{backgroundColor:'#d8dde5', height:1, marginLeft:deviceWidth/25, marginRight:deviceWidth/25, marginTop:deviceHeight/30}} />

            <Text style={{margin:deviceWidth/20, fontWeight:'400', fontSize:13, color:'#818181'}}>Select Photo Tag</Text>
            <View style={{marginLeft:deviceWidth/10, marginRight:deviceWidth/10, marginBottom:deviceHeight/30}}>
              {this.show_tag()}
            </View>

          </View>


          <View style={{backgroundColor:'#fff', margin:deviceWidth/30, borderColor:'#e5e5e5', borderWidth:1, borderRadius:3}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Text style={{margin:deviceWidth/20, fontWeight:'400', fontSize:18}}>Capture Photo</Text>
              {this.props.edit_photo_data == null ? 
                <TouchableOpacity style={{marginRight:deviceWidth/20}} onPress={() => this.click_cameraCaptureBtn()}>
                  <Image source={camera_icon} style={{width:deviceWidth/7, height:deviceWidth*93/178/7}} />
                </TouchableOpacity>
              : null}              
            </View>
            <View style={{backgroundColor:'#657682', height:2, marginLeft:deviceWidth/50, marginRight:deviceWidth/50}} />
            <View style={{margin:deviceHeight/50}}>
              {this.props.edit_photo_data == null ? 
                <View>
                  {this.show_capturedPhotos()}
                </View>
              : <View>
                  {this.show_editPhoto()}
                </View>
              }
            </View>
          </View>

          <View style={{backgroundColor:'#fff', margin:deviceWidth/30, borderColor:'#e5e5e5', borderWidth:1, borderRadius:3}}>
            <Text style={{margin:deviceWidth/20, fontWeight:'400', fontSize:18}}>Remarks</Text>
            <View style={{backgroundColor:'#657682', height:2, marginLeft:deviceWidth/50, marginRight:deviceWidth/50}} />
            <View style={{margin:deviceHeight/30, backgroundColor:'white', borderRadius:5, borderColor:'#acacac', borderWidth:1, height:deviceHeight/3}}>
              <Input multiline={true} numberOfLines={20} style={{paddingLeft:10, textAlignVertical: "top"}} placeholder='Description' value={this.state.description} onChangeText={description => this.setState({ description })} />
            </View>
          </View>

          <Spinner visible={this.state.spinner_visible} overlayColor='rgba(0,0,0,0.3)' />

        </Content>

        <TouchableOpacity style={{marginLeft:deviceWidth/1.2, marginTop:-deviceWidth/10,}} onPress={() => this.click_OKBtn()}>
          <Image source={ok_icon} style={{width:deviceWidth/8, height:deviceWidth/8, marginBottom:deviceHeight/50}} />
        </TouchableOpacity>

      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    send_addedPhotoItem: data => dispatch(send_addedPhotoItem(data)),
    send_editedPhotoItem: data => dispatch(send_editedPhotoItem(data)),
  };
}

const mapStateToProps = state => ({
  claim_detail: state.user.claim_detail,
  login_data: state.user.login_data,
  claim_number: state.user.claim_number,
  claim_data: state.user.claim_data,
  edit_photo_data: state.user.edit_photo_data,
  tag_list: state.user.tag_list,
  type_list: state.user.type_list
});

export default connect(mapStateToProps, bindAction)(CameraPage);



class Child_Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{borderColor:'#acacac', borderWidth:1, width:deviceWidth*14/50, height:deviceWidth*0.75*14/50}}>
        <Image source={{uri: this.props.itemData}} style={{width:deviceWidth*14/50, height:deviceWidth*0.75*14/50}} />
      </View>
    );
  }
}


class Child_Type extends Component {
  constructor(props) {
    super(props);
    this.state ={

    }
  }

  testFunction(i) {
    this.props.selectType(i)
  }

  render() {
    return (
      <View>
        {this.props.selectedIndex == this.props.index ?
          <TouchableOpacity style={{backgroundColor:'#ff4083', borderRadius:10, width:deviceWidth*0.35, height:deviceHeight/18, alignItems:'center', justifyContent:'center'}} onPress={() => this.testFunction(this.props.index)}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#fff'}}>{this.props.itemData.group_display}</Text>
          </TouchableOpacity>
        : <TouchableOpacity style={{backgroundColor:'#fff', borderRadius:10, width:deviceWidth*0.35, height:deviceHeight/18, borderWidth:2, borderColor:'#ff4083', alignItems:'center', justifyContent:'center'}} onPress={() => this.testFunction(this.props.index)}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#000'}}>{this.props.itemData.group_display}</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
}

class Child_Tag extends Component {
  constructor(props) {
    super(props);
    this.state ={

    }
  }

  testFunction(i) {
    this.props.selectTag(i, this.props.itemData.insp_file_tagid_fk)
  }


  render() {
    return (
      <View>
        {this.props.selectedIndex == this.props.index ?
          <TouchableOpacity style={{backgroundColor:'#ff4083', borderRadius:10, width:deviceWidth*0.35, height:deviceHeight/18, alignItems:'center', justifyContent:'center'}} onPress={() => this.testFunction(this.props.index)}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#fff'}}>{this.props.itemData.tag_display}</Text>
          </TouchableOpacity>
        : <TouchableOpacity style={{backgroundColor:'#fff', borderRadius:10, width:deviceWidth*0.35, height:deviceHeight/18, borderWidth:2, borderColor:'#ff4083', alignItems:'center', justifyContent:'center'}} onPress={() => this.testFunction(this.props.index)}>
            <Text style={{fontWeight:'400', fontSize:13, color:'#000'}}>{this.props.itemData.tag_display}</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
}