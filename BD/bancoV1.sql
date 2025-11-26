CREATE DATABASE musclelab;
USE musclelab;

create table usuario(
usuario_id int primary key auto_increment,
nome varchar(60) not null,
sobrenome varchar(60) not null,
nivel_muscle varchar(15),
CONSTRAINT chk_nivel CHECK(nivel_muscle IN('Intermediário','Avançado','Iniciante','Nenhum')),
objetivo varchar(50),
CONSTRAINT chk_obj CHECK(objetivo IN('Hipertrofia','Definição','Nenhum')),
email varchar(100) not null unique,
CONSTRAINT chk_email CHECK(email LIKE '%@%' AND email LIKE '%.%'),
senha varchar(255) not null );

create table imc (
id_imc INT PRIMARY KEY AUTO_INCREMENT,
fkUsuario INT NOT NULL,
contador INT,
peso DECIMAL(5,2) not null,
altura DECIMAL (3,2) not null,
dtRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_user_imc FOREIGN KEY (fkUsuario) REFERENCES usuario (usuario_id));

CREATE TABLE checkTreino (
id_treino INT PRIMARY KEY AUTO_INCREMENT,
fkUsuario INT NOT NULL,
treino varchar(70),
dtHora DATETIME DEFAULT CURRENT_TIMESTAMP,
status_treino VARCHAR(70),
CONSTRAINT chk_status CHECK(status_treino IN('Intenso','Leve','Mediano')),
CONSTRAINT fk_user_treino FOREIGN KEY (fkUsuario) REFERENCES usuario(usuario_id));

