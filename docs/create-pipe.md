# createPipe

This is the low-level API that we use to build `createApi`.  All it does is
structure an action creator in such a way that when it gets dispatched, it goes
through a stack list of middleware.

```ts
import { createPipe, delay } from 'robodux';

const thunks = createPipe();
thunks.use(async (ctx, next) => {
  console.log('before thunk');
  await next();
  console.log('after thunk');
});
thunks.use(thunks.actions());

const makeItSo = thunks.create('make-it-so', async (ctx, next) => {
  console.log('thunk start');
  await delay(500);  
  console.log('thunk end');
  await next();
});

store.dispatch(makeItSo());
// before thunk
// thunk start
// thunk end
// after thunk
```

