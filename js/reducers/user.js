
import type { Action } from '../actions/types';
import { SET_USER } from '../actions/user';

export type State = {
    name: string,
    login_data: {},
    claim_data: null,
    claim_detail: {},
    claim_number: 0,
    task_data: {},
    custom_date: null,
    photo_array: [],
    edit_photo_data: null,
    claim_status: "yes",
    tag_list: [],
    type_list: [],
    clicked_photo_data: null
}

const initialState = {
  name: '',
  login_data: {},
  claim_data: null,
  claim_detail: {},
  claim_number: 0,
  task_data: {},
  custom_date: null,
  photo_array: [],
  edit_photo_data: null,
  claim_status: "yes",
  tag_list: [],
  type_list: [],
  clicked_photo_data: null
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_USER) {
    return {
      ...state,
      name: action.payload,
    };
  }

  if (action.type === 'Login_Data') {
    return {
      ...state,
      login_data: action.data
    };
  }

  if (action.type === 'Claim_List') {
    return {
      ...state,
      claim_data: action.data
    };
  }

  if (action.type === 'send_claimDetailData') {
    return {
      ...state,
      claim_detail: action.data
    };
  }

  if (action.type === 'send_claimNumber') {
    return {
      ...state,
      claim_number: action.data
    };
  }

  if (action.type === 'send_taskList') {
    return {
      ...state,
      task_data: action.data
    };
  }
  
  if (action.type === 'send_date') {
    return {
      ...state,
      custom_date: action.data
    };
  }

  if (action.type === 'send_photoArray') {
    if (state.photo_array.length != 0) {
      state.photo_array = []
    }
    return {
      ...state,
      photo_array: action.data
    };
  }

  if (action.type === 'send_addedPhotoItem') {
    var temp = state.photo_array
    temp.push(action.data)
    return {
      ...state,
      photo_array: temp
    };
  }

  if (action.type === 'send_deleted_photoArray') {
    var temp = state.photo_array
    temp.splice(action.data, 1)
    return {
      ...state,
      photo_array: temp
    };
  }

  if (action.type === 'send_editPhoto') {
    return {
      ...state,
      edit_photo_data: action.data
    };
  }

  if (action.type === 'send_clickPhoto') {
    return {
      ...state,
      clicked_photo_data: action.data
    };
  }  

  if (action.type === 'send_editedPhotoItem') {
    
    var temp = state.photo_array
    var i=-1;
    temp.map((data) => {
      i++;
      if (action.data.inspfileuploadid_pk == data.inspfileuploadid_pk) {
        temp[i] = action.data
      }
    })
    return {
      ...state,
      photo_array: temp
    };
  }

  if (action.type === 'send_claimStatus') {
    return {
      ...state,
      claim_status: action.data
    };
  }

  if (action.type === 'send_typeList') {
    var temp = state.type_list
    if (temp.length != 0) {
      temp = []
    }
    temp = action.data
    return {
      ...state,
      type_list: temp
    };
  }

  if (action.type === 'send_tagList') {
    var temp = state.tag_list
    if (temp.length != 0) {
      temp = []
    }
    temp = action.data
    return {
      ...state,
      tag_list: temp
    };
  }
  

  return state;
}
