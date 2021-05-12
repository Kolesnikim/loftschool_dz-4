const user = {
    email: 'kolesnik0796@mail.ru',
    password: '010123456aA'
}

exports.getLoginPage = async (ctx, next) => {
    if (ctx.session.isAdmin) {
        ctx.redirect('/admin')
    }

    await ctx.render('pages/login', { title: 'SigIn page', msglogin: ctx.flash('warning') })
}

exports.sendForm = async (ctx, next) => {
    const { email, password } = ctx.request.body

    if (email !== user.email || password !== user.password) {
        ctx.flash('warning', 'Вы ввели неверный логин или пароль!')
        ctx.redirect('/login')
        return
    }

    ctx.session.isAdmin = true
    ctx.redirect('/admin')
}
