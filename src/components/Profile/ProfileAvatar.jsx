import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';

import { authSelectors, authOperations, fileOperations } from 'store';
import { BASE_URL } from '../../config';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { ElementImg } from 'components';

import person from '../../images/person.png';

export const ProfileAvatar = () => {
  const dispatch = useDispatch();
  const avatar = useSelector(authSelectors.getAvatar);
  const isFetchingUploadAvatar = useSelector(authSelectors.getIsFetchingUploadAvatar);
  const [avatarImg, setAvatarImg] = useState({
    img: null,
    file: null,
    imgOldURL: null,
    imgNewURL: null,
    imgChange: true,
  }); //  # Заголовок блока
  const [isUploadAvatar, setIsUploadAvatar] = useState(true);
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState(avatarImg.croppedArea || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(avatarImg.zoom || 1);
  const [crop, setCrop] = useState(avatarImg.croppedArea || { x: 0, y: 0 });
  const [correctImage, setCorrectImage] = useState(false);
  const timestamp = Date.now(); //  # Добавляем метку времени для уникальности
  const [deleteImg, setDeleteImg] = useState([]); //  # Массив для хранения удаляемых изображений

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const updateTransparency = debounce(newValue => {
      setIsUploadAvatar(newValue);
    }, 200);
    updateTransparency(isFetchingUploadAvatar);
  }, [dispatch, isFetchingUploadAvatar]);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  }, []);

  // Загружаем данные при изменении avatarImg
  useEffect(() => {
    if (avatarImg.img) setOriginalImage(avatarImg.img);
    if (avatarImg.croppedArea) setCropArea(avatarImg.croppedArea);
    if (avatarImg.zoom) setZoom(avatarImg.zoom);
  }, [avatarImg]);

  const handleEditImage = () => {
    setCropMode(true);
    setCropArea(avatarImg.croppedArea || { x: 0, y: 0 });
  };

  const handleApplyCrop = () => {
    if (!originalImage || !cropArea) {
      console.warn('Нет данных для обрезки');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      setCroppedImage(canvas.toDataURL());
      setCropMode(false);
    };
  };

  const handleCancelCrop = () => setCropMode(false);

  const handleCorrectImage = () => {
    setCorrectImage(!correctImage);
  };

  const handleCanceCorrectImage = () => {
    setCorrectImage(!correctImage);
    setAvatarImg(prevState => ({
      ...prevState,
      img: avatar ? `${BASE_URL}${avatar}` : null,
      file: null, //file
      imgOldURL: avatar, //imgOldURL
      imgNewURL: null,
      imgChange: false, //imgChange
      zoom: 1,
    }));
    setCroppedImage(null);
  };

  //  ~ Обработка загрузки файла главного изображения
  const handleFileChange = event => {
    const selectedFile = event.target.files[0]; // Берём только один файл
    if (!selectedFile) return;

    // Генерируем новое имя файла, очищая недопустимые символы
    const sanitizeFileName = selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const newFileName = `${timestamp}_${sanitizeFileName}`;
    // Создаём новый файл с новым именем через Blob
    const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });
    setAvatarImg(prevState => ({
      ...prevState,
      img: URL.createObjectURL(renamedFile),
      file: renamedFile, //file
      imgOldURL: null, //imgOldURL
      imgNewURL: `${newFileName}`,
      imgChange: true, //imgChange
      zoom: 1,
    }));
  };

  //  ~ Удаление текущего файла
  const handleDeleteMainImage = () => {
    !avatarImg.imgChange && setDeleteImg(prev => [...prev, avatarImg.imgOldURL.replace(/^\/files/, '')]);
    setAvatarImg(prevState => ({
      ...prevState,
      img: null,
      file: null, //file
      imgOldURL: null, //imgOldURL
      imgNewURL: null, //imgOldURL
      imgChange: true, //imgChange
    }));

    setCroppedImage(null);
  };

  //  ~ Запись данных в форму для редактирования
  useEffect(() => {
    setAvatarImg(prevState => ({
      ...prevState,
      img: avatar ? `${BASE_URL}${avatar}` : null,
      file: null, //file
      imgOldURL: avatar, //imgOldURL
      imgChange: false, //imgChange
    }));
  }, [avatar]);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const OnSumbitFile = async e => {
    e.preventDefault();

    const response = await fetch(person); // Загружаем импортированное изображение
    const blob = await response.blob(); // Конвертируем в Blob
    const file = new File([blob], 'default-avatar.png', { type: blob.type }); // Создаём объект File

    const formData = new FormData();

    if (avatarImg.file !== null) {
      formData.append('avatar', croppedImage ? dataURLtoFile(croppedImage, 'cropped-avatar.png') : avatarImg.file);
    } else {
      formData.append('avatar', file);
    }
    dispatch(authOperations.updateAvatar(formData, { headers: { 'Content-type': 'multipart/form-data' } }));

    deleteImg.length
      ? dispatch(fileOperations.deleteFile(deleteImg))
      : avatar !== null && dispatch(fileOperations.deleteFile([avatar.replace(/^\/files/, '')]));

    setDeleteImg([]);
  };

  return (
    <div className="block__user-data">
      <div className="user-data__text-block">
        <p className="text-block__titlt">Изменить профиль</p>
        <p className="text-block__text">Измените свою фотографию профиля здесь</p>
      </div>

      <div className="user-data__img-block">
        {avatarImg.img && cropMode ? (
          <div style={{ width: '100%', height: '200px', position: 'relative' }}>
            <Cropper
              image={avatarImg.img}
              crop={crop}
              zoom={zoom}
              zoomSpeed={0.05}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteHandler}
              onZoomChange={setZoom}
            />
          </div>
        ) : (
          <ElementImg
            step
            img={croppedImage || avatarImg.img}
            onDeleteImage={handleDeleteMainImage}
            onFileChange={handleFileChange}
            isFetching={isUploadAvatar}
            isVisibleBtnDelete={correctImage}
          />
        )}
      </div>

      <div className="user-data__btn-block">
        {cropMode ? (
          <>
            <IconButton variant="outlined" onClick={handleApplyCrop}>
              <CheckIcon />
            </IconButton>

            <IconButton onClick={handleCancelCrop}>
              <ClearIcon />
            </IconButton>
          </>
        ) : correctImage ? (
          <>
            <IconButton disabled={!avatarImg.imgChange} onClick={OnSumbitFile}>
              <CheckIcon />
            </IconButton>
            <IconButton onClick={handleEditImage} disabled={!avatarImg.imgNewURL || !avatarImg.imgChange}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleCanceCorrectImage}>
              <ClearIcon />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={handleCorrectImage}>
            <EditIcon />
          </IconButton>
        )}
      </div>

      <p className="user-data__text">Разрешены JPG, WEBP или PNG.</p>
    </div>
  );
};
