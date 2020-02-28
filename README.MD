# Desafio Boticário - Aplicação de cashback

## Backend do aplicação desenovolvida em NodeJS

### Stack do desafio
Foram utilizadas as seguintes tecnologias:
* NodeJS
* Express
* MongoDB

Para conexão com o banco de dados foi utilizada a biblioteca Mongoose, devido a facilidade que apresenta para inclusão e manipulação dos dados.

### Modelos
A aplicaçaõ apresenta uma pasta "models" para melhor organização do código. Foram criados dois modelos para representar as entidades propostas no desafio, cada um em seu respectivo arquivo:
* Sales: representa as vendas feitas pelos revendedores. Possui os campos mandatórios indicados na documentação do desafio.
* Salesperson: representa o cadastro dos revendedores, com os dados mandatórios conforme indicado no desafio. As vendas são cadastradas como Object Reference nos registros dos revendedores.

### Rotas
Assim como os models, foi criada uma pasta "routes" para melhor organização do código. Cada entidade possui seu próprio arquivo de rotas:
* sales: possui as rotas para inserção, edição e deleção de uma venda, conforme as regras de negócio apresentadas no documento do desafio.
* salesperson: possui as rotas para inserção e simulação do login de um revendedor, assim como a rota para consumo da API externa e recuperação do saldo de cashback.

## Inicialização da aplicação
Para executar a aplicação, faça o clone ou download do repositório. Navegue para pasta raiz da aplicação (cashback-sales) e execute o comando yarn install para instalar as dependências do projeto.
Para executar a aplicação, use o comando yarn start, para executar o script de inicialização em modo de desenvolvimento.
Para simular as rotas, fui utilizado o Postman.