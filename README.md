# Gabarita — Correção de vestibulares e simulados

## Como abrir
1. Extraia a pasta `gabarita-site`.
2. Abra `index.html` no navegador.
3. Para atualizar uma instalação que já tem histórico, substitua `index.html`, `styles.css` e `app.js` **na mesma pasta em que você já abre o site**.

## Histórico
As provas ficam salvos no armazenamento local do navegador (`localStorage`), usando a chave `gabarita_submissions_v1`. Esta versão mantém a mesma chave e o mesmo formato dos registros, e não apaga o histórico automaticamente.

Como precaução, use **Exportar cópia** no histórico antes de substituir os arquivos. Se você abrir a aplicação em outro caminho ou navegador, o armazenamento local pode ser diferente; nesse caso, use **Importar** para recuperar uma cópia JSON exportada anteriormente.

## Recursos
- Tela inicial com atalhos para começar uma correção ou abrir o histórico; navegação separada para corrigir gabaritos e consultar estatísticas e correções anteriores. Correções abertas ou editadas aparecem em uma tela de detalhe com opção de voltar.
- Correção automática das respostas.
- Organização opcional de cada questão por matéria, com cores próprias.
- Resumo de acertos e porcentagem por matéria em cada prova corrigida, com ordenação, desempate pelo total de acertos e destaque para matérias com 100% de acertos.
- Cartões maiores para comparar sua resposta ao gabarito oficial.
- Filtros para ver todas as questões, apenas as acertadas, erradas ou em branco.
- Histórico de correções com estatísticas gerais, prévia das respostas, opção de abrir a revisão completa, editar e excluir.
- Exportação e importação do histórico em JSON.

## Importar gabarito por texto

Na primeira etapa da correção, cole o texto do gabarito na área **Já tem o gabarito em texto?** e clique em **Ler e preencher**. Quando o texto contém pares como `01 C 19 B 37 B 55 A`, o Gabarita usa os números para colocar cada alternativa na questão correta, mesmo quando o material está organizado em colunas. Questões com numeração ausente ficam vazias para você revisar antes de salvar.

Também é possível colar somente uma sequência de alternativas A–E separadas por espaços ou vírgulas. Nesse caso, a sequência segue a numeração inicial configurada no formulário.
