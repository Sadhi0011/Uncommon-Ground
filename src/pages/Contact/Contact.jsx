import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { brand } from '../../data/brand';
import Seo from '../../components/ui/Seo';
import Reveal from '../../components/ui/Reveal';
import Select from '../../components/ui/Select';
import { cn } from '../../utils/format';

const inquiryTypes = [
  'General Inquiry',
  'Bulk Orders',
  'Wholesale Inquiries',
  'Retail Partnerships',
  'Podcast Guest',
  'Other',
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { type: '' } });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Seo
        title="Contact"
        description={`Get in touch with ${brand.name}. ${brand.contact.phone} · ${brand.contact.email}`}
        path="/contact"
      />

      <section className="bg-ink-900 py-16 lg:py-24">
        <div className="container-luxe">
          <Reveal>
            <span className="eyebrow">Get in Touch</span>
            <h1 className="display-hero mt-4 text-5xl text-sand sm:text-6xl">Contact Us</h1>
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left — contact details */}
            <div className="space-y-8">
              <Reveal>
                <p className="text-lg leading-relaxed text-haze">
                  Whether you have a question about our jerky, want to place a bulk order, or are
                  interested in partnering with us — we would love to hear from you.
                </p>
              </Reveal>

              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Phone', value: brand.contact.phone, href: brand.contact.phoneHref },
                  { icon: Mail, label: 'Email', value: brand.contact.email, href: `mailto:${brand.contact.email}` },
                  { icon: MapPin, label: 'Address', value: brand.contact.address, href: `https://maps.google.com/?q=${encodeURIComponent(brand.contact.mapsQuery)}` },
                ].map((item) => (
                  <Reveal key={item.label}>
                    <a
                      href={item.href}
                      target={item.icon === MapPin ? '_blank' : undefined}
                      rel={item.icon === MapPin ? 'noreferrer' : undefined}
                      className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-ink-800/60 p-5 transition-colors hover:border-ember/40"
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ember/15 text-ember">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-luxe text-haze">{item.label}</p>
                        <p className="mt-1 text-sm text-sand transition-colors group-hover:text-ember">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  </Reveal>
                ))}
              </div>

              {/* Map embed */}
              <Reveal>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <iframe
                    title="Uncommon Ground location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(brand.contact.mapsQuery)}&output=embed`}
                    width="100%"
                    height="220"
                    loading="lazy"
                    className="border-0"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            </div>

            {/* Right — form */}
            <Reveal>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-3xl border border-white/10 bg-ink-800/60 p-8"
                noValidate
              >
                <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-sand">
                  Send a Message
                </h2>

                <div className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First Name" error={errors.firstName?.message}>
                      <input
                        {...register('firstName', { required: 'First name is required' })}
                        className={inputClass(errors.firstName)}
                        placeholder="Jane"
                      />
                    </Field>
                    <Field label="Last Name" error={errors.lastName?.message}>
                      <input
                        {...register('lastName', { required: 'Last name is required' })}
                        className={inputClass(errors.lastName)}
                        placeholder="Doe"
                      />
                    </Field>
                  </div>

                  <Field label="Email" error={errors.email?.message}>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                      })}
                      className={inputClass(errors.email)}
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field label="Inquiry Type" error={errors.type?.message}>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: 'Please select a type' }}
                      render={({ field }) => (
                        <Select
                          name={field.name}
                          options={inquiryTypes}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={Boolean(errors.type)}
                          placeholder="Select..."
                        />
                      )}
                    />
                  </Field>

                  <Field label="Message" error={errors.message?.message}>
                    <textarea
                      rows={5}
                      {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                      className={cn(inputClass(errors.message), 'resize-none')}
                      placeholder="Tell us how we can help..."
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary mt-8 w-full text-[#fff] disabled:opacity-60"
                >
                  <Send size={16} /> {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitted && (
                  <p className="mt-4 text-center text-sm text-teal" role="status">
                    Thank you! We will get back to you soon.
                  </p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Bulk / Wholesale / Retail */}
      <section className="border-t border-white/10 bg-ink-800 py-20">
        <div className="container-luxe">
          <h2 className="font-display text-center text-3xl uppercase tracking-wide text-sand">
            Business Inquiries
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Bulk Orders', desc: 'Stock up for events, teams, or gifts. Volume pricing available.' },
              { title: 'Wholesale', desc: 'Carry Uncommon Ground in your store or venue. Let us talk terms.' },
              { title: 'Retail Partnerships', desc: 'Collaborate on co-branded products, pop-ups, or retail displays.' },
            ].map((item) => (
              <Reveal key={item.title}>
                <div className="rounded-2xl border border-white/10 bg-ink-700/60 p-8 text-center">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-ember">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-haze">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe text-haze">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return cn(
    'w-full rounded-xl border bg-ink-700 px-4 py-3 text-sm text-sand placeholder:text-haze/60 focus:outline-none transition-colors',
    error ? 'border-red-400/60 focus:border-red-400' : 'border-white/10 focus:border-ember'
  );
}
