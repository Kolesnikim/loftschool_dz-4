const nodemailer = require('nodemailer')
const validator = require('validator')

const config = require('../nodemailer.config.json')
const db = require('../db')

exports.getMainPage = (req, res, next) => {
    const products = db.get('products').value()
    const skills = db.get('skills').value()

    res.render('pages/index', { title: 'Main page', products, skills, msgemail: req.flash('msgemail')})
}

exports.sendMessage = async (req, res, next) => {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
        req.flash('msgemail', 'Вы ввели недостаточные данные для отправки письма!')
        return res.redirect('/')
    }

    if (!validator.isEmail(email)) {
        req.flash('msgemail', 'Вы ввели адрес в неверном формате!')
        return res.redirect('/')
    }

    const transport = nodemailer.createTransport(config.mail.smtp)

    try {
        const info = await transport.sendMail({
            from: `"${name}", ${email}`,
            to: config.mail.smtp.auth.user,
            subject: config.mail.subject,
            text: `${name} "${email}" Отправил Вам письмо: ${message}`,
        })

        req.flash('msgemail', 'Письмо успешно отправлено!')
        res.redirect('/')
    } catch (err) {
        console.log(err)
        req.flash('msgemail', 'Что-то пошло не так. Отправьте Ваше сообщение позже!')
        res.redirect('/')
    }
}

