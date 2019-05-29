import { Composer } from './Composer';

export const cache = [];

export class Transistor extends Composer {
  totalSubscribers = 0;

  constructor(composer, name) {
    super(null, composer, name);
  }

  handleValidation() {
    this.errors = this.validate(this.values);
    console.log(this.props.name);
    console.log(this.errors);
  }

  findInCache([,, transistor]) {
    transistor === this;
  }

  subscribeToEvents() {
    if (this.totalSubscribers === 0) super.subscribeToEvents();
    this.totalSubscribers++;
  }

  unsubscribeFromEvents() {
    this.totalSubscribers--;
    if (this.totalSubscribers === 0) super.unsubscribeFromEvents();
    cache.splice(cache.indexOf(this.findInCache), 1);
  }
}