DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prioridade_enum') THEN
        CREATE TYPE prioridade_enum AS ENUM ('baixa', 'média', 'alta');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('a fazer', 'fazendo', 'pronto');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    descricao TEXT NOT NULL,
    setor VARCHAR(100) NOT NULL,
    prioridade prioridade_enum NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status status_enum NOT NULL DEFAULT 'a fazer',
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_status ON tarefas(status);

TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;