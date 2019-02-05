import Application from './app.js';
import TripPageView from './trip-page-view.js';

class TripPageInstance {
  constructor(data) {
    this.data = data;
    this.template = new TripPageView(data);
    this.element = this.template.element;

    this.template.onClick = () => {
      Application.showTripList();
    };
  }
}

export default TripPageInstance;
