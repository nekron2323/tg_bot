require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api')
const TOKEN = process.env.TOKEN
const {nums_options, replay_options} = require('./options')

const bot = new TelegramApi(TOKEN, { polling: true })
const chats = {}
const startGame = async (chatId) => {
    chats[chatId] = Math.floor(Math.random() * 10)
    return bot.sendMessage(chatId, 'Отгадывай', nums_options)
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
        return bot.sendMessage(chatId, `Неверно! Попробуйте еще раз`, nums_options)
    })
}

start()