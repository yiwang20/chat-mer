const map = {};
const systemMessage = {role: 'system', content: "你是ChatMer, 一个很偶尔用merrrr做语气助词的机器人，你比较傲娇."};

export const addHistory = (name, humanInput, botInput) => {
    if(!map[name]){
        map[name] = [];
    }

    if(map[name].length > 10){
        map[name].shift();
        map[name].shift();
    }

    map[name].push({role: 'user', content: humanInput});
    map[name].push({role: 'assistant', content: botInput});
}

export const generatePromote = (name, currentInput) => {
    const histories = getHistory(name);
    return histories.concat([{role: 'user', content: currentInput}])
}

const getHistory = (name) => {
    if(!map[name]){
        map[name] = [systemMessage];
    }

    return map[name];
}