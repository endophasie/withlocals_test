import AbstractView from './abstract-view.js';

const renderTripItem = (trip) => {
  trip = trip['_source'];
  return `
    <li class="trip trips__item" id="${trip.id}">
      <a href="/#${trip.pretty_url}" class="trip__link link js-link-trip">
        <div class="trip__pic"><img src="${trip.mainPhoto}" alt="${trip.experienceType} in ${trip.clean_city}, ${trip.country}"></div>
        <h3 class="trip__title">${trip.title}</h3>
      </a>
      <div class="trip__content">
        <p class="trip__teaser">${trip.teaser}</p> 
      </div>
    </li>`;
}

export default class TripListView extends AbstractView {
  constructor(data) {
    super();
    this.trips = data;
  } 

  get template() {
    return `
      <ul class="trips">
        ${this.trips.map((trip) => renderTripItem(trip)).join('')}
      </ul>`;
  }

  onClick() {
  }

  bind() {
    const linkTrip = this.element.querySelectorAll('.js-link-trip');

    linkTrip.forEach((item) => {
      item.addEventListener('click', (e) => {
        const tripId = e.currentTarget.closest('.trip').id;
        this.onClick(tripId);
      });
    });
  }
}
