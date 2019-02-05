(function () {
'use strict';

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

const render = (template) => {
    const el = document.createElement('section');
    el.innerHTML = template;
    return el;
};

class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error("Can't instantiate AbstractView, only concrete one");
    }
  }

  get template() {
    throw new Error('Template is required');
  }

  get element() {
    if (this._element) {
      return this._element;
    }

    this._element = this.render();
    this.bind(this._element);

    return this._element;
  }

  render() {
    return render(this.template);
  }

  bind() {
  }

  onClick() {
  }
}

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
};

class TripListView extends AbstractView {
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

const renderHost = (host) => {
  const hostTpl = `
    <li class="trip__host host">
      <a href="${host.pretty_url}" class="link">
        <span class="host__pic" style="background-image: url(${host.photo})"></span>
        <span class="host__name">${host.fullName}</span>
      </a>
    </li>`;
    
  return hostTpl;
};

class TripPageView extends AbstractView {
  constructor(trip) {
    super();
    this.trip = trip['_source'];
  } 

  get template() {
    console.log(this.trip);
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

document.addEventListener('DOMContentLoaded', Application.init());

}());

//# sourceMappingURL=main.js.map
