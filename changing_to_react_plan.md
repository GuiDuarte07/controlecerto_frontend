# Adaptando repositório para React

Nome do aplicativo: Controle-certo 

## Objetivo
Este repositório usa Angular, tailwind CSS, primeNG para criar um sistema web de gerenciamento financeiro, tendo direito a criação de transações fiscais (receitas, despesas, créditos), categorias de transações, contas, cartões, investimentos etc. Por problemas de se adaptar com o primeNG e seu visual, quero iniciar nesse sistema uma adaptação para transforma-lo em um sistema baseado no React usando bibliotecas do react como Nextjs (mais recente) Zustand, tanstack, react-hook-form, shadcn/ui e tailwindcss.

## Etapas
Ao realizar a adaptação do projeto Angular para React, é importante lembrar de adaptar a organização do sistema (e aperfeiçoar ela) e separar corretamente as dependencias. O sistema precisará ser organizado por modulos, por exemplo, módulo de login/registro onde terá as paginas, serviços, componentes, models referentes a login/registro, módulo transactions, módulo categories e por ai vai, sempre mantendo tudo em inglês, menos o que é lido pelo usuário final. Em relação a textos, nesse caso, irei solicitar o uso de alguma plataforma como o i18n, no momento, só terá a versão português do sistema, mas é legal ter a opção de adicionar mais idiomas futuramente.

Quero que durante o desenvolvimento, nunca esqueça que o que está sendo feito aqui é um sistema profissional que precisa ter uma organização excelente, precisa pensar em necessidades futuras e precisa ter um apelo visual forte.
Tente ao máximo adaptar as coisas do Angular para o React mas melhorando a interface grafica usando sempre que possível os componentes do shadcn e claro, precisa ter um UI/UX adaptado para telas grandes, telas pequenas e médias.

toda a câmada de comunicação com o back-end, é interessante que ela seja isoladas dentro dos módulos usando algo parecido com o que o Angular faz com seus services, não precisa usar Rxjs para isso, apenas entenda que você precisa criar essa comunicação de forma isolada e reutilizavel, da mesma forma o contexto da aplicação, precisa ser isolada por módulos, precisa ser dinamica quando necessário e reutilizável. Use Zustand, query stack ou que mais precisar para criar essa arquitetura de services. 

Crie equivalantes de guards para gerenciar a autentificação no sistema.

## Identificação visual do sistema

Como dito você vai usar o shadcn para criar a interface do sistema, use sempre que possível seus componentes e para cada componente a ser usada, faça a instalação do mesmo via a cli do shadcn, não crie os componentes manualmente.

Para cores, minha recomendação será usar essa paleta de cores:

#26532b
#399E5A
#5ABCB9
#63E2C6
#6EF9F5

Ordenado da cor mais forte para a mais fraca

Porém caso achar que deva adaptar a paleta, sinta-se a vontade, só recomendo que dê titulos e salva como variaveis globais para possíveis alterações no futuro, apesar de que não sei se o shadcn permite esse tipo de personalização.

Lembrando que o sistema deve possuir uma versão light e uma versão dark da sua interface!

## Implentação de cada módulo

Agora vamos descrever o que você precisa fazer por módulos.

### Login e registro
src\app\pages\login

