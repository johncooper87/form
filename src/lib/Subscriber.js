import { notNull } from './_shared';

export class Subscriber {

  constructor(forceUpdate, composer, name, validate) {
    this.props = {
      forceUpdate,
      composer,
      name,
      validate
    };

    this.currentErrors = this.currentErrors.bind(this);
    this.handleValuesChangeEvent = this.handleValuesChangeEvent.bind(this);
    this.handleResetEvent = this.handleResetEvent.bind(this);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);

    this.error = this.handleValidation?.();
  }

  currentErrors(errors) {
    return errors[this.props.name];
  }

  validate(target) {
    return this.props.composer.errors.map(this.currentErrors)
    |> this.props.validate == null && # || [this.props.validate(target), ...#]
    |> #.filter(notNull);
  }

  handleValuesChangeEvent(...callers) {
    const error = this.handleValidation?.();
    if (error != null) this.props.composer.form.hasErrors = true;

    const shouldUpdate = this.shouldUpdateOnValuesChange?.(error, ...callers);
    this.handleValuesChange?.(error, ...callers);
    if (shouldUpdate) this.props.forceUpdate?.();
  }

  handleResetEvent(prevValues) {
    const error = this.handleValidation?.();
    if (error != null) this.props.composer.form.hasErrors = true;

    const current = prevValues?.[this.props.name];
    const shouldUpdate = this.shouldUpdateOnReset?.(error, current);
    this.handleReset?.(error, current);
    if (shouldUpdate) this.props.forceUpdate?.();
  }

  handleSubmitEvent() {
    const shouldUpdate = this.shouldUpdateOnSubmit?.();
    this.handleSubmit?.();
    if (shouldUpdate) this.props.forceUpdate?.();
  }

  subscribeToEvents() {
    if (this.props.composer.constructor.name === 'Transistor') this.props.composer.subscribeToEvents();
    this.valuesChangeSub = this.props.composer.valuesChangeEvent.subscribe(this.handleValuesChangeEvent);
    this.resetSub = this.props.composer.resetEvent.subscribe(this.handleResetEvent);
    this.submitSub = this.props.composer.submitEvent.subscribe(this.handleSubmitEvent);
  }

  unsubscribeFromEvents() {
    this.valuesChangeSub.unsubscribe();
    this.resetSub.unsubscribe();
    this.submitSub.unsubscribe();
    if (this.props.composer.constructor.name === 'Transistor') this.props.composer.unsubscribeFromEvents();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}