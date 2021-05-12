const nodemailer = require('nodemailer')
const validator = require('validator')

const config = require('../nodemailer.config.json')
const db = require('../models/db')

exports.getMainPage = async (ctx, next) => {
    const products = db.get('products').value()
    const skills = db.get('skills').value()

    await ctx.render('pages/index', { title: 'Main page', products, skills, msgemail: ctx.flash('msgemail')})
}

exports.sendMessage = async (ctx, next) => {
    const { name, email, message } = ctx.request.body

    if (!name || !email || !message) {
        ctx.flash('msgemail', 'Вы ввели недостаточные данные для отправки письма!')
        return ctx.redirect('/')
    }

    if (!validator.isEmail(email)) {
        ctx.flash('msgemail', 'Вы ввели адрес в неверном формате!')
        return ctx.redirect('/')
    }

    const transport = nodemailer.createTransport(config.mail.smtp)

    try {
        const info = await transport.sendMail({
            from: `"${name}", ${email}`,
            to: config.mail.smtp.auth.user,
            subject: config.mail.subject,
            text: `${name} "${email}" Отправил Вам письмо: ${message}`,
        })

        ctx.flash('msgemail', 'Письмо успешно отправлено!')
        ctx.redirect('/')
    } catch (err) {
        ctx.flash('msgemail', 'Что-то пошло не так. Отправьте Ваше сообщение позже!')
        ctx.redirect('/')
    }
}

