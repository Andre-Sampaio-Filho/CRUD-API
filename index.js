const express = require('express')
const cors = require('cors')
const { BodyBuilder } = require('./src/bodybuilder/bodybuilder.entity')
const { Gym } = require('./src/gym/gym.entity')
const { Estilo } = require('./src/Estilo/estilo.entity')
const app = express()
app.use(cors())
const port = 3000
app.use(express.json())

//banco de dados de clientes
var clientes = []

//banco de dados de academias
var academias = [
  {
    id: 1,
    nome: "Academia 1",
    telefone: "123456789",
  },
  {
    id: 2,
    nome: "Academia 2",
    telefone: "987654321",
  }
]

var estilos = [
  {
    id: 1,
    nome: "Monstrão",
  },
  {
    id: 2,
    nome: "Frango",
  },
  {
    id: 3,
    nome: "Chassi de grilo",
  }
]

var ultimoID = 0; // Inicializa a última ID como 0

function validarCpf(cpf) {
  var Soma = 0
  var Resto

  var strCPF = String(cpf).replace(/[^\d]/g, '')

  if (strCPF.length !== 11)
    return false

  if ([
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ].indexOf(strCPF) !== -1)
    return false

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

  Resto = (Soma * 10) % 11

  if ((Resto == 10) || (Resto == 11))
    Resto = 0

  if (Resto != parseInt(strCPF.substring(9, 10)))
    return false

  Soma = 0

  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)

  Resto = (Soma * 10) % 11

  if ((Resto == 10) || (Resto == 11))
    Resto = 0

  if (Resto != parseInt(strCPF.substring(10, 11)))
    return false

  return true
}
function validarTelefone(celular) {
  const regex = /^\([0-9]{2}\) [0-9]{4,5}\-[0-9]{4}$/;
  return regex.test(celular)

}

app.post('/body-builder', (req, res) => {
  const data = req.body;

  if (!data.nome || !data.cpf || !data.peso || !data.altura || !data.dataNascimento || !data.celular){ 
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  } 
  if (!validarCpf(data.cpf)) { 
    return res.status(400).json({ mensagem: "Digite um CPF existente!" })
  } 
    if (!validarTelefone(data.celular)) { 
      return res.status(400).json({ mensagem: "Digite um celular válido!" }); }

  const idAcademia = data.idAcademia;
  const gym = academias.find((gym) => gym.id == idAcademia);

  const idEstilo = data.idEstilo;
  const estilo = estilos.find((estilo) => estilo.id == idEstilo);

  // Gera um ID único no backend
  const id = ++ultimoID;

  let bodyBuilder = new BodyBuilder(id, data.cpf, data.nome, data.peso, data.altura, data.dataNascimento, data.celular, data.imc, gym, estilo);

  const existe = clientes.some(cliente => cliente.cpf === data.cpf);
  const celularExiste = clientes.some(cliente => cliente.celular === data.celular);

  if (existe) {
    return res.status(400).json({ mensagem: "CPF já cadastrado" });
  }

  if (celularExiste) {
    return res.status(400).json({ mensagem: "Celular já cadastrado" });
  }

  clientes.push(bodyBuilder);
  res.status(200).json({ mensagem: "Cadastrado com sucesso", bodyBuilder });
});

app.put('/body-builder/:id', (req, res) => {
  let id = req.params.id;
  const data = req.body;

  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i];
    if (cliente.id == id) {
      const idAcademia = data.idAcademia;
      const gym = academias.find(gym => gym.id == idAcademia);

      const idEstilo = data.idEstilo;
      const estilo = estilos.find(estilo => estilo.id == idEstilo);

      let bodyBuilder = new BodyBuilder(
        cliente.id, // Mantém o ID original
        data.cpf,
        data.nome,
        data.peso,
        data.altura,
        data.dataNascimento,
        data.celular,
        data.imc,
        gym,
        estilo
      );

      clientes[i] = bodyBuilder;
      return res.status(200).json({ mensagem: "Atualizado com sucesso", bodyBuilder });
    }
  }

  res.status(404).json({ mensagem: "Bodybuilder não encontrado" });
});


app.delete('/body-builder/:id', (req, res) => {
  let id = req.params.id;
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].id == id) {
      clientes.splice(i, 1);
      reorganizarIDs(); // Reorganiza os IDs após exclusão
      return res.status(200).json({ mensagem: "Deletado com sucesso" });
    }
  }
  res.status(404).json({ mensagem: "Bodybuilder não encontrado" });
});

function reorganizarIDs() {
  for (let i = 0; i < clientes.length; i++) {
    clientes[i].id = i + 1; // Reorganiza os IDs para serem sequenciais a partir de 1
  }
  ultimoID = clientes.length; // Atualiza o último ID com base na nova sequência
}

app.get('/body-builder', (req, res) => {
  const { busca } = req.query;
    
  if (busca) {
    const buscaLower = busca.toLowerCase();
    const clientesFiltrados = clientes.filter(cliente =>
      Object.values(cliente).some(valor => {
        if (typeof valor === "string") {
          // Verifica se a string contém o termo de busca
          return valor.toLowerCase().includes(buscaLower);
        } else if (typeof valor === "number") {
          // Verifica se o número contém o termo de busca como substring
          return valor.toString().includes(busca);
        }
        return false;
      })
    );
    res.json(clientesFiltrados);
  } else {
    res.json(clientes);
  }
});

app.post('/gym', (req, res) => {
  const data = req.body
  let gym = new Gym()
  gym.nome = data.nome
  gym.telefone = data.telefone
  academias.push(gym)
  res.status(200).json({ mensagem: "Cadastrado com sucesso" });
});

app.get('/gym', (req, res) => {
  res.json(academias);
});


app.post('/estilo', (req, res) => {
  const data = req.body;
  // Verifica se o nome já existe
  const estiloExistente = estilos.find(estilo => estilo.nome.toLowerCase() === data.nome.toLowerCase());
  if (estiloExistente) {
    return res.status(400).json({ mensagem: "Estilo já cadastrado" });
  }

  if (!data.nome || data.nome.length < 1) {
    return res.status(400).json({ mensagem: "Nome do estilo inválido" });
  }

  let estilo = new Estilo();
  estilo.id = estilos.length + 1;
  estilo.nome = data.nome;
  estilos.push(estilo);

  res.status(200).json({ mensagem: "Cadastrado com sucesso" });
});

app.get('/estilo', (req, res) => {
  res.json(estilos);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

