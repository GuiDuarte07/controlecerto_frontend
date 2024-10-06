# Controle Certo

## Sobre

Controle Certo é um aplicativo de gerenciamento de despesas/receitas, o objetivo desse site é permitir um controle maior dos gastos do usuário, afim de melhorar a saúde financeira do mesmo.
O diferencial do Controle Certo é sua interface amigável e de fácil compreensão.
Nesse site é possível registrar suas contas, cartões e separar suas receitas e despesas por categorias, sendo possível também ter um controle das faturas dos cartões cadastrados.

## Detalhes Tecnicos

A API do sistema é desenvolvida usando .NET Framework junto com o Entity Framework Core para gerenciamento de queries do banco de dados.
As rotas de autentificação, login entre outras foram implementadas a mão, o que permite total liberdade para gerenciar os dados dos usuários como também para implementações futuras.
O projeto também tem integração com SMTP (Simple Mail Transfer Protocol) para envio de e-mail para os usuários, como confirmação de e-mail e esqueci minha senha.
RabbitMQ (mensageria assíncrona) através do MassTransit: a intenção por trás do uso do RabbitMQ, será principalmente na parte de geração de relatórios do sistema que ainda não foi desenvolvida, o intuito é evitar uso excessivo de mémoria e processamento do servidor e dar prioridade às operações cotidianas mais essencias como lançamento de transações. No momento o RabbitMQ está sendo usado na criação de filas para envio de E-mails.
Por fim, também foi usado o Redis (Cache em memória) para armazenamento de dados voláteis, tal como refresh tokens, tokens temporários (confirmação de e-mail e recuperação de senha), ou seja, dados que tem uma valididade, ao fazer isso, disponso a necessidade de criar rotinas para apagar esses dados do meu banco de dados. Será usado futuramente também para melhorar a performace do site mantendo alguns dados mais solicitados já preparados em memória.
Referente a parte do Front End do aplicativo, ela foi desenvolvida usando Angular 17, Tailwind CSS e Material UI, a vantagem de usar Angular é que ele despensa a necessidade de usar bibliotecas para controlar requisições ao back-end, para formulários etc. o Angular já fornece tudo isso e mais built-in.

Esse aplicativo foi desenvolvido usando tudo o que conheço sobre desenvolvimento e organizaçao de software, como ainda tenho muito a aprender sobre desenvolvimento, esse é um projeto que será melhorado sempre que eu aprender algo novo.

## Fluxograma

O primeiro passo ao acessar o site Controle Certo, é criar uma conta, digíte seu nome, email e uma senha, assim que concluir o cadastro você já poderá fazer o login ou poderá confirmar seu e-mail a partir de um e-mail que é enviado para o endereço do cadastro.
Ao fazer o login você já terá acesso a todas as funcionalidades do sistema, para cadastrar um lançamento, é necessário primeiro ter uma conta, então navegue até a página de Cadastros e clique em adicionar uma conta. Caso queira também cadastrar os gastos via cartão, o caminho é Cadastros -> Cartões, e a terceira opção seria a de categórias, onde você pode criar uma nova categoria ou visualizar e editar as existentes.

## Imagens
<img src="https://github.com/user-attachments/assets/a97a161c-51a7-4719-9505-b4ff953d8b4a" alt="Imagem 1" width="400"/>
<img src="https://github.com/user-attachments/assets/23e830b1-66ce-48ed-9660-4d24ff3265ae" alt="Imagem 2" width="400"/>
<img src="https://github.com/user-attachments/assets/a4a65f38-1297-4aae-a26b-11fdb17e8950" alt="Imagem 3" width="400"/>
<img src="https://github.com/user-attachments/assets/eea922e5-d67b-4d0f-97be-4890fe6453d5" alt="Imagem 4" width="400"/>

## Objetivos Futuros
Tenho a intenção de fazer com que esse seja meu projeto principalmente, então estarei constantemente o aperfeiçoando.
Algumas melhorias que já estão programadas para acontecer:
- Aba de relatórios de lançamentos, com filtros de conta, categorias etc.
- Lançamentos recorrentes (diarios, semanais, mensais)
- Alertas como contas a pagar, faturas encerradas etc.
- Tradução para o inglês
- Logs de aplicação para resolução de bugs
- Testes automatizados




