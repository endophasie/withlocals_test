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

export default AbstractView;
