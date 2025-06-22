let array = [];
let barElements = [];
let isSorting = false;
let swapCount = 0;
const container = document.getElementById('array-container');

function generateArray(numElements) {
    array = [];
    for (let i = 0; i < numElements; i++) {
        array.push(Math.floor(Math.random() * 400) + 20);
    }

    const barWidth = (container.clientWidth / numElements) - 2;
    container.innerHTML = '';
    barElements = [];
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${array[i]}px`;
        container.appendChild(bar);
        barElements.push(bar);
    }
    swapCount = 0;
    document.getElementById('swap-count').innerText = `Swaps: 0`;
}

function getDelay() {
    const speed = parseFloat(document.getElementById('speed').value);
    return 500 / speed;
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function swap(i, j) {
    [array[i], array[j]] = [array[j], array[i]];
    barElements[i].style.height = `${array[i]}px`;
    barElements[j].style.height = `${array[j]}px`;
    swapCount++;
    document.getElementById('swap-count').innerText = `Swaps: ${swapCount}`;
    await delay(getDelay());
}

async function highlightComparison(i, j) {
    barElements[i].classList.add('comparing');
    barElements[j].classList.add('comparing');
    await delay(getDelay());
    barElements[i].classList.remove('comparing');
    barElements[j].classList.remove('comparing');
}

function markSorted(index) {
    barElements[index].classList.add('sorted');
}

// Bubble Sort
async function bubbleSort() {
    for (let i = 0; i < array.length && isSorting; i++) {
        for (let j = 0; j < array.length - i - 1 && isSorting; j++) {
            await highlightComparison(j, j + 1);
            if (!isSorting) break;
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
        if (isSorting) markSorted(array.length - i - 1);
    }
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
    if (!isSorting) return;
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    if (!isSorting) return;
    await mergeSort(mid + 1, end);
    if (!isSorting) return;
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length && isSorting) {
        await highlightComparison(start + i, mid + 1 + j);
        if (left[i] <= right[j]) {
            array[k] = left[i];
            barElements[k].style.height = `${left[i]}px`;
            i++;
        } else {
            array[k] = right[j];
            barElements[k].style.height = `${right[j]}px`;
            j++;
        }
        k++;
        await delay(getDelay());
    }

    while (i < left.length && isSorting) {
        array[k] = left[i];
        barElements[k].style.height = `${left[i]}px`;
        i++;
        k++;
        await delay(getDelay());
    }

    while (j < right.length && isSorting) {
        array[k] = right[j];
        barElements[k].style.height = `${right[j]}px`;
        j++;
        k++;
        await delay(getDelay());
    }

    if (isSorting) {
        for (let idx = start; idx <= end; idx++) {
            markSorted(idx);
        }
    }
}

// Quick Sort
async function quickSort(low = 0, high = array.length - 1) {
    if (!isSorting) return;
    if (low < high) {
        const pi = await partition(low, high);
        if (!isSorting) return;
        await quickSort(low, pi - 1);
        if (!isSorting) return;
        await quickSort(pi + 1, high);
    }
    if (low === 0 && high === array.length - 1 && isSorting) {
        for (let i = 0; i < array.length; i++) {
            markSorted(i);
        }
    }
}

async function partition(low, high) {
    if (!isSorting) return -1;
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high && isSorting; j++) {
        await highlightComparison(j, high);
        if (array[j] < pivot) {
            i++;
            await swap(i, j);
        }
    }
    if (isSorting) {
        await swap(i + 1, high);
        return i + 1;
    }
    return -1;
}

// Selection Sort
async function selectionSort() {
    for (let i = 0; i < array.length && isSorting; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length && isSorting; j++) {
            await highlightComparison(minIdx, j);
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i && isSorting) {
            await swap(i, minIdx);
        }
        if (isSorting) markSorted(i);
    }
}

// Insertion Sort
async function insertionSort() {
    for (let i = 1; i < array.length && isSorting; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key && isSorting) {
            await highlightComparison(j, j + 1);
            array[j + 1] = array[j];
            barElements[j + 1].style.height = `${array[j]}px`;
            j--;
            await delay(getDelay());
        }
        array[j + 1] = key;
        barElements[j + 1].style.height = `${key}px`;
        if (isSorting) markSorted(i);
        await delay(getDelay());
    }
}

// Start Sorting
async function startSorting() {
    if (isSorting) return;
    isSorting = true;

    const numElements = parseInt(document.getElementById('num-elements').value);
    if (numElements < 10 || numElements > 200) {
        alert("Number of elements must be between 10 and 200.");
        isSorting = false;
        return;
    }

    generateArray(numElements);
    barElements.forEach(bar => {
        bar.classList.remove('sorted');
        bar.classList.remove('comparing');
    });

    const sortType = document.getElementById('sort-type').value;
    if (sortType === 'bubble') await bubbleSort();
    else if (sortType === 'merge') await mergeSort();
    else if (sortType === 'quick') await quickSort();
    else if (sortType === 'selection') await selectionSort();
    else if (sortType === 'insertion') await insertionSort();

    isSorting = false;
}

// Stop Sorting
function stopSorting() {
    isSorting = false;
}

// Restart Array
function restartSorting() {
    stopSorting();
    const numElements = parseInt(document.getElementById('num-elements').value);
    if (numElements < 10 || numElements > 200) {
        alert("Number of elements must be between 10 and 200.");
        return;
    }
    generateArray(numElements);
}

// Initial array generation
generateArray(10);
