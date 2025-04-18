let calendar; // variável global
let calendarioCarregado = false; // flag para renderizar só uma vez
const aulas = {
  "2025-04-18": [
    { materia: "Poder de Polícia", horario: "08:15 - 09:05" },
    { materia: "EFAG", horario: "09:05 - 09:55" },
    { materia: "Análise da decisão do STF", horario: "10:15 - 11:05" },
    { materia: "EFAG", horario: "11:05 - 11:55" },
    { materia: "Avaliação", horario: "12:55 - 13:45" },
    { materia: "EFAG", horario: "13:45 - 14:35" },
    { materia: "Avaliação", horario: "15:05 - 15:50" },
    { materia: "EFAG", horario: "15:50 - 16:40" }
  ],}
  const user = localStorage.getItem('nomeUsuario');
  const dados = JSON.parse(localStorage.getItem(`dados_${user}`)) || {};
  
  document.getElementById('titulo-bemvindo').textContent = `Bem-vindo, ${user}`;
  document.getElementById('qraAluno').textContent = dados.qraAluno || '—';
  document.getElementById('cfAluno').textContent = dados.cfAluno || '—';
  document.getElementById('reAluno').textContent = dados.reAluno || '—';
  document.getElementById('emailAluno').textContent = dados.emailAluno || '—';
  document.getElementById('cursoAluno').textContent = dados.cursoAluno || 'Formação de Guardas Municipais';
  document.getElementById('pelotaoAluno').textContent = dados.pelotaoAluno || '—';
  
  document.getElementById('nomeCompleto').textContent = dados.nomeCompleto || '—';
  document.getElementById('cpfAluno').textContent = dados.cpfAluno || '—';
  document.getElementById('dataNascimento').textContent = dados.dataNascimento || '—';
  document.getElementById('enderecoAluno').textContent = dados.enderecoAluno || '—';
  document.getElementById('telefoneAluno').textContent = dados.telefoneAluno || '—';
  document.getElementById('sangueAluno').textContent = dados.sangueAluno || '—';
  
