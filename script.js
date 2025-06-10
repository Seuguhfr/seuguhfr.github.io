// script.js
document.addEventListener('DOMContentLoaded', () => {
    const inputForm = document.getElementById('inputForm');
    const elementInput = document.getElementById('elementInput');
    const elementList = document.getElementById('elementList');
    const startSort = document.getElementById('startSort');
    const compareModal = document.getElementById('compareModal');
    const compareText = document.getElementById('compareText');

    let elements = [];

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
        elements.sort((a, b) => a.localeCompare(b));
        displaySortedElements();
    });

    function displaySortedElements() {
        elements.forEach((element) => {
            const li = document.createElement('li');
            li.textContent = element;
            sortedList.appendChild(li);
        });
    }
});
