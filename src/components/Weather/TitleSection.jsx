import React, { useState } from 'react';

import { AirQuality } from './AirQuality';
import { UV } from './UV';
import { HumidityDew } from './HumidityDew';
import { Pressure } from './Pressure';
import { Visibility } from './Visibility';
import { Wind } from './Wind';
import { Cloudcover } from './Cloudcover';
import { Precip } from './Precip';
import { TempFeelslike } from './TempFeelslike';

export const TitleSection = () => {
  const [selectParams, setSelectParams] = useState('0');
  const [choiceOfDayGlobal, setChoiceOfDayGlobal] = useState('1');

  const handleChoiceOfDayGlobal = newValue => {
    setChoiceOfDayGlobal(newValue);
  };

  const handleSelectParams = e => {
    setSelectParams(e.currentTarget.value);
  };

  const buttonData = [
    { value: '0', title: 'Ощущается как' },
    { value: '1', title: 'Осадки' },
    { value: '2', title: 'Ветер' },
    { value: '3', title: 'Облачность' },
    { value: '4', title: 'UV' },
    { value: '5', title: 'Влажность' },
    { value: '6', title: 'Давление' },
    { value: '7', title: 'Видимость' },
    { value: '8', title: 'Качество воздуха' },
  ];

  return (
    <>
      <div class="title-section">
        <div class="title-start-section">
          <div class="title-label">Ежечасно</div>
          <div class="parameter-buttons">
            <div class="forecast-type-buttons">
              <div class="forecast-type-group">
                {buttonData.map((el, index) => (
                  <button
                    key={index}
                    class={selectParams === el.value ? 'forecast-button forecast-button--active' : 'forecast-button'}
                    onClick={handleSelectParams}
                    value={el.value}
                    title={el.title}
                    aria-label={el.title}
                  >
                    <span>{el.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* <div class="forecastButtonGroup-DS-EntryPoint1-2 outer">
          <button
            class="forecastButton-DS-EntryPoint1-2 forecastButtonActive-DS-EntryPoint1-2"
            title="Диаграмма"
            aria-label="Диаграмма"
            data-t='{"n":"forecastButtonchart","b":76,"c.i":"forecastButtonchart","c.t":1,"c.v":"weather","c.c":"weather"}'
            data-forecasttype="forecastButton_chart"
          >
            <span aria-hidden="true" role="presentation" style="width: 20px; height: 20px;">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="inline-DS-EntryPoint1-1"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.573 3.75C5.28788 3.75 5.00009 3.97055 5.00009 4.3125V9.02765C4.99997 9.03433 4.99997 9.04102 5.00009 9.04772V14.4375C5.00009 14.7794 5.28788 15 5.573 15H15.6771C15.9622 15 16.25 14.7794 16.25 14.4375C16.25 14.0956 15.9622 13.875 15.6771 13.875H14.7917V6.3375C14.7917 6.10159 14.6467 5.9101 14.4561 5.82527C14.267 5.74117 14.0427 5.76289 13.8732 5.88839L13.8617 5.89692L11.337 8.36158L9.12675 7.1924C8.97349 7.11133 8.79127 7.1033 8.63199 7.16883L6.14592 8.19168V4.3125C6.14592 3.97055 5.85813 3.75 5.573 3.75ZM11.7652 9.47672L13.6459 7.56119V13.875H6.14592V9.41189L8.82323 8.31036L11.1338 9.5326C11.3293 9.63604 11.5715 9.62017 11.7519 9.48661L11.7652 9.47672Z"
                ></path>
              </svg>
            </span>
            <span class="forecastButtonLabel-DS-EntryPoint1-1">Диаграмма</span>
          </button>
          <button
            class="forecastButton-DS-EntryPoint1-2"
            title="Список"
            aria-label="Список"
            data-t='{"n":"forecastButtonlist","b":76,"c.i":"forecastButtonlist","c.t":1,"c.v":"weather","c.c":"weather"}'
            data-forecasttype="forecastButton_list"
          >
            <span aria-hidden="true" role="presentation" style="width: 20px; height: 20px;">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="inline-DS-EntryPoint1-1"
              >
                <path
                  d="M6.20536 5C5.53966 5 5 5.55964 5 6.25V7.91667C5 8.60702 5.53966 9.16667 6.20536 9.16667H7.8125C8.4782 9.16667 9.01786 8.60702 9.01786 7.91667V6.25C9.01786 5.55964 8.4782 5 7.8125 5H6.20536ZM5.80357 6.25C5.80357 6.01988 5.98346 5.83333 6.20536 5.83333H7.8125C8.0344 5.83333 8.21429 6.01988 8.21429 6.25V7.91667C8.21429 8.14679 8.0344 8.33333 7.8125 8.33333H6.20536C5.98346 8.33333 5.80357 8.14679 5.80357 7.91667V6.25ZM11.0268 5.83333C10.8049 5.83333 10.625 6.01988 10.625 6.25C10.625 6.48012 10.8049 6.66667 11.0268 6.66667H15.8482C16.0701 6.66667 16.25 6.48012 16.25 6.25C16.25 6.01988 16.0701 5.83333 15.8482 5.83333H11.0268ZM11.0268 7.5C10.8049 7.5 10.625 7.68655 10.625 7.91667C10.625 8.14679 10.8049 8.33333 11.0268 8.33333H14.2411C14.463 8.33333 14.6429 8.14679 14.6429 7.91667C14.6429 7.68655 14.463 7.5 14.2411 7.5H11.0268ZM6.20536 10.8333C5.53966 10.8333 5 11.393 5 12.0833V13.75C5 14.4404 5.53966 15 6.20536 15H7.8125C8.4782 15 9.01786 14.4404 9.01786 13.75V12.0833C9.01786 11.393 8.4782 10.8333 7.8125 10.8333H6.20536ZM5.80357 12.0833C5.80357 11.8532 5.98346 11.6667 6.20536 11.6667H7.8125C8.0344 11.6667 8.21429 11.8532 8.21429 12.0833V13.75C8.21429 13.9801 8.0344 14.1667 7.8125 14.1667H6.20536C5.98346 14.1667 5.80357 13.9801 5.80357 13.75V12.0833ZM11.0268 11.6667C10.8049 11.6667 10.625 11.8532 10.625 12.0833C10.625 12.3135 10.8049 12.5 11.0268 12.5H15.8482C16.0701 12.5 16.25 12.3135 16.25 12.0833C16.25 11.8532 16.0701 11.6667 15.8482 11.6667H11.0268ZM11.0268 13.3333C10.8049 13.3333 10.625 13.5199 10.625 13.75C10.625 13.9801 10.8049 14.1667 11.0268 14.1667H14.2411C14.463 14.1667 14.6429 13.9801 14.6429 13.75C14.6429 13.5199 14.463 13.3333 14.2411 13.3333H11.0268Z"
                  fill="#242424"
                  fill-opacity="0.6"
                ></path>
              </svg>
            </span>
            <span class="forecastButtonLabel-DS-EntryPoint1-1">Список</span>
          </button>
        </div> */}
      </div>

      {selectParams === '0' && (
        <TempFeelslike choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />
      )}
      {selectParams === '1' && <Precip choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}

      {selectParams === '2' && <Wind choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}
      {selectParams === '3' && <Cloudcover choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}
      {selectParams === '4' && <UV choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}
      {selectParams === '5' && <HumidityDew choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}
      {selectParams === '6' && <Pressure choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}
      {selectParams === '7' && <Visibility choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}
      {selectParams === '8' && <AirQuality choiceOfDayGlobal={choiceOfDayGlobal} onChange={handleChoiceOfDayGlobal} />}
    </>
  );
};
