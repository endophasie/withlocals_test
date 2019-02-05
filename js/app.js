import Loader from './loader.js';
import TripListInstance from './trip-list-screen.js';
import TripPageInstance from './trip-page-screen.js';

let tripList;
let tripListOriginals;

const mainElement = document.querySelector('#main');

const showPage = (element) => {
  mainElement.innerHTML = '';
  mainElement.appendChild(element);
};

class Application {
  static init() {
    Loader.loadData()
      .then((data) => {
        tripList = data.all.hits.hits; 
        tripListOriginals = tripList.filter(item => (item['_source'].is_originals));
        Application.showTripList();
      })
      .catch((err) => {
        throw new Error('Error: ' + err);
      });
      
  }

  static showTripList() {
    const tripListInstance = new TripListInstance(tripListOriginals);
    showPage(tripListInstance.element);
  }

  static showTripPage(tripId) {
    const currentTrip = tripListOriginals.filter(item => (item['_source']['id'] === tripId));
    const tripPage = new TripPageInstance(currentTrip[0]);
    showPage(tripPage.element);
  }
}

export default Application;
