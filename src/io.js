/**
 * An IO monad for wrapping impure operations.
 * - computations will be performed lazily
 *
 * @name IO
 * @class
 * @param {Function} comp Computation for this IO to run
 */
function IO(comp) {
  this.fn = comp;
}

/**
 * @name run
 * @method
 * @memberof IO#
 * @param {Function} reject A function to call when the computation fails
 * @param {Function} resolve A function to call when the computation succeeds.
 */
IO.prototype.run = function(reject, resolve) {
  try {
    this.fn(reject, resolve);
  } catch(err) {
    reject(err);
  }
};

/**
 * unit :: a -> IO x a
 *
 * @name unit
 * @method
 * @memberof IO
 * @param {*} val A value to place in the IO context
 * @returns {IO} A new instance of the IO monad
 */
IO.unit = function(val) {
  return new IO((_, resolve) => {
    resolve(val);
  });
};

/**
 * unit :: IO x a -> b -> IO x b
 *
 * @name unit
 * @method
 * @memberof IO#
 * @param {*} val A value to place in the IO context
 * @returns {IO} A new instance of the IO monad
 */
IO.prototype.unit = IO.unit;


/**
 * map :: IO x a -> (a -> b) -> IO x b
 *
 * @name map
 * @method
 * @memberof IO#
 * @param {Function} fn A function to map the value of our IO
 * @returns {IO} A new instance of the IO monad
 */
IO.prototype.map = function(fn) {
  const comp = this.fn;
  return new IO((reject, resolve) => {
    comp(reject, (val) => {
      resolve(fn(val));
    });
  });
};


/**
 * join :: IO x (IO x a) -> IO x a
 *
 * @name join
 * @method
 * @memberof IO#
 * @returns {IO} A new instance of the IO monad
 */
IO.prototype.join = function() {
  const comp = this.fn;
  return new IO((reject, resolve) => {
    comp(reject, (val) => {
      val.run(reject, resolve);
    });
  });
};


/**
 * chain :: IO x a -> (a -> IO x b) -> IO x b
 *
 * @name chain
 * @method
 * @memberof IO#
 * @param {Function} fn A unary function that returns an IO
 * @returns {IO} A new instance of the IO monad
 */
IO.prototype.chain = function(fn) {
  return this.map(fn).join();
};


/**
 * concat :: IO x a -> IO x b -> IO x b
 *
 * @name concat
 * @method
 * @memberof IO#
 * @param {IO} io An IO to run after this IO
 * @returns {IO} A new instance of the IO monad
 */
IO.prototype.concat = function(io) {
  const comp = this.fn;
  return new IO((reject, resolve) => {
    comp(reject, (_) => {
      io.run(reject, resolve);
    });
  });
};


/**
 * recover :: IO x a -> (x -> a) -> IO x a
 *
 * @name recover
 * @method
 * @memberof IO#
 * @param {Function} fn A function used to map the error to a value
 * @returns {IO} A new instance of the IO monad
 */
IO.prototype.recover = function(fn) {
  const comp = this.fn;
  return new IO((_, resolve) => {
    comp((err) => {
      resolve(fn(err));
    }, resolve);
  });
};


/**
 * default :: IO x a -> a -> IO x a
 *
 * @name default
 * @method
 * @memberof IO#
 * @param {*} val A value to replace an error
 * @returns {IO} A new instance of the IO monad
 */
IO.prototype.default = function(val) {
  return this.recover(() => val);
};
