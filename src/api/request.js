import axios from 'axios';

export const requestByURL = URL => {
  return axios
    .request(URL)
    .then(function (response) {
      // console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log('❌ Error: ', error.message);
    })
    .finally(function () {});
};

// export const fetchNBUtoday = URL => {
//   return axios
//     .request(URL)
//     .then(function (response) {
//       //   console.log('fetch OK');
//       return response.data;
//     })
//     .catch(function (error) {
//       console.log('❌ Error: ', error.message);
//     })
//     .finally(function () {});
// };

// export const setCity = () => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve([
//         {
//           currencyCodeA: 840,
//           currencyCodeB: 980,
//           date: 1711992373,
//           rateBuy: 38.95,
//           rateSell: 139.3592,
//         },
//       ]);
//     }, 500);
//   });
// };
