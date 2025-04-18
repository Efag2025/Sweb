const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Aluno';
document.getElementById('titulo-bemvindo').textContent = `Bem-vindo, ${nomeUsuario}`;
document.getElementById('nomeAluno').textContent = nomeUsuario;

function showSection(id) {
  const sections = ['info', 'disciplinas', 'notas', 'grade'];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = 'none';
  });

  const sectionToShow = document.getElementById(id);
  sectionToShow.style.display = 'block';

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

function logout() {
  localStorage.removeItem('nomeUsuario');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const aulas = {
    "2025-04-18": [
      { materia: "Matemática", horario: "08:00 - 09:30" },
      { materia: "História", horario: "10:00 - 11:30" }
    ],
    "2025-04-19": [
      { materia: "Educação Física", horario: "08:00 - 09:30" }
    ]
  };

  const calendar = new FullCalendar.Calendar(calendarEl, {
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
      container.innerHTML = '';
      if (aulasDoDia) {
        aulasDoDia.forEach(aula => {
          const el = document.createElement('div');
          el.innerHTML = `<strong>${aula.materia}</strong> - ${aula.horario}`;
          el.style.marginBottom = '10px';
          container.appendChild(el);
        });
      } else {
        container.innerHTML = 'Nenhuma aula marcada para este dia.';
      }
    }
  });

  calendar.render();
});
