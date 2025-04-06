import { Block } from 'notiflix/build/notiflix-block-aio';

const idNews = document.querySelector('#news');
const btnMinus = document.querySelector('#btn-minus');
const btnPlus = document.querySelector('#btn-plus');
// const sliderNews = document.querySelector('#slider-news');
const contentModal = document.querySelector('#contentModal');
const openModalBtn = document.querySelector('[data-modal-open-1]');
const closeModalBtn = document.querySelector('[data-modal-close-1]');
const modal = document.querySelector('[data-modal-1]');

let count = 0;
let totalnews = 0;
let dataNews = [];

// idNews.innerHTML = `<div class="spinner-news"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>`;
idNews.innerHTML = `<div class="spinner-news js-loading-news"></div>`;
Block.pulse('.js-loading-news');
const news = async () => {
  const response1 = await fetch(
    `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&country=ru,ua&language=ru&category=technology `,
    { referrerPolicy: 'origin-when-cross-origin' }
  );
  const data1 = await response1.json();
  const response2 = await fetch(
    `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&country=ua`,
    { referrerPolicy: 'origin-when-cross-origin' }
  );
  const data2 = await response2.json();
  const nextPage = data2.nextPage;
  const response3 = await fetch(
    `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&country=ua&page=${nextPage}`,
    { referrerPolicy: 'origin-when-cross-origin' }
  );
  const data3 = await response3.json();
  let data = [];
  data = await data.concat(data1.results);
  data = await data.concat(data2.results);
  data = await data.concat(data3.results);
  if (data1.status === 'error') {
    return 'error';
  }
  return data;
};

news()
  .then(data => {
    dataNews = data;
    newsMarkup();
  })
  .catch(error => {
    console.log('много запросов новостей');
    // currencyA('error');
  });

function newsMarkup() {
  const data = dataNews;
  totalnews = data.length;
  if (count === data.length - 1) {
    count = 0;
  } else count = count + 1;

  // !!!!!!!!!!!Timer
  let nIntervId;

  function startTimer() {
    if (!nIntervId) {
      nIntervId = setInterval(nextSlide, 15000);
    }
  }

  function nextSlide() {
    if (count === data.length - 1) {
      count = 0;
    } else count = count + 1;
    markup();
  }

  function stopTimer() {
    clearInterval(nIntervId);
    nIntervId = null;
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // !!!!! MODAL OPEN/CLOSED

  openModalBtn.addEventListener('click', toggleModal);
  closeModalBtn.addEventListener('click', toggleModal);
  // document.addEventListener('keyup', e => {
  //   if (e.key === 'Escape') {
  //     toggleModal();
  //   }
  // });
  modal.addEventListener('click', e => {
    if (e.target.classList.value === 'backdrop') {
      toggleModal();
    }
  });

  let toggleTimer = true;

  function toggleModal() {
    if (toggleTimer) {
      stopTimer();
      toggleTimer = false;
    } else {
      startTimer();
      toggleTimer = true;
    }

    document.body.classList.toggle('modal-open');
    modal.classList.toggle('is-hidden');
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  btnMinus.addEventListener('click', () => {
    if (count === 0) {
      count = data.length - 1;
    } else count = count - 1;
    markup();
  });

  btnPlus.addEventListener('click', () => {
    if (count === data.length - 1) {
      count = 0;
    } else count = count + 1;
    stopTimer();
    markup();
  });

  function markup() {
    // ????????? для нового слайдера?????????????????????????
    // f11();
    function f11() {
      // const count = 10;
      // const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const arr = data;
      let arr2 = [];
      if (count - 1 < 1) {
        arr2 = [...arr.slice(-2)];
      } else if (count - 2 < 1) {
        arr2 = [...arr.slice(-1)];
      }
      arr2 = [...arr2, ...arr.slice(count - 3 < 0 ? 0 : count - 3, count + 2)];
      if (count + 1 > arr.length) {
        arr2 = [...arr2, ...arr.slice(0, 2)];
      } else if (count + 2 > arr.length) {
        arr2 = [...arr2, ...arr.slice(0, 1)];
      }

      if (arr.length === 0) {
        return;
      }
      const renderNews = arr2
        .map(i => {
          // console.log(i.image_url);
          const img1 = `<img src="${i.image_url}" height="250">`;
          const img2 = '';

          return `
          <div class="news-card">
            ${i.image_url ? img1 : img2}
            <div class="news-card-text">
            <div class="news-card-content">
            <h3>${i.title}</h3>
              <p>${i.description ? i.description : ''}</p>
            </div>
              <div>
                <p class="publishedAt">Опубликовано ${i.pubDate}</p>
                <p class="totalnews">${count + 1} из ${totalnews}</p>
              </div>
            </div>
          </div>
         `;
        })
        .join('');
      console.log(renderNews);
      Block.remove('.js-loading-news');
      idNews.innerHTML = `<div class="slider">${renderNews}</div>`;
    }
    // ???????????????????????????????????????????????????????????????????????????????????
    startTimer();
    const img1 = `<img src="${data[count].image_url}" height="250">`;
    const img2 = '';

    idNews.innerHTML = `
      <div class="news-card">
        ${data[count].image_url ? img1 : img2}
        <div class="news-card-text">
        <div class="news-card-content">
        <h3>${data[count].title}</h3>
          <p>${data[count].description ? data[count].description : ''}</p>

        </div>

          <div>
            <p class="publishedAt">Опубликовано ${data[count].pubDate}</p>
            <p class="totalnews">${count + 1} / ${totalnews}</p>
          </div>
        </div>
      </div>
     `;

    contentModal.innerHTML = `
    <div class="news-card-modal">
    <h2>${data[count].title}</h2>
      ${data[count].image_url ? img1 : img2}
      <div class="news-card-text">
      <div class="news-card-content-modal">
      
        <p>${data[count].content ? data[count].content : data[count].description}</p>
        <a class="news-link" href="${data[count].link}" rel="noopener noreferrer" target="_blank">Источник: ${
      data[count].source_id
    }</a>
      </div>
        
        <div>
          <p class="publishedAt">Опубликовано ${data[count].pubDate}</p>
          
        </div>
      </div>
    </div>
   `;
  }
  markup();

  // const intervalID = setInterval(() => {}, 10000);
}
