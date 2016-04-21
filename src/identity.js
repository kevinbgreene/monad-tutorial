/**
 * An identity monad.
 *
 * @name Identity
 * @class
 * @param {*} val A value to place in our context
 */
function Identity(val) {
  this.value = val;
}

// toString :: Identity a -> String
Identity.prototype.toString = function() {
  return 'Identity( ' + this.value + ' )';
};

// get :: Identity a -> a
Identity.prototype.get = function() {
  return this.value;
};

// unit :: a -> Identity a
Identity.unit = function(a) {
  return new Identity(a);
};

// unit :: Identity a -> b -> Identity b
Identity.prototype.unit = Identity.unit;

// map :: Identity a -> ( a -> b ) -> Identity b
Identity.prototype.map = function(fn) {
  return new Identity(fn(this.value));
};

// join :: Identity ( Identity a ) -> Identity a
Identity.prototype.join = function(id) {
  return new Identity(id.get().get());
};

// chain :: Identity a -> ( a -> Identity b ) -> Identity b
Identity.prototype.chain = function(fn) {
  return fn(this.value);
};

// concat :: Identity a -> Identity b -> Identity b
Identity.prototype.concat = function(id) {
  return this.map(() => id.get());
};