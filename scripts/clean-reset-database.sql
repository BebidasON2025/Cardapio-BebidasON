-- 🔥 RESET TOTAL E LIMPO - BEBIDAS ON
-- Execute este script completo no SQL Editor do Supabase

-- ========================================
-- 1. LIMPAR TUDO COMPLETAMENTE
-- ========================================

-- Desabilitar RLS temporariamente
ALTER TABLE IF EXISTS categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bebidas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pedidos DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Remover todos os triggers
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public') LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON ' || quote_ident(r.event_object_table);
    END LOOP;
END $$;

-- Remover todas as funções
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Remover todas as tabelas
DROP TABLE IF EXISTS itens_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS bebidas CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;

-- Aguardar limpeza
SELECT pg_sleep(1);

-- ========================================
-- 2. CRIAR FUNÇÃO PARA UPDATED_AT
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- 3. CRIAR TABELA CATEGORIAS
-- ========================================
CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    icone VARCHAR(50) DEFAULT 'package',
    cor VARCHAR(20) DEFAULT 'amber',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. CRIAR TABELA BEBIDAS
-- ========================================
CREATE TABLE bebidas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
    categoria_id BIGINT REFERENCES categorias(id) ON DELETE SET NULL,
    imagem TEXT,
    estoque INTEGER DEFAULT 0 CHECK (estoque >= 0),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. CRIAR TABELA PEDIDOS
-- ========================================
CREATE TABLE pedidos (
    id VARCHAR(20) PRIMARY KEY,
    cliente VARCHAR(200) NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total > 0),
    forma_pagamento VARCHAR(20) NOT NULL CHECK (forma_pagamento IN ('pix', 'cartao', 'dinheiro')),
    valor_pago DECIMAL(10,2) DEFAULT NULL,
    troco DECIMAL(10,2) DEFAULT NULL,
    itens JSONB NOT NULL,
    tipo_entrega VARCHAR(20) DEFAULT 'retirada' CHECK (tipo_entrega IN ('entrega', 'retirada')),
    endereco_entrega TEXT DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'enviado' CHECK (status IN ('enviado', 'confirmado', 'entregue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. CRIAR ÍNDICES
-- ========================================
CREATE INDEX idx_bebidas_categoria_id ON bebidas(categoria_id);
CREATE INDEX idx_bebidas_ativo ON bebidas(ativo);
CREATE INDEX idx_categorias_ativo ON categorias(ativo);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX idx_pedidos_status ON pedidos(status);

-- ========================================
-- 7. CRIAR TRIGGERS
-- ========================================
CREATE TRIGGER update_categorias_updated_at 
    BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bebidas_updated_at 
    BEFORE UPDATE ON bebidas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at 
    BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. CONFIGURAR RLS
-- ========================================
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE bebidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas
CREATE POLICY "Allow all on categorias" ON categorias FOR ALL USING (true);
CREATE POLICY "Allow all on bebidas" ON bebidas FOR ALL USING (true);
CREATE POLICY "Allow all on pedidos" ON pedidos FOR ALL USING (true);

-- ========================================
-- 9. INSERIR APENAS 2 CATEGORIAS
-- ========================================
INSERT INTO categorias (nome, icone, cor) VALUES 
('Cervejas', 'beer', 'amber'),
('Refrigerantes', 'cup-soda', 'blue');

-- ========================================
-- 10. VERIFICAR CRIAÇÃO
-- ========================================
SELECT 
    'CATEGORIAS' as tabela, 
    count(*) as total,
    'Apenas Cervejas e Refrigerantes' as status
FROM categorias
UNION ALL
SELECT 
    'BEBIDAS' as tabela, 
    count(*) as total,
    'Estoque zerado - pronto para adicionar' as status
FROM bebidas
UNION ALL
SELECT 
    'PEDIDOS' as tabela, 
    count(*) as total,
    'Tabela criada e vazia' as status
FROM pedidos;

-- ✅ BANCO LIMPO E PRONTO PARA USO!
-- Apenas 2 categorias: Cervejas e Refrigerantes
-- Sem produtos - adicione pelo painel admin
