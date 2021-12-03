export interface CancelablePromise<T> extends Promise<T> {
  cancel: () => any;
}

export function cancelable<T = void>(
  executor: (
    resolve: (t: T) => any,
    reject: (e: any) => any,
    onCancel: (h: () => any) => any,
  ) => any,
  parentController?: AbortController,
): CancelablePromise<T> {
  const controller = parentController || new AbortController();
  const signal = controller.signal;

  const wrap = new Promise<T>((resolve, reject) => {
    let isSettled = false;

    const _resolve = (input: T) => {
      isSettled = true;
      resolve(input);
    };

    const _reject = (input: any) => {
      isSettled = true;
      reject(input);
    };

    let cancelHandler = () => {};
    const onCancel = (handler: () => any) => {
      cancelHandler = () => {
        if (!isSettled) {
          handler();
        }
      };
    };

    signal.addEventListener('abort', () => {
      cancelHandler();
      reject(new Error('aborted'));
    });

    executor(_resolve, _reject, onCancel);
  });

  (wrap as any).cancel = () => controller.abort();
  return wrap as any;
}

export function wrap<T>(promise: Promise<T>, controller?: AbortController) {
  return cancelable<T>((resolve, reject) => {
    promise.then(resolve).catch(reject);
  }, controller);
}
