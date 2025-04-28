import React from 'react';
import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

export const ImageBlock = ({ step = 'main', img, onDeleteImage, onFileChange }) => {
  return (
    <div className="img-block">
      {img && (
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
          <label className="img-block__label" for={`uploadFile-${step}`}>
            <FileDownloadOutlinedIcon sx={{ fontSize: 72 }} />
            <span className="label__text">ЗАГРУЗИТЬ ИЗОБРАЖЕНИЕ</span>
          </label>
        </>
      )}

      {img && (
        <img className="img-block__img" src={img} alt="Preview" style={{ maxWidth: '192px', maxHeight: '192px' }} />
      )}
    </div>
  );
};
