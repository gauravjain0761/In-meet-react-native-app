import { get, isEmpty } from 'lodash';
import { Blog, BlogReply } from '~/store/forumSlice';
import { IInterest } from '~/store/interestSlice';
import HttpClient, { cancelTokenSource } from '../axios/axios';
import { ActionResponse } from '~/types/custom';

interface UserResponse {
  data: {
    records: User[];
    page: Page;
  };
}
interface UserInfoResponse {
  data: User;
}

interface BlogListResponse {
  data: {
    records: Blog[];
    page: Page;
  };
}

type BlockReport = {
  blockReportType: string;
  content: string;
  createTime: string;
  id: number;
  isDone: boolean;
  modifyTime: string;
  remark: string;
  reportUser: User;
  user: User;
};

type BlockInfo = {
  blockUser: User;
  createTime: string;
  id: number;
  modifyTime: string;
  user: User;
};
interface BlockReportResponse {
  data: {
    records: Blog[];
    page: Page;
  };
}
interface BlockUserInfoResponse {
  data: {
    records: BlockInfo[];
    page: Page;
  };
}
export interface CollectorUser extends User {
  collector: User;
  favoriteUser: User;
}
interface FavoriteListResponse {
  data: {
    records: CollectorUser[];
    page: Page;
  };
}
interface Page {
  prePageSize: number;
  currentPage: number;
  totalCount: number;
  totalPage: number;
  offset: number;
}

interface InterestResponse {
  data: {
    records: IInterest[];
    page: Page;
  };
}

export interface FileRecord {
  id: number;
  createTime: string;
  userPhotoType: string;
  fileInfoResponse: {
    id: number;
    createTime: string;
    createBy: number;
    originalFileName: string;
    realFileName: string;
    url: string;
    fileType: string;
  };
  userId: number;
  amount: number;
  isLock: boolean;
  isHidden: boolean;
  photoVerifyType: string;
  isLikeBefore: boolean;
  isUnLockBefore: boolean;
}

interface FileRecordResponse {
  data: {
    records: FileRecord[];
    page: Page;
  };
}

