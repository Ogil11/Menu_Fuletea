import { Clock, MapPin, Phone } from "lucide-react";
import { business } from "@/data/business";
import { greetingUrl } from "@/lib/whatsapp";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact() {
  const { whatsapp, address, hours } = business;

  return (
    <section id="contacto" aria-labelledby="contact-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grain relative isolate overflow-hidden rounded-[2rem] border border-white/[0.07] bg-ink-2 p-6 sm:p-12">
          <div
            aria-hidden="true"
            className="absolute -right-32 -top-32 -z-10 size-96 rounded-full bg-[radial-gradient(closest-side,rgb(255_121_0/0.25),transparent)]"
          />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <SectionHeading
                id="contact-title"
                eyebrow="Contacto"
                title="¿Con hambre?"
                description="Escríbenos por WhatsApp para pedidos, dudas o para confirmar tu domicilio."
              />
              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
                <a
                  href={greetingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("whatsapp", "lg")}
                >
                  <WhatsAppIcon className="size-5" />
                  Escribir por WhatsApp
                </a>
                <a href="#menu" className={buttonClasses("secondary", "lg")}>
                  Ver el menú
                </a>
              </div>
            </div>

            <dl className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl bg-ink/60 p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted">WhatsApp</dt>
                  <dd>
                    <a
                      href={`https://wa.me/${whatsapp.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="price text-lg font-semibold hover:text-brand"
                    >
                      {whatsapp.display}
                    </a>
                  </dd>
                </div>
              </div>
              {address && (
                <div className="flex items-center gap-4 rounded-2xl bg-ink/60 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted">Dirección</dt>
                    <dd className="font-semibold">{address}</dd>
                  </div>
                </div>
              )}
              {hours.length > 0 && (
                <div className="flex items-start gap-4 rounded-2xl bg-ink/60 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Clock className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted">Horario</dt>
                    {hours.map((h) => (
                      <dd key={h.days} className="font-semibold">
                        {h.days}: <span className="font-normal text-paper/80">{h.time}</span>
                      </dd>
                    ))}
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
