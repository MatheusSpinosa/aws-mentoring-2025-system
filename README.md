# Projeto de Backend para Mentoria AWS

Este projeto demonstra a integração de diversos serviços da AWS, incluindo Cognito para autenticação, RDS para gerenciamento de banco de dados, funções Lambda para lógica de negócios e WebSocket para comunicação em tempo real, culminando na implementação de um jogo de roleta.

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Implantação](#configuração-e-implantação)
- [Uso](#uso)
- [Referências](#referências)

## Visão Geral

O objetivo deste projeto é fornecer um exemplo prático de como integrar e utilizar serviços da AWS para construir uma aplicação backend robusta e escalável. As principais funcionalidades incluem:

- **Autenticação de Usuários**: Utilização do AWS Cognito para gerenciamento de usuários e autenticação.
- **Interação com Banco de Dados**: Integração com Amazon RDS para operações de banco de dados.
- **Lógica de Negócios**: Implementação de funções AWS Lambda para processar a lógica da aplicação.
- **Comunicação em Tempo Real**: Uso de WebSocket para fornecer atualizações em tempo real no jogo de roleta.

## Arquitetura

A arquitetura do projeto é composta pelos seguintes componentes:

- **AWS Cognito**: Gerencia a autenticação e autorização de usuários.
- **Amazon RDS**: Banco de dados relacional para armazenar dados persistentes da aplicação.
- **AWS Lambda**: Funções serverless que contêm a lógica de negócios da aplicação.
- **API Gateway com WebSocket**: Facilita a comunicação em tempo real entre o cliente e o servidor para o jogo de roleta.

*Diagrama de arquitetura ilustrando a interação entre os componentes.*

## Pré-requisitos

Antes de configurar o projeto, certifique-se de ter:

- **Conta AWS**: Uma conta ativa na AWS.
- **Node.js**: Ambiente de execução JavaScript.
- **AWS CLI**: Interface de linha de comando para interagir com os serviços da AWS.
- **Serverless Framework**: Ferramenta para desenvolver e implantar aplicações serverless.

## Configuração e Implantação

1. **Clonar o Repositório**:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
