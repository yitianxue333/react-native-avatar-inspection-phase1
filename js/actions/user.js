
import type { Action } from './types';

export const SET_USER = 'SET_USER';

export function setUser(user:string):Action {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function login(data):Action {
    return {
        type: 'Login_Data',
        data: data
    }
}

export function send_claimList(data):Action {
    return {
        type: 'Claim_List',
        data: data
    }
}

export function send_claimDetailData(data):Action {
    return {
        type: 'send_claimDetailData',
        data: data
    }
}

export function send_claimNumber(data):Action {
    return {
        type: 'send_claimNumber',
        data: data
    }
}

export function send_taskList(data):Action {
    return {
        type: 'send_taskList',
        data: data
    }
}

export function send_date(data):Action {
    return {
        type: 'send_date',
        data: data
    }
}

export function send_photoArray(data):Action {
    return {
        type: 'send_photoArray',
        data: data
    }
}

export function send_addedPhotoItem(data):Action {
    return {
        type: 'send_addedPhotoItem',
        data: data
    }
}

export function send_deleted_photoArray(data):Action {
    return {
        type: 'send_deleted_photoArray',
        data: data
    }
}

export function send_editedPhotoItem(data):Action {
    return {
        type: 'send_editedPhotoItem',
        data: data
    }
}

export function send_clickPhoto(data):Action {
    return {
        type: 'send_clickPhoto',
        data: data
    }
}

export function send_editPhoto(data):Action {
    return {
        type: 'send_editPhoto',
        data: data
    }
}

export function send_claimStatus(data):Action {
    return {
        type: 'send_claimStatus',
        data: data
    }
}

export function send_typeList(data):Action {
    return {
        type: 'send_typeList',
        data: data
    }
}

export function send_tagList(data):Action {
    return {
        type: 'send_tagList',
        data: data
    }
}