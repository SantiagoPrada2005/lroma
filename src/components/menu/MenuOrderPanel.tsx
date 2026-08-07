"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { formatOrderMessage, openWhatsApp, type OrderItem } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MenuItemInfo {
  id: string;
  name: string;
  price: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

function updateButtonDOM(itemId: string, quantity: number): void {
  const btn = document.querySelector<HTMLButtonElement>(`[data-add-btn="${itemId}"]`);
  if (!btn) return;

  if (btn.dataset.activeQty === String(quantity)) return;
  btn.dataset.activeQty = String(quantity);

  if (quantity === 0) {
    // Restore "Agregar" button
    btn.className =
      "menu-add-btn group/btn flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition-all duration-300 hover:border-lroma-red/30 hover:bg-lroma-red/10 hover:text-white";
    btn.setAttribute("aria-label", `Agregar ${btn.dataset.itemName ?? ""}`);
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-transform duration-300 group-hover/btn:rotate-90"><path d="M12 5v14"/><path d="M5 12h14"/></svg>Agregar`;
    return;
  }

  // Counter button
  btn.className =
    "menu-add-btn flex items-center gap-1.5 rounded-full bg-lroma-red/10 px-2 py-1.5 ring-1 ring-lroma-red/20";
  btn.setAttribute("aria-label", `Cantidad de ${btn.dataset.itemName ?? ""}: ${quantity}`);
  btn.innerHTML = `
    <span class="flex size-7 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white cursor-pointer" data-action="remove" data-item-id="${itemId}">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"><path d="M5 12h14"/></svg>
    </span>
    <span class="min-w-[1.5rem] text-center text-sm font-bold text-white tabular-nums">${quantity}</span>
    <span class="flex size-7 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white cursor-pointer" data-action="add" data-item-id="${itemId}">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
    </span>
  `;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MenuOrderPanel({ items }: { items: MenuItemInfo[] }) {
  const [selected, setSelected] = useState<Map<string, number>>(new Map());
  const [expanded, setExpanded] = useState(false);

  const itemsById = useMemo(() => {
    const map = new Map<string, MenuItemInfo>();
    for (const item of items) map.set(item.id, item);
    return map;
  }, [items]);

  // Derived state
  const selectedList = useMemo(() => {
    const list: (MenuItemInfo & { quantity: number })[] = [];
    selected.forEach((qty, id) => {
      const item = itemsById.get(id);
      if (item && qty > 0) list.push({ ...item, quantity: qty });
    });
    return list;
  }, [selected, itemsById]);

  const selectedCount = useMemo(
    () => selectedList.reduce((acc, s) => acc + s.quantity, 0),
    [selectedList],
  );

  const totalPrice = useMemo(
    () => selectedList.reduce((acc, s) => acc + s.price * s.quantity, 0),
    [selectedList],
  );

  // Event delegation — single listener on document to catch clicks reliably
  useEffect(() => {
    function handleGridClick(e: MouseEvent) {
      const target = e.target as HTMLElement;

      // Direct click on .menu-add-btn
      const btnAdd = target.closest<HTMLButtonElement>("[data-add-btn]");
      if (btnAdd && !target.closest("[data-action]")) {
        e.preventDefault();
        const id = btnAdd.getAttribute("data-add-btn")!;
        const name = btnAdd.getAttribute("data-item-name") ?? "";
        const price = Number(btnAdd.getAttribute("data-item-price") ?? "0");
        if (!itemsById.has(id)) {
          itemsById.set(id, { id, name, price });
        }
        addItem(id);
        return;
      }

      // Delegate action buttons inside counter (remove / add)
      const actionBtn = target.closest<HTMLElement>("[data-action]");
      if (actionBtn) {
        e.preventDefault();
        const action = actionBtn.getAttribute("data-action")!;
        const id = actionBtn.getAttribute("data-item-id")!;
        if (action === "add") addItem(id);
        else if (action === "remove") removeItem(id);
        return;
      }
    }

    document.addEventListener("click", handleGridClick);
    return () => {
      document.removeEventListener("click", handleGridClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync button DOM with state
  useEffect(() => {
    selected.forEach((qty, id) => updateButtonDOM(id, qty));
    // Restore buttons for items no longer in selection
    document.querySelectorAll<HTMLButtonElement>("[data-add-btn]").forEach((btn) => {
      const id = btn.getAttribute("data-add-btn")!;
      if (!selected.has(id)) updateButtonDOM(id, 0);
    });
  }, [selected]);

  // Actions
  const addItem = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Map(prev);
      next.set(id, (next.get(id) ?? 0) + 1);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const current = next.get(id) ?? 0;
      if (current <= 1) {
        next.delete(id);
      } else {
        next.set(id, current - 1);
      }
      return next;
    });
  }, []);

  const clearOrder = useCallback(() => {
    setSelected(new Map());
    setExpanded(false);
  }, []);

  const handleSend = useCallback(() => {
    const orderItems: OrderItem[] = selectedList.map((s) => ({
      name: s.name,
      quantity: s.quantity,
      price: s.price,
    }));
    const message = formatOrderMessage(orderItems);
    if (message) openWhatsApp(message);
  }, [selectedList]);

  // --- Render ---
  return (
    <>
      {/* Backdrop for mobile expanded panel */}
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-300 md:hidden"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating order bar / panel */}
      <div
        className={cn(
          "fixed z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "bottom-0 left-0 right-0 md:bottom-8 md:left-auto md:right-8",
          selectedCount > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none md:translate-y-4",
          expanded ? "md:w-[420px]" : "md:w-auto",
        )}
      >
        <div className="rounded-t-3xl md:rounded-3xl p-[1px] bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent shadow-[0_-8px_32px_rgba(0,0,0,0.4)] md:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="rounded-t-[calc(1.5rem-1px)] md:rounded-[calc(1.5rem-1px)] bg-black/85 backdrop-blur-2xl overflow-hidden">
            {expanded ? (
              // --- Expanded panel ---
              <div className="flex max-h-[70dvh] flex-col md:max-h-[60dvh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-lroma-red"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    <h2 className="font-heading text-base font-bold text-white/90">
                      Tu pedido
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={clearOrder}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white/35 transition-all duration-200 hover:bg-white/[0.05] hover:text-red-400"
                      aria-label="Vaciar pedido"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-3"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      <span className="hidden sm:inline">Vaciar</span>
                    </button>
                    <button
                      onClick={() => setExpanded(false)}
                      className="flex size-8 items-center justify-center rounded-full text-white/30 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/60"
                      aria-label="Cerrar pedido"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Item list */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3 space-y-1">
                  {selectedList.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors duration-200 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white/85">
                            {s.name}
                          </p>
                          <p className="mt-0.5 text-xs text-white/35">
                            {formatPrice(s.price)} c/u
                          </p>
                        </div>
                        <span className="shrink-0 font-heading text-sm font-semibold text-lroma-gold">
                          {formatPrice(s.price * s.quantity)}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex items-center gap-0.5 rounded-full bg-white/[0.05] px-1 py-0.5 ring-1 ring-white/[0.06]">
                          <button
                            onClick={() => removeItem(s.id)}
                            className="flex size-7 items-center justify-center rounded-full text-white/50 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                            aria-label={`Reducir ${s.name}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3.5"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                          <span className="min-w-[1.75rem] text-center text-sm font-bold text-white tabular-nums">
                            {s.quantity}
                          </span>
                          <button
                            onClick={() => addItem(s.id)}
                            className="flex size-7 items-center justify-center rounded-full text-white/50 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                            aria-label={`Agregar más ${s.name}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3.5"
                            >
                              <path d="M12 5v14" />
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer — total + send */}
                <div className="border-t border-white/[0.06] px-5 py-4 shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium tracking-wide text-white/35 uppercase">
                      Total
                    </span>
                    <span className="font-heading text-xl font-bold text-white/95">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={handleSend}
                    className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-lroma-red px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-lroma-red/90 active:scale-[0.98] shadow-[0_0_24px_rgba(231,49,52,0.3)]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                    Enviar por WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              // --- Collapsed bar ---
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpanded(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded(true);
                  }
                }}
                className="group flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-300 hover:bg-white/[0.03] cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lroma-red/15">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-lroma-red"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium tracking-wide text-white/40 uppercase">
                      {selectedCount} {selectedCount === 1 ? "item" : "items"}
                    </p>
                    <p className="mt-0.5 font-heading text-lg font-bold text-white/95">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/60">
                    Ver pedido
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSend();
                    }}
                    className="flex size-9 items-center justify-center rounded-full bg-lroma-red transition-all duration-300 hover:bg-lroma-red/90 active:scale-[0.95] shadow-[0_0_16px_rgba(231,49,52,0.3)]"
                    aria-label="Enviar pedido por WhatsApp"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 text-white"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
