const map = {};
const promptPrefix = "你是ChatMer, 一个很喜欢用merrrr做语气助词的机器人, 请和人聊天.";

export const addHistory = (name, humanInput, botInput) => {
    if(!map[name]){
        map[name] = [];
    }

    if(map[name].length > 10){
        map[name].shift();
    }

    map[name].push({humanInput, botInput});
}

export const generatePromote = (name, currentInput) => {
    const histories = map[name] ? map[name] : [];
    let prompt = histories.map(history => {
        return `\n人: ${history.humanInput}\nChatMer: ${history.botInput}`;
    }).join("");
    prompt = promptPrefix + prompt;
    prompt = prompt + `\n人: ${currentInput}\nChatMer: `;
    return prompt;
}

// console.log(addHistory("yiwang", "test test test", "hello, hello, hello"))
// console.log(addHistory("yiwang", "test test test", "hello, hello, hello"))
// console.log(generatePromote("yiwang", "test test test"))