// falso banco de dados de clientes, em memória RAM
var clientes = []
// falso banco de dados de academias, em memória RAM
var academias = []
//falso banco de dados de estilos, em memoria RAM
var estilos = []

var clienteAlterado = null
let ultimoID = 1
let itensPorPagina = 5; // Número de itens por página
let paginaAtual = 1; // Página inicial
let ordemAscendente = true;


function gerarIdUnico() {
    return ++ultimoID; // Incrementa e retorna o próximo ID único
}
function adicionar() {
    clienteAlterado = null
    mostrarModal()
    limparFormulario()
}
function adicionarEstilo() {
    mostrarModalEstilo()
    limparFormularioEstilo()
}

function salvarEstilo() {
    let nome = document.getElementById("nomeEstilo").value;
    
    let novoEstilo = {
        nome: nome
    };

    mostrarLoading();
    fetch('http://localhost:3000/estilo', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoEstilo)
    })
    .then(response => {
        if (!response.ok) {
            ocultarLoading();
            return response.json().then(error => {
                throw new Error(error.mensagem);
            });
        }
        return response.json();
    })
    .then(data => {
        setTimeout(() => {
            ocultarLoading();
            ocultarModalEstilo();
            alert(data.mensagem);
            limparFormularioEstilo();
            carregarEstilos(); // Chama a função para atualizar a lista de estilos
        }, 1500); // Adiciona um tempo de espera de 1.5 segundos
    })
    .catch(error => {
        ocultarLoading();
        console.error('Erro no fetch:', error);
        alert('Erro no fetch: ' + error.message);
    });
    return false; // Prevenindo o formulário de enviar de forma tradicional
}
function salvar() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let peso = document.getElementById("peso").value;
    let altura = document.getElementById("altura").value;
    let dataNascimento = document.getElementById("dataNascimento").value;
    let celular = document.getElementById("celular").value;
    let imc = peso / Math.pow(altura / 100, 2);
    let idAcademia = document.getElementById("academia").value;
    let idEstilo = document.getElementById("estilo").value;

    let novoBodyBuilder = {
        nome: nome,
        cpf: cpf,
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        dataNascimento: dataNascimento,
        celular: celular,
        imc: imc.toFixed(2),
        idAcademia: idAcademia,
        idEstilo: idEstilo
    };

    const url = clienteAlterado == null ? 'http://localhost:3000/body-builder/' : 'http://localhost:3000/body-builder/' + clienteAlterado.id;
    const method = clienteAlterado == null ? 'POST' : 'PUT';

    fetch(url, {
        method: method,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoBodyBuilder)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.mensagem);
            });
        }
        return response.json();
    })
    .then(data => {
        mostrarLoading();
        setTimeout(function () {
            ocultarLoading();
            ocultarModal();
            alert(data.mensagem);
            limparFormulario();
            carregarClientes();
        }, 1500); // Tempo de espera para simular carregamento
    })
    .catch(error => {
        alert(error.message);
    });

    return false;
}

function mostrarLoading() {
    document.getElementById("loading").style.display = "block";
}

function ocultarLoading() {
    document.getElementById("loading").style.display = "none";
}

function limparFormulario() {
    document.getElementById("form").reset()
}
function limparFormularioEstilo() {
    document.getElementById("formEstilo").reset()
}

