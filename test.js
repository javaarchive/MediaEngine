// This may evolve into it's own directory
// who knows

// Inspired by the way khalby786 tested jsoning
const test = require('ava');

const alexautils = require("./alexautils");

const {Account,loginCodeManager} = require("./accountsystem");

test('sanity', t => {
	t.pass();
});

test('storecode', async t => {
	await loginCodeManager.storeLoginCode(1234,"pogfish");
  t.true(await loginCodeManager.hasCode(1234));
  t.is(await loginCodeManager.getUserForCode(1234),"pogfish");
});

test('sampleacc', async t => {
  let acc = new Account({},"sampleacc");
  await acc.save();
  t.pass();
});

test('sampleacc_getcontentprovider_andsearch', async t => {
  t.timeout(1000*30);
  let acc = new Account({},"sampleacc");
  await acc.save();
  let provider = await acc.getContentProvider();
  console.log("Searching for technology");
  let results = await provider.search("technology",{type:"mediaitem"});
  console.log(results);
  t.true(results.length > 0);
  t.true(results[0].resultType == "mediaitem");
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