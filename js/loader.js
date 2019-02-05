const SERVER_URL = 'https://www.withlocals.com/api/v1/experience/searchWithOthers?adults=2&children=0&date.from=2019-05-10&date.to=2019-05-10&fieldset=reactsearch&lang=en&location.city=rome&location.country=italy&page=1&pagesize=47';

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

const toJSON = (response) => response.json();

class Loader {
  static loadData() {
    return fetchJsonp(`${SERVER_URL}`)
      .then(checkStatus)
      .then(toJSON);
  }
}

export default Loader;
