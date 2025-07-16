import {reactive, ComputedRef, Ref, computed, watchEffect, WatchStopHandle} from "vue";

enum AsyncStatus {
  ERROR = 'error', SUCCESS = 'success', LOADING = 'loading'
}

interface AsyncAccess<T> extends ComputedRef<T> {
  status: Ref<AsyncStatus>,
  error: Ref<any>,
  retry: () => void
}

export default function asyncComputed<T> (func: (() => Promise<T>), options: {default?: T | Ref<T>, lazy?: boolean} = {}): AsyncAccess<T | undefined> {
  const optionsWithDefaults = {
    default: undefined,
    lazy: false,
    ...options
  };
  const state = reactive({
    result: undefined as any | undefined,
    status: AsyncStatus.LOADING,
    error: null as any,
    hasEverRun: false
  });
  let hasEverRequested = false;
  const result = computed<T | undefined>(() => {
    if (!hasEverRequested) {
      retry();
    }
    if (state.hasEverRun) {
      return state.result;
    } else {
      return options.default as T | undefined;
    }
  })

  let lastRetryCalled: Symbol | null = null
  let stopLast: WatchStopHandle | null = null;

  const retry = () => {
    hasEverRequested = true;
    if (stopLast) {
      stopLast();
      stopLast = null;
    }

    stopLast = watchEffect(() => {
      let me = Symbol('retry');
      lastRetryCalled = me;
      state.status = AsyncStatus.LOADING
      state.error = null;
      func().then(value => {
        if (lastRetryCalled === me) {
          state.status = AsyncStatus.SUCCESS
          state.result = value;
          state.error = null;
          state.hasEverRun = true;
        }
      }, error => {
        if (lastRetryCalled === me) {
          state.status = AsyncStatus.ERROR;
          state.error = error;
          state.hasEverRun = true;
        }
      });
    })
  }

  if (!optionsWithDefaults.lazy) {
    retry()
  }

  Object.defineProperty(result, 'status', {
    value: computed(() => state.status)
  });
  Object.defineProperty(result, 'error', {
    value: computed(() => state.error)
  })
  Object.defineProperty(result, 'retry', {
    value: retry
  })
  return result as AsyncAccess<T>;
}
