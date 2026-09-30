/**
 * @license
 * Casa 6 — Bianca Tofoli
 * Camada de Proteção de Conteúdo Anticópia (Best-Effort & Acessibilidade)
 * 
 * Regras Estritas:
 * 1. Desativado integralmente em /painel e rotas administrativas.
 * 2. Permite normalmente seleção em input, textarea, select e contenteditable.
 * 3. Não interfere em leitores de tela ou acessibilidade.
 * 4. Não alega proteção absoluta contra DevTools.
 */

type NoticeCallback = (message: string) => void;
let noticeCallback: NoticeCallback | null = null;

export function registerAntiCopyNotifier(cb: NoticeCallback): () => void {
  noticeCallback = cb;
  return () => {
    noticeCallback = null;
  };
}

export function initAntiCopyProtection(): () => void {
  if (typeof window === 'undefined') return () => {};

  function isExempt(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;

    // Isenção total para rotas do Painel Administrativo
    const currentPath = window.location.pathname || window.location.hash;
    if (currentPath.includes('/painel') || document.body.classList.contains('admin-scope')) {
      return true;
    }

    // Isenção para elementos de entrada de formulários e campos editáveis
    const tagName = target.tagName.toLowerCase();
    if (['input', 'textarea', 'select', 'option'].includes(tagName)) return true;
    if (target.isContentEditable) return true;
    if (target.closest('input, textarea, select, [contenteditable="true"], .allow-select, .admin-scope')) return true;

    return false;
  }

  function handleContextMenu(e: MouseEvent) {
    if (isExempt(e.target)) return;
    e.preventDefault();
    if (noticeCallback) {
      noticeCallback('Conteúdo protegido pela Lei Federal nº 9.610/1998 — Casa 6 / Bianca Tofoli.');
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (isExempt(e.target)) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Interceptação de atalhos comuns de clonagem de conteúdo
    if (isCtrlOrCmd && ['c', 'x', 's', 'u', 'p'].includes(key)) {
      e.preventDefault();
      if (noticeCallback) {
        noticeCallback('A reprodução ou impressão não autorizada deste conteúdo autoral é protegida.');
      }
      return;
    }

    // Best-effort para teclas de DevTools (F12, Ctrl+Shift+I) sem alegar invulnerabilidade
    if (e.key === 'F12' || (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(key))) {
      e.preventDefault();
      if (noticeCallback) {
        noticeCallback('Ambiente institucional Casa 6.');
      }
    }
  }

  function handleDragStart(e: DragEvent) {
    if (isExempt(e.target)) return;
    if (e.target instanceof HTMLImageElement) {
      e.preventDefault();
    }
  }

  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('dragstart', handleDragStart);

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('dragstart', handleDragStart);
  };
}