export const userApi = {
  deleteMessageRoom: ({ token, userId, recipientId }) => {
    return HttpClient.delete(`/messages/${recipientId}/${userId}`, {
      headers: {
        Authorization: token,
      },
    }).then(res => res.data.data);
  },
  fetchUser: (data, pageObject) => {
    const { pageParam = 1, queryKey } = pageObject;
    const distanceFromQueryKey = get(queryKey, [1]) * 1000;
    const genderFromQueryKey = get(queryKey, [2]);
    const endAgeQueryKey = get(queryKey, [3]);
    const startAgeQueryKey = get(queryKey, [4]);
    const hobbyIdsQueryKey = get(queryKey, [5]);
    const {
      gender = genderFromQueryKey,
      city,
      constellation,
      startAge = startAgeQueryKey,
      endAge = endAgeQueryKey,
      hobbyId = hobbyIdsQueryKey,
      lng,
      lat,
      distance = undefined,
      token,
    } = data;

    return HttpClient.get<ActionResponse<UserResponse>>('/user/search', {
      params: {
        page: pageParam,
        ...(gender && { gender }),
        ...(city && { city }),
        ...(constellation && { constellation }),
        ...((startAge || startAge === 0) && { startAge }),
        ...(endAge && { endAge }),
        ...(!isEmpty(hobbyId) && { hobbyId: hobbyId.join(',') }),
        // ...(lng && { lng }),
        // ...(lat && { lat }),
        ...(distance && { distance }),
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserpair: (data, pageObject) => {
    const { pageParam = 1, queryKey } = pageObject;
    const {
      token,
    } = data;

    return HttpClient.get<ActionResponse<UserResponse>>('/userpair', {
      params: {
        page:pageParam,
        limit:10,
        order:"asc",
        sort:'id'
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  checkEmailAvailable: ({ email }) => {
    return HttpClient.get<ActionResponse<{ data: string }>>('/user/available', {
      params: {
        account: email,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserByConstellation: ({ token, constellation }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<UserResponse>>('/user/search', {
      params: {
        constellation,
        page: pageParam,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserByInterest: ({ token, hobbyId }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<UserResponse>>('/user/search', {
      params: {
        hobbyId,
        page: pageParam,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchFavoriteUserList: ({ token }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<FavoriteListResponse>>('/favorite/list', {
      params: {
        page: pageParam,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchWhoFavoriteMe: ({ token }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<FavoriteListResponse>>('/favorite/whoFavoriteMe', {
      params: {
        page: pageParam,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  getFavoriteUser: ({ token }) => {
    return HttpClient.get<ActionResponse<FavoriteListResponse>>('/favorite/list', {
      params: {
        limit: 100,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  removeCollectUser: ({ token, dataRecordId }) => {
    return HttpClient.delete<ActionResponse<UserResponse>>(`/favorite/${dataRecordId}`, {
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  getMyCollection: ({ token, userId }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<UserResponse>>('/favorite/list', {
      params: {
        page: pageParam,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  collectUser: ({ token, userId, favoriteUserId }) => {
    return HttpClient.post<ActionResponse<UserResponse>>(
      '/favorite',
      {
        userId,
        favoriteUserId,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  fetchUserInfoById: ({ token, id }) => {
    return HttpClient.get<ActionResponse<UserInfoResponse>>(`/user/info/${id}`, {
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserInfoByLocation: ({ token }) => {
    return HttpClient.get<ActionResponse<UserInfoResponse>>(`/user/info/${id}`, {
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserPhotos: ({ token, id }) => {
    return HttpClient.get<ActionResponse<FileRecordResponse>>(`/user/photo/list`, {
      params: {
        userId: id,
        userPhotoType: 'PHOTO',
        limit: 100,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserAvatars: ({ token, id }) => {
    return HttpClient.get<ActionResponse<FileRecordResponse>>(`/user/photo/list`, {
      params: {
        userId: id,
        userPhotoType: 'AVATAR',
        limit: 100,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserLike: ({ token, id,isLike }:any) => {
    return HttpClient.get<ActionResponse<FileRecordResponse>>(`/user/like`, {
      params: {
        userId: id,
        liked:isLike
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  deleteUserAvatars: ({ token, id }) => {
    return HttpClient.delete<ActionResponse<any>>(`/user/photo/${id}`, {
      headers: {
        Authorization: token,
      },
    }).then(res => {
      console.log('reeeee',res);
      
      return res.data.data;
    }).catch((err)=>console.log("sdasdasdadad",err))
  },
  fetchUserBlogs: ({ token, id }) => {
    return HttpClient.get<ActionResponse<BlogListResponse>>(`/blog/list`, {
      params: {
        userId: id,
        limit: 100,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserBlockList: ({ token }) => {
    return HttpClient.get<ActionResponse<BlockReportResponse>>(`/blockReport/list`, {
      params: {
        blockReportType: 'USER',
        limit: 100,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchUserPhotos: ({ token, id, limit = 100 }) => {
    return HttpClient.get<ActionResponse<FileRecordResponse>>(`/user/photo/list`, {
      params: {
        userId: id,
        userPhotoType: 'PHOTO',
        limit,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  likePhoto: ({ token, id }: { token: string; id: number }) => {
    return HttpClient.put(
      `/user/photo/${id}/like`,
      {},
      {
        params: {
          id,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  unLikePhoto: ({ token, id }: { token: string; id: number }) => {
    return HttpClient.put(
      `/user/photo/${id}/like/cancel`,
      {},
      {
        params: {
          id,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  unLockPrivatePost: ({ token, id }: { token: string; id: number }) => {
    return HttpClient.put(
      `/blog/${id}/unLock`,
      {},
      {
        params: {
          id,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  unLockPrivatePhoto: ({ token, id }: { token: string; id: number }) => {
    return HttpClient.put(
      `/user/photo/${id}/unLock`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  unHideRoomChat: ({ token, password, userId }) => {
    return HttpClient.put(
      `/messages/unHide`,
      {
        recipientId: userId,
        password,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => res.data);
  },
  hideRoomChat: ({ token, userId, recipientId }) => {
    return HttpClient.put(
      `/messages/${recipientId}/${userId}/hide`,
      {},
      {
        params: {
          secret: true,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => res.data.data);
  },
  UserpairremainChat: ({ token, chatId, vipTest }) => {
    return HttpClient.get(
      `userpair/remain?chatId=${chatId}&testMode%2C%E7%84%A1%E8%A6%96VIP=${vipTest}`,
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res =>{ 
      return res.data.data});
  },
  fetchUserRoomList: ({ token, userId }, pageObject) => {
    const { pageParam = 1 } = pageObject;
    return HttpClient.get(`/messages/list/${userId}`, {
      params: {
        userId,
        page: pageParam,
        order: 'asc',
        sort: 'id',
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchMessageClientList: ({ token, userId }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<InterestResponse>>(`/messages/client/list/${userId}`, {
      params: {
        page: pageParam,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  fetchMessagesList: ({ token, senderId, recipientId }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<InterestResponse>>(
      `/messages/${recipientId}/${senderId}`,
      {
        params: {
          page: pageParam,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      console.log('res.data.data',res.data.data);
      
      return res.data.data;
    });
  },
  updateUserPassword: ({ token, oldPassword, newPassword }) => {
    return HttpClient.post<ActionResponse<any>>(
      `/user/updatePwd`,
      {},
      {
        params: {
          oldPassword,
          password: newPassword,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  lockPhoto: ({ token, photoId }) => {
    return HttpClient.post(
      `/user/photo/lock/${photoId}`,
      {},
      {
        params: {
          id: photoId,
          lock: true,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  unLockPhoto: ({ token, photoId }) => {
    return HttpClient.post(
      `/user/photo/lock/${photoId}`,
      {},
      {
        params: {
          id: photoId,
          lock: false,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  deletePhoto: ({ token, photoId }) => {
    return HttpClient.delete(`/user/photo/${photoId}`, {
      params: {
        id: photoId,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  lockBlog: ({ token, blogId }) => {
    return HttpClient.put(
      `/blog/hidden`,
      {},
      {
        params: {
          blogIds: blogId,
          hidden: true,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  unLockBlog: ({ token, blogId }) => {
    return HttpClient.put(
      `/blog/hidden`,
      {},
      {
        params: {
          blogIds: blogId,
          hidden: false,
        },
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  readAllRoom: ({ token }) => {
    return HttpClient.post(
      `/messages/readAll`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  blockInfo: ({ token, userId, blockUserId }) => {
    return HttpClient.post(
      `/blockInfo`,
      {
        blockUserId,
        userId,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data;
    });
  },
  removeBlockInfo: ({ token, id }) => {
    return HttpClient.delete(`/blockInfo/${id}`, {
      params: {
        id,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data;
    });
  },
  fetchUserBlockInfoList: ({ token }) => {
    return HttpClient.get<ActionResponse<BlockUserInfoResponse>>(`/blockInfo/list`, {
      params: {
        limit: 100,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  phoneRegister: ({ phone }: { phone: string }) => {
    return HttpClient.get<ActionResponse<{ data: string }>>('/user/phoneRegister', {
      params: {
        loginPhone: phone,
      },
    })
      .then(res => {
        console.log('該用戶已經註冊',res);
        
                return res.data.data;
      })
      .catch(err => {
        console.log("eeerrr",err);
        
                return { err };
      });
  },
  verification: ({ phone, verifyCode }: { phone: string; verifyCode: string }) => {
    return HttpClient.post<ActionResponse<{ data: string }>>(
      '/user/verification',
      {},
      {
        params: {
          loginPhone: phone,
          code: verifyCode,
        },
      },
    )
      .then(res => {
        return res.data.data;
      })
      .catch(err => {
        return { err };
      });
  },
  findWhoLikeMe: ({ token, id }, pageObject) => {
    const { pageParam = 0 } = pageObject;
    
    return HttpClient.get<ActionResponse<FavoriteListResponse>>('/user/findWhoLikeMe', {
      params: {
        page: pageParam,
        userId:id,
        limit:10
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    }).catch((err)=>console.log("errrrr",err) )
  },
  findUserpairLikeMe: ({ token, id }, pageObject) => {
    const { pageParam = 1 } = pageObject;
    console.log('token',id);
    
    return HttpClient.get<ActionResponse<FavoriteListResponse>>(`/userpair/history?modeChange%E7%82%BAtrue%E6%99%82%20%E6%9C%83%E5%88%87%E6%8F%9B%E6%88%90%E6%9F%A5%E8%A9%A2%E8%A2%AB%E5%96%9C%E6%AD%A1%2F%E8%A2%AB%E7%9C%8B%E9%81%8E%20%E4%B8%A6%E7%A2%BA%E8%AA%8D%E5%85%B6%E6%9C%83%E5%93%A1%E6%98%AF%E5%90%A6%E7%82%BAVIP=true&isTest%20%E6%B8%AC%E8%A9%A6%E6%A8%A1%E5%BC%8F%EF%BC%8C%E7%84%A1%E8%A6%96%E6%98%AF%E5%90%A6%E6%9C%89VIP=true&liked%20%E5%96%9C%E6%AD%A1%28%E4%BA%A4%E9%9B%86%29%2C%E5%BB%BA%E8%AD%B0%E5%96%9C%E6%AD%A1%2C%E7%9C%8B%E9%81%8E%E6%BE%A4%E4%B8%80%E4%BD%BF%E7%94%A8=true&page=${pageParam}&limit=20&order=asc&sort=id`, {
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    }).catch((err)=>console.log("errrrr",err) )
  },
  findUserpairWatchedMe: ({ token, id }, pageObject) => {
    const { pageParam = 1 } = pageObject;
    return HttpClient.get<ActionResponse<FavoriteListResponse>>(`https://uat.inmeet.vip/userpair/history?modeChange%E7%82%BAtrue%E6%99%82%20%E6%9C%83%E5%88%87%E6%8F%9B%E6%88%90%E6%9F%A5%E8%A9%A2%E8%A2%AB%E5%96%9C%E6%AD%A1%2F%E8%A2%AB%E7%9C%8B%E9%81%8E%20%E4%B8%A6%E7%A2%BA%E8%AA%8D%E5%85%B6%E6%9C%83%E5%93%A1%E6%98%AF%E5%90%A6%E7%82%BAVIP=false&isTest%20%E6%B8%AC%E8%A9%A6%E6%A8%A1%E5%BC%8F%EF%BC%8C%E7%84%A1%E8%A6%96%E6%98%AF%E5%90%A6%E6%9C%89VIP=false&watched%20%E7%9C%8B%E9%81%8E%28%E4%BA%A4%E9%9B%86%29%2C%E5%BB%BA%E8%AD%B0%E5%96%9C%E6%AD%A1%2C%E7%9C%8B%E9%81%8E%E6%93%87%E4%B8%80%E4%BD%BF%E7%94%A8=true&page=${pageParam}&limit=20&order=asc&sort=id`, {
      headers: {
        Authorization: token,
      },
    }).then(res => {
      console.log('resss',res.data);
      
      return res.data.data;
    }).catch((err)=>console.log("errrrr",err) )
  },
  findWhoWatchedMe: ({ token, id }, pageObject) => {
    const { pageParam = 0 } = pageObject;

    return HttpClient.get<ActionResponse<FavoriteListResponse>>('/user/findWhoWatchedMe', {
      params: {
        page: pageParam,
        userId:id,
        limit:10
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
};

export const interestApi = {
  fetchAllInterest: ({ token, hobbyName, limit = 10 }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<InterestResponse>>('/hobby/search', {
      params: {
        hobbyName,
        page: pageParam,
        limit,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
};

export const paymentApi = {
  payPoint: ({ token, usedPoint }) => {
    return HttpClient.put(
      '/user/payPoint',
      {},
      {
        params: {
          point: usedPoint,
        },
        headers: {
          Authorization: token,
        },
      },
    );
  },
  chatWithOthers: ({ token, recipientId }) => {
    return HttpClient.post(
      `/messages/${recipientId}/unLock`,
      {},
      {
        params: {
          recipientId,
        },
        headers: {
          Authorization: token,
        },
      },
    );
  },
  addHeart: ({ token, pointType, transactionId, payload }) => {
    return HttpClient.post(
      '/iap/ios_pay/point',
      {
        payload,
        pointType,
        transactionId,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );
  },
  addAndroidHeart: ({ token, pointType, packageName, productId, purchaseToken }) => {
    return HttpClient.post(
      '/iap/google_pay/point',
      {},
      {
        params: {
          pointType,
          productId,
          purchaseToken,
          packageName,
        },
        headers: {
          Authorization: token,
        },
      },
    );
  },
  addVIP: ({ token, vipType, transactionId, payload }) => {
    return HttpClient.post(
      '/iap/ios_pay/vip',
      {
        vipType,
        transactionId,
        payload,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );
  },
  addAndroidVIP: ({ token, vipType, packageName, productId, purchaseToken }) => {
    return HttpClient.post(
      '/iap/google_pay/vip',
      {},
      {
        params: {
          vipType,
          packageName,
          productId,
          purchaseToken,
        },
        headers: {
          Authorization: token,
        },
      },
    );
  },
};
export const forumsApi = {
  fetchAllForums: ({ token, limit = 10 }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<BlogListResponse>>('/blog/list', {
      params: {
        page: pageParam,
        limit,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  mutateForumAmount: ({ token, id }) => {
    return HttpClient.put<ActionResponse<any>>(
      `/blog/${Number(id)}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  likeForum: ({ token, id }) => {
    return HttpClient.put<ActionResponse<any>>(
      `/blog/${Number(id)}/like`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  unLikeForum: ({ token, id }) => {
    return HttpClient.put<ActionResponse<any>>(
      `/blog/${Number(id)}/like/cancel`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    ).then(res => {
      return res.data.data;
    });
  },
  fetchBlogRelpy: ({ token, currentBlogId, limit = 10 }, pageObject) => {
    const { pageParam = 1 } = pageObject;

    return HttpClient.get<ActionResponse<any>>(`/blogReply/list/${currentBlogId}`, {
      params: {
        page: pageParam,
        limit,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      return res.data.data;
    });
  },
  deleteBlog: ({ token, id }) => {
    return HttpClient.delete(`/blog/disable?blogId=${id}`, {
      params: {
        id,
      },
      headers: {
        Authorization: token,
      },
    }).then(res => {
      console.log(token, id);
      return res.data;
    });
  },
};
