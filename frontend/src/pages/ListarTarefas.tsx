import {
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import type { Status, Tarefa } from "../types";

const STATUS_OPTIONS: { value: Status | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_ANDAMENTO", label: "Em Andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
  { value: "CANCELADA", label: "Cancelada" },
];

const STATUS_COLOR: Record<Status, string> = {
  PENDENTE: "#6B7280",
  EM_ANDAMENTO: "#F59E0B",
  CONCLUIDA: "#10B981",
  CANCELADA: "#EF4444",
};

const PRIORIDADE_COLOR: Record<string, string> = {
  BAIXA: "#6B7280",
  MEDIA: "#F59E0B",
  ALTA: "#EF4444",
  CRITICA: "#7C3AED",
};

const PRIORIDADE_LABEL: Record<string, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

const PRIORIDADE_OPTIONS = [
  { value: "ALL", label: "Todas" },
  { value: "BAIXA", label: "Baixa" },
  { value: "MEDIA", label: "Média" },
  { value: "ALTA", label: "Alta" },
  { value: "CRITICA", label: "Crítica" },
];

interface Props {
  tarefas: Tarefa[];
  loading: boolean;
  onMover: (id: string, status: Status) => void;
  onEditar: (tarefa: Tarefa) => void;
  onVerDetalhes: (tarefa: Tarefa) => void;
}

export function ListaTarefas({ tarefas, loading, onMover, onEditar, onVerDetalhes }: Props) {
  const [filtro, setFiltro] = useState<Status | "ALL">("ALL");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<string | null>(null);
  const [filtroPrioridade, setFiltroPrioridade] = useState<string | "ALL">("ALL");
  const tarefasFiltradas = tarefas
    .filter((t) => filtro === "ALL" || t.status === filtro)
    .filter((t) => filtroPrioridade === "ALL" || t.prioridade === filtroPrioridade);

  function handleMenuOpen(e: React.MouseEvent<HTMLElement>, id: string) {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setTarefaSelecionada(id);
  }

  function handleMover(status: Status) {
    if (tarefaSelecionada) onMover(tarefaSelecionada, status);
    setMenuAnchor(null);
    setTarefaSelecionada(null);
  }

  function handleEditar() {
    const tarefa = tarefas.find((t) => t.id === tarefaSelecionada);
    if (tarefa) onEditar(tarefa);
    setMenuAnchor(null);
    setTarefaSelecionada(null);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={
              opt.value === "ALL"
                ? `${opt.label} (${tarefas.length})`
                : `${opt.label} (${tarefas.filter((t) => t.status === opt.value).length})`
            }
            onClick={() => setFiltro(opt.value)}
            variant={filtro === opt.value ? "filled" : "outlined"}
            size="small"
            sx={{
              cursor: "pointer",
              fontWeight: filtro === opt.value ? 600 : 400,
              bgcolor: filtro === opt.value ? "primary.main" : "transparent",
              color: filtro === opt.value ? "#fff" : "text.secondary",
              borderColor: "divider",
            }}
          />
        ))}
      </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {PRIORIDADE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={
                opt.value === "ALL"
                  ? `Prioridade: Todas`
                  : PRIORIDADE_LABEL[opt.value]
              }
              onClick={() => setFiltroPrioridade(opt.value)}
              variant={filtroPrioridade === opt.value ? "filled" : "outlined"}
              size="small"
              sx={{
                cursor: "pointer",
                fontWeight: filtroPrioridade === opt.value ? 600 : 400,
                bgcolor:
                  filtroPrioridade === opt.value && opt.value !== "ALL"
                    ? `${PRIORIDADE_COLOR[opt.value]}22`
                    : filtroPrioridade === opt.value
                    ? "action.selected"
                    : "transparent",
                color:
                  filtroPrioridade === opt.value && opt.value !== "ALL"
                    ? PRIORIDADE_COLOR[opt.value]
                    : filtroPrioridade === opt.value
                    ? "text.primary"
                    : "text.secondary",
                borderColor:
                  filtroPrioridade === opt.value && opt.value !== "ALL"
                    ? PRIORIDADE_COLOR[opt.value]
                    : "divider",
              }}
            />
          ))}
        </Box>

      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={64} />
          ))}
        </Box>
      ) : tarefasFiltradas.length === 0 ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography color="text.secondary" fontSize={14}>
            Nenhuma tarefa encontrada.
          </Typography>
        </Box>
      ) : (
        <Box>
          {tarefasFiltradas.map((tarefa, idx) => (
            <Box key={tarefa.id}>
              {idx > 0 && <Divider />}
              <Box
                onClick={() => onVerDetalhes(tarefa)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 1.5,
                  px: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: STATUS_COLOR[tarefa.status],
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontSize={14} fontWeight={500} noWrap>
                    {tarefa.titulo}
                  </Typography>
                  {tarefa.descricao && (
                    <Typography fontSize={12} color="text.secondary" noWrap>
                      {tarefa.descricao}
                    </Typography>
                  )}
                </Box>

                {tarefa.prioridade && (
                  <Chip
                    label={PRIORIDADE_LABEL[tarefa.prioridade]}
                    size="small"
                    sx={{
                      fontSize: 11,
                      height: 20,
                      bgcolor: `${PRIORIDADE_COLOR[tarefa.prioridade]}18`,
                      color: PRIORIDADE_COLOR[tarefa.prioridade],
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  />
                )}

                <Chip
                  label={STATUS_OPTIONS.find((s) => s.value === tarefa.status)?.label}
                  size="small"
                  sx={{
                    fontSize: 11,
                    height: 20,
                    bgcolor: `${STATUS_COLOR[tarefa.status]}18`,
                    color: STATUS_COLOR[tarefa.status],
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                />

                <Tooltip title="Ações">
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, tarefa.id)}>
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handleEditar} sx={{ fontSize: 13 }}>
          Editar
        </MenuItem>

        <Divider />

        <MenuItem disabled sx={{ fontSize: 12, opacity: 0.5 }}>
          Mover para...
        </MenuItem>

        {(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"] as Status[]).map((s) => (
          <MenuItem key={s} onClick={() => handleMover(s)} sx={{ fontSize: 13 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: STATUS_COLOR[s],
                mr: 1.5,
              }}
            />
            {STATUS_OPTIONS.find((o) => o.value === s)?.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}