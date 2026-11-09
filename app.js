(() => {
  'use strict';

  const STORAGE_KEY = 'gabarita_submissions_v1';
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];
  const SUBJECTS = ['Sem matéria', 'Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Português', 'Literatura', 'Inglês', 'Redação', 'Artes', 'Educação Física', 'Outra'];
  const KNOWLEDGE_AREAS = [
    {name: 'Linguagens', subjects: ['Português', 'Literatura', 'Inglês', 'Redação', 'Artes', 'Educação Física'], colors: {bg:'#e4f3ff', border:'#71b1fb', ink:'#126b9f', light:'#f1fcff'}},
    {name: 'Ciências da Natureza', subjects: ['Física', 'Química', 'Biologia'], colors: {bg:'#dcfce7', border:'#4ade80', ink:'#166534', light:'#f0fdf4'}},
    {name: 'Ciências Humanas', subjects: ['História', 'Geografia', 'Filosofia', 'Sociologia'], colors: {bg:'#ffd6d5', border:'#fb523c', ink:'#9a2612', light:'#ffefed'}},
    {name: 'Matemática', subjects: ['Matemática'], colors: {bg:'#f9e6a8', border:'#d8a620', ink:'#73520b', light:'#fff8e3'}}
  ];
  const SUBJECT_COLORS = {
    'Sem matéria': {bg:'#f1f5f9', border:'#cbd5e1', ink:'#475569', light:'#f8fafc'},
    'Matemática': {bg:'#f9e6a8', border:'#d8a620', ink:'#73520b', light:'#fff8e3'},
    'Física': {bg:'#b9efd5', border:'#38a878', ink:'#176b49', light:'#effcf5'},
    'Química': {bg:'#eefecf', border:'#a7ee22', ink:'#53900e', light:'#ecfeff'},
    'Biologia': {bg:'#dcfce7', border:'#4ade80', ink:'#166534', light:'#f0fdf4'},
    'História': {bg:'#ffd6d5', border:'#fb523c', ink:'#9a2612', light:'#ffefed'},
    'Geografia': {bg:'#fbe5cc', border:'#d4862d', ink:'#5e3f11', light:'#fdf7f0'},
    'Filosofia': {bg:'#fae8ff', border:'#e879f9', ink:'#86198f', light:'#fdf4ff'},
    'Sociologia': {bg:'#fce7f3', border:'#f472b6', ink:'#9d174d', light:'#fdf2f8'},
    'Português': {bg:'#e4f3ff', border:'#71b1fb', ink:'#126b9f', light:'#f1fcff'},
    'Literatura': {bg:'#e0e7ff', border:'#8193f8', ink:'#3045a3', light:'#eef1ff'},
    'Inglês': {bg:'#e0fdfe', border:'#38f8f8', ink:'#078585', light:'#f0fffe'},
    'Redação': {bg:'#e2f6fe', border:'#71cdf8', ink:'#1b6b99', light:'#f2f9fe'},
    'Artes': {bg:'#fce7f3', border:'#f9a8d4', ink:'#9d174d', light:'#fdf2f8'},
    'Educação Física': {bg:'#d1fae5', border:'#34d399', ink:'#065f46', light:'#ecfdf5'},
    'Outra': {bg:'#e2e8f0', border:'#94a3b8', ink:'#334155', light:'#f8fafc'}
  };
  const $ = (selector) => document.querySelector(selector);
  const els = {
    setupForm: $('#setup-form'), answersForm: $('#answers-form'), examTitle: $('#exam-title'),
    questionCount: $('#question-count'), startNumber: $('#start-number'), pastedKey: $('#pasted-key'), parseKeyButton: $('#parse-key-button'), parseKeyFeedback: $('#parse-key-feedback'), keyGrid: $('#key-grid'),
    studentGrid: $('#student-grid'), subjectGrid: $('#subject-grid'), emptyBuilder: $('#empty-builder'),
    formTitle: $('#form-title'), stepPill: $('#step-pill'), backButton: $('#back-button'),
    resultStatus: $('#result-status'), resultEmpty: $('#result-empty'), resultContent: $('#result-content'),
    resultExamName: $('#result-exam-name'), reviewNoResults: $('#review-no-results'),
    resultPercent: $('#result-percent'), resultCorrect: $('#result-correct'), resultWrong: $('#result-wrong'),
    resultBlank: $('#result-blank'), resultMessage: $('#result-message'), subjectPerformanceList: $('#subject-performance-list'),
    subjectPerformanceTitle: $('#subject-performance-title'), subjectPerformanceDescription: $('#subject-performance-description'),
    subjectGroup: $('#subject-group'), subjectSort: $('#subject-sort'), reviewCount: $('#review-count'),
    reviewList: $('#review-list'), reviewSubjectFilter: $('#review-subject-filter'), scoreRing: $('#score-ring'), historyBody: $('#history-body'),
    historyEmpty: $('#history-empty'), historyCount: $('#history-count'), toast: $('#toast'),
    dialog: $('#confirm-dialog'), dialogTitle: $('#dialog-title'), dialogMessage: $('#dialog-message'),
    dialogCancel: $('#dialog-cancel'), dialogConfirm: $('#dialog-confirm'), importFile: $('#import-file'),
    correctionPanel: $('.correction-panel'), resultPanel: $('#result-panel'),
    detailHeading: $('#detail-heading'), backToHistoryButton: $('#back-to-history-button'),
    detailToolbar: $('.detail-toolbar'), newCorrectionHeading: $('#new-correction-heading')
  };

  let submissions = loadSubmissions();
  let currentDraft = null;
  let editingId = null;
  let activeResultId = null;
  let activeSubjectResults = [];
  let subjectGroup = 'subject';
  let subjectSortOrder = 'desc';
  let activeReviewFilter = 'all';
  let activeReviewSubject = 'all';
  let detailReturnScreen = 'correction';
  let toastTimeout;
  let pendingConfirm = null;

  function makeId() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`; }
  function validSubmission(item) {
    return item && typeof item.id === 'string' && Array.isArray(item.key) && Array.isArray(item.answers) && item.key.length > 0 && item.key.length === item.answers.length;
  }
  function loadSubmissions() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(data)) return [];
      return data.filter(validSubmission).map(item => ({
        ...item,
        subjects: Array.isArray(item.subjects) ? item.subjects.map(s => SUBJECTS.includes(s) ? s : 'Sem matéria') : item.key.map(() => 'Sem matéria')
      }));
    } catch (error) { console.warn('Histórico indisponível:', error); return []; }
  }
  function saveSubmissions() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions)); return true; }
    catch (error) { showToast('Não foi possível salvar. O armazenamento do navegador pode estar cheio.'); return false; }
  }
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => els.toast.classList.remove('show'), 3000);
  }
  function showScreen(screen, returnScreen = detailReturnScreen) {
    if (screen === 'detail') detailReturnScreen = returnScreen;
    document.querySelectorAll('[data-screen-panel]').forEach(panel => {
      panel.classList.toggle('hidden', panel.dataset.screenPanel !== screen);
    });
    const activeScreen = screen === 'detail' ? detailReturnScreen : screen;
    document.querySelectorAll('.nav-link[data-screen]').forEach(link => {
      const active = link.dataset.screen === activeScreen;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    els.backToHistoryButton.textContent = detailReturnScreen === 'history' ? '← Voltar ao histórico' : '← Voltar para corrigir';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  function setDetailMode(mode) {
    const editing = mode === 'edit';
    const newCorrection = editing && !editingId;
    els.correctionPanel.classList.toggle('hidden', !editing);
    els.resultPanel.classList.toggle('hidden', editing);
    els.detailToolbar.classList.toggle('hidden', newCorrection);
    els.newCorrectionHeading.classList.toggle('hidden', !newCorrection);
    els.detailHeading.textContent = editing ? (editingId ? 'Editar correção' : 'Nova correção') : 'Detalhe da correção';
  }
  function askConfirm({title, message, confirmText = 'Confirmar', danger = true, onConfirm}) {
    els.dialogTitle.textContent = title;
    els.dialogMessage.textContent = message;
    els.dialogConfirm.textContent = confirmText;
    els.dialogConfirm.className = `button ${danger ? 'button-danger' : 'button-primary'}`;
    pendingConfirm = onConfirm;
    if (typeof els.dialog.showModal === 'function') els.dialog.showModal();
    else if (window.confirm(message)) { const action = pendingConfirm; pendingConfirm = null; if (action) action(); }
  }

  function buildAnswerGrid(container, kind, count, start, values = []) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = `answer-cell ${kind === 'key' ? 'key-cell' : 'student-cell'}`;
      const label = document.createElement('label');
      label.htmlFor = `${kind}-${i}`;
      label.textContent = String(start + i);
      const select = document.createElement('select');
      select.className = 'answer-select'; select.id = `${kind}-${i}`; select.dataset.index = String(i);
      select.setAttribute('aria-label', `${kind === 'key' ? 'Gabarito oficial' : 'Sua resposta'} — questão ${start + i}`);
      const blank = document.createElement('option'); blank.value = ''; blank.textContent = '—'; select.appendChild(blank);
      LETTERS.forEach(letter => { const option = document.createElement('option'); option.value = letter; option.textContent = letter; select.appendChild(option); });
      select.value = LETTERS.includes(values[i]) ? values[i] : '';
      wrapper.append(label, select); fragment.appendChild(wrapper);
    }
    container.replaceChildren(fragment);
  }
  function subjectColors(subject) { return SUBJECT_COLORS[SUBJECTS.includes(subject) ? subject : 'Sem matéria']; }
  function subjectStyle(subject) {
    const color = subjectColors(subject);
    return `--subject-bg:${color.bg};--subject-border:${color.border};--subject-ink:${color.ink};--subject-light:${color.light}`;
  }
  function subjectTag(subject, extraClass = '') {
    const safeSubject = SUBJECTS.includes(subject) ? subject : 'Sem matéria';
    return `<span class="review-subject ${extraClass}" style="${subjectStyle(safeSubject)}">${safeSubject === 'Sem matéria' ? '○ ' : '✦ '}${escapeHTML(safeSubject)}</span>`;
  }
  function applySubjectColor(select) {
    const wrapper = select.closest('.subject-cell');
    if (!wrapper) return;
    wrapper.style.cssText = subjectStyle(select.value);
  }
  function buildSubjectGrid(count, start, values = []) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const wrapper = document.createElement('div'); wrapper.className = 'subject-cell';
      const label = document.createElement('label'); label.htmlFor = `subject-${i}`; label.textContent = `Questão ${start + i}`;
      const select = document.createElement('select'); select.id = `subject-${i}`; select.className = 'subject-select'; select.dataset.index = String(i);
      select.setAttribute('aria-label', `Matéria da questão ${start + i}`);
      SUBJECTS.forEach(subject => { const option = document.createElement('option'); option.value = subject; option.textContent = subject; select.appendChild(option); });
      select.value = SUBJECTS.includes(values[i]) ? values[i] : 'Sem matéria';
      select.addEventListener('change', () => applySubjectColor(select));
      wrapper.append(label, select); fragment.appendChild(wrapper);
      applySubjectColor(select);
    }
    els.subjectGrid.replaceChildren(fragment);
  }
  function gridValues(container) { return Array.from(container.querySelectorAll('select')).map(select => select.value); }

  // Lê pares como "01 C 19 B 37 B" e associa cada alternativa ao número da questão.
  // Assim, gabaritos organizados em várias colunas continuam na ordem numérica correta.
  function parsePastedKey(text) {
    const normalized = String(text || '').toUpperCase().replace(/\u00A0/g, ' ').trim();
    if (!normalized) return { error: 'Cole o texto do gabarito antes de importar.' };

    const pairPattern = /(?:^|[^A-Z0-9])(\d{1,4})\s*(?:[:.)\-–—]\s*)?([A-E])(?=$|[^A-Z0-9])/g;
    const numbered = new Map();
    const conflicts = [];
    let match;
    while ((match = pairPattern.exec(normalized)) !== null) {
      const number = Number(match[1]);
      const letter = match[2];
      if (!Number.isInteger(number) || number < 1 || number > 9999) continue;
      if (numbered.has(number) && numbered.get(number) !== letter) conflicts.push(number);
      else numbered.set(number, letter);
    }

    if (conflicts.length) {
      return { error: `Encontrei números com alternativas diferentes: ${[...new Set(conflicts)].sort((a,b)=>a-b).join(', ')}. Confira o texto copiado.` };
    }

    if (numbered.size) {
      const numbers = [...numbered.keys()].sort((a, b) => a - b);
      const start = numbers[0];
      const end = numbers[numbers.length - 1];
      const count = end - start + 1;
      if (count > 200) return { error: 'Esse gabarito passa de 200 questões, o limite atual do Gabarita.' };
      const key = Array.from({ length: count }, (_, index) => numbered.get(start + index) || '');
      const missing = key.map((value, index) => value ? null : start + index).filter(value => value !== null);
      return { start, count, key, mode: 'numbered', found: numbered.size, missing };
    }

    // Sem numeração, aceita somente uma sequência de alternativas isoladas ou agrupadas.
    // Não varre palavras de um parágrafo para evitar transformar letras do texto em respostas.
    if (/^[A-E\s,;|/()[\]{}.:;!?'"_–—-]+$/i.test(normalized)) {
      const key = normalized.replace(/[^A-E]/g, '').split('');
      if (key.length && key.length <= 200) {
        const start = Math.max(1, Number(els.startNumber.value) || 1);
        if (start + key.length - 1 > 9999) return { error: 'A sequência ultrapassa o número máximo de questão permitido.' };
        return { start, count: key.length, key, mode: 'sequence', found: key.length, missing: [] };
      }
    }
    return { error: 'Não consegui identificar o gabarito. Use pares como “01 C 02 D 03 A” ou cole apenas a sequência de alternativas A–E.' };
  }

  function importPastedKey() {
    const parsed = parsePastedKey(els.pastedKey.value);
    if (parsed.error) {
      els.parseKeyFeedback.textContent = parsed.error;
      els.parseKeyFeedback.className = 'parse-key-feedback error';
      showToast(parsed.error);
      return;
    }

    els.questionCount.value = String(parsed.count);
    els.startNumber.value = String(parsed.start);
    currentDraft = {
      title: els.examTitle.value.trim(),
      count: parsed.count,
      start: parsed.start,
      key: parsed.key,
      answers: Array(parsed.count).fill(''),
      subjects: Array(parsed.count).fill('Sem matéria')
    };
    editingId = null;
    renderInputs();
    els.setupForm.classList.add('hidden');
    els.emptyBuilder.classList.add('hidden');
    els.answersForm.classList.remove('hidden');
    els.formTitle.textContent = 'Gabarito importado';
    els.stepPill.textContent = 'ETAPA 2';
    $('#grade-button').innerHTML = 'Corrigir e salvar <span>→</span>';

    const missingText = parsed.missing.length
      ? ` Faltam as questões ${parsed.missing.join(', ')}; complete essas alternativas antes de salvar.`
      : '';
    const modeText = parsed.mode === 'numbered'
      ? `${parsed.found} questões identificadas por número (${parsed.start}–${parsed.start + parsed.count - 1}).`
      : `${parsed.count} alternativas importadas em sequência a partir da questão ${parsed.start}.`;
    els.parseKeyFeedback.textContent = modeText + missingText;
    els.parseKeyFeedback.className = `parse-key-feedback ${parsed.missing.length ? 'warning' : 'success'}`;
    if (parsed.missing.length) showToast(`Gabarito importado com ${parsed.missing.length} questão(ões) sem alternativa. Confira os campos vazios.`);
    else showToast('Gabarito importado! Agora preencha suas respostas.');
    $('#correcao').scrollIntoView({behavior:'smooth', block:'start'});
  }
  els.parseKeyButton.addEventListener('click', importPastedKey);

  function startNewDraft() {
    currentDraft = null; editingId = null; els.setupForm.reset();
    els.examTitle.value = ''; els.questionCount.value = '20'; els.startNumber.value = '1';
    els.pastedKey.value = ''; els.parseKeyFeedback.textContent = ''; els.parseKeyFeedback.className = 'parse-key-feedback hidden';
    els.setupForm.classList.remove('hidden'); els.answersForm.classList.add('hidden'); els.emptyBuilder.classList.remove('hidden');
    els.formTitle.textContent = 'Nova correção'; els.stepPill.textContent = 'ETAPA 1';
    $('#grade-button').innerHTML = 'Corrigir e salvar <span>→</span>';
  }
  function editSubmission(item) {
    editingId = item.id;
    currentDraft = {title:item.title || '', count:item.key.length, start:Number(item.start) || 1, key:[...item.key], answers:[...item.answers], subjects:[...(item.subjects || [])]};
    els.examTitle.value = currentDraft.title; els.questionCount.value = String(currentDraft.count); els.startNumber.value = String(currentDraft.start);
    renderInputs(); els.formTitle.textContent = 'Editar correção'; els.stepPill.textContent = 'EDIÇÃO';
    $('#grade-button').innerHTML = 'Salvar alterações <span>✓</span>';
    els.setupForm.classList.add('hidden'); els.emptyBuilder.classList.add('hidden'); els.answersForm.classList.remove('hidden');
    setDetailMode('edit');
    showScreen('detail', 'history');
  }
  function renderInputs() {
    buildAnswerGrid(els.keyGrid, 'key', currentDraft.count, currentDraft.start, currentDraft.key);
    buildAnswerGrid(els.studentGrid, 'student', currentDraft.count, currentDraft.start, currentDraft.answers);
    buildSubjectGrid(currentDraft.count, currentDraft.start, currentDraft.subjects);
  }

  els.setupForm.addEventListener('submit', event => {
    event.preventDefault();
    const count = Number(els.questionCount.value), start = Number(els.startNumber.value);
    if (!Number.isInteger(count) || count < 1 || count > 200) { showToast('Escolha entre 1 e 200 questões.'); return; }
    if (!Number.isInteger(start) || start < 1 || start + count - 1 > 9999) { showToast('Informe uma questão inicial válida.'); return; }
    const old = currentDraft;
    currentDraft = {title:els.examTitle.value.trim(), count, start, key:Array(count).fill(''), answers:Array(count).fill(''), subjects:Array(count).fill('Sem matéria')};
    if (old) for (let i=0; i<Math.min(count, old.count); i++) { currentDraft.key[i]=old.key[i] || ''; currentDraft.answers[i]=old.answers[i] || ''; currentDraft.subjects[i]=old.subjects?.[i] || 'Sem matéria'; }
    renderInputs(); els.setupForm.classList.add('hidden'); els.emptyBuilder.classList.add('hidden'); els.answersForm.classList.remove('hidden');
    els.formTitle.textContent = editingId ? 'Editar correção' : 'Preencha as respostas'; els.stepPill.textContent = editingId ? 'EDIÇÃO' : 'ETAPA 2';
    $('#correcao').scrollIntoView({behavior:'smooth', block:'start'});
  });
  els.backButton.addEventListener('click', () => {
    currentDraft.title = els.examTitle.value.trim();
    currentDraft.key = gridValues(els.keyGrid); currentDraft.answers = gridValues(els.studentGrid); currentDraft.subjects = gridValues(els.subjectGrid);
    els.setupForm.classList.remove('hidden'); els.answersForm.classList.add('hidden'); els.emptyBuilder.classList.add('hidden');
    els.formTitle.textContent = editingId ? 'Editar correção' : 'Nova correção'; els.stepPill.textContent = editingId ? 'EDIÇÃO' : 'ETAPA 1';
    $('#correcao').scrollIntoView({behavior:'smooth', block:'start'});
  });
  els.answersForm.addEventListener('submit', event => {
    event.preventDefault(); if (!currentDraft) return;
    const key = gridValues(els.keyGrid), answers = gridValues(els.studentGrid), subjects = gridValues(els.subjectGrid);
    const missing = key.findIndex(value => !LETTERS.includes(value));
    if (missing !== -1) { showToast(`Preencha o gabarito oficial da questão ${currentDraft.start + missing}.`); els.keyGrid.querySelectorAll('select')[missing].focus(); return; }
    const now = new Date().toISOString();
    const old = submissions.find(item => item.id === editingId);
    const item = {id:editingId || makeId(), title:els.examTitle.value.trim() || `Prova de ${currentDraft.count} questões`, start:currentDraft.start, key, answers, subjects, createdAt:old?.createdAt || now, updatedAt:now};
    if (old) submissions = submissions.map(entry => entry.id === editingId ? item : entry); else submissions.unshift(item);
    if (!saveSubmissions()) return;
    activeResultId = item.id; renderStats(); renderHistory(); renderResult(item);
    showToast(old ? 'Correção atualizada e salva.' : 'Correção salva no histórico!'); startNewDraft();
    setDetailMode('result');
    showScreen('detail');
  });

  function calculate(item) {
    let correct=0, wrong=0, blank=0;
    const details = item.key.map((key,i) => { const answer=item.answers[i] || ''; let status;
      if (!answer) { blank++; status='blank'; } else if (answer===key) { correct++; status='correct'; } else { wrong++; status='wrong'; }
      return {number:(Number(item.start)||1)+i, key, answer, status, subject:item.subjects?.[i] || 'Sem matéria'};
    });
    const total=item.key.length; return {correct,wrong,blank,total,percent:total ? correct/total*100 : 0,details};
  }
  function renderResult(item) {
    if (!item) {
      activeResultId = null;
      els.resultStatus.textContent = 'Aguardando';
      els.resultStatus.classList.remove('done');
      els.resultExamName.textContent = 'Selecione um gabarito para ver os detalhes';
      els.resultEmpty.classList.remove('hidden');
      els.resultContent.classList.add('hidden');
      return;
    }
    activeResultId = item.id;
    activeReviewFilter = 'all';
    const result = calculate(item);
    els.resultStatus.textContent = 'Concluído';
    els.resultStatus.classList.add('done');
    els.resultExamName.textContent = item.title || `Prova de ${result.total} questões`;
    els.resultEmpty.classList.add('hidden');
    els.resultContent.classList.remove('hidden');
    els.resultPercent.innerHTML = `${result.percent.toFixed(1).replace('.', ',')}<small>%</small>`;
    els.resultCorrect.textContent = `${result.correct}/${result.total}`;
    els.resultWrong.textContent = String(result.wrong);
    els.resultBlank.textContent = String(result.blank);
    const subjectResults = new Map();
    result.details.forEach(detail => {
      const subject = SUBJECTS.includes(detail.subject) ? detail.subject : 'Sem matéria';
      const counts = subjectResults.get(subject) || {correct: 0, total: 0};
      counts.total++;
      if (detail.status === 'correct') counts.correct++;
      subjectResults.set(subject, counts);
    });
    activeSubjectResults = [...subjectResults.entries()].map(([subject, counts]) => ({subject, ...counts}));
    renderSubjectPerformance();
    const degrees = result.percent * 3.6;
    els.scoreRing.style.background = `conic-gradient(#25b982 0deg, #25b982 ${degrees}deg, #edf0f5 ${degrees}deg 360deg)`;
    let title = 'Correção concluída!', message = 'Confira questão por questão e use o resultado para orientar seus estudos.';
    if (result.percent >= 90) { title = 'Excelente resultado!'; message = 'Seu desempenho foi muito alto. Continue com esse ritmo de estudos!'; }
    else if (result.percent >= 70) { title = 'Bom trabalho!'; message = 'Revise os erros para avançar ainda mais.'; }
    else if (result.percent >= 50) { title = 'Você está evoluindo!'; message = 'Use as questões erradas como guia para sua próxima revisão.'; }
    else { title = 'Cada erro ensina algo.'; message = 'Revise os conteúdos e tente novamente. O importante é acompanhar sua evolução.'; }
    els.resultMessage.querySelector('strong').textContent = title;
    els.resultMessage.querySelector('p').textContent = message;
    els.reviewCount.textContent = `${result.total} questões`;

    const countByStatus = result.details.reduce((counts, detail) => {
      counts[detail.status] += 1;
      return counts;
    }, {correct: 0, wrong: 0, blank: 0});
    $('[data-count="all"]').textContent = String(result.total);
    $('[data-count="correct"]').textContent = String(countByStatus.correct);
    $('[data-count="wrong"]').textContent = String(countByStatus.wrong);
    $('[data-count="blank"]').textContent = String(countByStatus.blank);

    const examSubjects = [...new Set(result.details.map(detail => detail.subject))]
      .sort((a, b) => SUBJECTS.indexOf(a) - SUBJECTS.indexOf(b));
    els.reviewSubjectFilter.innerHTML = '<option value="all">Todas as matérias</option>' +
      examSubjects.map(subject => `<option value="${escapeHTML(subject)}">${escapeHTML(subject)}</option>`).join('');
    activeReviewSubject = 'all';
    els.reviewSubjectFilter.value = 'all';

    els.reviewList.innerHTML = result.details.map(detail => {
      const statusText = detail.status === 'correct' ? '✓ Acertou' : detail.status === 'wrong' ? '✕ Errou' : '— Em branco';
      const yourAnswer = detail.answer || '—';
      const answerDescription = detail.status === 'correct' ? 'Resposta certa' : detail.status === 'wrong' ? 'Resposta diferente do gabarito' : 'Questão sem resposta';
      const subject = subjectTag(detail.subject, 'review-subject-large');
      return `<article class="review-card ${detail.status}" data-status="${detail.status}" data-subject="${escapeHTML(detail.subject)}">
        <div class="review-card-top"><span class="review-question-number">Questão ${detail.number}</span><span class="review-status ${detail.status}">${statusText}</span></div>
        <div class="review-card-subject">${subject}</div>
        <div class="review-answer-pair">
          <div class="answer-choice ${detail.status === 'correct' ? 'chosen-correct' : detail.status === 'wrong' ? 'chosen-wrong' : 'chosen-blank'}"><span>Sua resposta</span><strong>${escapeHTML(yourAnswer)}</strong></div>
          <div class="answer-choice official-answer"><span>Gabarito oficial</span><strong>${escapeHTML(detail.key)}</strong></div>
        </div>
        <div class="review-card-note ${detail.status}">${answerDescription}</div>
      </article>`;
    }).join('');
    setReviewFilter('all');
  }
  function renderSubjectPerformance() {
    const areaMode = subjectGroup === 'area';
    const direction = subjectSortOrder === 'asc' ? 1 : -1;
    const results = areaMode
      ? KNOWLEDGE_AREAS.map(area => {
        const parts = area.subjects
          .map(name => activeSubjectResults.find(result => result.subject === name))
          .filter(Boolean);
        const counts = parts.reduce((total, result) => ({correct: total.correct + result.correct, total: total.total + result.total}), {correct: 0, total: 0});
        return {subject: area.name, ...counts, colors: area.colors, parts};
      }).filter(result => result.total > 0)
      : activeSubjectResults;
    const sorted = [...results].sort((a, b) => {
      const percentageDifference = (a.correct * b.total - b.correct * a.total) * direction;
      return percentageDifference || b.correct - a.correct || a.subject.localeCompare(b.subject, 'pt-BR');
    });
    els.subjectPerformanceTitle.textContent = areaMode ? 'Desempenho por área do conhecimento' : 'Desempenho por matéria';
    els.subjectPerformanceDescription.textContent = areaMode
      ? 'Soma automática das questões de todas as matérias de cada área. “Sem matéria” e “Outra” não entram nesta visualização.'
      : 'Acertos sobre o total de questões da matéria, incluindo as em branco.';
    els.subjectPerformanceList.innerHTML = sorted.map(({subject, correct, total, colors, parts}) => {
      const percent = total ? correct / total * 100 : 0;
      const perfect = correct === total;
      const style = areaMode
        ? `--subject-bg:${colors.bg};--subject-border:${colors.border};--subject-ink:${colors.ink};--subject-light:${colors.light}`
        : subjectStyle(subject);
      const subjectLabel = areaMode
        ? `<span class="review-subject" style="${style}">✦ ${escapeHTML(subject)}</span>`
        : subjectTag(subject);
      return `<article class="subject-performance-card${perfect ? ' perfect-score' : ''}" style="${style}">
        <div class="subject-performance-top"><div class="subject-performance-subject">${subjectLabel}${perfect ? '<svg class="subject-perfect-trophy" role="img" aria-label="Aproveitamento perfeito" viewBox="0 0 24 24"><path d="M7 3h10v3h4v3a5 5 0 0 1-5 5h-.4a5 5 0 0 1-2.6 2.7V20h4v2H7v-2h4v-3.3A5 5 0 0 1 8.4 14H8a5 5 0 0 1-5-5V6h4V3Zm0 5H5v1a3 3 0 0 0 2.7 3A8 8 0 0 1 7 9V8Zm10 0v1a8 8 0 0 1-.7 3A3 3 0 0 0 19 9V8h-2Z"/></svg>' : ''}</div><strong>${percent.toFixed(1).replace('.', ',')}%</strong></div>
        <div class="subject-performance-score">${correct}/${total} <span>acertos</span></div>
        ${areaMode ? `<div class="area-breakdown">${parts.map(part => `<span>${escapeHTML(part.subject)} <b>${part.correct}/${part.total}</b></span>`).join('')}</div>` : ''}
        <div class="subject-performance-track" role="img" aria-label="${correct} de ${total} acertos, ${percent.toFixed(1).replace('.', ',')}%">
          <span style="width:${percent}%"></span>
        </div>
      </article>`;
    }).join('');
  }
  els.subjectGroup.addEventListener('change', () => {
    subjectGroup = els.subjectGroup.value;
    renderSubjectPerformance();
  });
  els.subjectSort.addEventListener('change', () => {
    subjectSortOrder = els.subjectSort.value;
    renderSubjectPerformance();
  });
  function applyReviewFilters() {
    let visible = 0;
    els.reviewList.querySelectorAll('.review-card').forEach(card => {
      const matchesStatus = activeReviewFilter === 'all' || card.dataset.status === activeReviewFilter;
      const matchesSubject = activeReviewSubject === 'all' || card.dataset.subject === activeReviewSubject;
      const show = matchesStatus && matchesSubject;
      card.classList.toggle('filtered-out', !show);
      if (show) visible++;
    });
    els.reviewNoResults.classList.toggle('hidden', visible > 0);
  }
  function setReviewFilter(filter) {
    activeReviewFilter = filter;
    document.querySelectorAll('.review-filter').forEach(button => button.classList.toggle('active', button.dataset.filter === filter));
    applyReviewFilters();
  }
  els.reviewSubjectFilter.addEventListener('change', () => {
    activeReviewSubject = els.reviewSubjectFilter.value;
    applyReviewFilters();
  });
  document.querySelectorAll('.review-filter').forEach(button => {
    button.addEventListener('click', () => setReviewFilter(button.dataset.filter));
  });
  function formatDate(value) { const date=new Date(value); if(Number.isNaN(date.getTime())) return '—'; return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(date).replace(/ de /g,' ').replace(/\./g,''); }
  function renderStats() {
    $('#stat-total').textContent=String(submissions.length);
    if(!submissions.length){$('#stat-average').innerHTML='—<small>%</small>';$('#stat-best').innerHTML='—<small>%</small>';$('#stat-best-caption').textContent='Seu recorde pessoal';return;}
    const results=submissions.map(item=>({item,...calculate(item)})); const avg=results.reduce((sum,r)=>sum+r.percent,0)/results.length; const best=results.reduce((max,r)=>r.percent>max.percent?r:max,results[0]);
    $('#stat-average').innerHTML=`${avg.toFixed(1).replace('.',',')}<small>%</small>`; $('#stat-best').innerHTML=`${best.percent.toFixed(1).replace('.',',')}<small>%</small>`; $('#stat-best-caption').textContent=best.item.title || 'Seu recorde pessoal';
  }
  function renderHistory() {
    const sorted = [...submissions].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    els.historyBody.innerHTML = sorted.map(item => {
      const result = calculate(item), pct = result.percent;
      const scoreClass = pct >= 70 ? '' : pct >= 50 ? 'mid' : 'low';
      const subjects = [...new Set((item.subjects || []).filter(subject => subject && subject !== 'Sem matéria'))];
      const subjectTags = subjects.length
        ? `${subjects.slice(0, 5).map(subject => subjectTag(subject, 'history-subject-tag')).join('')}${subjects.length > 5 ? `<span class="subject-overflow">+${subjects.length - 5}</span>` : ''}`
        : subjectTag('Sem matéria', 'history-subject-tag');
      return `<article class="history-card" data-id="${escapeHTML(item.id)}">
        <div class="history-card-top"><div class="exam-icon">▤</div><div class="history-card-title"><h3 title="${escapeHTML(item.title || '')}">${escapeHTML(item.title || `Prova de ${result.total} questões`)}</h3><p>${escapeHTML(formatDate(item.updatedAt || item.createdAt))} · ${result.total} questões · começa na ${Number(item.start) || 1}</p></div><span class="score-pill ${scoreClass}">${result.correct}/${result.total}</span></div>
        <div class="history-score-row"><strong>${pct.toFixed(1).replace('.', ',')}%</strong><div class="history-progress-track"><div class="history-progress-fill" style="width:${pct}%"></div></div><span>${result.correct} certas · ${result.wrong} erradas · ${result.blank} em branco</span></div>
        <div class="history-subject-tags">${subjectTags}</div>
        <div class="history-card-actions"><button class="row-action view" type="button" data-action="view">Ver gabarito completo <span>→</span></button><button class="row-action" type="button" data-action="edit">Editar</button><button class="row-action delete" type="button" data-action="delete">Excluir</button></div>
      </article>`;
    }).join('');
    els.historyEmpty.classList.toggle('hidden', submissions.length > 0);
    els.historyBody.classList.toggle('hidden', submissions.length === 0);
    els.historyCount.textContent = `${submissions.length} ${submissions.length === 1 ? 'correção salva' : 'correções salvas'}`;
  }
  els.historyBody.addEventListener('click', event => {
    const card = event.target.closest('.history-card[data-id]');
    if (!card) return;
    const button = event.target.closest('button[data-action]');
    const item = submissions.find(entry => entry.id === card.dataset.id);
    if (!item) return;
    const action = button ? button.dataset.action : 'view';
    if (action === 'view') {
      renderResult(item);
      setDetailMode('result');
      showScreen('detail', 'history');
    }
    if (action === 'edit') editSubmission(item);
    if (action === 'delete') askConfirm({
      title: 'Excluir este envio?',
      message: `“${item.title}” será removido do histórico. Essa ação não pode ser desfeita.`,
      confirmText: 'Excluir envio',
      onConfirm: () => {
        submissions = submissions.filter(entry => entry.id !== item.id);
        saveSubmissions();
        if (activeResultId === item.id) renderResult(null);
        renderStats(); renderHistory(); showToast('Envio excluído do histórico.');
      }
    });
  });
  $('#start-correction-button').addEventListener('click',()=>{
    startNewDraft();
    setDetailMode('edit');
    showScreen('detail', 'correction');
  });
  $('#new-correction-button').addEventListener('click',()=>{
    startNewDraft();
    setDetailMode('edit');
    showScreen('detail', 'correction');
  });
  $('#detail-edit-button').addEventListener('click',()=>{
    const item = submissions.find(entry => entry.id === activeResultId);
    if (item) editSubmission(item);
  });
  els.backToHistoryButton.addEventListener('click',()=>showScreen(detailReturnScreen));
  $('#clear-history-button').addEventListener('click',()=>{
    if(!submissions.length){showToast('Seu histórico já está vazio.');return;}
    askConfirm({title:'Apagar todo o histórico?',message:'Todos resultados salvos neste navegador serão removidos. Considere exportar uma cópia antes.',confirmText:'Apagar tudo',onConfirm:()=>{submissions=[];saveSubmissions();renderStats();renderHistory();renderResult(null);showToast('Histórico apagado.');}});
  });
  $('#export-button').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify({app:'Gabarita',version:2,exportedAt:new Date().toISOString(),submissions},null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob), link=document.createElement('a');link.href=url;link.download=`gabarita-historico-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);showToast('Histórico exportado.');
  });
  $('#import-trigger').addEventListener('click',()=>els.importFile.click());
  els.importFile.addEventListener('change',async()=>{
    const file=els.importFile.files?.[0];if(!file)return;
    try{
      const parsed=JSON.parse(await file.text()), incoming=Array.isArray(parsed)?parsed:parsed.submissions;
      if(!Array.isArray(incoming))throw new Error('Formato inválido');
      const clean=incoming.filter(validSubmission).map(item=>({id:typeof item.id==='string'?item.id:makeId(),title:String(item.title||`Prova de ${item.key.length} questões`).slice(0,80),start:Math.max(1,Number(item.start)||1),key:item.key.map(v=>LETTERS.includes(v)?v:''),answers:item.answers.map(v=>LETTERS.includes(v)?v:''),subjects:item.key.map((_,i)=>SUBJECTS.includes(item.subjects?.[i])?item.subjects[i]:'Sem matéria'),createdAt:item.createdAt||new Date().toISOString(),updatedAt:item.updatedAt||item.createdAt||new Date().toISOString()})).filter(item=>item.key.every(Boolean));
      if(!clean.length)throw new Error('Nenhum envio válido');
      askConfirm({title:'Importar histórico?',message:`${clean.length} envio(s) válido(s) encontrado(s). Registros com o mesmo ID serão atualizados e os demais adicionados.`,confirmText:'Importar',danger:false,onConfirm:()=>{const map=new Map(submissions.map(item=>[item.id,item]));clean.forEach(item=>map.set(item.id,item));submissions=Array.from(map.values()).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));if(saveSubmissions()){renderStats();renderHistory();showToast(`${clean.length} envio(s) importado(s).`);}}});
    }catch(error){showToast('Não foi possível importar. Selecione um JSON exportado pelo Gabarita.');}finally{els.importFile.value='';}
  });
  els.dialogCancel.addEventListener('click',()=>{pendingConfirm=null;els.dialog.close();});
  els.dialogConfirm.addEventListener('click',()=>{const action=pendingConfirm;pendingConfirm=null;els.dialog.close();if(action)action();});
  els.dialog.addEventListener('click',event=>{if(event.target===els.dialog)els.dialog.close();});
  document.querySelectorAll('[data-screen]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    if (link.dataset.screen === 'correction') {
      $('#start-correction-button').click();
      return;
    }
    showScreen(link.dataset.screen);
  }));
  $('#home-start-correction-button').addEventListener('click',()=>{
    $('#start-correction-button').click();
  });
  $('#home-open-history-button').addEventListener('click',()=>showScreen('history'));
  renderStats();renderHistory();
})();
