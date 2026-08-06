"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { MessageCircle, Plus, Minus } from "lucide-react";
import gsap from "gsap";
import { formatOrderMessage, openWhatsApp, type OrderItem } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

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
}

// ─── Category config ─────────────────────────────────────────────────────────

const CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: "all", label: "Todos", emoji: "📋" },
  { key: "pizzas", label: "Pizzas", emoji: "🍕" },
  { key: "burgers", label: "Hamburguesas", emoji: "🍔" },
  { key: "hots", label: "Hot Dogs", emoji: "🌭" },
  { key: "sandwiches", label: "Sandwiches", emoji: "🥪" },
  { key: "pastas", label: "Pastas", emoji: "🍝" },
  { key: "grill", label: "Parrilla", emoji: "🥩" },
  { key: "picadas", label: "Picadas", emoji: "🧀" },
  { key: "alitas", label: "Alitas", emoji: "🍗" },
  { key: "drinks", label: "Bebidas", emoji: "🥤" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MenuPage({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(
    new Map()
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const prevCategoryRef = useRef<string>("all");

  // ── Derived state ──────────────────────────────────────────────────────

  // Only show categories that have items
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
    return selectedList.reduce(
      (acc, s) => acc + s.item.price * s.quantity,
      0
    );
  }, [selectedList]);

  // ── Actions ─────────────────────────────────────────────────────────────

  const addItem = useCallback((item: MenuItemData) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      next.set(item.id, {
        item,
        quantity: existing ? existing.quantity + 1 : 1,
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
        next.set(item.id, { ...existing, quantity: existing.quantity - 1 });
      }
      return next;
    });
  }, []);

  const getQuantity = useCallback(
    (id: string) => selectedItems.get(id)?.quantity || 0,
    [selectedItems]
  );

  const handleWhatsAppOrder = useCallback(() => {
    const orderItems: OrderItem[] = selectedList.map((s) => ({
      name: s.item.name,
      quantity: s.quantity,
      price: s.item.price,
    }));
    const message = formatOrderMessage(orderItems);
    if (message) {
      openWhatsApp(message);
    }
  }, [selectedList]);

  // ── GSAP stagger animation on category change ──────────────────────────

  useEffect(() => {
    if (prevCategoryRef.current === activeCategory) return;
    prevCategoryRef.current = activeCategory;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll<HTMLElement>("[data-menu-card]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "transform",
      }
    );
  }, [activeCategory, filteredItems.length]);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-[100dvh] bg-[#0A0A0A]">
      {/* ================================================================
          Hero banner
          ================================================================ */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:pb-24 md:pt-48">
        {/* Subtle red radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(231,49,52,0.08) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-lroma-gold uppercase">
            Carta
          </span>
          <h1 className="mt-4 font-heading text-[clamp(2.5rem,8vw,5rem)] leading-none text-white">
            Nuestro Menú
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/50 md:text-base">
            Pizza artesanal, parrilla, pastas y más. Elegí tus platos y pedí
            directo por WhatsApp.
          </p>
        </div>
      </section>

      {/* ================================================================
          Category filter pills — sticky on scroll
          ================================================================ */}
      <div className="sticky top-20 z-30 border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div
            role="tablist"
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none md:flex-wrap md:justify-center"
          >
            {availableCategoryKeys.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-lroma-red text-white shadow-[0_0_12px_rgba(231,49,52,0.4)]"
                      : "border border-white/10 text-white/60 hover:border-white/25 hover:text-white/90"
                  )}
                >
                  <span aria-hidden="true">{cat.emoji}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================
          Menu items grid
          ================================================================ */}
      <section className="px-6 py-12 md:py-20" aria-label="Menú">
        <div className="mx-auto max-w-7xl">
          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl" aria-hidden="true">🍽️</span>
              <p className="mt-4 text-lg text-white/60">
                No hay platos en esta categoría por ahora.
              </p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-3 text-sm font-medium text-lroma-gold underline underline-offset-4 hover:text-lroma-gold/80"
              >
                Ver todo el menú
              </button>
            </div>
          )}

          {/* Cards grid */}
          <div
            ref={gridRef}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5"
          >
            {filteredItems.map((item) => {
              const qty = getQuantity(item.id);
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

      {/* ================================================================
          WhatsApp builder — floating bottom bar
          ================================================================ */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl md:bottom-6 md:left-auto md:right-6 md:rounded-2xl md:border md:shadow-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:max-w-md md:px-5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {selectedCount} {selectedCount === 1 ? "item" : "items"}{" "}
                seleccionado{selectedCount !== 1 && "s"}
              </p>
              <p className="mt-0.5 font-heading text-lg font-bold text-lroma-gold">
                Total: {formatPrice(totalPrice)}
              </p>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="flex shrink-0 items-center gap-2 rounded-full bg-lroma-red px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-lroma-red/90 active:scale-[0.97] shadow-[0_0_20px_rgba(231,49,52,0.3)]"
            >
              <MessageCircle className="size-4" />
              Pedir por WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MenuItemCard ────────────────────────────────────────────────────────────

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
      className="group flex flex-col overflow-hidden"
    >
      {/* Double-Bezel glass architecture */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-white/10 to-white/5">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-black/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-black/70">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
              aria-hidden="true"
            />

            {/* Featured badge */}
            {item.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-lroma-gold/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-black uppercase">
                Destacado
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-heading text-lg font-bold text-white leading-snug">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-white/50 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-lroma-gold">
                {formatPrice(item.price)}
              </span>

              {/* Add / quantity controls */}
              {quantity === 0 ? (
                <button
                  onClick={onAdd}
                  className="flex items-center gap-1 rounded-full border border-lroma-red/30 px-3.5 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:border-lroma-red/50 hover:bg-lroma-red/15"
                  aria-label={`Agregar ${item.name}`}
                >
                  <Plus className="size-3.5" />
                  Agregar
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-lroma-red/15 px-3 py-1.5">
                  <button
                    onClick={onRemove}
                    className=" flex size-6 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label={`Quitar ${item.name}`}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="min-w-[1.25rem] text-center text-sm font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={onAdd}
                    className="flex size-6 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
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
