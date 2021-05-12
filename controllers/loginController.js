const user = {
    email: 'kolesnik0796@mail.ru',
    password: '010123456aA'
}

exports.getLoginPage = (req, res, next) => {
    if (req.session.isAdmin) {
        res.redirect('/admin')
    }

    res.render('pages/login', { title: 'SigIn page', msglogin: req.flash('warning') })
}

exports.sendForm = (req, res, next) => {
    const { email, password } = req.body;

    if (email !== user.email || password !== user.password) {
        req.flash('warning', 'Вы ввели неверный логин или пароль!')
        res.redirect('/login')
        return
    }

    req.session.isAdmin = true;
    res.redirect('/admin')
}
