import assert from 'assert';
import {EventHub} from '../src/index';

describe('The EventHub module', () => {
  var eventHub;
  var UserView;
  var ProfileView

  beforeEach(() => {
    eventHub = new EventHub();
    
    UserView = () => {};
    ProfileView = () => {};
  });

  it('subscribe only', () => {
    eventHub.subscribe(UserView, 'EventType', () => true);
    assert.equal(eventHub.subscriptions[UserView.name].length, 1);
  });

  it('subscribe with same key and different channel', () => {
    eventHub.subscribe(UserView, 'EventType', () => true);
    assert.equal(eventHub.subscriptions[UserView.name].length, 1);
    eventHub.subscribe(UserView, 'EventType2', () => true);
    assert.equal(eventHub.subscriptions[UserView.name].length, 2);
  });

  it('subscribe and dispose', () => {
    let subscription = eventHub.subscribe(UserView, 'EventType', () => true);
    let subscription2 = eventHub.subscribe(UserView, 'EventType1', () => true);
    assert.equal(eventHub.subscriptions[UserView.name].length, 2);
    subscription.dispose();
    assert.equal(eventHub.subscriptions[UserView.name].length, 1);
    subscription2.dispose();
    assert.equal(eventHub.subscriptions[UserView.name].length, 0);
  });

  it('subscribe and dispose all for key', () => {
    let sub = eventHub.subscribe(UserView, 'EventType', () => true);
    eventHub.subscribe(UserView, 'EventType1', () => true);
    assert.equal(eventHub.subscriptions[UserView.name].length, 2);
    assert.notEqual(Object.keys(eventHub.subscriptions).indexOf(UserView.name), -1);
    eventHub.unsubscribe(UserView);
    assert.equal(Object.keys(eventHub.subscriptions).indexOf(UserView.name), -1);
  });

  it('subscribe with array of channels', () => {
    let testVal = 0;
    eventHub.subscribe(UserView, ['EventType','EventType2'], (data) => testVal = data.x);
    assert.equal(testVal, 0);
    eventHub.publish('EventType', {x: 2});
    assert.equal(testVal, 2);
    eventHub.publish('EventType2', {x: 4});
    assert.equal(testVal, 4);
  });

  it('subscribe and publish with data', () => {
    let testVal = 0;
    eventHub.subscribe(UserView, 'EventType', (data) => testVal = data.x);
    assert.equal(testVal, 0);
    eventHub.publish('EventType', {x: 2});
    assert.equal(testVal, 2);
  });

  it('subscribe and publish with multiple handlers', () => {
    let testVal = 0;
    let testVal2 = 0;
    eventHub.subscribe(UserView, 'EventType', (data) => testVal = data.x);
    eventHub.subscribe(ProfileView, 'EventType', (data) => testVal2 = (data.x + 2));
    assert.equal(testVal, 0);
    assert.equal(testVal2, 0);
    eventHub.publish('EventType', {x: 2});
    assert.equal(testVal, 2);
    assert.equal(testVal2, 4);
  });

  it('subscribe once', () => {
    let testVal = 0;
    eventHub.subscribeOnce(UserView, 'EventType', (data) => testVal = data.x);
    assert.equal(testVal, 0);
    eventHub.publish('EventType', {x: 2});
    assert.equal(testVal, 2);
    assert.equal(eventHub.subscriptions[UserView.name].length, 0);
    eventHub.publish('EventType', {x: 4});
    assert.equal(testVal, 2);
  });

  it('subscribe once with array', () => {
    let testVal = 0;
    eventHub.subscribeOnce(UserView, ['EventType', 'EventType2'], (data) => testVal = data.x);
    assert.equal(testVal, 0);
    eventHub.publish('EventType', {x: 2});
    assert.equal(testVal, 2);
    eventHub.publish('EventType2', {x: 4});
    assert.equal(testVal, 4);
  });

  it('attach event hub and subscribe', () => {
    let userview = new UserView(null, eventHub, null);
    eventHub.attachEventHub(userview, UserView.name);
    let testVal = 0;
    userview.subscribe('EventType', (data) => testVal = data.x);
    assert.equal(eventHub.subscriptions[UserView.name].length, 1);
    eventHub.publish('EventType', {x: 4});
    assert.equal(testVal, 4);
  });
});