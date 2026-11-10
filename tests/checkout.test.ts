import { describe, expect, it } from "vitest";
import { getProductById } from "@/data/catalog";
import { createCartItem } from "@/lib/cart";
import { isValidColombianPhone, validateCheckout } from "@/lib/validation";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";
import type { CheckoutData } from "@/types";

const base: CheckoutData = {
  name: "Juan Pérez",
  phone: "300 000 0000",
  deliveryMode: "domicilio",
  address: "Calle 10 # 20-30, Centro",
  reference: "",
  paymentMethod: "efectivo",
  notes: "Sin cebolla.",
};

const items = [
  createCartItem({ product: getProductById("perro-ranchero")!, quantity: 2 }),
  createCartItem({ product: getProductById("salchipapa-sencilla")!, quantity: 1 }),
];

describe("validación del checkout", () => {
  it("acepta datos válidos", () => {
    expect(validateCheckout(base)).toEqual({});
  });

  it("exige nombre, teléfono válido y dirección para domicilio", () => {
    const e = validateCheckout({ ...base, name: " ", phone: "123", address: "" });
    expect(Object.keys(e).sort()).toEqual(["address", "name", "phone"]);
  });

  it("no exige dirección al recoger", () => {
    expect(validateCheckout({ ...base, deliveryMode: "recoger", address: "" })).toEqual({});
  });

  it("valida teléfonos colombianos", () => {
    expect(isValidColombianPhone("3023705830")).toBe(true);
    expect(isValidColombianPhone("+57 302 370 5830")).toBe(true);
    expect(isValidColombianPhone("6017654321")).toBe(true);
    expect(isValidColombianPhone("2023705830")).toBe(false);
    expect(isValidColombianPhone("30237058")).toBe(false);
  });
});

describe("mensaje de WhatsApp", () => {
  it("genera el mensaje con el formato esperado y domicilio por confirmar", () => {
    const msg = buildOrderMessage(items, base, null);
    expect(msg).toBe(
      [
        "🍔 FULLETIAO FAST FOOD",
        "NUEVO PEDIDO",
        "",
        "Cliente: Juan Pérez",
        "Teléfono: 3000000000",
        "Modalidad: Domicilio",
        "Dirección: Calle 10 # 20-30, Centro",
        "",
        "PRODUCTOS:",
        "2 x Perro ranchero — $24.000",
        "1 x Salchipapa sencilla — $12.000",
        "",
        "Subtotal: $36.000",
        "Domicilio: Por confirmar",
        "Total de productos: $36.000",
        "",
        "Método de pago: Efectivo",
        "Observaciones: Sin cebolla.",
      ].join("\n"),
    );
    expect(msg).not.toMatch(/confirmado|recibido/i);
  });

  it("al recoger no muestra dirección ni domicilio", () => {
    const msg = buildOrderMessage(items, { ...base, deliveryMode: "recoger", notes: "" }, null);
    expect(msg).toContain("Modalidad: Recoger en el local");
    expect(msg).not.toContain("Dirección");
    expect(msg).not.toContain("Domicilio:");
    expect(msg).not.toContain("Observaciones");
    expect(msg).toContain("Total: $36.000");
  });

  it("solo suma el domicilio si hay tarifa definida", () => {
    const msg = buildOrderMessage(items, base, 4000);
    expect(msg).toContain("Domicilio: $4.000");
    expect(msg).toContain("Total: $40.000");
  });

  it("incluye observaciones por producto y referencia", () => {
    const withNote = [
      createCartItem({ product: getProductById("full-perro")!, quantity: 1, notes: "sin piña" }),
    ];
    const msg = buildOrderMessage(withNote, { ...base, reference: "Casa azul" }, null);
    expect(msg).toContain("1 x Full perro — $20.000\n   Nota: sin piña");
    expect(msg).toContain("Referencia: Casa azul");
  });

  it("codifica correctamente la URL de wa.me", () => {
    const text = buildOrderMessage(items, base, null);
    const url = whatsappUrl(text);
    expect(url.startsWith("https://wa.me/573023705830?text=")).toBe(true);
    expect(url).not.toMatch(/[\s#]/);
    const decoded = decodeURIComponent(url.split("?text=")[1]!);
    expect(decoded).toBe(text);
  });
});
