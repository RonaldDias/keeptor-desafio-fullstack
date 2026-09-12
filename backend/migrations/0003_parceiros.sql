-- ---------------------------------------------------------------------------
-- 0003_parceiros.sql: tabela de parceiros comerciais
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.parceiro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NULL,
    inscricao_estadual VARCHAR(30) NULL,
    
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    data_inicio_relacionamento DATE NOT NULL DEFAULT CURRENT_DATE,
    limite_credito NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    ativo BOOLEAN NOT NULL DEFAULT true,
    
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NOT NULL,
    uf_id INTEGER NOT NULL REFERENCES public.uf(id),
    municipio_id INTEGER NOT NULL REFERENCES public.municipio(id),
    
    -- Auditoria
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints de integridade de negócio
    CONSTRAINT parceiro_cnpj_unique UNIQUE (cnpj),
    CONSTRAINT parceiro_limite_credito_check CHECK (limite_credito >= 0)
);

-- Índices para otimização de consultas comuns
CREATE INDEX IF NOT EXISTS parceiro_nome_fantasia_idx ON public.parceiro (nome_fantasia);
CREATE INDEX IF NOT EXISTS parceiro_razao_social_idx ON public.parceiro (razao_social);
CREATE INDEX IF NOT EXISTS parceiro_uf_id_idx ON public.parceiro (uf_id);
CREATE INDEX IF NOT EXISTS parceiro_municipio_id_idx ON public.parceiro (municipio_id);
CREATE INDEX IF NOT EXISTS parceiro_ativo_idx ON public.parceiro (ativo);

-- Permissões para os roles do Supabase
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
        GRANT ALL ON TABLE public.parceiro TO authenticated, service_role;
        GRANT SELECT ON TABLE public.parceiro TO anon;
    END IF;
END
$$;