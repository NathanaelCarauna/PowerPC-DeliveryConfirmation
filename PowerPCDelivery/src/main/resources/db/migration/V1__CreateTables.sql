CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_processo_venda_produto INT NOT NULL,
    id_processo_venda INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL
);

CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataPedido DATETIME NOT NULL,
    status VARCHAR(255) NOT NULL,
    documento_cliente VARCHAR(255) NOT NULL,
    nome_cliente VARCHAR(255) NOT NULL,
    id_processo_venda INT NOT NULL
);

CREATE TABLE filial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE entrega (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataEntrega DATETIME NOT NULL,
    documento BLOB NOT NULL,
    pedido_id INT NOT NULL,
    entregador_id INT NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES Pedido(id),
    FOREIGN KEY (entregador_id) REFERENCES Usuario(id)
);

CREATE TABLE usuario_filial (
    usuario_id INT,
    filial_id INT,
    PRIMARY KEY (usuario_id, filial_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (filial_id) REFERENCES Filial(id)
);

CREATE TABLE itens_pedido (
    pedido_id INT,
    produto_id INT,
    PRIMARY KEY (pedido_id, produto_id),
    FOREIGN KEY (pedido_id) REFERENCES Pedido(id),
    FOREIGN KEY (produto_id) REFERENCES Produto(id)
);