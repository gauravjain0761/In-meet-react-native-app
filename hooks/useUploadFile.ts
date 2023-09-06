import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '~/store';
import uploadFile from '~/store/fileSlice';
import { selectUserId } from '~/store/userSlice';

const useUploadFile = () => {
  const dispatch = useAppDispatch();
  const userId = useSelector(selectUserId);
  const uploadPhoto = async imgPhotos => {
    try {
      const dataPhotos = imgPhotos.map(photo => ({
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        name: photo.name,
        type: photo.type,
      }));
      const uploadPhotoPromise = dataPhotos.map(photo =>
        dispatch(
          uploadFile({
            fileData: photo,
            fileType: 'CHAT',
            userId,
          }),
        ).unwrap(),
      );
      const allPhotoPromise = await Promise.all(uploadPhotoPromise);
      const photosUrls = allPhotoPromise
        .map(p => p.data?.url)
        .filter(e => e)
        .join(',');
      return photosUrls;
    } catch (error) {}
  };

  return { uploadPhoto };
};

export default useUploadFile;
