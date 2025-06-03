const getNews_Loading = state => state.news.news.loading;
const getNews_Status = state => state.news.news.status;
const getNews_TimeUpdate = state => state.news.news.timeUpdate;
const getNews_Data = state => state.news.news.data;

export const newsSelectors = {
  getNews_Loading,
  getNews_Status,
  getNews_TimeUpdate,
  getNews_Data,
};
