// Mock network request
const fetchResults = function() {
  return new IO((reject, resolve) => {
    setTimeout(() => {
      resolve({
        status : 'success',
        data : ['Bob', 'Sam', 'Marcia', 'Leon', 'Kelly']
      });
    }, 1000);
  });
};

// Displats list of string in the DOM
const displayResults = function(results) {
  return new IO((reject, resolve) => {
    const list = document.getElementById('fixture');
    const contents = results.reduce((acc, next) => {
      acc += '<li>' + next + '</li>';
      return acc;
    }, '');
    list.innerHTML = contents;
  });
};

const toData = function(response) {
  return response.data;
};

const fetchAndDisplay = fetchResults().map(toData).chain(displayResults);

// Nothing has happened yet.

// ...

// Now the magic
fetchAndDisplay.run(
  (err) => console.log(err),
  (val) => console.log(val)
);