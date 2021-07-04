'use strict';
const head = document.getElementById('head');
const h2 = document.querySelector('h2');
const h3 = document.querySelector('h3');
const inner = document.getElementById('inner');
const ul = document.querySelector('ul');
const startButton = document.getElementById('start-button');
let randomData = {};
let count = 1;
let correctCounter = 0;


const getQuizzJson = async() => {
  try {
    const response = await
    fetch('https://opentdb.com/api.php?amount=50&type=multiple')
    return response.json();
  } catch (e) {
    console.error(e);
  }
};

function arrayShuffle(array) {
  for(let i = (array.length - 1); 0 < i; i--){
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
};

function changeHTML(data) {
  if (count < 11) {
    head.innerHTML = `問題${count}`;
    randomData = arrayShuffle(data).results[count - 1];
    inner.innerHTML = randomData.question;
    h2.innerHTML = randomData.category;
    h3.innerHTML = randomData.difficulty;
    count++;
    createSelectButton(data);
  } else {
    inner.innerHTML = '終了';
    head.innerHTML = `あなたの正答数は${correctCounter}です`;
    h2.innerHTML = '';
    h3.innerHTML = '';
    createBackButton();
  }
}

function createSelectButton(data) {
  const selecterArray = randomData.incorrect_answers;
  selecterArray.push(randomData.correct_answer);
  const suffuledSelecterArray = arrayShuffle(selecterArray);
  for(let j = 0; j < 4; j++) {
    const selectButton = document.createElement('button');
    selectButton.innerHTML = suffuledSelecterArray[j];
    selectButton.addEventListener('click', () => {
      if(selectButton.innerHTML === randomData.correct_answer) {
        correctCounter++;
      }
      deleteHTML();
      changeHTML(data);
    })
    ul.appendChild(selectButton);
  }
}

function deleteHTML() {
  while(ul.firstChild) {
    ul.removeChild(ul.firstChild);
  };
  inner.innerHTML = '';
  head.innerHTML = '';
}

function createBackButton() {
  const backButton = document.createElement('button');
  backButton.innerHTML = '戻る';
  backButton.addEventListener('click', () => {
    createTopPage();
  })
  ul.appendChild(backButton);
}

function createStartButton() {
  const startButton = document.createElement('button');
  startButton.id = 'start-button';
  startButton.innerHTML = '開始';
  startButton.addEventListener('click', async() => {
    head.innerHTML = "取得中";
    inner.innerHTML = "少々お待ちください";
    count = 1;
    correctCounter = 0;
    ul.removeChild(startButton);
    const data = await getQuizzJson();
    changeHTML(data);
  });
  ul.appendChild(startButton);
}

function createTopPage() {
  deleteHTML();
  head.innerHTML = 'ようこそ';
  inner.innerHTML = '以下のボタンをクリック';
  createStartButton();
}

document.getElementById('start-button').addEventListener('click', () => {
    head.innerHTML = "取得中";
    inner.innerHTML = "少々お待ちください";
    ul.removeChild(startButton);
    getQuizzJson()
    .then((data) => {
      changeHTML(data);
    })
});
