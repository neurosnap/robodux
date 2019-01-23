import createAction from '../src/action';

// testing no payload
const test = createAction('SOMETHING');
// $ExpectType { type: string; }
test();
// $ExpectError Expected 0 arguments, but got 1.
test('payload');

// testing payload boolean
const testTwo = createAction<boolean>('SOMETHING');
// $ExpectError Expected 1 arguments, but got 0.
testTwo();
// $ExpectType { type: string; payload?: boolean | undefined; }
testTwo(true);

// testing payload object
const testThree = createAction<{ error: string }>('SOMETHING');
// $ExpectError Type 'true' is not assignable to type 'string'.
testThree({ error: true });
// $ExpectType { type: string; payload?: { error: string; } | undefined; }
testThree({ error: 'nice' });

// testing type generic
const type = 'SOMETHING';
const testFour = createAction<number, typeof type>(type);
// $ExpextType { type: "SOMETHING"; payload?: number | undefined; }
testFour(2);
