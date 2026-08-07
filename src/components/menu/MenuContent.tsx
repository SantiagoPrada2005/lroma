"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  MessageCircle,
  Plus,
  Minus,
  ChevronUp,
  Trash2,
  StickyNote,
  X,
  Pizza,
  Beef,
  Flame,
  Sandwich,
  UtensilsCrossed,
  Wine,
  Coffee,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { formatOrderMessage, openWhatsApp, type OrderItem } from "@/lib/whatsapp";
import { getUnsplashUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
}

interface Props {
  items: MenuItemData[];
}

interface SelectedItem {
  item: MenuItemData;
  quantity: number;
  note: string;
}

const CATEGORIES: {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "all", label: "Todos", icon: Sparkles },
  { key: "pizzas", label: "Pizzas", icon: Pizza },
  { key: "burgers", label: "Hamburguesas", icon: Beef },
  { key: "hots", label: "Hot Dogs", icon: Flame },
  { key: "sandwiches", label: "Sandwiches", icon: Sandwich },
  { key: "pastas", label: "Pastas", icon: UtensilsCrossed },
  { key: "grill", label: "Parrilla", icon: Flame },
  { key: "picadas", label: "Picadas", icon: Wine },
  { key: "alitas", label: "Alitas", icon: Flame },
  { key: "drinks", label: "Bebidas", icon: Coffee },
];

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export default function MenuContent({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(
    new Map(),
  );
  const [scrolled, setScrolled] = useState(false);
  const [orderExpanded, setOrderExpanded] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const prevCategoryRef = useRef<string>("all");
  const scrollCtx = useRef<{ revert: () => void } | null>(null);
  const gsapModule = useRef<any>(null);

  const availableCategoryKeys = useMemo(() => {
    const keys = new Set(items.map((i) => i.category));
    return CATEGORIES.filter((c) => c.key === "all" || keys.has(c.key));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  const selectedList = useMemo(() => {
    return Array.from(selectedItems.values()).filter((s) => s.quantity > 0);
  }, [selectedItems]);

  const selectedCount = useMemo(() => {
    return selectedList.reduce((acc, s) => acc + s.quantity, 0);
  }, [selectedList]);

  const totalPrice = useMemo(() => {
    return selectedList.reduce((acc, s) => acc + s.item.price * s.quantity, 0);
  }, [selectedList]);

  const addItem = useCallback((item: MenuItemData) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      next.set(item.id, {
        item,
        quantity: existing ? existing.quantity + 1 : 1,
        note: existing?.note ?? "",
      });
      return next;
    });
  }, []);

  const removeItem = useCallback((item: MenuItemData) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      if (!existing || existing.quantity <= 1) {
        next.delete(item.id);
      } else {
        next.set(item.id, {
          ...existing,
          quantity: existing.quantity - 1,
        });
      }
      return next;
    });
  }, []);

  const updateNote = useCallback((itemId: string, note: string) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const existing = next.get(itemId);
      if (!existing) return prev;
      next.set(itemId, { ...existing, note });
      return next;
    });
  }, []);

  const setQuantity = useCallback((item: MenuItemData, quantity: number) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (quantity <= 0) {
        next.delete(item.id);
      } else {
        const existing = next.get(item.id);
        next.set(item.id, {
          item,
          quantity,
          note: existing?.note ?? "",
        });
      }
      return next;
    });
  }, []);

  const clearOrder = useCallback(() => {
    setSelectedItems(new Map());
  }, []);

  const getQuantity = useCallback(
    (id: string) => selectedItems.get(id)?.quantity || 0,
    [selectedItems],
  );

  const handleWhatsAppOrder = useCallback(() => {
    const orderItems: OrderItem[] = selectedList.map((s) => ({
      name: s.item.name,
      quantity: s.quantity,
      price: s.item.price,
      note: s.note || undefined,
    }));
    const message = formatOrderMessage(orderItems);
    if (message) {
      openWhatsApp(message);
    }
  }, [selectedList]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    import("@/lib/gsap").then(({ initGSAP, gsap, ScrollTrigger }) => {
      initGSAP();
      gsapModule.current = { gsap, ScrollTrigger };

      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-reveal]",
          {
            y: 80,
            opacity: 0,
            filter: "blur(12px)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-menu-grid]",
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      scrollCtx.current = ctx;
    });

    return () => {
      scrollCtx.current?.revert();
    };
  }, []);

  useEffect(() => {
    const mod = gsapModule.current;
    if (!mod) return;
    if (prevCategoryRef.current === activeCategory) return;
    prevCategoryRef.current = activeCategory;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || !gridRef.current) return;

    mod.ScrollTrigger.getAll().forEach((st: any) => {
      if (st.vars.trigger === gridRef.current) st.kill();
    });

    const cards =
      gridRef.current.querySelectorAll<HTMLElement>("[data-menu-card]");
    mod.gsap.fromTo(
      cards,
      { opacity: 0, y: 32, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
  }, [activeCategory, filteredItems.length]);

  return (
    <div className="relative bg-lroma-black overflow-x-hidden">
      {/* Category navigation — floating glass pill */}
      <div
        ref={categoryBarRef}
        className={cn(
          "sticky z-30 transition-all duration-500",
          scrolled ? "top-20" : "top-6",
        )}
      >
        <div className="mx-auto max-w-fit px-4">
          <div className="rounded-full p-[1px] bg-gradient-to-r from-white/[0.06] via-white/[0.1] to-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <nav
              role="tablist"
              aria-label="Categorías del menú"
              className="flex gap-0.5 overflow-x-auto rounded-full bg-black/60 backdrop-blur-2xl px-1.5 py-1.5 scrollbar-none"
            >
              {availableCategoryKeys.map((cat) => {
                const isActive = activeCategory === cat.key;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(cat.key)}
                    className={cn(
                      "relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                      isActive
                        ? "bg-lroma-red text-white shadow-[0_0_20px_rgba(231,49,52,0.35)]"
                        : "text-white/45 hover:text-white/75 hover:bg-white/[0.04]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 transition-transform duration-300",
                        isActive && "scale-110",
                      )}
                    />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Menu items — asymmetrical bento grid */}
      <section
        data-menu-grid
        className="relative z-10 px-6 pt-12 pb-32 md:pt-20 md:pb-40"
        aria-label="Menú"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section eyebrow */}
          <div className="mb-10 flex items-center gap-3 md:mb-14">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-white/25 uppercase shrink-0">
              {activeCategory === "all"
                ? "Todos los platos"
                : availableCategoryKeys.find((c) => c.key === activeCategory)
                    ?.label}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-white/[0.06] to-transparent">
                <div className="rounded-[calc(1.5rem-1px)] bg-black/30 backdrop-blur-sm px-12 py-16">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <UtensilsCrossed className="size-7 text-white/20" />
                  </div>
                  <p className="text-lg font-medium text-white/40">
                    No hay platos en esta categoría por ahora.
                  </p>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-lroma-gold transition-all duration-300 hover:bg-white/[0.1]"
                  >
                    <Sparkles className="size-3.5" />
                    Ver todo el menú
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bento grid */}
          <div
            ref={gridRef}
            className="grid gap-4 md:grid-cols-3 md:gap-5 auto-rows-auto"
          >
            {filteredItems.map((item) => {
              const qty = getQuantity(item.id);
              if (item.featured) {
                return (
                  <FeaturedMenuItemCard
                    key={item.id}
                    item={item}
                    quantity={qty}
                    onAdd={() => addItem(item)}
                    onRemove={() => removeItem(item)}
                  />
                );
              }
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantity={qty}
                  onAdd={() => addItem(item)}
                  onRemove={() => removeItem(item)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* WhatsApp order builder — expandable floating panel */}
      {orderExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-300 md:hidden"
          onClick={() => setOrderExpanded(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "bottom-0 left-0 right-0 md:bottom-8 md:left-auto md:right-8",
          selectedCount > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none md:translate-y-4",
          orderExpanded ? "md:w-[420px]" : "md:w-auto",
        )}
      >
        <div className="rounded-t-3xl md:rounded-3xl p-[1px] bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent shadow-[0_-8px_32px_rgba(0,0,0,0.4)] md:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="rounded-t-[calc(1.5rem-1px)] md:rounded-[calc(1.5rem-1px)] bg-black/85 backdrop-blur-2xl overflow-hidden">
            {orderExpanded ? (
              <ExpandedOrder
                selectedList={selectedList}
                totalPrice={totalPrice}
                updateNote={updateNote}
                addItem={addItem}
                removeItem={removeItem}
                setQuantity={setQuantity}
                clearOrder={clearOrder}
                onSend={handleWhatsAppOrder}
                onClose={() => setOrderExpanded(false)}
              />
            ) : (
              <CollapsedBar
                selectedCount={selectedCount}
                totalPrice={totalPrice}
                onExpand={() => setOrderExpanded(true)}
                onSend={handleWhatsAppOrder}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItemData;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <article
      data-menu-card
      data-reveal
      className="group flex flex-col contain-content"
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-white/[0.07] via-white/[0.04] to-white/[0.02] transition-shadow duration-500 group-hover:shadow-[0_0_30px_rgba(231,49,52,0.06)]">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-black/50 backdrop-blur-md transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-black/60">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={getUnsplashUrl(item.image, 400)}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              aria-hidden="true"
            />

            {/* Featured badge */}
            {item.featured && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-lroma-gold/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-black uppercase backdrop-blur-sm">
                <Sparkles className="size-2.5" />
                Destacado
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-heading text-lg font-bold text-white/90 leading-snug">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-white/35 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-lroma-gold">
                {formatPrice(item.price)}
              </span>
              {quantity === 0 ? (
                <button
                  onClick={onAdd}
                  className="group/btn flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition-all duration-300 hover:border-lroma-red/30 hover:bg-lroma-red/10 hover:text-white"
                  aria-label={`Agregar ${item.name}`}
                >
                  <Plus className="size-3.5 transition-transform duration-300 group-hover/btn:rotate-90" />
                  Agregar
                </button>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-lroma-red/10 px-2 py-1.5 ring-1 ring-lroma-red/20">
                  <button
                    onClick={onRemove}
                    className="flex size-7 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                    aria-label={`Quitar ${item.name}`}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={onAdd}
                    className="flex size-7 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                    aria-label={`Agregar más ${item.name}`}
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedMenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItemData;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <article
      data-menu-card
      data-reveal
      className="group flex flex-col md:col-span-2"
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-lroma-gold/[0.12] via-white/[0.05] to-lroma-red/[0.06] transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(212,168,83,0.08)]">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-black/50 backdrop-blur-md transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-black/60 md:flex-row">
          <div className="relative aspect-[16/10] overflow-hidden md:w-[55%] md:aspect-auto">
            <img
              src={getUnsplashUrl(item.image, 600)}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/40"
              aria-hidden="true"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-lroma-gold/90 px-3 py-1.5 text-[10px] font-bold tracking-wider text-black uppercase backdrop-blur-sm">
              <Sparkles className="size-3" />
              Destacado
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
            <h3 className="font-heading text-2xl font-bold text-white/90 leading-tight md:text-3xl">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-3 text-[15px] leading-relaxed text-white/40 md:text-base">
                {item.description}
              </p>
            )}
            <div className="mt-6 flex items-center justify-between">
              <span className="font-heading text-2xl font-semibold text-lroma-gold md:text-3xl">
                {formatPrice(item.price)}
              </span>
              {quantity === 0 ? (
                <button
                  onClick={onAdd}
                  className="group/btn flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-lroma-red/30 hover:bg-lroma-red/10 hover:text-white"
                  aria-label={`Agregar ${item.name}`}
                >
                  <Plus className="size-4 transition-transform duration-300 group-hover/btn:rotate-90" />
                  Agregar
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-lroma-red/10 px-3 py-2 ring-1 ring-lroma-red/20">
                  <button
                    onClick={onRemove}
                    className="flex size-8 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                    aria-label={`Quitar ${item.name}`}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-[1.75rem] text-center text-base font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={onAdd}
                    className="flex size-8 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
                    aria-label={`Agregar más ${item.name}`}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CollapsedBar({
  selectedCount,
  totalPrice,
  onExpand,
  onSend,
}: {
  selectedCount: number;
  totalPrice: number;
  onExpand: () => void;
  onSend: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExpand();
        }
      }}
      className="group flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-300 hover:bg-white/[0.03] cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lroma-red/15">
          <ShoppingBag className="size-4 text-lroma-red" />
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
          onClick={(e) => {
            e.stopPropagation();
            onSend();
          }}
          className="flex size-9 items-center justify-center rounded-full bg-lroma-red transition-all duration-300 hover:bg-lroma-red/90 active:scale-[0.95] shadow-[0_0_16px_rgba(231,49,52,0.3)]"
          aria-label="Enviar pedido por WhatsApp"
        >
          <MessageCircle className="size-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function ExpandedOrder({
  selectedList,
  totalPrice,
  updateNote,
  addItem,
  removeItem,
  setQuantity,
  clearOrder,
  onSend,
  onClose,
}: {
  selectedList: SelectedItem[];
  totalPrice: number;
  updateNote: (itemId: string, note: string) => void;
  addItem: (item: MenuItemData) => void;
  removeItem: (item: MenuItemData) => void;
  setQuantity: (item: MenuItemData, quantity: number) => void;
  clearOrder: () => void;
  onSend: () => void;
  onClose: () => void;
}) {
  const [openNotes, setOpenNotes] = useState<Set<string>>(new Set());

  const toggleNote = (id: string) => {
    setOpenNotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex max-h-[70dvh] flex-col md:max-h-[60dvh]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="size-4 text-lroma-red" />
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
            <Trash2 className="size-3" />
            <span className="hidden sm:inline">Vaciar</span>
          </button>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-white/30 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/60"
            aria-label="Cerrar pedido"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3 space-y-1">
        {selectedList.map(({ item, quantity, note }) => {
          const itemTotal = item.price * quantity;
          const noteOpen = openNotes.has(item.id);
          const hasNote = note.trim().length > 0;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 transition-colors duration-200 hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-3">
                <img
                  src={getUnsplashUrl(item.image, 200)}
                  alt=""
                  className="mt-0.5 size-12 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/85">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-white/35">
                        {formatPrice(item.price)} c/u
                      </p>
                    </div>
                    <span className="shrink-0 font-heading text-sm font-semibold text-lroma-gold">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex items-center gap-0.5 rounded-full bg-white/[0.05] px-1 py-0.5 ring-1 ring-white/[0.06]">
                      <button
                        onClick={() =>
                          quantity <= 1
                            ? setQuantity(item, 0)
                            : removeItem(item)
                        }
                        className="flex size-7 items-center justify-center rounded-full text-white/50 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                        aria-label={`Reducir ${item.name}`}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-[1.75rem] text-center text-sm font-bold text-white tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="flex size-7 items-center justify-center rounded-full text-white/50 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
                        aria-label={`Agregar más ${item.name}`}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => toggleNote(item.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        hasNote || noteOpen
                          ? "bg-lroma-gold/10 text-lroma-gold ring-1 ring-lroma-gold/20"
                          : "text-white/35 hover:bg-white/[0.05] hover:text-white/55",
                      )}
                    >
                      <StickyNote className="size-3" />
                      <span className="hidden sm:inline">Nota</span>
                    </button>
                  </div>

                  {noteOpen && (
                    <div className="mt-2.5">
                      <textarea
                        value={note}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        placeholder="Ej: sin cebolla, término medio, sin sal..."
                        rows={2}
                        maxLength={120}
                        className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-white/70 placeholder:text-white/20 focus:border-lroma-gold/30 focus:outline-none focus:ring-1 focus:ring-lroma-gold/20 transition-colors duration-200"
                        autoFocus
                      />
                      <p className="mt-1 text-right text-[10px] text-white/20">
                        {note.length}/120
                      </p>
                    </div>
                  )}

                  {!noteOpen && hasNote && (
                    <p className="mt-2 text-xs leading-relaxed text-white/30 italic line-clamp-1">
                      &ldquo;{note.trim()}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
          onClick={onSend}
          className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-lroma-red px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-lroma-red/90 active:scale-[0.98] shadow-[0_0_24px_rgba(231,49,52,0.3)]"
        >
          <MessageCircle className="size-4" />
          Enviar por WhatsApp
          <span className="flex size-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
            <ChevronUp className="size-3 rotate-45" />
          </span>
        </button>
      </div>
    </div>
  );
}
