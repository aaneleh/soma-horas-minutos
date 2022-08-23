const horas_atuais = document.getElementById('horas_atuais');
const minutos_atuais = document.getElementById('minutos_atuais');

const horasEl = document.getElementById('horas_inseridas');
const minutosEl = document.getElementById('minutos_inseridos');

const progressoEl = document.getElementById('progress-bar');
const historicoEl = document.getElementById('historico');

document.getElementById('form').addEventListener("submit", function(event){ event.preventDefault(); });

let historico = [
    ['Horas', 'Excluir']
];

function getHoras(minutos){
    return (minutos - minutos % 60) / 60;
}
function getMinutos(minutos){
    return minutos % 60;
}
function getPorcentagem(minutos, max){
    return ((minutos/60)*100)/max;
}
function updateDisplay(minutos){
    //ajusta display
    horas_atuais.textContent = getHoras(minutos);
    minutos_atuais.textContent = getMinutos(minutos);
    progressoEl.innerHTML = getPorcentagem(minutos, 40)+"%";
    progressoEl.value = getPorcentagem(minutos, 40); //progresso = 100% - 40h | x - minutosTotais
    //zera input
    horasEl.value = 0;
    minutosEl.value = 0;
}
function deleteHistorico(id){
    let minutosAtuais = Number(horas_atuais.textContent)*60 + Number(minutos_atuais.textContent);
    let minutosAtualizados = minutosAtuais - historico[id][0];
    historico.splice(id, 1);
    updateDisplay(minutosAtualizados);
    updateHistorico();
}
function reiniciar(){
    historico.splice(1, historico.length);
    updateDisplay(0);
    updateHistorico();
}
function updateHistorico(minutos){
    //reset tabela
    historicoEl.textContent = "";

    //se tem algum, adiciona ao historico
    if(minutos != '' && minutos > 0){
        let horas = minutos;
        let excluir = "X";
        let registro = [horas, excluir];
        historico.push(registro);
    }

    //se só tem o header, mostra aviso que não sem registro
    if(historico.length == 1) {
        historicoEl.innerHTML = '<p>Nenhum registro inserido ainda</p>';
    } else {
    //reescreve a tabela
        for(var i = 0; i < historico.length; i++){
            const rowEl = document.createElement('tr');
            const horasEl =  document.createElement('td');
            const excluirEl =  document.createElement('td');
            const id = i;
            if(i == 0){
                horasEl.innerHTML = historico[i][0];
            } else {
                horasEl.innerHTML = getHoras(historico[i][0]) + "h " + getMinutos(historico[i][0]) + "min ";
            }
            excluirEl.innerHTML = historico[i][1];
            excluirEl.addEventListener('click', ()=>{deleteHistorico(id)});
            rowEl.appendChild(horasEl);
            rowEl.appendChild(excluirEl);
            historicoEl.appendChild(rowEl);
        }
    }
}
function calcular(){
    //pega as informações do form
    let horas = Number(horasEl.value);
    let minutos = Number(minutosEl.value);

    //se algum dos numeros for invalidos ou negativos ou acima de 60min, cancela a execução
    if (isNaN(horas) || isNaN(minutos)) return
    if (horas < 0 || minutos < 0 || minutos > 60) return

    //soma os valores inseridos
    let totalInserido = horas * 60 + minutos;
    //horas já inseridas
    let displayAtual = Number(horas_atuais.textContent)*60 + Number(minutos_atuais.textContent);
    //somas as horas inseridas as horas já registradas
    let minutosTotais = totalInserido + Number(horas_atuais.textContent)*60 + Number(minutos_atuais.textContent);

    //chega se o usuário alcançou suas horas
    if(totalInserido + displayAtual > 40*60) {
        alert('Você inseriu ' + Math.round( (minutosTotais - 40*60)/60 )   + 'h a mais');
    } else {
        //transforma a quantidade total de minutos em h e min para visualização
        updateDisplay(minutosTotais);
        updateHistorico(totalInserido);
    }
}
window.addEventListener('load', ()=>{
    updateHistorico();
})