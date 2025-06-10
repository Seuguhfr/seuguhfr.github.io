document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('item-input');
  const addBtn = document.getElementById('add-btn');
  const rawListEl = document.getElementById('raw-list');
  const startSortBtn = document.getElementById('start-sort');
  const resultSection = document.getElementById('result-section');
  const sortedListEl = document.getElementById('sorted-list');
  const toggleBtn = document.getElementById('toggle-order');

  // Modal elements
  const compareModal = new bootstrap.Modal(document.getElementById('compareModal'));
  const choiceA = document.getElementById('choiceA');
  const choiceB = document.getElementById('choiceB');

  let items = [];
  let sorted = [];
  let compareQueue = [];
  let asc = true;

  // Render raw list
  function renderRaw() {
    rawListEl.innerHTML = '';
    items.forEach((it, i) => {
      const li = document.createElement('li');
      li.textContent = it;
      li.className = 'list-group-item';
      rawListEl.appendChild(li);
    });
    startSortBtn.disabled = items.length < 2;
  }

  // Render final sorted list
  function renderSorted() {
    sortedListEl.innerHTML = '';
    const display = asc ? sorted : [...sorted].reverse();
    display.forEach((it, i) => {
      const li = document.createElement('li');
      li.textContent = it;
      li.className = 'list-group-item';
      sortedListEl.appendChild(li);
    });
    toggleBtn.textContent = asc ? 'Switch to Descending' : 'Switch to Ascending';
  }

  // Build comparison queue for insertion sort
  function buildQueue() {
    sorted = [];
    compareQueue = [];

    // insert first element automatically
    sorted.push(items[0]);

    // for each new item, we schedule comparisons to find its spot
    for (let i = 1; i < items.length; i++) {
      // binary-search–style queue of comparisons
      let low = 0, high = sorted.length;
      while (low < high) {
        let mid = Math.floor((low + high) / 2);
        compareQueue.push({ a: items[i], b: sorted[mid], insertAt: mid });
        // we’ll handle branching based on user picks
        // and update low/high in real time
      }
      // we mark end insertion when queue empty for this item
      compareQueue.push({ a: items[i], b: null, insertAt: null });
    }
  }

  // Start sort flow
  startSortBtn.addEventListener('click', () => {
    resultSection.classList.add('d-none');
    buildQueue();
    nextComparison();
  });

  // Handle modal choices
  function nextComparison() {
    // clear highlights
    document.querySelectorAll('.compared').forEach(el => el.classList.remove('compared'));

    if (!compareQueue.length) {
      // done!
      renderSorted();
      resultSection.classList.remove('d-none');
      return;
    }

    const { a, b, insertAt } = compareQueue.shift();

    if (b === null) {
      // insert at last decided position
      sorted.splice(insertAt, 0, a);
      return nextComparison();
    }

    // show modal
    choiceA.textContent = a;
    choiceB.textContent = b;
    // highlight in raw list (optional)
    [...rawListEl.children].forEach(li => {
      if (li.textContent === a || li.textContent === b) {
        li.classList.add('compared');
      }
    });

    compareModal.show();

    // once user picks, we decide branch
    function handle(choice) {
      compareModal.hide();
      // if user chose A < B => a comes before b => narrow high
      // else a > b => narrow low
      if (choice === 'A') {
        // drop all comparisons of this insertion beyond this mid
        // by flushing remaining mids greater or equal to this insertAt
        compareQueue = compareQueue.filter(c => c.insertAt < insertAt);
      } else {
        // drop all less than or equal
        compareQueue = compareQueue.filter(c => c.insertAt > insertAt);
      }
      // continue
      nextComparison();
    }

    choiceA.onclick = () => handle('A');
    choiceB.onclick = () => handle('B');
  }

  // Event bindings
  addBtn.onclick = () => {
    const v = input.value.trim();
    if (v) {
      items.push(v);
      input.value = '';
      renderRaw();
    }
  };
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') addBtn.click();
  });
  toggleBtn.onclick = () => {
    asc = !asc;
    renderSorted();
  };

  // initial render
  renderRaw();
});
