import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fileActions, fileSelector, fileOperations, dataActions, rootSelectors, authSelectors } from 'store';
import { BASE_URL } from 'config';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import IconButton from '@mui/material/IconButton';

import { color } from './TabPanel1BackgroundColor';

const different = [4, 6, 10, 11, 12, 13, 14, 15, 16].map(num => ({
  value: `url(${require(`../../images/wallpaper/different/img_${num}.jpg`)})`,
  preview: require(`../../images/wallpaper/different/img_${num}_128.webp`),
}));

const newYear = ['04', '06', '08', '10', '11', 16, 19, 20, 27, 28, 29].map(num => ({
  value: `url(${require(`../../images/wallpaper/holiday/new-year-${num}.jpg`)})`,
  preview: require(`../../images/wallpaper/holiday/new-year-${num}_128.jpg`),
}));

const halloween = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => ({
  value: `url(${require(`../../images/wallpaper/holiday/img_${num}.jpg`)})`,
  preview: require(`../../images/wallpaper/holiday/img_${num}_128.webp`),
}));

const colors = color.map(c => ({
  value: c.color,
  gradient: c.color,
}));

const Thumb = ({ it, index, value, onSelect }) => (
  <button
    type="button"
    className={`wallpaper-thumb${it.gradient ? ' wallpaper-thumb--color' : ''}${
      value === it.value ? ' wallpaper-thumb--selected' : ''
    }`}
    style={it.gradient ? { background: it.gradient } : undefined}
    onClick={() => onSelect(it.value)}
    aria-pressed={value === it.value}
  >
    {it.preview && <img className="wallpaper-thumb__img" src={it.preview} alt="" />}
    <span className="wallpaper-thumb__num">{index + 1}</span>
  </button>
);

const PhotoCategory = ({ title, count, footer, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [rowMaxH, setRowMaxH] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !row.children.length) {
      setOverflowing(false);
      return;
    }

    const measure = () => {
      const firstTop = row.children[0].offsetTop;
      let firstRowCount = 1;
      for (let i = 1; i < row.children.length; i++) {
        if (row.children[i].offsetTop === firstTop) {
          firstRowCount += 1;
        } else {
          break;
        }
      }
      const rowTop = row.getBoundingClientRect().top;
      let bottom = 0;
      for (let i = 0; i < firstRowCount; i++) {
        const rect = row.children[i].getBoundingClientRect();
        bottom = Math.max(bottom, rect.bottom - rowTop);
      }
      setRowMaxH(bottom);
      setOverflowing(count > firstRowCount);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [count]);

  const collapsed = overflowing && !expanded;

  return (
    <div className="wallpaper-category">
      <div className="wallpaper-category__header">
        <span className="wallpaper-category__title">{title}</span>
        {overflowing && (
          <button
            type="button"
            className="wallpaper-category__toggle"
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? 'показать меньше' : `показать все (${count})`}
          </button>
        )}
      </div>
      <div
        ref={rowRef}
        className={`wallpaper-row${collapsed ? ' wallpaper-row--collapsed' : ''}`}
        style={collapsed && rowMaxH != null ? { maxHeight: rowMaxH } : undefined}
      >
        {children}
      </div>
      {footer}
    </div>
  );
};

const useYourPhotos = () => {
  const dispatch = useDispatch();
  const BACKGROUND = useSelector(rootSelectors.getThemeWalpaper);
  const walpaperURL = useSelector(authSelectors.getWalpaperURL);
  const loadingUploadWalpaper = useSelector(fileSelector.getLoadingUploadWalpaper);
  const statusUploadWalpaper = useSelector(fileSelector.getLoadingUploadWalpaper);

  const [aspectRatioImg, setAspectRatioImg] = useState('0:0');
  const [backgroundImg, setBackgroundImg] = useState({
    img: null,
    file: null,
    imgNewURL: null,
    imgChange: false,
    width: 0,
    height: 0,
  });
  const inputRef = useRef(null);

  useEffect(() => {
    walpaperURL !== null && walpaperURL !== undefined && dispatch(dataActions.setThemeWalpaper(walpaperURL));
  }, [dispatch, walpaperURL]);

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
        imgNewURL: `/walpaper/${newFileName}`,
        imgChange: true,
      }));

      setAspectRatioImg(`${img.width / divisor}:${img.height / divisor}`);
    };

    img.src = URL.createObjectURL(selectedFile);
    event.target.value = '';
  };

  const handleClear = () => {
    setBackgroundImg({
      img: null,
      file: null,
      imgNewURL: null,
      imgChange: false,
      width: 0,
      height: 0,
    });
  };

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
      handleClear();
    }
  }, [BACKGROUND, backgroundImg.imgNewURL, dispatch, statusUploadWalpaper]);

  const uploadedValue = BACKGROUND ? `url(${BASE_URL}/files${BACKGROUND})` : null;

  const widthClass =
    backgroundImg.width > 0 && backgroundImg.width < 1920
      ? 'size-error'
      : backgroundImg.width > 0
      ? 'size-success'
      : '';
  const heightClass =
    backgroundImg.height > 0 && backgroundImg.height < 1080
      ? 'size-error'
      : backgroundImg.height > 0
      ? 'size-success'
      : '';

  return {
    uploadedValue,
    loadingUploadWalpaper,
    aspectRatioImg,
    backgroundImg,
    inputRef,
    handleFileChange,
    handleClear,
    handleSaveImg,
    widthClass,
    heightClass,
  };
};