![Design Reference](https://cdn.dribbble.com/userupload/12425940/file/original-4dd109542caca1adc9ceb53815205c73.png?resize=1600x1200&vertical=center)

Exemplo de como pode ficar a tela de login/registro

Aqui, vai ter algumas páginas, a tela de login (/login) a tela de registro (/register) e a tela de esqueci minha senha (src/app/pages/forgot-password).

Na tela de login, o sistema deve pedir E-mail e Senha, e na de registro, deve pedir também o Nome do usuário.

Já a tela de esqueci minha senha, leia o codigo html e ts dele para entender como funciona, ele precisa de um token que vem da url e precisa validar se ainda não expirou o token etc. no fim é uma tela de esqueci minha senha como qualquer outra, só mantenha um padrão visual entre todas as telas.

```typescript
  user: InfoUserResponse;
  accessToken: string;
  refreshToken: string;
```

### Transactions
\src\app\pages\transactions

Esse módulo será responsável por listar todas as transações, criar, editar e remover transações existentes.

No momento ela funciona apenas listando transações mês a mês, mas eu quero que dentro dos filtros, exista as opções de listar por mês, ano e personalizado. Os filtros dessa tela estão horríveis, quero que você crie uma solução para deixar os filtros mais apresentaveis em tela e ter filtros rápidos (passar e voltar o mês, filtrar por conta e categoria) e os filtros mais completos que eu vou poder pesquisar por texto, ordenar por data, tipo, e por ai vai, seja livre para decidir quais filtros podem ser importantes para o usuário, no momento esses filtros estão sendo via client-side, filtrando ali no arraay que o back-end mesmo retorna, mas faça essas adaptações esperando que elas sejam feitas no back-end, pode enviar todos os filtros como query-params para ser recebido no back-end, posteriomente eu irei adaptar a rota de get transactions para aceitar e trabalhar em cima desses filtros, então os filtros tem que ser dinamico, marquei alguma coisa ele, automaticamente tem que solicitar o back-end.

Vai ser necessário também que eu possa marcar transaçõe na lista de transações, isso vai servir para eu poder excluir mais de uma transação por vêz e também para trabalhar no demonstrativo de saldo. O demonstrativo de saldo funciona como uma referencia para o usuário do total que existe ali naquelas transações, total receita, total despesa, total fatura. e quando eu marco as transações, esses totais tem que somar somente as transações que eu marquei na checkbox.

Lembrando também que existe as faturas, no caso a fatura quando eu clico nela, lista as despesas que existem para aquela fatura naquele cartão, podendo ter mais de uma fatura na tela. Aqui, no momento ela está sendo trabalhada como faturas por mês, então como eu quero adaptar a tela para eu personalizar essa questão da listagem, não vai mais ser possível listar por mês, ainda não tenho a certeza de qual a melhor solução para isso, mas por enquanto, acho que vou apenas retornar invoices quando for filtro mensal (valor padrão do filtro) e quando for selecionado outros tipos de cobertura, eu ignoro os invoices (deixar claro isso para o usuário).

A visualização dos itens precisa ser:
uma esfera com a cor e o ícone da categoria seguido do nome da transação, depois o banco a que ela pertence, data e o valor da transação, está assim por enquanto, sinta-se a vontade para adaptar da forma que achar mais bonito.

Ao clicar nela eu preciso vizualizar os demais dados: destino/origem, tipo (receita, despesa, cartao etc), Observações... e ter as opções de excluir e editar.

A tela de criar/editar deverá ser um modal, esse modal exite em: src\app\components\dialogs\transaction-dialog

Ele deverá servir para criar e editar transações, aqui, o apelo visual precisa ser forte, ele vai precisar ter os seguintes dados:

Valor, data, categoria, conta, descrição, destino e observações.

Categoria e conta, precisam ser dropdown que aceitam pesquisa por texto e que cada item do dropdown tenha antes do nome um iconezinho mostrando a cor e o icone daquela categoria ou conta, como conta nao tem icone ainda, pode escolher um icone padrão para eles, mas cor existe.

Para o caso de despesa de cartão, existe diferenças, porque nele eu tenho um campo de parcelas e outro que mostra quanto vai ficar o valor por parcela e no lugar de contas, eu seleciono cartão, então sinta-se a vontade caso queria criar um modal separado só para a criação de despesas de cartão. Eu quero que vocÊ adiciona a opção de eu colocar o valor inteiro e as parcelas ou então eu adicionar o valor por parcela e no final ele enviar o valor final + parcelas, isso para o usuário ter as duas opções de preencher os dados.

```typescript
  id: number;
  type: TransactionTypeEnum;
  amount: number;
  purchaseDate: Date;
  description: string;
  observations?: string;
  destination?: string;
  justForRecord: boolean;
  account: AccountInfo;
  category?: Category;
  creditPurchase?: InfoCreditPurchaseResponse;
```

### Accounts
src\app\pages\accounts

A tela de contas deve ter uma lista das contas existentes mostrado ícone com cor, nome e saldo atual. Para cada conta eu devo ter a opção de editar e desativar a mesma.

Também precisa ter um botão de criar nova conta.

No modal de criar conta, eu preciso selecionar a cor da conta, saldo inicial, nome e descrição.

```typescript
  id: number;
  balance: number;
  description: string;
  bank: string;
  accountType: AccountTypeEnum;
  color: string;
```

### Credit Cards
src\app\pages\creditcards
src\app\pages\creditcard-details

Aqui, precisa listar os cartões cadastrados com nome (banco) credito usado e credito disponivel.

Para criar um novo cartão, eu preciso preencher limite do cartão, conta do cartão (só pode existir um cartão por conta, então precisaria listar somente as contas que ainda não tem cartão, veja no código), dia de vencimento e nome.

Ao clicar nos cartões, eu vou para uma nova tela onde mostra mais detalhes daquele cartão e eu posso pesquisar por faturas.

```typescript
  id: number;
  totalLimit: number;
  usedLimit: number;
  description: string;
  dueDay: number;
  closeDay: number;
  account: AccountInfo;
```

```typescript
  id: number;
  totalAmount: number;
  totalInstallment: number;
  installmentsPaid: number;
  purchaseDate?: Date;
  paid: boolean;
  destination: string;
  description?: string;
  creditCardId: number;
```

### Invoices
src\app\pages\invoices

A tela de invoice, vai mostrar os dados de uma fatura em especifico, vai motrar qual o cartão, a conta, se a fatura está paga, pendente, atrasada etc, mostra o dia de fechamento, vencimento, valor total, valor pago e depois mostrar os lançamentos que existem para aquela fatura.

```typescript
  id: number;
  totalAmount: number;
  totalPaid: number;
  isPaid: boolean;
  invoiceDate: Date;
  closingDate: Date;
  dueDate: Date;
  creditCard: CreditCardInfo;
  transactions?: InfoTransactionResponse[];
  invoicePayments?: InfoInvoicePaymentResponse[];
```

### Categories
src\app\pages\categories

Categorias podem ser de despesa e receita e eu posso ter sub-categorias, ou seja, eu posso criar uma categoria e definir que ele seja sub-categoria de uma categoria existente ou que não seja sub-categoria de ninguém (pai).

no modal de criação de categoria eu tenho que preencher: 
- Cor
- Icone
- Nome
- Tipo (Despesa e Receita)
- sub-categoria?
- Limite mensal?

```typescript
id: number;
  name: string;
  icon: string;
  billType: BillTypeEnum;
  color: string;
  limit: number;
  subCategories: Category[];
```


### Investiments
src\app\pages\investments

Essa tela é uma tela onde eu posso cadastrar investimentos e gerenciar eles, a tela inicial deve ter a lista de investimentos mostrando os dados mais importantes e também um indicador para somar todos os valores e andamento dos investimentos no mes atual.
Quando eu clicar nela, vou entrar em uma tela de visão geral daquele investimento em que vou mostrar todos os seus dados e vou ter alguma opções.
Botões: Depositar, Sacar, Ajustar, Editar, Excluir, onde para cada um, vou abrir um modal.
Depositar: vou precisar de valor, conta (opcional), data e observações;
Sacar: Valor, conta (opcional), data e observações;
Ajustar: Aqui, seria referente a atualizar os valores do investimento, eu tenho que informar o novo valor total, data e observações. O sistema calcula no back-end quando teve de ajuste do valor anterior para novo, isso serve para validar os rendimentos.
Editar: pode editar nome, descrição e data inicial.
Excluir: mostrar um alert para ter certeza que o usuário deseja excluir.

Além disso, essa tela vai mostrar duas abas, a primeira aba referente a histórico, onde eu vejo o historico de movimento do investimento e na outra eu vou ter graficos referente a evolução do valor, distribuição do tipo e faça de uma forma que eu possa ter noção de qual a média mensal/anual que o usuário recebe desse investimento, qual o indicador de crescimento, e por ai vai, seja criativo e mostre dados que o usuário gostaria de saber!

```typescript
  id: number;
  name: string;
  currentValue: number;
  description?: string | null;
  startDate?: string | null;
  createdAt: string; // ISO
  updatedAt?: string | null;
  histories?: InvestmentHistoryResponse[] | null;
```


### Profile
src\app\pages\profile

A tela de profile é uma tela que vai mostrar somente a imagem do usuário (que no momento não existe ainda),
nome do usuario, email, opções de deletar e resetar dados e uma opção para mudar senha, que eu devo preencher senha atual, nova senha e confirmar nova senha. E também mostrar a data que o usuário crio sua conta.

```typescript
  id: number;
  name: string;
  email: string;
  emailConfirmed: boolean;
```

### Home
src\app\pages\home

A tela de home é uma tela de acesso geral, nela, eu devo ter botoes para criar transações de todos os tipos. 
Deve ter cards que mostram quanto eu tenho de saldo total, receitas, despesas, faturas, investimentos, tudo do mês atual e esses cards devem ser clicaveis pra dar uma visão geral deles, aqui, eu vou deixar vocÊ fazer da forma que achar mais completa possível, pensando em possíveis necessidades dos clientes, pode caprichar!

### SideBar  
src\app\components\sidebar

No momento, o sidebar está no topo mostrando alguns caminhos como visão geral, cadastros, investimentos, lançamentos, notificações, configurações e o icone de ir para o perfil e sair do sistema.
Não estou confortável de como ela está hoje, acredito que seja melhor colocar ele como sidebar mesmo, na direita ou na esquerda da tela com versão maior mostrando o nome de cada link e uma versão menor com os icones de cada caminho, aqui, pode ser criativo, eu vou deixar totalmente para você decidir como será a nova sidebar, use o shadcn o máximo que der pense em como vai ficar em telas médias e pequenas, pois quero que seja bom de usar em qualquer tipo de tela existente. A organização das rotas e o que tem no siderbar eu vou deixar para vocÊ decidir, não precisa seguir o que tem hoje na sidebar do angular, faça você mesmo da melhor forma e mais profissional.
Lembrando que vai ter as novas opções de mudar a cor do sistema etc.

### Confirm Email
src\app\pages\confirm-email

É uma tela que vai mostrar que o email foi confirmado, veja o que precisa receber na tela e implemente ela, coisa simples.


### Notificações
```typescript
  id: number;
  title: string;
  message: string;
  type: NotificationTypeEnum;
  actionPath?: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt: Date;
```

## Next

Tente fazer de uma forma que permita o server-side render, mas não precisa fazer o sistema 100% dessa forma

Aqui vou passar um exemplo de modelagem que pode ser criado para estruturar a organização do sistema:
Controle-certo
├── src/
│   ├── app/                          # App Router (rotas)
│   │   ├── (auth)/                   # Route Group - rotas públicas
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── confirm-email/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx           # Layout para auth (centralizado, sem sidebar)
│   │   │
│   │   ├── (dashboard)/             # Route Group - rotas protegidas
│   │   │   ├── home/
│   │   │   │   └── page.tsx
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx
│   │   │   ├── accounts/
│   │   │   │   └── page.tsx
│   │   │   ├── credit-cards/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Detalhes do cartão
│   │   │   ├── invoices/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── investments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx           # Layout com sidebar
│   │   │
│   │   ├── api/                      # API Routes (opcional)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx                # Root layout (providers, fonts)
│   │   ├── page.tsx                  # Landing ou redirect
│   │   ├── loading.tsx               # Loading global
│   │   ├── error.tsx                 # Error boundary global
│   │   └── not-found.tsx
│   │
│   ├── features/                     # MÓDULOS (feature-based)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   └── forgot-password-form.tsx
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   ├── store/
│   │   │   │   └── auth.store.ts    # Zustand
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.ts
│   │   │   │   └── use-login.ts
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── utils/
│   │   │       └── auth.utils.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── components/
│   │   │   │   ├── transaction-list.tsx
│   │   │   │   ├── transaction-item.tsx
│   │   │   │   ├── transaction-filters.tsx
│   │   │   │   ├── transaction-dialog.tsx
│   │   │   │   ├── balance-statement.tsx
│   │   │   │   └── invoice-card.tsx
│   │   │   ├── services/
│   │   │   │   └── transactions.service.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-transactions.ts
│   │   │   │   ├── use-create-transaction.ts
│   │   │   │   └── use-transaction-filters.ts
│   │   │   ├── types/
│   │   │   │   └── transaction.types.ts
│   │   │   └── store/
│   │   │       └── transactions.store.ts
│   │   │
│   │   ├── accounts/
│   │   │   ├── components/
│   │   │   │   ├── account-list.tsx
│   │   │   │   ├── account-card.tsx
│   │   │   │   └── account-dialog.tsx
│   │   │   ├── services/
│   │   │   │   └── accounts.service.ts
│   │   │   ├── hooks/
│   │   │   │   └── use-accounts.ts
│   │   │   └── types/
│   │   │       └── account.types.ts
│   │   │
│   │   ├── credit-cards/
│   │   │   └── ...
│   │   ├── categories/
│   │   │   └── ...
│   │   ├── investments/
│   │   │   └── ...
│   │   └── profile/
│   │       └── ...
│   │
│   ├── components/                   # Componentes globais/compartilhados
│   │   ├── ui/                       # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   └── shared/
│   │       ├── loading-spinner.tsx
│   │       ├── error-message.tsx
│   │       └── empty-state.tsx
│   │
│   ├── lib/                          # Configurações e utilities globais
│   │   ├── api/
│   │   │   ├── client.ts             # Axios/Fetch config
│   │   │   └── interceptors.ts
│   │   ├── utils/
│   │   │   ├── cn.ts                 # classnames utility
│   │   │   ├── format.ts
│   │   │   └── validators.ts
│   │   ├── constants/
│   │   │   └── index.ts
│   │   └── query-client.ts           # TanStack Query config
│   │
│   ├── hooks/                        # Hooks globais
│   │   ├── use-media-query.ts
│   │   ├── use-debounce.ts
│   │   └── use-toast.ts
│   │
│   ├── types/                        # Types globais
│   │   ├── index.ts
│   │   └── enums.ts
│   │
│   ├── providers/                    # React Context Providers
│   │   ├── query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── auth-provider.tsx
│   │
│   ├── middleware.ts                 # Next.js middleware (auth guard)
│   └── styles/
│       └── globals.css
│
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json

## Regras

1. Todos o sistema deve ser modular e componentizado, sempre crie componentes e os faça de forma reutilizaveis
2. Os modais dos dados vão ficar sempre nos seus módulos correspondentes, modais de categoria vão ficar no modulo de categoria e por ai vai, da mesma forma services e tudo que diz respeito a categoria.
3. Você vai usar NextJs mais recente, organize as pastas e módulos de forma que o Next entenda e que fique organizado como foi passado para você.
4. IMPORTANTE: Sempre que você for implementar um módulo você DEVE ler todos os arquivos referentes aquele dado, acessar a pasta de pages, procurar os models na pasta models, acessar pasta service etc, o sistema aqui não está modulado, então eles ficam em pastas organizados por tipos de arquivos.




## API
Da para saber o que o back-end espera analisando os services e os models, mas para reforçar, vou deixar aqui o arquivo json referente a documentação da API do back:

```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "ControleCerto",
    "version": "v1"
  },
  "paths": {
    "/api/Account/CreateAccount": {
      "post": {
        "tags": [
          "Account"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateAccountRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateAccountRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateAccountRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Account/DeleteAccount/{accountId}": {
      "delete": {
        "tags": [
          "Account"
        ],
        "parameters": [
          {
            "name": "accountId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Account": {
      "get": {
        "tags": [
          "Account"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Account/GetAccountsWithoutCreditCard": {
      "get": {
        "tags": [
          "Account"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Account/UpdateAccount": {
      "patch": {
        "tags": [
          "Account"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateAccountRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateAccountRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateAccountRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Account/GetBalanceStatement": {
      "get": {
        "tags": [
          "Account"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Account/GetAccountBalance": {
      "get": {
        "tags": [
          "Account"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Article/GetArticleByTitle/{title}": {
      "get": {
        "tags": [
          "Article"
        ],
        "parameters": [
          {
            "name": "title",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Auth/Authenticate": {
      "post": {
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AuthRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AuthRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AuthRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Auth/GenerateAccessToken/{refreshToken}": {
      "get": {
        "tags": [
          "Auth"
        ],
        "parameters": [
          {
            "name": "refreshToken",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Auth/Logout/{refreshToken}": {
      "get": {
        "tags": [
          "Auth"
        ],
        "parameters": [
          {
            "name": "refreshToken",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Category/CreateCategory": {
      "post": {
        "tags": [
          "Category"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCategoryRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCategoryRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCategoryRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Category/GetAllCategories/{type}": {
      "get": {
        "tags": [
          "Category"
        ],
        "parameters": [
          {
            "name": "type",
            "in": "path",
            "required": true,
            "schema": {
              "$ref": "#/components/schemas/BillTypeEnum"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Category/UpdateCategory": {
      "patch": {
        "tags": [
          "Category"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCategoryRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCategoryRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCategoryRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Category/DeleteCategory/{categoryId}": {
      "delete": {
        "tags": [
          "Category"
        ],
        "parameters": [
          {
            "name": "categoryId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Category/UpdateCategoryLimit": {
      "patch": {
        "tags": [
          "Category"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCategoryLimitRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCategoryLimitRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCategoryLimitRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Category/GetLimitInfo/{categoryId}": {
      "get": {
        "tags": [
          "Category"
        ],
        "parameters": [
          {
            "name": "categoryId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/CreateCreditCard": {
      "post": {
        "tags": [
          "CreditCard"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCreditCardRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCreditCardRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCreditCardRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/UpdateCreditCard": {
      "patch": {
        "tags": [
          "CreditCard"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCreditCardRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCreditCardRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCreditCardRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/CreateCreditPurchase": {
      "post": {
        "tags": [
          "CreditCard"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCreditPurchaseRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCreditPurchaseRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateCreditPurchaseRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/UpdateCreditPurchase": {
      "patch": {
        "tags": [
          "CreditCard"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCreditPurchaseRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCreditPurchaseRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateCreditPurchaseRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/GetInvoicesByDate": {
      "get": {
        "tags": [
          "CreditCard"
        ],
        "parameters": [
          {
            "name": "startDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "endDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "creditCardId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/GetInvoicesById/{invoiceId}": {
      "get": {
        "tags": [
          "CreditCard"
        ],
        "parameters": [
          {
            "name": "invoiceId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/GetCreditExpensesFromInvoice/{invoiceId}": {
      "get": {
        "tags": [
          "CreditCard"
        ],
        "parameters": [
          {
            "name": "invoiceId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/PayInvoice": {
      "post": {
        "tags": [
          "CreditCard"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreteInvoicePaymentRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreteInvoicePaymentRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreteInvoicePaymentRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/DeleteInvoicePayment/{id}": {
      "delete": {
        "tags": [
          "CreditCard"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/DeleteCreditPurchase/{creditPurchaseId}": {
      "delete": {
        "tags": [
          "CreditCard"
        ],
        "parameters": [
          {
            "name": "creditPurchaseId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/CreditCard/GetCreditCardInfo": {
      "get": {
        "tags": [
          "CreditCard"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/CreateInvestment": {
      "post": {
        "tags": [
          "Investment"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateInvestmentRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateInvestmentRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateInvestmentRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/UpdateInvestment": {
      "patch": {
        "tags": [
          "Investment"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateInvestmentRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateInvestmentRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateInvestmentRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/Deposit": {
      "post": {
        "tags": [
          "Investment"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DepositInvestmentRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/DepositInvestmentRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/DepositInvestmentRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/Withdraw": {
      "post": {
        "tags": [
          "Investment"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/DepositInvestmentRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/DepositInvestmentRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/DepositInvestmentRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/AdjustValue": {
      "post": {
        "tags": [
          "Investment"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AdjustInvestmentRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AdjustInvestmentRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AdjustInvestmentRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/DeleteInvestment/{investmentId}": {
      "delete": {
        "tags": [
          "Investment"
        ],
        "parameters": [
          {
            "name": "investmentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/GetInvestments": {
      "get": {
        "tags": [
          "Investment"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/GetInvestment/{investmentId}": {
      "get": {
        "tags": [
          "Investment"
        ],
        "parameters": [
          {
            "name": "investmentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Investment/GetInvestmentHistory/{investmentId}": {
      "get": {
        "tags": [
          "Investment"
        ],
        "parameters": [
          {
            "name": "investmentId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Note": {
      "post": {
        "tags": [
          "Note"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateNoteRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateNoteRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateNoteRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "get": {
        "tags": [
          "Note"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Note/{id}": {
      "put": {
        "tags": [
          "Note"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateNoteRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateNoteRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateNoteRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "get": {
        "tags": [
          "Note"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "delete": {
        "tags": [
          "Note"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Note/month": {
      "get": {
        "tags": [
          "Note"
        ],
        "parameters": [
          {
            "name": "year",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "month",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Note/general": {
      "get": {
        "tags": [
          "Note"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Notification/GetRecentNotifications": {
      "get": {
        "tags": [
          "Notification"
        ],
        "parameters": [
          {
            "name": "isRead",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Notification/GetAllNotifications": {
      "get": {
        "tags": [
          "Notification"
        ],
        "parameters": [
          {
            "name": "isRead",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Notification/SendUserNotification": {
      "post": {
        "tags": [
          "Notification"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateNotificationRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateNotificationRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateNotificationRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Notification/SendPublicNotification": {
      "post": {
        "tags": [
          "Notification"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreatePublicNotificationRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreatePublicNotificationRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreatePublicNotificationRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Notification/MarkAsRead": {
      "patch": {
        "tags": [
          "Notification"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ReadNotificationsRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ReadNotificationsRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ReadNotificationsRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Notification/{id}": {
      "delete": {
        "tags": [
          "Notification"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Recurring": {
      "post": {
        "tags": [
          "Recurring"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateRecurringTransactionRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateRecurringTransactionRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateRecurringTransactionRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "get": {
        "tags": [
          "Recurring"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Recurring/{recurringId}": {
      "patch": {
        "tags": [
          "Recurring"
        ],
        "parameters": [
          {
            "name": "recurringId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateRecurringTransactionRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateRecurringTransactionRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateRecurringTransactionRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      },
      "delete": {
        "tags": [
          "Recurring"
        ],
        "parameters": [
          {
            "name": "recurringId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int64"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Recurring/Process": {
      "post": {
        "tags": [
          "Recurring"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProcessPendingRecurringRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ProcessPendingRecurringRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ProcessPendingRecurringRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Recurring/instances": {
      "get": {
        "tags": [
          "Recurring"
        ],
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "schema": {
              "$ref": "#/components/schemas/InstanceStatusEnum"
            }
          },
          {
            "name": "startDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "endDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Transaction/CreateTransaction": {
      "post": {
        "tags": [
          "Transaction"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTransactionRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTransactionRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTransactionRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Transaction/DeleteTransaction/{transactionId}": {
      "delete": {
        "tags": [
          "Transaction"
        ],
        "parameters": [
          {
            "name": "transactionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Transaction/UpdateTransaction": {
      "patch": {
        "tags": [
          "Transaction"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTransactionRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTransactionRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTransactionRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Transaction/CreateTransference": {
      "post": {
        "tags": [
          "Transaction"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTransferenceRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTransferenceRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTransferenceRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/Transaction/GetTransactions": {
      "get": {
        "tags": [
          "Transaction"
        ],
        "parameters": [
          {
            "name": "startDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "endDate",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "seeInvoices",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "accountId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/GetUser": {
      "get": {
        "tags": [
          "User"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/CreateUser": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/ConfirmEmail/{token}": {
      "get": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/SendConfirmEmail": {
      "get": {
        "tags": [
          "User"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/ChangePassword": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ChangePasswordRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ChangePasswordRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ChangePasswordRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/SendForgotPasswordEmail": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ForgotPasswordEvent"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ForgotPasswordEvent"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ForgotPasswordEvent"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/VerifyForgotPasswordToken/{token}": {
      "get": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/ForgotPassword/{token}": {
      "post": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "token",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ForgotPasswordRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ForgotPasswordRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ForgotPasswordRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/Update": {
      "patch": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/DeleteUser": {
      "delete": {
        "tags": [
          "User"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/api/User/ResetUserData": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ResetUserDataRequest"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ResetUserDataRequest"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ResetUserDataRequest"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AdjustInvestmentRequest": {
        "type": "object",
        "properties": {
          "investmentId": {
            "type": "integer",
            "format": "int64"
          },
          "newTotalValue": {
            "type": "number",
            "format": "double"
          },
          "occurredAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "note": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "AuthRequest": {
        "required": [
          "email",
          "password"
        ],
        "type": "object",
        "properties": {
          "email": {
            "maxLength": 60,
            "minLength": 4,
            "type": "string"
          },
          "password": {
            "maxLength": 30,
            "minLength": 4,
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "BillTypeEnum": {
        "enum": [
          0,
          1
        ],
        "type": "integer",
        "format": "int32"
      },
      "ChangePasswordRequest": {
        "required": [
          "newPassword",
          "oldPassword"
        ],
        "type": "object",
        "properties": {
          "oldPassword": {
            "maxLength": 30,
            "minLength": 4,
            "type": "string"
          },
          "newPassword": {
            "maxLength": 30,
            "minLength": 4,
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "CreateAccountRequest": {
        "required": [
          "balance",
          "bank"
        ],
        "type": "object",
        "properties": {
          "balance": {
            "type": "number",
            "format": "double"
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "bank": {
            "minLength": 1,
            "type": "string"
          },
          "color": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "CreateCategoryRequest": {
        "required": [
          "billType",
          "color",
          "icon",
          "name"
        ],
        "type": "object",
        "properties": {
          "parentId": {
            "type": "integer",
            "format": "int64",
            "nullable": true
          },
          "name": {
            "maxLength": 60,
            "minLength": 1,
            "type": "string"
          },
          "icon": {
            "minLength": 1,
            "type": "string"
          },
          "billType": {
            "$ref": "#/components/schemas/BillTypeEnum"
          },
          "color": {
            "minLength": 1,
            "type": "string"
          },
          "limit": {
            "type": "number",
            "format": "double",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "CreateCreditCardRequest": {
        "required": [
          "accountId",
          "closeDay",
          "dueDay",
          "skipWeekend",
          "totalLimit"
        ],
        "type": "object",
        "properties": {
          "totalLimit": {
            "type": "number",
            "format": "double"
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "accountId": {
            "type": "integer",
            "format": "int32"
          },
          "closeDay": {
            "maximum": 31,
            "minimum": 1,
            "type": "integer",
            "format": "int32"
          },
          "dueDay": {
            "maximum": 31,
            "minimum": 1,
            "type": "integer",
            "format": "int32"
          },
          "skipWeekend": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "CreateCreditPurchaseRequest": {
        "required": [
          "categoryId",
          "creditCardId",
          "destination",
          "installmentsPaid",
          "purchaseDate",
          "totalAmount",
          "totalInstallment"
        ],
        "type": "object",
        "properties": {
          "totalAmount": {
            "minimum": 0,
            "type": "number",
            "format": "double"
          },
          "totalInstallment": {
            "type": "integer",
            "format": "int32"
          },
          "installmentsPaid": {
            "type": "integer",
            "format": "int32"
          },
          "purchaseDate": {
            "type": "string",
            "format": "date-time"
          },
          "destination": {
            "maxLength": 80,
            "minLength": 1,
            "type": "string"
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "creditCardId": {
            "type": "integer",
            "format": "int64"
          },
          "categoryId": {
            "type": "integer",
            "format": "int64"
          }
        },
        "additionalProperties": false
      },
      "CreateInvestmentRequest": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "nullable": true
          },
          "initialAmount": {
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "startDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "description": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "CreateNoteRequest": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "nullable": true
          },
          "content": {
            "type": "string",
            "nullable": true
          },
          "year": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "month": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "CreateNotificationRequest": {
        "required": [
          "message",
          "title",
          "userId"
        ],
        "type": "object",
        "properties": {
          "title": {
            "maxLength": 100,
            "minLength": 1,
            "type": "string"
          },
          "message": {
            "maxLength": 600,
            "minLength": 1,
            "type": "string"
          },
          "type": {
            "$ref": "#/components/schemas/NotificationTypeEnum"
          },
          "actionPath": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "expiresAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "userId": {
            "type": "integer",
            "format": "int32"
          }
        },
        "additionalProperties": false
      },
      "CreatePublicNotificationRequest": {
        "required": [
          "message",
          "title"
        ],
        "type": "object",
        "properties": {
          "title": {
            "maxLength": 100,
            "minLength": 1,
            "type": "string"
          },
          "message": {
            "maxLength": 600,
            "minLength": 1,
            "type": "string"
          },
          "type": {
            "$ref": "#/components/schemas/NotificationTypeEnum"
          },
          "actionPath": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "expiresAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "CreateRecurrenceRuleRequest": {
        "required": [
          "frequency",
          "interval"
        ],
        "type": "object",
        "properties": {
          "frequency": {
            "$ref": "#/components/schemas/RecurrenceFrequencyEnum"
          },
          "isEveryDay": {
            "type": "boolean"
          },
          "daysOfWeek": {
            "maxLength": 50,
            "minLength": 0,
            "type": "string",
            "nullable": true
          },
          "dayOfWeek": {
            "maximum": 7,
            "minimum": 1,
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "dayOfMonth": {
            "maximum": 31,
            "minimum": -1,
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "monthOfYear": {
            "maximum": 12,
            "minimum": 1,
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "dayOfMonthForYearly": {
            "maximum": 31,
            "minimum": 1,
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "interval": {
            "maximum": 2147483647,
            "minimum": 1,
            "type": "integer",
            "format": "int32"
          }
        },
        "additionalProperties": false
      },
      "CreateRecurringTransactionRequest": {
        "required": [
          "accountId",
          "amount",
          "categoryId",
          "description",
          "justForRecord",
          "recurrenceRule",
          "startDate",
          "type"
        ],
        "type": "object",
        "properties": {
          "description": {
            "maxLength": 200,
            "minLength": 0,
            "type": "string"
          },
          "amount": {
            "minimum": 0.01,
            "type": "number",
            "format": "double"
          },
          "destination": {
            "maxLength": 80,
            "minLength": 0,
            "type": "string",
            "nullable": true
          },
          "justForRecord": {
            "type": "boolean"
          },
          "type": {
            "$ref": "#/components/schemas/TransactionTypeEnum"
          },
          "startDate": {
            "type": "string",
            "format": "date-time"
          },
          "endDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "accountId": {
            "type": "integer",
            "format": "int64"
          },
          "categoryId": {
            "type": "integer",
            "format": "int64"
          },
          "recurrenceRule": {
            "$ref": "#/components/schemas/CreateRecurrenceRuleRequest"
          }
        },
        "additionalProperties": false
      },
      "CreateTransactionRequest": {
        "required": [
          "accountId",
          "amount",
          "categoryId",
          "destination",
          "justForRecord",
          "purchaseDate",
          "type"
        ],
        "type": "object",
        "properties": {
          "amount": {
            "minimum": 0,
            "type": "number",
            "format": "double"
          },
          "type": {
            "$ref": "#/components/schemas/TransactionTypeEnum"
          },
          "purchaseDate": {
            "type": "string",
            "format": "date-time"
          },
          "destination": {
            "maxLength": 80,
            "minLength": 1,
            "type": "string"
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "observations": {
            "maxLength": 300,
            "type": "string",
            "nullable": true
          },
          "accountId": {
            "type": "integer",
            "format": "int64"
          },
          "categoryId": {
            "type": "integer",
            "format": "int64"
          },
          "justForRecord": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "CreateTransferenceRequest": {
        "required": [
          "accountDestinyId",
          "accountOriginId",
          "amount",
          "purchaseDate"
        ],
        "type": "object",
        "properties": {
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "amount": {
            "minimum": 0,
            "type": "number",
            "format": "double"
          },
          "purchaseDate": {
            "minLength": 1,
            "type": "string"
          },
          "accountDestinyId": {
            "type": "integer",
            "format": "int64"
          },
          "accountOriginId": {
            "type": "integer",
            "format": "int64"
          }
        },
        "additionalProperties": false
      },
      "CreateUserRequest": {
        "required": [
          "email",
          "name",
          "password"
        ],
        "type": "object",
        "properties": {
          "name": {
            "maxLength": 100,
            "minLength": 5,
            "type": "string"
          },
          "email": {
            "maxLength": 60,
            "minLength": 7,
            "type": "string"
          },
          "password": {
            "maxLength": 30,
            "minLength": 4,
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "CreteInvoicePaymentRequest": {
        "required": [
          "amountPaid",
          "description",
          "invoiceId",
          "paymentDate"
        ],
        "type": "object",
        "properties": {
          "amountPaid": {
            "minimum": 0,
            "type": "number",
            "format": "double"
          },
          "description": {
            "maxLength": 100,
            "minLength": 1,
            "type": "string"
          },
          "paymentDate": {
            "type": "string",
            "format": "date-time"
          },
          "invoiceId": {
            "type": "integer",
            "format": "int64"
          },
          "accountId": {
            "type": "integer",
            "format": "int64"
          },
          "justForRecord": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "DepositInvestmentRequest": {
        "type": "object",
        "properties": {
          "investmentId": {
            "type": "integer",
            "format": "int64"
          },
          "amount": {
            "type": "number",
            "format": "double"
          },
          "accountId": {
            "type": "integer",
            "format": "int64",
            "nullable": true
          },
          "occurredAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "note": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ForgotPasswordEvent": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ForgotPasswordRequest": {
        "required": [
          "confirmPassword",
          "password"
        ],
        "type": "object",
        "properties": {
          "password": {
            "maxLength": 30,
            "minLength": 4,
            "type": "string"
          },
          "confirmPassword": {
            "maxLength": 30,
            "minLength": 4,
            "type": "string"
          }
        },
        "additionalProperties": false
      },
      "InstanceStatusEnum": {
        "enum": [
          0,
          1,
          2,
          3,
          4
        ],
        "type": "integer",
        "format": "int32"
      },
      "NotificationTypeEnum": {
        "enum": [
          0,
          1,
          2,
          3,
          4
        ],
        "type": "integer",
        "format": "int32"
      },
      "ProcessPendingRecurringRequest": {
        "required": [
          "action"
        ],
        "type": "object",
        "properties": {
          "pendingTransactions": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int64"
            },
            "nullable": true
          },
          "action": {
            "$ref": "#/components/schemas/InstanceStatusEnum"
          },
          "rejectReason": {
            "maxLength": 300,
            "minLength": 0,
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ReadNotificationsRequest": {
        "type": "object",
        "properties": {
          "notificationIds": {
            "type": "array",
            "items": {
              "type": "integer",
              "format": "int64"
            },
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RecurrenceFrequencyEnum": {
        "enum": [
          0,
          1,
          2,
          3
        ],
        "type": "integer",
        "format": "int32"
      },
      "ResetUserDataRequest": {
        "type": "object",
        "properties": {
          "accounts": {
            "type": "boolean"
          },
          "transactions": {
            "type": "boolean"
          },
          "categories": {
            "type": "boolean"
          },
          "creditCards": {
            "type": "boolean"
          },
          "invoices": {
            "type": "boolean"
          },
          "recurringTransactions": {
            "type": "boolean"
          },
          "notifications": {
            "type": "boolean"
          },
          "transferences": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "TransactionTypeEnum": {
        "enum": [
          0,
          1,
          2,
          3,
          4
        ],
        "type": "integer",
        "format": "int32"
      },
      "UpdateAccountRequest": {
        "required": [
          "id"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "balance": {
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "bank": {
            "type": "string",
            "nullable": true
          },
          "color": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UpdateCategoryLimitRequest": {
        "type": "object",
        "properties": {
          "categoryId": {
            "type": "integer",
            "format": "int64"
          },
          "amount": {
            "type": "number",
            "format": "double"
          }
        },
        "additionalProperties": false
      },
      "UpdateCategoryRequest": {
        "required": [
          "id"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "name": {
            "maxLength": 60,
            "type": "string",
            "nullable": true
          },
          "icon": {
            "type": "string",
            "nullable": true
          },
          "color": {
            "type": "string",
            "nullable": true
          },
          "parentId": {
            "type": "integer",
            "format": "int64",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UpdateCreditCardRequest": {
        "required": [
          "id"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "totalLimit": {
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UpdateCreditPurchaseRequest": {
        "required": [
          "id"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "totalAmount": {
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "totalInstallment": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "purchaseDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "destination": {
            "maxLength": 80,
            "type": "string",
            "nullable": true
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "creditCardId": {
            "type": "integer",
            "format": "int64",
            "nullable": true
          },
          "categoryId": {
            "type": "integer",
            "format": "int64"
          }
        },
        "additionalProperties": false
      },
      "UpdateInvestmentRequest": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string",
            "nullable": true
          },
          "startDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "description": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UpdateNoteRequest": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "title": {
            "type": "string",
            "nullable": true
          },
          "content": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UpdateRecurringTransactionRequest": {
        "required": [
          "accountId",
          "amount",
          "categoryId",
          "description",
          "justForRecord",
          "recurrenceRule",
          "startDate",
          "type"
        ],
        "type": "object",
        "properties": {
          "description": {
            "maxLength": 200,
            "minLength": 0,
            "type": "string"
          },
          "amount": {
            "minimum": 0.01,
            "type": "number",
            "format": "double"
          },
          "destination": {
            "maxLength": 80,
            "minLength": 0,
            "type": "string",
            "nullable": true
          },
          "justForRecord": {
            "type": "boolean"
          },
          "type": {
            "$ref": "#/components/schemas/TransactionTypeEnum"
          },
          "startDate": {
            "type": "string",
            "format": "date-time"
          },
          "endDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "accountId": {
            "type": "integer",
            "format": "int64"
          },
          "categoryId": {
            "type": "integer",
            "format": "int64"
          },
          "isActive": {
            "type": "boolean"
          },
          "recurrenceRule": {
            "$ref": "#/components/schemas/CreateRecurrenceRuleRequest"
          }
        },
        "additionalProperties": false
      },
      "UpdateTransactionRequest": {
        "required": [
          "id"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "amount": {
            "minimum": 0,
            "type": "number",
            "format": "double",
            "nullable": true
          },
          "purchaseDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "destination": {
            "maxLength": 80,
            "type": "string",
            "nullable": true
          },
          "description": {
            "maxLength": 100,
            "type": "string",
            "nullable": true
          },
          "observations": {
            "maxLength": 300,
            "type": "string",
            "nullable": true
          },
          "justForRecord": {
            "type": "boolean",
            "nullable": true
          },
          "categoryId": {
            "type": "integer",
            "format": "int64",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UpdateUserRequest": {
        "required": [
          "id"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "name": {
            "maxLength": 100,
            "minLength": 5,
            "type": "string",
            "nullable": true
          },
          "email": {
            "maxLength": 60,
            "minLength": 7,
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      }
    },
    "securitySchemes": {
      "Bearer": {
        "type": "apiKey",
        "description": "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        "name": "Authorization",
        "in": "header"
      }
    }
  },
  "security": [
    {
      "Bearer": [ ]
    }
  ]
}
```