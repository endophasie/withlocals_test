import AbstractView from './abstract-view.js';

const renderHost = (host) => {
  const hostTpl = `
    <li class="trip__host host">
      <a href="${host.pretty_url}" class="link">
        <span class="host__pic" style="background-image: url(${host.photo})"></span>
        <span class="host__name">${host.fullName}</span>
      </a>
    </li>`;
    
  return hostTpl;
}

export default class TripPageView extends AbstractView {
  constructor(trip) {
    super();
    this.trip = trip['_source'];
  } 

  get template() {
    console.log(this.trip)
    return `
      <a href="/" class="trip__back link js-back-to-trips">Back to Trips</a>
      <article class="trip-page">
        <h2 class="trip-page__title">${this.trip.title} <span class="trip-page__fav">Add to Favourites</span></h2>
        <div class="trip-page__pic"><img src="${this.trip.mainPhoto}" alt="${this.trip.experienceType} in ${this.trip.clean_city}, ${this.trip.country}"></div>
        <p class="trip-page__teaser">${this.trip.teaser}</p> 
        <ul class="trip-page__hosts">${this.trip.hosts.map((host) => renderHost(host)).join('')}</ul>
      </article>`;
  }

  onClick() {
  }

  bind() {
    const backLink = this.element.querySelector('.js-back-to-trips');
    
    backLink.addEventListener('click', this.onClick);
  }
}
