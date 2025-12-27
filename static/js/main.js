let STORY = null;
let currentNode = 'start';
let dialogueIndex = 0;
let typing = false;
let typingInterval = null;
let playerName = '你';

// 定位html的所有元素
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const startBtn = document.getElementById('startBtn');
const returnBtn = document.getElementById('returnBtn');
const toStartBtn = document.getElementById('toStartBtn');
const NxtBtn = document.getElementById('NxtBtn');
const backgroundEl = document.getElementById('background');
const mainChar = document.getElementById('mainChar');
const nameEl = document.getElementById('name');
const textEl = document.getElementById('text');
const choicesEl = document.getElementById('choices');

// ===== 畫面切換 =====
function showStart() {
    startScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
}

function showGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
}

function showEnd(node) {
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');

    const endBg = document.getElementById('endBg');
    const endTitle = document.getElementById('endTitle');
    const endText = document.getElementById('endText');

    endBg.src = node.background
        ? '/static/bg/' + node.background
        : '';

    endTitle.innerText = (node.endtitle || '故事結束').replace('{playerName}', playerName);

    endText.innerText = node.text || '';
}


// ===== 載入節點 =====
function loadNode(id) {

    // 利用/node載入節點內容
    fetch('/node?id=' + id)
        .then(res => res.json())
        .then(node => {
            STORY = STORY || {};
            STORY[id] = node;

            currentNode = id;
            dialogueIndex = 0;
            choicesEl.innerHTML = '';

            // 背景
            if (node.background) {
                backgroundEl.style.backgroundImage =
                    "url('/static/bg/" + node.background + "')";
            }

            // 結局
            if (node.endtype) {
                showEnd(node);
                return;
            }

            showNextLine();
        });
}

// ===== 顯示下一句 =====
function showNextLine() {
    const node = STORY[currentNode];
    if (!node) return;

    if (dialogueIndex < node.dialogue.length) {
        const line = node.dialogue[dialogueIndex];

        // 玩家輸入名字
        if (line.text === '__INPUT_NAME__') {
            const name = prompt('請輸入你的名字：');
            if (name) playerName = name;
            dialogueIndex++;
            showNextLine();
            return;
        }

        // 背景切換
        if (line.background) {
            backgroundEl.style.backgroundImage = "url('/static/bg/" + line.background + "')";
        }

        // 替換對話中的 {playerName}
        const finalText = line.text.replace('{playerName}', playerName);

        // 切換角色圖片
        if (line.character) {
            mainChar.src = '/static/char/' + line.character;
        }
        
        typeText(line.name === 'PLAYER' ? playerName : line.name, finalText);
        dialogueIndex++;
    
    } else {
        showChoices(node);
    }
}

// ===== 打字機效果 =====
function typeText(speaker, text) {
    if (speaker.startsWith('我')) {
        speaker = '我';
    }

    if (speaker.startsWith('？？？？')) {
        speaker = '？？？？';
    }

    if (speaker.startsWith('洛希')) {
        speaker = '洛希';
    }

    if (typing) {
        finishTyping(speaker, text);
        return;
    }

    typing = true;
    nameEl.innerText = speaker;
    textEl.innerText = '';

    let i = 0;
    typingInterval = setInterval(() => {
        textEl.innerText = text.slice(0, ++i);
        if (i >= text.length) {
            clearInterval(typingInterval);
            typing = false;
        }
    }, 24);
}

function finishTyping(speaker, text) {
    clearInterval(typingInterval);
    nameEl.innerText = speaker;
    textEl.innerText = text;
    typing = false;
}

// ===== 選項 =====
function showChoices(node) {
    choicesEl.innerHTML = '';

    if (!node.choices || node.choices.length === 0) {
        choicesEl.innerHTML = '<div style="text-align:center;color:#ccc;">（故事結束）</div>';
        return;
    }

    node.choices.forEach(ch => {
        const btn = document.createElement('button');
        btn.innerText = ch.text;
        btn.onclick = () => loadNode(ch.next);
        choicesEl.appendChild(btn);
    });
}

// ===== 操作 =====
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !gameScreen.classList.contains('hidden')) {
        e.preventDefault();
        showNextLine();
    }
});

NxtBtn.addEventListener('click', showNextLine);

startBtn.addEventListener('click', () => {
    loadNode('start');
    showGame();
});

returnBtn.addEventListener('click', showStart);

toStartBtn.addEventListener('click', () => {
    if (confirm('確定回主畫面？')) showStart();
});