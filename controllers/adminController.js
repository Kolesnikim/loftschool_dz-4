const path = require('path')
const fs = require(('fs'))

const validator = require('validator')
const formidable = require('formidable')

const db = require('../models/db')

exports.isAdmin = (ctx, next) => {
    if (ctx.session.isAdmin) {
        return next()
    }

    ctx.redirect('/login')
}

exports.getAdminPage = async (ctx, next) => {
    const age = db.get('skills[0]').value().number
    const concerts = db.get('skills[1]').value().number
    const cities = db.get('skills[2]').value().number
    const years = db.get('skills[3]').value().number

    const counts = { age, concerts, cities, years }

    await ctx.render('pages/admin',
        {
            title: 'Admin page',
            msgskill: ctx.flash('msgskill'),
            msgfile: ctx.flash('msgfile'),
            counts
        })
}

exports.updateSkills = async (ctx, next) => {
    const { age, concerts, cities, years } = ctx.request.body

    if (!age || !concerts || !cities || !years) {
        ctx.flash('msgskill', 'Вы указали не все численные показатели!')
        ctx.redirect('/admin')
        return
    }

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

    db.set('skills', newSkills).write()

    ctx.flash('msgskill', 'Новые показатели успешно сохранены!')
    ctx.redirect('/admin')
}

exports.addNewProduct = async (ctx, next) => {
    const form = formidable.IncomingForm()
    const upload = path.join('./public', 'assets', 'img', 'products')

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload)
    }

    form.uploadDir = path.join(process.cwd(), upload)

    await new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
            if (err) reject(err)

            const valid = validation(fields, files)

            if (valid.err) {
                fs.unlinkSync(files.photo.path)

                ctx.flash('msgfile', valid.status)
                return ctx.redirect('/admin')
            }

            const fileName = path.join(upload, files.photo.name)

            fs.rename(files.photo.path, fileName, (err) => {
                if (err) reject(err);
            })

            const dir = `.${fileName.substr(fileName.indexOf('/'))}`

            const newProduct = {
                src: dir,
                name: fields.name,
                price: parseFloat(fields.price)
            }

            db.get('products').push(newProduct).write()

            ctx.flash('msgfile', 'Новый продукт успешно сохранен!')
            ctx.redirect('/admin')
            resolve();
        })
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
