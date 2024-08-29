require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const TOKEN = process.env.TOKEN

const bot = new TelegramApi(TOKEN, { polling: true })

const chats = {}

const options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: '1', callback_data: 1 }, { text: '2', callback_data: 2 }, { text: '3', callback_data: 3 }],
            [{ text: '4', callback_data: 4 }, { text: '5', callback_data: 5 }, { text: '6', callback_data: 6 }],
            [{ text: '7', callback_data: 7 }, { text: '8', callback_data: 8 }, { text: '9', callback_data: 9 }],
            [{ text: '0', callback_data: 0 }]
            
        ]
    })
}

const replay_options = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Играть еще раз!', callback_data: '/game' }]            
        ]
    })
}

const startGame = async (chatId) => {
    chats[chatId] = Math.floor(Math.random() * 10)
    return bot.sendMessage(chatId, 'Отгадывай', options)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие' },
        { command: '/game', description: 'Игра угадай число' }
    ])

    bot.on('message', async msg => {
        const user = msg.from
        const chatId = msg.chat.id
        const text = msg.text
        if (text === '/start') {
            await bot.sendMessage(chatId, `Привет ${user.first_name} ${user.last_name}!`)
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
        }
        if (text === '/game') {
            await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен угадать')
            return startGame(chatId)
        }
    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/game') return startGame(chatId)
        if (data == chats[chatId]) return bot.sendMessage(chatId, `Поздравляю! Вы угадали`, replay_options)
        return bot.sendMessage(chatId, `Неверно! Попробуйте еще раз`, options)
    })
}

start()