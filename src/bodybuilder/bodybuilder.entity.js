class BodyBuilder {

    constructor(id, cpf, nome, peso, altura, dataNascimento, celular, imc, gym, estilo){
        this.id = id
        this.cpf = cpf
        this.nome = nome
        this.peso = peso
        this.altura = altura
        this.dataNascimento = dataNascimento
        this.celular = celular
        this.imc = imc
        this.gym = gym 
        this.estilo = estilo
    }
}
module.exports = {BodyBuilder}