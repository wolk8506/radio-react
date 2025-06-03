import React from 'react';
import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

export const ElementImg = ({
  step = 'main',
  img,
  onDeleteImage,
  onFileChange,
  isFetching = false,
  isVisibleBtnDelete = true,
}) => {
  return (
    <div className="img-block">
      {img && isVisibleBtnDelete && (
        <Button className="img-block__btn" onClick={() => onDeleteImage(step)}>
          <DeleteIcon sx={{ fontSize: 72 }} />
        </Button>
      )}

      {!img && (
        <>
          <input
            className="img-block__input"
            id={`uploadFile-${step}`}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={onFileChange}
          />
          <label className="img-block__label" htmlFor={`uploadFile-${step}`}>
            <FileDownloadOutlinedIcon sx={{ fontSize: 72 }} />
            <span className="label__text">ЗАГРУЗИТЬ ИЗОБРАЖЕНИЕ</span>
          </label>
        </>
      )}

      {img &&
        (isFetching ? (
          <CircularProgress />
        ) : (
          <img className="img-block__img" src={img} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        ))}
    </div>
  );
};