function atualizarLista(listaClientes = clientes) {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = ""; // Limpa o conteúdo atual da tabela

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const dadosPagina = listaClientes.slice(inicio, fim);

    dadosPagina.forEach(cliente => {
        const linhaTabela = document.createElement("tr");
        linhaTabela.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.peso}Kg</td>
            <td>${cliente.altura}m</td>
            <td>${cliente.dataNascimento}</td>
            <td>${cliente.celular}</td>
            <td>${cliente.imc}</td>
            <td>${cliente.gym.nome}</td>
            <td>${cliente.estilo.nome}</td>
            <td>
                <button class="alterar" onclick="alterar('${cliente.id}')">Alterar</button>
                <button class="excluir" onclick="excluir('${cliente.id}')">Excluir</button>
            </td>
        `;
        tbody.appendChild(linhaTabela);
    });

    atualizarPaginacao(listaClientes); // Atualiza a paginação com base na lista filtrada
}


function atualizarPaginacao(listaClientes = clientes) {
    const divPaginacao = document.getElementById("paginacao");
    divPaginacao.innerHTML = "";

    const totalPaginas = Math.ceil(listaClientes.length / itensPorPagina);

    // Botão "Anterior"
    if (paginaAtual > 1) {
        const btnAnterior = document.createElement("button");
        btnAnterior.textContent = "Anterior";
        btnAnterior.onclick = () => {
            paginaAtual--;
            atualizarLista(listaClientes);
        };
        divPaginacao.appendChild(btnAnterior);
    }

    // Números das páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement("button");
        btnPagina.textContent = i;
        btnPagina.disabled = i === paginaAtual;
        btnPagina.onclick = () => {
            paginaAtual = i;
            atualizarLista(listaClientes);
        };
        divPaginacao.appendChild(btnPagina);
    }

    // Botão "Próximo"
    if (paginaAtual < totalPaginas) {
        const btnProximo = document.createElement("button");
        btnProximo.textContent = "Próximo";
        btnProximo.onclick = () => {
            paginaAtual++;
            atualizarLista(listaClientes);
        };
        divPaginacao.appendChild(btnProximo);
    }
}

function mostrarLoading() {
    console.log("Loading mostrado"); // Log para verificar a chamada
    document.getElementById("loading").style.display = "flex";
}

function ocultarLoading() {
    console.log("Loading ocultado"); // Log para verificar a chamada
    document.getElementById("loading").style.display = "none";
}


function mostrarModal() {
    document.getElementById("modal").style.display = "flex";
}
function ocultarModal() {
    document.getElementById("modal").style.display = "none";
}
function mostrarModalEstilo() {
    document.getElementById("modalEstilo").style.display = "flex";
}
function ocultarModalEstilo() {
    document.getElementById("modalEstilo").style.display = "none";
}

function excluir(id) {
    if (confirm("Tem certeza que deseja excluir?")) {
        fetch('http://localhost:3000/body-builder/' + id, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            alert("Excluído com sucesso")
            carregarClientes()
        }).catch((error) => {
            alert("Erro ao cadastrar")
        });
    }
}
function alterar(id) {
    //busca o cliente a ser alterado
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i]
        if (cliente.id == id) {
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("peso").value = cliente.peso
            document.getElementById("altura").value = cliente.altura
            document.getElementById("dataNascimento").value = cliente.dataNascimento
            document.getElementById("celular").value = cliente.celular
            document.getElementById("academia").value = cliente.gym.id
            document.getElementById("estilo").value = cliente.estilo.id
            clienteAlterado = cliente
            mostrarModal()
        }
    }
}

function carregarClientes() {
    fetch('http://localhost:3000/body-builder', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => response.json())
        .then((data) => {
            clientes = data
            atualizarLista()
        }).catch((error) => {
            console.log(error)
            alert("Erro ao listar clientes")
        });
}
// Função para aplicar máscara
function aplicarMascara(input, mascara) {
    const valorSemMascara = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    let valorFormatado = "";
    let posicao = 0;

    for (let i = 0; i < mascara.length; i++) {
        if (mascara[i] === "0") {
            if (valorSemMascara[posicao]) {
                valorFormatado += valorSemMascara[posicao];
                posicao++;
            } else {
                break;
            }
        } else {
            valorFormatado += mascara[i];
        }
    }

    input.value = valorFormatado;
}

let estadoOrdenacao = { campo: null, ordem: null }; // Para controlar o estado de ordenação

function ordenarTabela(campo) {
    // Se clicar no mesmo campo, altera o estado de ordenação
    if (estadoOrdenacao.campo === campo) {
        if (estadoOrdenacao.ordem === "asc") {
            estadoOrdenacao.ordem = "desc"; // Passa para descendente
        } else if (estadoOrdenacao.ordem === "desc") {
            estadoOrdenacao.ordem = null; // Volta ao estado original
        } else {
            estadoOrdenacao.ordem = "asc"; // Ascendente
        }
    } else {
        // Se clicar em outro campo, redefine para ascendente
        estadoOrdenacao = { campo: campo, ordem: "asc" };
    }

    // Remove classes de ordenação de todos os cabeçalhos
    document.querySelectorAll("th").forEach(th => th.classList.remove("ordenado-asc", "ordenado-desc"));

    if (estadoOrdenacao.ordem === null) {
        // Estado desordenado: carrega os clientes na ordem original
        carregarClientes();
    } else {
        // Ordena os dados
        clientes.sort((a, b) => {
            if (typeof a[campo] === "number") {
                return estadoOrdenacao.ordem === "asc" ? a[campo] - b[campo] : b[campo] - a[campo];
            } else if (campo === "dataNascimento") {
                return estadoOrdenacao.ordem === "asc"
                    ? new Date(a[campo]) - new Date(b[campo])
                    : new Date(b[campo]) - new Date(a[campo]);
            } else {
                return estadoOrdenacao.ordem === "asc"
                    ? a[campo].localeCompare(b[campo])
                    : b[campo].localeCompare(a[campo]);
            }
        });

        // Atualiza a tabela
        atualizarLista();

        // Adiciona a classe de ordenação ao cabeçalho atual
        const th = document.querySelector(`th[onclick="ordenarTabela('${campo}')"]`);
        th.classList.add(estadoOrdenacao.ordem === "asc" ? "ordenado-asc" : "ordenado-desc");
    }
}

function Filtrar() {
    const termoBusca = document.getElementById("busca").value; // Obtém o texto digitado

    fetch(`http://localhost:3000/body-builder?busca=${encodeURIComponent(termoBusca)}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(clientesFiltrados => {
            atualizarLista(clientesFiltrados); // Atualiza a tabela com os dados filtrados
        })
        .catch(error => {
            console.error("Erro ao buscar clientes:", error);
            alert("Erro ao buscar clientes");
        });
}
function carregarAcademias() {
    fetch('http://localhost:3000/gym', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => response.json())
        .then((data) => {
            academias = data
            atualizarListaAcademias()
        }).catch((error) => {
            console.log(error)
            alert("Erro ao listar academias")
        });
}
function atualizarListaAcademias() {
    const listaAcademia = document.getElementById("academia")
    for (let i = 0; i < academias.length; i++) {
        let academia = academias[i]
        let option = document.createElement("option")
        option.value = academia.id
        option.innerHTML = academia.nome
        listaAcademia.add(option)
    }
}

function carregarEstilos() {
    fetch('http://localhost:3000/estilo', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((response) => response.json())
        .then((data) => {
            estilos = data
            atualizarListaEstilos()
        }).catch((error) => {
            console.log(error)
            alert("Erro ao listar estilos")
        });
}
function atualizarListaEstilos() {
    const listaEstilo = document.getElementById("estilo")
    listaEstilo.innerHTML = "";
    for (let i = 0; i < estilos.length; i++) {
        let estilo = estilos[i]
        let option = document.createElement("option")
        option.value = estilo.id
        option.innerHTML = estilo.nome
        listaEstilo.add(option)
    }
}