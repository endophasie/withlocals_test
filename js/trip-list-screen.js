import Application from './app.js';
import TripListView from './trip-list-view.js';

class TripListInstance {
  constructor(data) {
    this.data = data;
    this.template = new TripListView(this.data);
    this.element = this.template.element;

    this.template.onClick = (tripId) => {
      Application.showTripPage(tripId);
    };
  }
}

export default TripListInstance;
