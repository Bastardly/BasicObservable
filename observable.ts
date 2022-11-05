type IUpdateMethod<T> = (newState: T, oldState: T) => void | Promise<void>;

export interface IObserver<T> {
  updateMethod: IUpdateMethod<T>;
  unsubscribe: (value: IObserver<T>) => boolean;
}

export class Observable<T> {
  observers: Set<IObserver<T>> = new Set();
  state!: T;
  oldState!: T;

  subscribe(updateMethod: IUpdateMethod<T>) {
    const observer = {
      updateMethod,
      unsubscribe: (createdObserver: IObserver<T>) =>
        this.observers.delete(createdObserver),
    };
    this.observers.add(observer);

    return observer;
  }

  #broadcastUpdate() {
    this.observers.forEach((observer) => {
        observer.updateMethod(this.state, this.oldState);
    });
    this.oldState = this.state;
  }

  setState(newState: T) {
    this.state = newState;
    this.#broadcastUpdate();
  }
}
