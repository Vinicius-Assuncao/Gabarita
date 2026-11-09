# 📚 Gabarita

> 🎯 Corrija vestibulares e simulados, compare suas respostas com o gabarito oficial e acompanhe seu desempenho por matéria e área do conhecimento.

O **Gabarita** é uma aplicação web que roda inteiramente no navegador. Você monta ou importa o gabarito oficial, preenche suas respostas e recebe a correção automática, com estatísticas detalhadas e um histórico que fica salvo no seu próprio computador.

---

## ✨ Funcionalidades

- 🏠 **Tela inicial** com atalhos para começar uma correção ou abrir o histórico
- ✏️ **Correção automática** das respostas, comparando cada alternativa com o gabarito
- 📥 **Importação do gabarito por texto**: cole o gabarito oficial e o sistema preenche as questões. Ele reconhece pares como `01 C 19 B 37 B 55 A`, mesmo quando o material está em colunas
- 🔤 **Sequência de alternativas**: também aceita apenas a sequência A–E, separada por espaços ou vírgulas, a partir de uma numeração inicial configurável
- 🎨 **Organização por matéria**: cada questão pode ser classificada com cores próprias (Matemática, Física, História, Redação e outras)
- 📊 **Resumo por matéria ou área do conhecimento**: acertos e porcentagem, com ordenação, desempate pelo total de acertos e destaque para 100% de acerto
- 🔍 **Filtros de revisão**: veja todas as questões, apenas as acertadas, apenas as erradas ou apenas as em branco
- 🃏 **Cartões de comparação** entre sua resposta e o gabarito oficial
- 🗂️ **Histórico de correções** com estatísticas gerais, prévia das respostas, revisão completa, edição e exclusão
- 💾 **Exportação e importação** do histórico em JSON, para backup ou para usar em outro navegador
- 📱 **Layout responsivo** para desktop e celular

---

## 🛠️ Tecnologias

- 🌐 **HTML5** para a estrutura da aplicação
- 🎨 **CSS3** para o layout e o visual, em um único arquivo `styles.css`
- ⚡ **JavaScript (ES6+)** puro, sem frameworks, em `app.js`
- 🔤 **Google Fonts** (DM Sans e Manrope) para a tipografia
- 💽 **localStorage** do navegador para salvar o histórico

Não há dependências para instalar nem etapa de build.

---

## 🚀 Hospedagem

Aplicação hospedada estaticamente no GitHub Pages, no link:
- https://viniciusassuncaosantos.github.io/Gabarita/

---

## 🗄️ Armazenamento dos dados

🔒 Todos os dados ficam no **localStorage** do navegador, usando a chave `gabarita_submissions_v1`. Nada é enviado para servidores.

⚠️ Os dados são vinculados ao navegador e ao endereço em que a aplicação foi aberta. Para não perder seu histórico, use **Exportar cópia** antes de trocar de navegador, limpar os dados ou mover os arquivos. Para restaurar, use **Importar**.

---

## 📁 Estrutura do projeto

```
Gabarita/
├── index.html        # Estrutura da aplicação
├── app.js            # Lógica: correção, histórico, estatísticas e importação/exportação
├── styles.css        # Estilos e layout responsivo
├── logo_gabarita.png # Logo e favicon
├── README.md
└── LICENSE           # MIT
```

## 👨‍💻 Autor

**Vinícius Assunção** 🎓
[GitHub](https://github.com/ViniciusAssuncaoSantos)
