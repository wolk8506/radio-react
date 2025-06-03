import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fileActions, fileSelector, fileOperations, dataActions, rootSelectors, authSelectors } from 'store';

import { BASE_URL } from 'config';

import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { ElementImg } from 'components';

export const TabPanel1AddWallpaper = ({ value, onHandleChange }) => {
  const dispatch = useDispatch();
  const BACKGROUND = useSelector(rootSelectors.getThemeWalpaper);
  const walpaperURL = useSelector(authSelectors.getWalpaperURL);
  const loadingUploadWalpaper = useSelector(fileSelector.getLoadingUploadWalpaper);
  const statusUploadWalpaper = useSelector(fileSelector.getLoadingUploadWalpaper);
  const [aspectRatioImg, setAspectRatioImg] = useState('0:0');
  const [backgroundImg, setBackgroundImg] = useState({
    img: null,
    file: null,
    imgOldURL: null,
    imgNewURL: null,
    imgChange: false,
    width: null,
    height: null,
  }); //  # Заголовок блока

  useEffect(() => {
    walpaperURL !== null && walpaperURL !== undefined && dispatch(dataActions.setThemeWalpaper(walpaperURL));
  }, [dispatch, walpaperURL]);

  // -------------------------------------------------------------------------------------------
  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const timestamp = Date.now();
    const sanitizeFileName = selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const newFileName = `${timestamp}_${sanitizeFileName}`;
    const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });

    const img = new Image();
    img.onload = () => {
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(img.width, img.height);

      setBackgroundImg(prevState => ({
        ...prevState,
        width: img.width,
        height: img.height,
        img: URL.createObjectURL(renamedFile),
        file: renamedFile,
        imgOldURL: null,
        imgNewURL: `/walpaper/${newFileName}`,
        imgChange: true,
      }));

      setAspectRatioImg(`${img.width / divisor}:${img.height / divisor}`);
    };

    img.src = URL.createObjectURL(selectedFile);
  };
  // -------------------------------------------------------------------------------------------
  const handleDeleteImage = () => {
    setBackgroundImg(prevState => ({
      ...prevState,
      img: null,
      file: null, //file
      imgOldURL: null, //imgOldURL
      imgNewURL: null, //imgOldURL
      imgChange: false, //imgChange
      width: 0,
      height: 0,
    }));
  };
  // ~  Сохранение в локалсторедж и отправка на сервер изображения
  const handleSaveImg = () => {
    dispatch(fileOperations.deleteFile([BACKGROUND]));
    const formData = new FormData();
    formData.append('file', backgroundImg.file);

    dispatch(
      fileOperations.uploadWalpaper(formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      })
    );
  };

  useEffect(() => {
    if (statusUploadWalpaper) {
      dispatch(fileActions.setStatusUploadWalpaper());
      backgroundImg.imgNewURL && dispatch(dataActions.setThemeWalpaper(backgroundImg.imgNewURL));

      setBackgroundImg(prevState => ({
        ...prevState,
        img: null,
        file: null, //file
        imgOldURL: null, //imgOldURL
        imgNewURL: null, //imgOldURL
        imgChange: false, //imgChange
        width: 0,
        height: 0,
      }));
    }
  }, [BACKGROUND, backgroundImg.imgNewURL, dispatch, statusUploadWalpaper]);

  // -------------------------------------------------------------------------------
  // ~  Соотношение сторон дисплея
  const [aspectRatio, setAspectRatio] = useState('');
  const [widthScreen, setWidthScreen] = useState('');
  const [heightScreen, setHeightScreen] = useState('');

  useEffect(() => {
    const calculateAspectRatio = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWidthScreen(width);
      setHeightScreen(height);
      // Вычисляем соотношение сторон
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b)); // Нахождение НОД
      const divisor = gcd(width, height);
      const ratioWidth = width / divisor;
      const ratioHeight = height / divisor;
      setAspectRatio(`${ratioWidth}:${ratioHeight}`);
    };
    calculateAspectRatio();
    window.addEventListener('resize', calculateAspectRatio);
    return () => {
      window.removeEventListener('resize', calculateAspectRatio);
    };
  }, []);
  // -------------------------------------------------------------------------------
  return (
    <>
      <FormControl>
        <FormLabel id="controlled-radio-theme-background">Изменение фона</FormLabel>
        <RadioGroup
          aria-labelledby="controlled-radio-theme-background"
          name="radio-theme-background"
          value={value}
          onChange={onHandleChange}
        >
          <div className="wallpaper-collection">
            <div className="wallpaper-collection__item">
              <p>Загруженное</p>
              <div className="item-background item-background--width">
                <FormControlLabel
                  className="btn"
                  value={`url(${BASE_URL}/files${BACKGROUND})`}
                  control={<Radio />}
                  label={`Загруженное изображение`}
                  disabled={BACKGROUND === null}
                />
                {loadingUploadWalpaper ? (
                  <div className="item-background__load">
                    <CircularProgress size={20} />
                  </div>
                ) : (
                  <div className="item-background__load-img">
                    <img src={`${BASE_URL}/files${BACKGROUND}`} alt="" width={64} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </RadioGroup>
      </FormControl>

      <div className="add-background-img">
        <ElementImg
          step={'background'}
          img={backgroundImg.img}
          onDeleteImage={handleDeleteImage}
          onFileChange={handleFileChange}
        />
      </div>
      <Button onClick={handleSaveImg} disabled={!backgroundImg.imgChange} loading={loadingUploadWalpaper}>
        <SaveIcon />
        Сохранить
      </Button>

      <div className="theme-clock-divider"></div>

      <p
        className={
          backgroundImg.width > 0 && backgroundImg.width < 1920
            ? 'size-error'
            : backgroundImg.width > 0
            ? 'size-success'
            : ''
        }
      >
        Ширина: {backgroundImg.width}
      </p>

      <p
        className={
          backgroundImg.height > 0 && backgroundImg.height < 1080
            ? 'size-error'
            : backgroundImg.height > 0
            ? 'size-success'
            : ''
        }
      >
        Высота: {backgroundImg.height}
      </p>

      <p>Соотношение сторон изображения: {aspectRatioImg}</p>
      <div className="theme-clock-divider"></div>
      <div style={{ marginTop: '12px' }}>
        <p>Соотношение сторон вашего экрана: {aspectRatio}</p>
        <p>Ширина вашего экрана: {widthScreen}</p>
        <p>Высота вашего экрана: {heightScreen}</p>
      </div>
    </>
  );
};
