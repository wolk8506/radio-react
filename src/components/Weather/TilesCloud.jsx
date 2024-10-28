import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getWeatherToday_Data, getWeatherTomorrow_Data } from 'store/selectors';

import moment from 'moment';

export const TilesCloud = () => {
  const data_today = useSelector(getWeatherToday_Data);
  const dataLast_tomorrow = useSelector(getWeatherTomorrow_Data);
  const [svgCloud, setSvgCloud] = useState(0);
  const [cloudText, setCloudText] = useState('--');
  const [description, setDescription] = useState('--');
  const [cloudProcent, setCloudProcent] = useState(0);

  useEffect(() => {
    const currentCloud = [
      'Ясно', //0-10
      'Преимущественно ясно', //10-15
      'В основном ясно', //15-30
      'Небольшая облачность', //30-50
      'Частичная облачность', //50-60
      'В основном облачно', //60-85
      'Облачно', //85-100
    ];
    const nextHourCloud = [
      ' с ясным небом в ', //0-10
      ' с преимущественно ясным небом в ', //10-15
      ' с восновном ясным небом в ', //15-30
      ' с небольшой облачностью в ', //30-50
      ' с частичной облачностью в ', //50-60
      ' с преимущественно облачным небом в ', //60-85
      ' с облачным небом в ', //85-100
    ];
    const nextDayCloud = [
      'ясное небо.', //0-10
      'преимущественно ясное небо.', //10-15
      'восновном ясное небо.', //15-30
      'небольшая облачность.', //30-50
      'частичная облачность.', //50-60
      'преимущественно облачное небо.', //60-85
      'облачное небо.', //85-100
    ];

    const hour = Number(moment().format('H'));
    const cloud = data_today.days[0].hours[hour].cloudcover;
    const cloudTomorrowHour0 = data_today.days[0].hours[0].cloudcover;
    const cloudTomorrow = dataLast_tomorrow.days[0].cloudcover;
    const arr = [];
    const arr2 = [];

    data_today.days[0].hours.map(i => arr.push(i.cloudcover));

    dataLast_tomorrow.days[0].hours.map(i => arr2.push(i.cloudcover));
    const arr3 = [...arr, cloudTomorrowHour0];

    const cloudEvening = arr.slice(-6).reduce((acc, num) => acc + num, 0) / 6;

    if (cloud < 15) {
      setSvgCloud(0);
    } else if (cloud < 45) {
      setSvgCloud(1);
    } else if (cloud < 65) {
      setSvgCloud(2);
    } else if (cloud < 85) {
      setSvgCloud(3);
    } else if (cloud <= 100) {
      setSvgCloud(4);
    }

    function fu1(cloud2) {
      if (cloud2 < 10) {
        return 0;
      } else if (cloud2 < 15) {
        return 1;
      } else if (cloud2 < 30) {
        return 2;
      } else if (cloud2 < 50) {
        return 3;
      } else if (cloud2 < 60) {
        return 4;
      } else if (cloud2 < 85) {
        return 5;
      } else if (cloud2 <= 100) {
        return 6;
      }
    }
    setCloudText(currentCloud[fu1(arr3[hour])]);
    setCloudProcent(cloud);

    let a = fu1(arr3[hour + 1]);
    let b = fu1(arr3[hour]);
    let c = '';

    if (hour > 17) {
      c = `Завтра ожидается ${nextDayCloud[fu1(cloudTomorrow)]}`;
    } else if (hour > 12) {
      c = `Вечером ожидается ${nextDayCloud[fu1(cloudEvening)]}`;
    } else c = '';

    if (a < b) {
      setDescription('Увеличение ' + nextHourCloud[a] + (hour + 1) + ':00. ' + c);
    } else if (a === b) {
      setDescription('Стабильное состояние ' + nextHourCloud[a] + (hour + 1) + ':00. ' + c);
    } else if (a > b) {
      setDescription('Уменьшается ' + nextHourCloud[a] + (hour + 1) + ':00. ' + c);
    }
  }, [dataLast_tomorrow.days, data_today.days]);

  return (
    <div className="card__item" id="animatedCloud">
      <p className="item__title">Облачность</p>
      <div className="cloud">
        <svg
          className="cloud__svg"
          xmlns="http://www.w3.org/2000/svg"
          width="130px"
          height="130px"
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 160 160"
        >
          <defs>
            <filter
              id="filter0_d_2586_5626"
              x="0"
              y="0"
              width="50.8184"
              height="33.5718"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2586_5626"></feBlend>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2586_5626" result="shape"></feBlend>
            </filter>
          </defs>
          <defs>
            <filter
              id="filter0_f_2586_5652"
              x="0"
              y="0"
              width="42.8193"
              height="29.9922"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
              <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_2586_5652"></feGaussianBlur>
            </filter>
          </defs>
          <defs>
            <filter
              id="filter0_f_2586_5637"
              x="0"
              y="0"
              width="75"
              height="40.3745"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
              <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_2586_5637"></feGaussianBlur>
            </filter>
          </defs>
          {svgCloud === 4 && (
            //   TODO: 85%-100%
            <g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(45 0) scale(1.3)" style={{ opacity: 0.6 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(100 100) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M69.8975 46.3317C76.4683 46.2364 81.7646 41.0475 81.7646 34.6604C81.7646 28.2137 76.3691 22.9877 69.7134 22.9877C69.6554 22.9877 69.5975 22.9881 69.5397 22.9889C69.4411 10.2761 58.7708 0 45.6225 0C36.3864 0 28.3731 5.07072 24.388 12.4948C15.4349 13.2413 8.4085 20.5171 8.4085 29.3823C8.4085 30.0233 8.44523 30.6559 8.51675 31.2783C8.27705 31.2568 8.03419 31.2458 7.7887 31.2458C3.48732 31.2458 0.000358582 34.6232 0.000358582 38.7895C0.000358582 42.9557 3.48732 46.3331 7.7887 46.3331C7.81483 46.3331 7.84094 46.333 7.86702 46.3328V46.3332H69.8975V46.3317Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(35 55) scale(1.5)" style={{ opacity: 0.6 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(-65 90) scale(2)" style={{ opacity: 0.6 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(5 80) scale(2)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(120 65) scale(1)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(45 0) scale(1.3)" style={{ opacity: 0.6 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(100 100) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M69.8975 46.3317C76.4683 46.2364 81.7646 41.0475 81.7646 34.6604C81.7646 28.2137 76.3691 22.9877 69.7134 22.9877C69.6554 22.9877 69.5975 22.9881 69.5397 22.9889C69.4411 10.2761 58.7708 0 45.6225 0C36.3864 0 28.3731 5.07072 24.388 12.4948C15.4349 13.2413 8.4085 20.5171 8.4085 29.3823C8.4085 30.0233 8.44523 30.6559 8.51675 31.2783C8.27705 31.2568 8.03419 31.2458 7.7887 31.2458C3.48732 31.2458 0.000358582 34.6232 0.000358582 38.7895C0.000358582 42.9557 3.48732 46.3331 7.7887 46.3331C7.81483 46.3331 7.84094 46.333 7.86702 46.3328V46.3332H69.8975V46.3317Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;50"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(35 55) scale(1.5)" style={{ opacity: 0.6 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;50"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(-65 90) scale(2)" style={{ opacity: 0.6 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(5 80) scale(2)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(120 65) scale(1)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(-10 15) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M81.2061 62.1666H51.9668C50.8675 62.2765 49.7518 62.3329 48.6226 62.3329C47.4933 62.3329 46.3776 62.2765 45.2783 62.1666H18.5821C17.8087 62.2763 17.0176 62.3331 16.2128 62.3331C7.25873 62.3331 0 55.3024 0 46.6295C0 37.9567 7.25873 30.926 16.2128 30.926C16.2908 30.926 16.3686 30.9265 16.4462 30.9276C16.5788 13.8248 30.9338 0 48.6226 0C61.2683 0 72.2103 7.06572 77.4699 17.3436C79.9826 16.939 82.6044 16.7248 85.3001 16.7248C103.912 16.7248 119 26.9346 119 39.529C119 40.3774 118.931 41.2149 118.798 42.0393C124.459 42.1919 129 46.6754 129 52.184C129 57.7889 124.299 62.3326 118.5 62.3326C117.85 62.3326 117.215 62.2757 116.598 62.1666H89.3941C88.0522 62.2766 86.6859 62.3332 85.3001 62.3332C83.9143 62.3332 82.5481 62.2766 81.2061 62.1666Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(-10 15) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M81.2061 62.1666H51.9668C50.8675 62.2765 49.7518 62.3329 48.6226 62.3329C47.4933 62.3329 46.3776 62.2765 45.2783 62.1666H18.5821C17.8087 62.2763 17.0176 62.3331 16.2128 62.3331C7.25873 62.3331 0 55.3024 0 46.6295C0 37.9567 7.25873 30.926 16.2128 30.926C16.2908 30.926 16.3686 30.9265 16.4462 30.9276C16.5788 13.8248 30.9338 0 48.6226 0C61.2683 0 72.2103 7.06572 77.4699 17.3436C79.9826 16.939 82.6044 16.7248 85.3001 16.7248C103.912 16.7248 119 26.9346 119 39.529C119 40.3774 118.931 41.2149 118.798 42.0393C124.459 42.1919 129 46.6754 129 52.184C129 57.7889 124.299 62.3326 118.5 62.3326C117.85 62.3326 117.215 62.2757 116.598 62.1666H89.3941C88.0522 62.2766 86.6859 62.3332 85.3001 62.3332C83.9143 62.3332 82.5481 62.2766 81.2061 62.1666Z"
                  ></path>
                  ;
                </g>
              </g>
            </g>
          )}
          {svgCloud === 1 && (
            // TODO:  15% - 45% облачности, отображается 2 облака
            <g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(75 15) scale(0.9)" style={{ opacity: 1 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(45 115) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5637)" transform="translate(75 15) scale(0.9)" style={{ opacity: 1 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.8274 36.2876H44.0042C44.5767 36.345 45.1578 36.3744 45.746 36.3744C46.3342 36.3744 46.9153 36.345 47.4878 36.2876H61.3451C61.748 36.3449 62.1601 36.3746 62.5794 36.3746C67.23 36.3746 71 32.723 71 28.2185C71 23.714 67.23 20.0624 62.5794 20.0624C62.5388 20.0624 62.4982 20.0627 62.4578 20.0632C62.389 11.1803 54.9332 4 45.746 4C39.1781 4 33.4951 7.66976 30.7633 13.0078C29.4582 12.7977 28.0964 12.6864 26.6963 12.6864C17.0297 12.6864 9.19332 17.9892 9.19332 24.5305C9.19332 24.9712 9.22889 25.4063 9.29821 25.8345C6.35796 25.9138 3.99962 28.2425 3.99962 31.1035C3.99962 34.0146 6.44123 36.3745 9.45311 36.3745C9.79175 36.3745 10.1232 36.3447 10.4447 36.2876H24.5651C25.2636 36.345 25.9748 36.3745 26.6963 36.3745C27.4177 36.3745 28.1289 36.345 28.8274 36.2876Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(45 115) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
            </g>
          )}
          {svgCloud === 2 && (
            //   TODO:  45% - 65%
            <g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(-10 15) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M81.2061 62.1666H51.9668C50.8675 62.2765 49.7518 62.3329 48.6226 62.3329C47.4933 62.3329 46.3776 62.2765 45.2783 62.1666H18.5821C17.8087 62.2763 17.0176 62.3331 16.2128 62.3331C7.25873 62.3331 0 55.3024 0 46.6295C0 37.9567 7.25873 30.926 16.2128 30.926C16.2908 30.926 16.3686 30.9265 16.4462 30.9276C16.5788 13.8248 30.9338 0 48.6226 0C61.2683 0 72.2103 7.06572 77.4699 17.3436C79.9826 16.939 82.6044 16.7248 85.3001 16.7248C103.912 16.7248 119 26.9346 119 39.529C119 40.3774 118.931 41.2149 118.798 42.0393C124.459 42.1919 129 46.6754 129 52.184C129 57.7889 124.299 62.3326 118.5 62.3326C117.85 62.3326 117.215 62.2757 116.598 62.1666H89.3941C88.0522 62.2766 86.6859 62.3332 85.3001 62.3332C83.9143 62.3332 82.5481 62.2766 81.2061 62.1666Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(77 90) scale(0.9)" style={{ opacity: 1 }} filter="url(#filter0_f_2586_5652)">
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26.2242 24.8384C24.6987 25.5768 22.9775 25.9922 21.1562 25.9922C18.5827 25.9922 16.2092 25.1629 14.3051 23.765C13.2621 25.1169 11.5966 25.992 9.7202 25.992C6.56102 25.992 4 23.5115 4 20.4515C4 17.3916 6.56102 14.911 9.7202 14.911C9.7481 14.911 9.77595 14.9112 9.80375 14.9116C9.85064 8.87752 14.9153 4 21.1562 4C25.5401 4 29.3436 6.40676 31.2352 9.93054C35.4844 10.2853 38.8192 13.7386 38.8192 17.9463C38.8192 22.3898 35.1001 25.992 30.5125 25.992C28.9434 25.992 27.476 25.5707 26.2242 24.8384Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(100 85) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M69.8975 46.3317C76.4683 46.2364 81.7646 41.0475 81.7646 34.6604C81.7646 28.2137 76.3691 22.9877 69.7134 22.9877C69.6554 22.9877 69.5975 22.9881 69.5397 22.9889C69.4411 10.2761 58.7708 0 45.6225 0C36.3864 0 28.3731 5.07072 24.388 12.4948C15.4349 13.2413 8.4085 20.5171 8.4085 29.3823C8.4085 30.0233 8.44523 30.6559 8.51675 31.2783C8.27705 31.2568 8.03419 31.2458 7.7887 31.2458C3.48732 31.2458 0.000358582 34.6232 0.000358582 38.7895C0.000358582 42.9557 3.48732 46.3331 7.7887 46.3331C7.81483 46.3331 7.84094 46.333 7.86702 46.3328V46.3332H69.8975V46.3317Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(45 115) scale(0.9)" filter="url(#filter0_d_2586_5626)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(-10 15) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M81.2061 62.1666H51.9668C50.8675 62.2765 49.7518 62.3329 48.6226 62.3329C47.4933 62.3329 46.3776 62.2765 45.2783 62.1666H18.5821C17.8087 62.2763 17.0176 62.3331 16.2128 62.3331C7.25873 62.3331 0 55.3024 0 46.6295C0 37.9567 7.25873 30.926 16.2128 30.926C16.2908 30.926 16.3686 30.9265 16.4462 30.9276C16.5788 13.8248 30.9338 0 48.6226 0C61.2683 0 72.2103 7.06572 77.4699 17.3436C79.9826 16.939 82.6044 16.7248 85.3001 16.7248C103.912 16.7248 119 26.9346 119 39.529C119 40.3774 118.931 41.2149 118.798 42.0393C124.459 42.1919 129 46.6754 129 52.184C129 57.7889 124.299 62.3326 118.5 62.3326C117.85 62.3326 117.215 62.2757 116.598 62.1666H89.3941C88.0522 62.2766 86.6859 62.3332 85.3001 62.3332C83.9143 62.3332 82.5481 62.2766 81.2061 62.1666Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5652)" transform="translate(77 90) scale(0.9)" style={{ opacity: 1 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26.2242 24.8384C24.6987 25.5768 22.9775 25.9922 21.1562 25.9922C18.5827 25.9922 16.2092 25.1629 14.3051 23.765C13.2621 25.1169 11.5966 25.992 9.7202 25.992C6.56102 25.992 4 23.5115 4 20.4515C4 17.3916 6.56102 14.911 9.7202 14.911C9.7481 14.911 9.77595 14.9112 9.80375 14.9116C9.85064 8.87752 14.9153 4 21.1562 4C25.5401 4 29.3436 6.40676 31.2352 9.93054C35.4844 10.2853 38.8192 13.7386 38.8192 17.9463C38.8192 22.3898 35.1001 25.992 30.5125 25.992C28.9434 25.992 27.476 25.5707 26.2242 24.8384Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(100 85) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M69.8975 46.3317C76.4683 46.2364 81.7646 41.0475 81.7646 34.6604C81.7646 28.2137 76.3691 22.9877 69.7134 22.9877C69.6554 22.9877 69.5975 22.9881 69.5397 22.9889C69.4411 10.2761 58.7708 0 45.6225 0C36.3864 0 28.3731 5.07072 24.388 12.4948C15.4349 13.2413 8.4085 20.5171 8.4085 29.3823C8.4085 30.0233 8.44523 30.6559 8.51675 31.2783C8.27705 31.2568 8.03419 31.2458 7.7887 31.2458C3.48732 31.2458 0.000358582 34.6232 0.000358582 38.7895C0.000358582 42.9557 3.48732 46.3331 7.7887 46.3331C7.81483 46.3331 7.84094 46.333 7.86702 46.3328V46.3332H69.8975V46.3317Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(45 115) scale(0.9)" filter="url(#filter0_d_2586_5626)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
            </g>
          )}
          {svgCloud === 3 && (
            //   TODO: 65% - 85% облочности
            <g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(-10 15) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M81.2061 62.1666H51.9668C50.8675 62.2765 49.7518 62.3329 48.6226 62.3329C47.4933 62.3329 46.3776 62.2765 45.2783 62.1666H18.5821C17.8087 62.2763 17.0176 62.3331 16.2128 62.3331C7.25873 62.3331 0 55.3024 0 46.6295C0 37.9567 7.25873 30.926 16.2128 30.926C16.2908 30.926 16.3686 30.9265 16.4462 30.9276C16.5788 13.8248 30.9338 0 48.6226 0C61.2683 0 72.2103 7.06572 77.4699 17.3436C79.9826 16.939 82.6044 16.7248 85.3001 16.7248C103.912 16.7248 119 26.9346 119 39.529C119 40.3774 118.931 41.2149 118.798 42.0393C124.459 42.1919 129 46.6754 129 52.184C129 57.7889 124.299 62.3326 118.5 62.3326C117.85 62.3326 117.215 62.2757 116.598 62.1666H89.3941C88.0522 62.2766 86.6859 62.3332 85.3001 62.3332C83.9143 62.3332 82.5481 62.2766 81.2061 62.1666Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5652)" transform="translate(77 90) scale(0.9)" style={{ opacity: 1 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26.2242 24.8384C24.6987 25.5768 22.9775 25.9922 21.1562 25.9922C18.5827 25.9922 16.2092 25.1629 14.3051 23.765C13.2621 25.1169 11.5966 25.992 9.7202 25.992C6.56102 25.992 4 23.5115 4 20.4515C4 17.3916 6.56102 14.911 9.7202 14.911C9.7481 14.911 9.77595 14.9112 9.80375 14.9116C9.85064 8.87752 14.9153 4 21.1562 4C25.5401 4 29.3436 6.40676 31.2352 9.93054C35.4844 10.2853 38.8192 13.7386 38.8192 17.9463C38.8192 22.3898 35.1001 25.992 30.5125 25.992C28.9434 25.992 27.476 25.5707 26.2242 24.8384Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(100 85) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M69.8975 46.3317C76.4683 46.2364 81.7646 41.0475 81.7646 34.6604C81.7646 28.2137 76.3691 22.9877 69.7134 22.9877C69.6554 22.9877 69.5975 22.9881 69.5397 22.9889C69.4411 10.2761 58.7708 0 45.6225 0C36.3864 0 28.3731 5.07072 24.388 12.4948C15.4349 13.2413 8.4085 20.5171 8.4085 29.3823C8.4085 30.0233 8.44523 30.6559 8.51675 31.2783C8.27705 31.2568 8.03419 31.2458 7.7887 31.2458C3.48732 31.2458 0.000358582 34.6232 0.000358582 38.7895C0.000358582 42.9557 3.48732 46.3331 7.7887 46.3331C7.81483 46.3331 7.84094 46.333 7.86702 46.3328V46.3332H69.8975V46.3317Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="0;200"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(45 115) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(-10 15) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M81.2061 62.1666H51.9668C50.8675 62.2765 49.7518 62.3329 48.6226 62.3329C47.4933 62.3329 46.3776 62.2765 45.2783 62.1666H18.5821C17.8087 62.2763 17.0176 62.3331 16.2128 62.3331C7.25873 62.3331 0 55.3024 0 46.6295C0 37.9567 7.25873 30.926 16.2128 30.926C16.2908 30.926 16.3686 30.9265 16.4462 30.9276C16.5788 13.8248 30.9338 0 48.6226 0C61.2683 0 72.2103 7.06572 77.4699 17.3436C79.9826 16.939 82.6044 16.7248 85.3001 16.7248C103.912 16.7248 119 26.9346 119 39.529C119 40.3774 118.931 41.2149 118.798 42.0393C124.459 42.1919 129 46.6754 129 52.184C129 57.7889 124.299 62.3326 118.5 62.3326C117.85 62.3326 117.215 62.2757 116.598 62.1666H89.3941C88.0522 62.2766 86.6859 62.3332 85.3001 62.3332C83.9143 62.3332 82.5481 62.2766 81.2061 62.1666Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_f_2586_5652)" transform="translate(77 90) scale(0.9)" style={{ opacity: 1 }}>
                  <path
                    className="cloud__svg--color-2"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26.2242 24.8384C24.6987 25.5768 22.9775 25.9922 21.1562 25.9922C18.5827 25.9922 16.2092 25.1629 14.3051 23.765C13.2621 25.1169 11.5966 25.992 9.7202 25.992C6.56102 25.992 4 23.5115 4 20.4515C4 17.3916 6.56102 14.911 9.7202 14.911C9.7481 14.911 9.77595 14.9112 9.80375 14.9116C9.85064 8.87752 14.9153 4 21.1562 4C25.5401 4 29.3436 6.40676 31.2352 9.93054C35.4844 10.2853 38.8192 13.7386 38.8192 17.9463C38.8192 22.3898 35.1001 25.992 30.5125 25.992C28.9434 25.992 27.476 25.5707 26.2242 24.8384Z"
                  ></path>
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g transform="translate(100 85) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M69.8975 46.3317C76.4683 46.2364 81.7646 41.0475 81.7646 34.6604C81.7646 28.2137 76.3691 22.9877 69.7134 22.9877C69.6554 22.9877 69.5975 22.9881 69.5397 22.9889C69.4411 10.2761 58.7708 0 45.6225 0C36.3864 0 28.3731 5.07072 24.388 12.4948C15.4349 13.2413 8.4085 20.5171 8.4085 29.3823C8.4085 30.0233 8.44523 30.6559 8.51675 31.2783C8.27705 31.2568 8.03419 31.2458 7.7887 31.2458C3.48732 31.2458 0.000358582 34.6232 0.000358582 38.7895C0.000358582 42.9557 3.48732 46.3331 7.7887 46.3331C7.81483 46.3331 7.84094 46.333 7.86702 46.3328V46.3332H69.8975V46.3317Z"
                  ></path>
                  ;
                </g>
              </g>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  keyTimes="0;1"
                  values="-130;20"
                  dur="12"
                  repeatCount="indefinite"
                  begin="animatedCloud.mouseenter"
                  end="animatedCloud.mouseleave"
                ></animateTransform>
                <g filter="url(#filter0_d_2586_5626)" transform="translate(45 115) scale(0.9)">
                  <path
                    className="cloud__svg--color-1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M18.9358 30.0199C20.9872 31.0129 23.3018 31.5717 25.7512 31.5717C29.211 31.5717 32.402 30.4568 34.9622 28.5777C36.3648 30.3952 38.6039 31.5716 41.1267 31.5716C45.3747 31.5716 48.8184 28.2361 48.8184 24.1216C48.8184 20.0071 45.3747 16.6716 41.1267 16.6716C41.0898 16.6716 41.0529 16.6719 41.0161 16.6724C40.9532 8.55863 34.1429 2 25.7512 2C19.8565 2 14.7421 5.23617 12.1986 9.97431C6.48431 10.4508 1.9997 15.0944 1.9997 20.7527C1.9997 26.7276 7.00047 31.5713 13.1692 31.5713C15.2792 31.5713 17.2525 31.0047 18.9358 30.0199Z"
                  ></path>
                </g>
              </g>
            </g>
          )}
        </svg>
        <div className="cloud__text-block">
          <p className="cloud__title" title={cloudText}>
            {cloudText}
          </p>
        </div>
      </div>
      <p className="item__text">{`${cloudText} (${cloudProcent}%)`}</p>
      <div className="cloud__item">
        <p className="item__sub-text" title={description}>
          {description}
        </p>
      </div>
    </div>
  );
};
