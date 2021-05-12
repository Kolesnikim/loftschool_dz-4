const path = require('path')
const fs = require(('fs'))

const validator = require('validator')
const formidable = require('formidable')

const db = require('../db')

exports.isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        return next()
    }

    res.redirect('/login')
}

exports.getAdminPage = (req, res, next) => {
    const age = db.get('skills[0]').value().number
    const concerts = db.get('skills[1]').value().number
    const cities = db.get('skills[2]').value().number
    const years = db.get('skills[3]').value().number

    const counts = { age, concerts, cities, years }

    res.render('pages/admin',
        {
            title: 'Admin page',
            msgskill: req.flash('msgskill'),
            msgfile: req.flash('msgfile'),
            counts
        })
}

exports.updateSkills = (req, res, next) => {
    const { age, concerts, cities, years } = req.body

    const newSkills = [
        {
            "number": age,
            "text": "Возраст начала занятий на скрипке"
        },
        {
            "number": concerts,
            "text": "Концертов отыграл"
        },
        {
            "number": cities,
            "text": "Максимальное число городов в туре"
        },
        {
            "number": years,
            "text": "Лет на сцене в качестве скрипача"
        }
    ]

    if (!age || !concerts || !cities || !years) {
        req.flash('msgskill', 'Вы указали не все численные показатели!')
        res.redirect('/admin')
        return
    }

    db.set('skills', newSkills).write()

    req.flash('msgskill', 'Новые показатели успешно сохранены!')
    res.redirect('/admin')
}

exports.addNewProduct = (req, res, next) => {
    const form = formidable.IncomingForm()
    const upload = path.join('./public', 'assets', 'img', 'products')

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload)
    }

    form.uploadDir = path.join(process.cwd(), upload)

    form.parse(req, (err, fields, files) => {
        if (err) return next(err)

        const valid = validation(fields, files)

        if (valid.err) {
            fs.unlinkSync(files.photo.path)

            req.flash('msgfile', valid.status)
            return res.redirect('/admin')
        }

        const fileName = path.join(upload, files.photo.name)

        fs.rename(files.photo.path, fileName, (err) => {
            if (err) throw err;
        })

        const dir = `.${fileName.substr(fileName.indexOf('/'))}`

        const newProduct = {
            src: dir,
            name: fields.name,
            price: parseFloat(fields.price)
        }

        db.get('products').push(newProduct).write()

        req.flash('msgfile', 'Новый продукт успешно сохранен!')
        res.redirect('/admin')
    })
}

const validation = (fields, files) => {
    if (!files.photo.name || !files.photo.size) {
        return { status: 'Вы не добавили картинку', err: true }
    }

    if (!fields.name) {
        return { status: 'Вы не указали название продукта', err: true }
    }

    if (!fields.price) {
        return { status: 'Вы не указали цену продукта', err: true }
    }

    if (!validator.isNumeric(fields.price)) {
        return { status: 'Вы указали цену в неверном формате', err: true }
    }

    return { err: false }
}
