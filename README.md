# 📚 Gabarita

> 🎯 Corrija vestibulares e simulados, compare suas respostas com o gabarito oficial e acompanhe seu desempenho por matéria e área do conhecimento.

O **Gabarita** é uma aplicação web que permite corrigir vestibulares e simulados diretamente pelo navegador. Você pode montar ou importar o gabarito oficial, preencher suas respostas e receber a correção automática, acompanhada de estatísticas detalhadas e um histórico de desempenho.

A aplicação oferece armazenamento local e integração com o **Supabase**, permitindo que usuários autenticados salvem suas correções em uma conta pessoal e acessem seus históricos em diferentes dispositivos.

---

## ✨ Funcionalidades

- 🏠 **Tela inicial** com atalhos para começar uma correção ou abrir o histórico
- ✏️ **Correção automática** das respostas, comparando cada alternativa com o gabarito
- 📥 **Importação do gabarito por texto**: cole o gabarito oficial e o sistema preenche as questões. Ele reconhece pares como `01 C 19 B 37 B 55 A`, mesmo quando o material está em colunas
- 🔤 **Sequência de alternativas**: também aceita apenas a sequência A–E, separada por espaços ou vírgulas, a partir de uma numeração inicial configurável
- 🎨 **Organização por matéria**: cada questão pode ser classificada com cores próprias (Matemática, Física, História, Português e outras)
- 📊 **Resumo por matéria ou área do conhecimento**: acertos e porcentagem, com ordenação, desempate pelo total de acertos e destaque para 100% de acerto
- 🔍 **Filtros de revisão**: veja todas as questões, apenas as acertadas, apenas as erradas ou apenas as em branco
- 🃏 **Cartões de comparação** entre sua resposta e o gabarito oficial
- 🗂️ **Histórico de correções** com estatísticas gerais, prévia das respostas, revisão completa, edição e exclusão
- 💾 **Exportação e importação** do histórico em JSON, para backup ou para usar em outro navegador
- 🔐 **Login com Google**: autenticação opcional para vincular o histórico de correções a uma conta pessoal
- ☁️ **Sincronização na nuvem**: usuários autenticados podem salvar e acessar suas correções em diferentes dispositivos
- 📱 **Layout responsivo** para desktop e celular

---

## 🛠️ Tecnologias

- 🌐 **HTML5** para a estrutura da aplicação
- 🎨 **CSS3** para o layout e o visual, em um único arquivo `styles.css`
- ⚡ **JavaScript (ES6+)** puro, sem frameworks, em `app.js`
- 🔤 **Google Fonts** (DM Sans e Manrope) para a tipografia
- 💽 **localStorage** do navegador para armazenamento local e funcionamento sem autenticação
- 🗄️ **Supabase** como backend, utilizando PostgreSQL para armazenar as correções dos usuários
- 🔑 **Google OAuth** por meio do Supabase Auth para autenticação das contas
- 🔒 **Row Level Security (RLS)** para garantir que cada usuário tenha acesso somente às próprias correções

Não há dependências para instalar nem etapa de build.

---

## 🚀 Hospedagem

Aplicação hospedada estaticamente no GitHub Pages:

- https://vinicius-assuncao.github.io/Gabarita/

A aplicação utiliza o Supabase como serviço externo de autenticação e armazenamento, mantendo a hospedagem do frontend independente do backend.

---

## 🗄️ Armazenamento dos dados

O Gabarita oferece duas modalidades de armazenamento:

**💻 Armazenamento local**

Por padrão, a aplicação funciona sem necessidade de criar uma conta. As correções são armazenadas no `localStorage` do navegador, permitindo utilizar todas as funcionalidades mesmo sem autenticação.

**☁️ Armazenamento na nuvem**

Ao entrar com uma conta Google, o usuário pode vincular suas correções ao perfil pessoal. Os dados são armazenados no Supabase e ficam associados à identificação da conta autenticada, permitindo acessar o histórico em diferentes dispositivos.

O login é totalmente opcional: quem preferir continuar utilizando somente o armazenamento local não precisa criar uma conta.

A integração também permite aproveitar o histórico já existente no navegador ao realizar a primeira autenticação.

---

## 📁 Estrutura do projeto

```text
Gabarita/
├── index.html             # Estrutura da aplicação
├── app.js                 # Lógica: correção, histórico, estatísticas e sincronização
├── styles.css             # Estilos e layout responsivo
├── supabase-config.js     # Configuração da conexão com o Supabase
├── supabase/
│   └── schema.sql         # Estrutura do banco de dados e políticas RLS
├── README.md
├── CONFIGURACAO_SUPABASE.md
├── logo_gabarita.png      # Logo e favicon
└── LICENSE               # MIT
```

## 👨‍💻 Autor

**Vinícius Assunção** 🎓

[GitHub](https://github.com/ViniciusAssuncaoSantos)