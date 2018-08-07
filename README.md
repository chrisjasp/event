# ctjs Event Hub #

Simple Event Pub Sub Library

### How do I use this? ###
```
npm install ctjs-event
```

```
let eventHub = new EventHub();
eventHub.subscribe(SomeClass, 'EventType', (data) => { /* event handler */});
eventHub.publish('EventType', {/* Data */});
eventHub.unsubscribe(SomeClass);

eventHub.subscribeOnce(SomeClass, 'EventType', (data) => { /* event handler */});
```

### Who do I talk to? ###
chrisjasp@gmail.com