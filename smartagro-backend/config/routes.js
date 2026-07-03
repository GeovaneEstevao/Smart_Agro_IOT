module.exports = app => {
    app.post('/usuarios/signin', app.api.auth.signin)
    app.post('/usuarios/signup', app.api.usuarios.signup)
    app.post('/usuarios/list', app.api.usuarios.listUsuarios)
    app.post('/usuarios/get', app.api.usuarios.getUsuario)
    app.post('/usuarios/update', app.api.usuarios.updateUsuario)
    app.post('/usuarios/rem', app.api.usuarios.remUsuario)
}