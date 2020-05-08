import createAction from '../src/create-action';

// testing no payload
const test = createAction('SOMETHING');
// $ExpectType ActionWithPayload<undefined, string>
test();
// $ExpectError Expected 0 arguments, but got 1.
test('payload');

// testing payload boolean
const testTwo = createAction<boolean>('SOMETHING');
// $ExpectError Expected 1 arguments, but got 0.
testTwo();
// $ExpectType ActionWithPayload<boolean, string>
testTwo(true);

// testing payload object
const testThree = createAction<{ error: string }>('SOMETHING');
// $ExpectError Type 'true' is not assignable to type 'string'.
testThree({ error: true });
// $ExpectType ActionWithPayload<{ error: string; }, string>
testThree({ error: 'nice' });

// testing type generic
const type = 'SOMETHING';
const testFour = createAction<number, typeof type>(type);
// $ExpextType { type: "SOMETHING"; payload: number; }
testFour(2);

type TestUnion = 'one' | 'two';
const testFive = createAction<TestUnion>('NICE');
testFive('one');
// $ExpectError Argument of type '"three"' is not assignable to parameter of type 'TestUnion'.
testFive('three');
