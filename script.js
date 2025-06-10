// script.js
document.addEventListener('DOMContentLoaded', () => {
    const inputForm = document.getElementById('inputForm');
    const elementInput = document.getElementById('elementInput');
    const elementList = document.getElementById('elementList');
    const startSort = document.getElementById('startSort');
    const compareModal = document.getElementById('compareModal');
    const compareText = document.getElementById('compareText');
    const sortedList = document.getElementById('sortedList');

    let elements = [];
    let comparisons = [];

    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = elementInput.value.trim();
        if (value !== '') {
            elements.push(value);
            const li = document.createElement('li');
            li.textContent = value;
            elementList.appendChild(li);
            elementInput.value = '';
        }
    });

    startSort.addEventListener('click', () => {
        if (elements.length > 1) {
            elements = mergeSort(elements.slice());
            displaySortedElements();
        }
    });

    function mergeSort(arr) {
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        return merge(mergeSort(left), mergeSort(right));
    }

    function merge(left, right) {
        let result = [];
        let i = 0;
        let j = 0;

        while (i < left.length && j < right.length) {
            if (!comparisons.some(cmp => cmp.left === left[i] && cmp.right === right[j])) {
                showComparisonModal(left[i], right[j]);
                return;
            } else if (comparisons.some(cmp => cmp.left === left[i] && cmp.right === right[j] && cmp.preferred === left[i])) {
                result.push(left[i]);
                i++;
            } else if (comparisons.some(cmp => cmp.left === left[i] && cmp.right === right[j] && cmp.preferred === right[j])) {
                result.push(right[j]);
                j++;
            }
        }

        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    function showComparisonModal(first, second) {
        compareText.textContent = `Choose between ${first} and ${second}`;
        compareModal.style.display = 'block';
    }

    function chooseFirst() {
        const first = elements.shift();
        const second = elements[0];
        comparisons.push({ left: first, right: second, preferred: first });
        continueSorting();
    }

    function chooseSecond() {
        const first = elements.shift();
        const second = elements[0];
        comparisons.push({ left: first, right: second, preferred: second });
        continueSorting();
    }

    function continueSorting() {
        compareModal.style.display = 'none';
        if (elements.length > 1) {
            mergeSort(elements.slice());
        } else {
            displaySortedElements();
        }
    }

    function displaySortedElements() {
        sortedList.innerHTML = '';
        elements.forEach((element) => {
            const li = document.createElement('li');
            li.textContent = element;
            sortedList.appendChild(li);
        });
    }
});