function showSection(id) {
  const sections = ['info', 'disciplinas', 'notas', 'grade'];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = 'none';
  });

  const sectionToShow = document.getElementById(id);
  sectionToShow.style.display = 'block';
  if (id === 'grade' && !calendarioCarregado) {
  setTimeout(() => {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: new Date(),
      height: 400,
      locale: 'pt-br',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ''
      },
      dateClick: function (info) {
        document.querySelectorAll('.fc-daygrid-day').forEach(cell => {
          cell.classList.remove('data-selecionada');
        });
      
        info.dayEl.classList.add('data-selecionada');
      
        const data = info.dateStr;
        const aulasDoDia = aulas[data];
        const container = document.getElementById('aulasDoDia');
        const btnPDF = document.getElementById('baixar-pdf');
        container.innerHTML = ''; // limpa
        
        // Corrigir fuso horário corretamente
        const dataObj = new Date(`${data}T00:00:00-03:00`);
        const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const diaSemana = diasSemana[dataObj.getDay()];
        const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        
        if (aulasDoDia && aulasDoDia.length > 0) {
          let html = `<div id="conteudo-pdf" style="text-align: center;">
  <h2 style="color:#1d3557; font-weight: 600; margin-bottom: 5px;">Aulas do Dia</h2>
  <h3 style="margin-bottom: 20px;">${diaSemana} - ${dataFormatada}</h3>
            <table style="width:100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 15px;">
              <thead>
                <tr style="background-color: #e3f2fd; color: #1d3557;">
                  <th style="padding: 10px; border: 1px solid #ccc; text-align: center;">Horário</th>
                  <th style="padding: 10px; border: 1px solid #ccc; text-align: center;">Matéria</th>
                </tr>
              </thead>
              <tbody>`;
        
          aulasDoDia.forEach(aula => {
            html += `
              <tr style="background-color: #f9fbfc;">
                <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${aula.horario}</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">${aula.materia}</td>
              </tr>`;
          });
        
          html += `</tbody></table></div>`;
          container.innerHTML = html;
          btnPDF.style.display = 'inline-block';
        } else {
          container.innerHTML = `
            <div id="conteudo-pdf">
              <p style="color: #555; font-size: 16px; padding: 10px; background: #f2f2f2; border-radius: 8px; text-align: center;">
                Não há grade disponível pra esta data.
              </p>
            </div>`;
          btnPDF.style.display = 'none';
        }}
    });
    calendar.render();
    calendarioCarregado = true;
  }, 100); // delay garante que o elemento esteja visível
}

  if (id === 'grade' && calendar) {
    setTimeout(() => {
      calendar.render();
    }, 100); // Pequeno delay para garantir que o container esteja visível
  }
  

  // Se for dispositivo móvel, rola até a seção visível
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    setTimeout(() => {
      sectionToShow.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

document.getElementById('searchInput').addEventListener('input', function () {
  const filtro = this.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.disciplina-card');
  const disciplinasBox = document.getElementById('disciplinas');

  const msgAntiga = document.getElementById('mensagem-resultado');
  if (msgAntiga) msgAntiga.remove();

  if (filtro === '') {
    showSection('info');
    cards.forEach(card => card.style.display = 'flex');
    return;
  }

  if (filtro.includes('nota')) { showSection('notas'); return; }
  if (filtro.includes('info')) { showSection('info'); return; }
  if (filtro.includes('grade')) { showSection('grade'); return; }

  let encontrou = false;
  cards.forEach(card => {
    const nome = card.textContent.toLowerCase();
    const mostrar = nome.includes(filtro);
    card.style.display = mostrar ? 'flex' : 'none';
    if (mostrar) encontrou = true;
  });

  const sections = ['info', 'disciplinas', 'notas', 'grade'];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = 'none';
  });

  if (encontrou) {
    document.getElementById('disciplinas').style.display = 'block';

    // Desce até o primeiro card visível
    const primeiroVisivel = Array.from(cards).find(card => card.style.display !== 'none');
    if (primeiroVisivel) {
      setTimeout(() => {
        primeiroVisivel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  } else {
    const msg = document.createElement('p');
    msg.id = 'mensagem-resultado';
    msg.style.fontSize = '1.1rem';
    msg.style.color = '#000';
    msg.style.marginTop = '20px';
    msg.style.textAlign = 'center';
    msg.innerHTML = `Nenhum resultado encontrado com: <strong>"${filtro}"</strong>`;
    document.querySelector('.main-content').appendChild(msg);
  }
});
const dadosDisciplinas = {};
document.querySelectorAll('.disciplina-card').forEach(card => {
  const nome = card.textContent.trim();
  dadosDisciplinas[nome] = {
    professor: '',
    carga: '',
    material: [] // aqui vão os links das apostilas
  };

  card.addEventListener('click', () => {
    const dados = dadosDisciplinas[nome];

    document.getElementById('modalTitulo').textContent = `📘 ${nome}`;
    document.getElementById('modalProfessor').textContent = dados.professor || '—';
    document.getElementById('modalCarga').textContent = dados.carga || '—';

    const materialDiv = document.getElementById('modalMaterial');
    materialDiv.innerHTML = '';
    if (dados.material.length > 0) {
      dados.material.forEach(link => {
        const a = document.createElement('a');
        a.href = link;
        a.textContent = '📄 Apostila';
        a.target = '_blank';
        a.style.display = 'block';
        a.style.marginBottom = '6px';
        materialDiv.appendChild(a);
      });
    } else {
      materialDiv.textContent = 'Nenhum material disponível.';
    }

    document.getElementById('modalDisciplina').style.display = 'flex';
  });
  function fecharModal() {
    document.getElementById('modalDisciplina').style.display = 'none';
  }
   
});
document.addEventListener('click', async function (e) {
  if (e.target && e.target.id === 'baixar-pdf') {
    const original = document.getElementById('conteudo-pdf');
    if (!original) {
      alert("Nenhuma grade disponível para exportar.");
      return;
    }

    // Cria um clone visível mas invisível para o usuário
    const clone = original.cloneNode(true);
    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '800px';
    clone.style.background = 'white';
    clone.style.padding = '20px';
    clone.style.zIndex = '-1';

    document.body.appendChild(clone);

    await new Promise(resolve => setTimeout(resolve, 500)); // espera renderizar

    const opt = {
      margin: 0.5,
      filename: `Grade_${new Date().toLocaleDateString('pt-BR')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clone).save().then(() => {
      document.body.removeChild(clone);
    });
  }
});
document.addEventListener('click', async function (e) {
  if (e.target && e.target.id === 'baixar-pdf') {
    const element = document.getElementById('conteudo-pdf');
    if (!element) {
      alert("Nenhuma grade disponível para exportar.");
      return;
    }

    // Usa html2canvas para capturar a imagem
    const canvas = await html2canvas(element, { scale: 2 });

    // Converte o canvas para imagem
    const imageData = canvas.toDataURL("image/png");

    // Cria um link e simula clique para download
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `Grade_${new Date().toLocaleDateString('pt-BR')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, 100);
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function logout() {
  localStorage.clear(); // limpa todos os dados salvos do aluno
  window.location.href = "index.html"; // redireciona para a tela de login
}

function abrirFormulario() {
  document.getElementById('popupContato').style.display = 'flex';
}

function fecharFormulario() {
  document.getElementById('popupContato').style.display = 'none';
}

function enviarEmail() {
  const nome = document.getElementById('contatoNome').value;
  const email = document.getElementById('contatoEmail').value;
  const mensagem = document.getElementById('contatoMensagem').value;

  const assunto = encodeURIComponent("Solicitação de Aluno - EFAG");
  const corpo = encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`);

  window.location.href = `mailto:secretaria@escola.com?subject=${assunto}&body=${corpo}`;

  fecharFormulario();
}