export const WallpaperThemes = () => {
  const dispatch = useDispatch();
  const THEME_BACKGROUND = useSelector(rootSelectors.getThemeChengeWalpaper);
  const BACKGROUND = useSelector(rootSelectors.getThemeWalpaper);
  const [value, setValue] = useState(THEME_BACKGROUND);

  const handleSelect = v => {
    dispatch(dataActions.setThemeChengeWalpaper(v));
    setValue(v);
  };

  const yourPhotos = useYourPhotos();
  const yourPhotosCount = (BACKGROUND ? 1 : 0) + 1;

  const yourPhotosMeta =
    yourPhotos.backgroundImg.img &&
    (() => (
      <div className="wallpaper-upload-meta">
        <p className={yourPhotos.widthClass}>Ширина: {yourPhotos.backgroundImg.width}</p>
        <p className={yourPhotos.heightClass}>Высота: {yourPhotos.backgroundImg.height}</p>
        <p>Соотношение сторон: {yourPhotos.aspectRatioImg}</p>
      </div>
    ))();

  return (
    <div className="tab-panel">
      <div className="settings settings--themes">
        <p className="preview-title">Изменение фона</p>
        <div className="wallpaper-categories">
          <PhotoCategory title="Разное" count={different.length}>
            {different.map((it, index) => (
              <Thumb key={it.value} it={it} index={index} value={value} onSelect={handleSelect} />
            ))}
          </PhotoCategory>
          <PhotoCategory title="Новый год" count={newYear.length}>
            {newYear.map((it, index) => (
              <Thumb key={it.value} it={it} index={index} value={value} onSelect={handleSelect} />
            ))}
          </PhotoCategory>
          <PhotoCategory title="Хэллоуин" count={halloween.length}>
            {halloween.map((it, index) => (
              <Thumb key={it.value} it={it} index={index} value={value} onSelect={handleSelect} />
            ))}
          </PhotoCategory>
          <PhotoCategory title="Цвета" count={colors.length}>
            {colors.map((it, index) => (
              <Thumb key={it.value} it={it} index={index} value={value} onSelect={handleSelect} />
            ))}
          </PhotoCategory>
          <PhotoCategory
            title="Ваши фото"
            count={yourPhotosCount}
            footer={yourPhotosMeta}
          >
            {yourPhotos.uploadedValue && (
              <button
                type="button"
                className={`wallpaper-thumb${value === yourPhotos.uploadedValue ? ' wallpaper-thumb--selected' : ''}`}
                onClick={() => handleSelect(yourPhotos.uploadedValue)}
                aria-pressed={value === yourPhotos.uploadedValue}
              >
                <img className="wallpaper-thumb__img" src={`${BASE_URL}/files${BACKGROUND}`} alt="" />
              </button>
            )}

            <div className={`wallpaper-add${yourPhotos.backgroundImg.img ? ' wallpaper-add--filled' : ''}`}>
              <input
                ref={yourPhotos.inputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="wallpaper-add__input"
                onChange={yourPhotos.handleFileChange}
              />
              <button
                type="button"
                className="wallpaper-add__frame"
                onClick={() => yourPhotos.inputRef.current && yourPhotos.inputRef.current.click()}
              >
                {yourPhotos.backgroundImg.img ? (
                  <img className="wallpaper-add__img" src={yourPhotos.backgroundImg.img} alt="" />
                ) : (
                  <>
                    <AddPhotoAlternateIcon className="wallpaper-add__icon" />
                    <span className="wallpaper-add__label">
                      {yourPhotos.uploadedValue ? 'Заменить фото' : 'Добавить фото'}
                    </span>
                  </>
                )}
              </button>

              {yourPhotos.backgroundImg.img && (
                <>
                  <IconButton
                    className="wallpaper-add__confirm"
                    onClick={yourPhotos.handleSaveImg}
                    disabled={yourPhotos.loadingUploadWalpaper}
                    aria-label="Подтвердить загрузку"
                    size="small"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    className="wallpaper-add__remove"
                    onClick={yourPhotos.handleClear}
                    aria-label="Отменить"
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              )}
            </div>
          </PhotoCategory>
        </div>
      </div>
    </div>
  );
};
