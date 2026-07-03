module.exports = app => {
    const signin = (req, res) => {

        console.log('signin')
        app.db('usuarios')
            .where({ email: req.body.email, password: req.body.password })
            .then((user) => {
                console.log(user[0])
                if (user[0]) {
                    res.json(
                        {
                            "msg": "Usuário Autenticado com Suceso",
                            "msg_erro": "",
                            "num_erro": 0,
                            "res": user[0]
                        }
                    )
                } else {
                    res.json(
                        {
                            "msg": "Usuário não Encontrado.",
                            "msg_erro": "Usuário não Encontrado.",
                            "num_erro": 1,
                        }
                    )
                }
            })
            .catch(err => res.status(400).json(
                {
                    "msg": "",
                    "msg_erro": err,
                    "num_erro": 1
                }
            ))
    }


         return {signin}
}