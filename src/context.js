function Context(val) {
  this.value = val;
}

Context.prototype.map = function(fn) {
  return new Context(fn(this.value));
};

Context.prototype.get = function() {
  return this.value;
};

Context.prototype.toString = function() {
  return 'Context(' + this.value + ')';
};