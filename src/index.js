import uuid from 'uuid/v4';
// eslint-disable-line no-loop-func

export class EventHub {
  constructor() {
    this.subscriptions = {};
    Object.freeze(this);
  }

  subscribe(key, channel, func) {
    let keyValue;

    if (typeof key === 'function') {
      keyValue = key.name;
    }else if (typeof key === 'string') {
      keyValue = key;
    }else { throw new Error('Subscribe Key must be valid string or function'); }

    let keySubscribers = this.subscriptions[keyValue] || (this.subscriptions[keyValue] = []);

    let result;
    let handler;
    if (Array.isArray(channel)) {
      let ra = [];
      let aa = (h, k) => {
        let idx = k.indexOf(h);
        if (idx !== -1) {
          k.splice(idx, 1);
        }
      };

      for (let c of channel) {
        handler = new Handler(c, func);
        // Check if this handler is registered already
        let subIndex = keySubscribers.findIndex(p => {
          return p.messageType === handler.messageType;
        });
        if(subIndex === -1){
          keySubscribers.push(handler);
        }else{
          keySubscribers[subIndex] = handler;
        }
        ra.push({
          dispose: aa.bind(this, handler, keySubscribers)
        });
      }
      result = ra;
    }else if (typeof channel === 'string') {
      handler = new Handler(channel, func);
      // Check if this handler is registered already
      let subIndex = keySubscribers.findIndex(p => {
        return p.messageType === handler.messageType;
      });
      if(subIndex === -1){
        keySubscribers.push(handler);
      }else{
        keySubscribers[subIndex] = handler;
      }

      result = {
        dispose: () => {
          let idx = keySubscribers.indexOf(handler);
          if (idx !== -1) {
            keySubscribers.splice(idx, 1);
          }
        }
      };
    } else { throw new Error('Subscribe Key must be valid string or function'); }
    return result;
  }

  subscribeOnce(key, channel, func){
    if(typeof channel === 'string'){
      let s = this.subscribe(key, channel, (a, b) => {
        if(!s && !s.dispose){return;}
        s.dispose();
        return func(a, b);
      });
      return s;
    }else if(Array.isArray(channel)){
      let result = [];
      for(let c of channel){
        let s = this.subscribe(key, c, (a, b) => {
          if(!s && !s.dispose){return;}
          s.dispose();
          return func(a, b);
        });
        result.push(s);
      }
      return result;
    }
  }

  publish(channel, payload) {
    if (typeof channel === 'string') {
      for(let keys of Object.keys(this.subscriptions)){
        this.subscriptions[keys].find(k => { // eslint-disable-line
          if(!k) {return;}
          if(k.messageType === channel){
            k.handle(payload);
          }
        });
      }
    }
  }

  unsubscribe(key) {
    let keyValue;
    if (typeof key === 'function') {
      keyValue = key.name;
    } else if (typeof key === 'string') {
      keyValue = key;
    } else { throw new Error('Subscribe Key must be valid string or function'); }
    delete this.subscriptions[keyValue];
  }

  attachEventHub(obj, keyName) {
    let eventHub = this;
    let k = keyName != null ? keyName : uuid();

    obj.subscribe = (channel, callback) => {
      return eventHub.subscribe(k, channel, callback);
    };

    obj.subscribeOnce = (channel, callback) => {
      return eventHub.subscribeOnce(k, channel, callback);
    };

    obj.publish = (channel, data) => {
      eventHub.publish(channel, data);
    };

    obj.unsubscribe = () => {
      eventHub.unsubscribe(k);
    };
  }
}

class Handler{
  constructor(messageType, callback) {
    this.messageType = messageType;
    this.callback = callback;
  }

  handle(message) {
    this.callback.call(null, message);
  }
}
