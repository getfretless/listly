var Task = function() {
  var self = this;
  self.counter = 1;

  function getOrSetId(id) {
    if (!id) {
      id = self.counter + 1;
    }
    incrementCounter(id);
    return id;
  }

  function incrementCounter(id) {
    if (id > self.counter) {
      self.counter = id;
    }
  }

  function Task(properties) {
    this.name = properties.name;
    this.id = getOrSetId(properties.id);
  }

  return Task;
}();
