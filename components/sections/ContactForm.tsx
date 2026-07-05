"use client";

/**
 * Contact form — React Hook Form + Zod validation, honeypot spam trap,
 * loading state on the submit button, and an animated glass success card.
 * Posts to /api/contact (a stub route — wire it to email/CRM later).
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MagneticButton from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/icons";

const contactSchema = z.object({
  name: z.string().min(2, "Tell us your name."),
  email: z.string().email("That email doesn't look right."),
  company: z.string().optional(),
  service: z.enum(
    ["web-development", "ui-ux", "content", "ai-automation", "not-sure"],
    { errorMap: () => ({ message: "Pick the closest match." }) },
  ),
  budget: z
    .enum(["under-5k", "5k-15k", "15k-50k", "50k-plus", "flexible", ""])
    .optional(),
  message: z.string().min(10, "Give us a sentence or two about the project."),
  // Honeypot — humans never see this field; bots fill it.
  website: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

const serviceOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "content", label: "Content" },
  { value: "ai-automation", label: "AI Automation" },
  { value: "not-sure", label: "Not sure yet" },
];

const budgetOptions = [
  { value: "", label: "Prefer not to say" },
  { value: "under-5k", label: "Under $5k" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-50k", label: "$15k – $50k" },
  { value: "50k-plus", label: "$50k+" },
  { value: "flexible", label: "Flexible / ongoing" },
];

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { service: "not-sure", budget: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass glass--panel flex flex-col items-center gap-6 p-10 text-center sm:p-14">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="44"
            cy="44"
            r="40"
            stroke="var(--color-accent)"
            strokeWidth="2"
            className="check-circle-draw"
            strokeLinecap="round"
          />
          <path
            d="M28 45.5 39 56l21-24"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-draw"
          />
        </svg>
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Message received.
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-secondary">
            We reply within one business day. In the meantime, think about the
            workflow you most want to never do manually again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            reset();
            setStatus("idle");
          }}
          className="link-underline pb-1 font-mono text-xs uppercase tracking-eyebrow text-accent"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass glass--panel p-6 sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow mb-2 block">
            Name *
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            className="field"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p role="alert" className="mt-2 text-xs text-accent-bright">
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="eyebrow mb-2 block">
            Email *
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ada@company.com"
            className="field"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p role="alert" className="mt-2 text-xs text-accent-bright">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="company" className="eyebrow mb-2 block">
            Company
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            className="field"
            {...register("company")}
          />
        </div>

        <div>
          <label htmlFor="service" className="eyebrow mb-2 block">
            Service *
          </label>
          <div className="relative">
            <select
              id="service"
              className="field appearance-none pr-10"
              aria-invalid={!!errors.service}
              {...register("service")}
            >
              {serviceOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-bg-elevated text-ink"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-tertiary"
            />
          </div>
          {errors.service ? (
            <p role="alert" className="mt-2 text-xs text-accent-bright">
              {errors.service.message}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="budget" className="eyebrow mb-2 block">
            Budget range
          </label>
          <div className="relative">
            <select
              id="budget"
              className="field appearance-none pr-10"
              {...register("budget")}
            >
              {budgetOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-bg-elevated text-ink"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-tertiary"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="eyebrow mb-2 block">
            Message *
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="What slows your team down every week?"
            className="field resize-y"
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {errors.message ? (
            <p role="alert" className="mt-2 text-xs text-accent-bright">
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot — visually hidden, ignored by humans */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <MagneticButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <span className="spinner h-4 w-4" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Icon name="arrow-right" size={18} />
            </>
          )}
        </MagneticButton>
        {status === "error" ? (
          <p role="alert" className="text-sm text-accent-bright">
            Something went wrong — email us directly instead.
          </p>
        ) : null}
      </div>
    </form>
  );
}
