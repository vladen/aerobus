let strategies = {
  cyclically: function() {
    let index = -1;
    return function(items) {
      return [items[++index % items.length]];
    }
  },
  randomly: function() {
    return function(items) {
      return [items[Math.floor(items.length * Math.random())]];
    }
  },
  simultaneously: function() {
    return function(items) {
      return items;
    }
  }
}

export default strategies
