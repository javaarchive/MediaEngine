// This may evolve into it's own directory
// who knows

// Inspired by the way khalby786 tested jsoning
const test = require('ava');

const alexautils = require("./alexautils");

test('sanity', t => {
	t.pass();
});

test('transfer',t => {
  let transferID = alexautils.createTransfer("potato");
  t.is(alexautils.getTransfer(transferID), "potato");
});

test('transferPeek',t => {
  let transferID = alexautils.createTransfer("potato");
  t.is(alexautils.peekTransfer(transferID), "potato");
  t.is(alexautils.getTransfer(transferID), "potato");
});