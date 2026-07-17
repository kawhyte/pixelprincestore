import { generateMetadata as buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  noIndex: false,
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-soft-charcoal">
        Effective date: July 17, 2026
      </p>

      <section>
        <h2 className="mb-3 mt-10 font-serif text-2xl font-semibold text-charcoal">
          What we collect
        </h2>
        <p className="text-soft-charcoal">
          When you request a free download or subscribe to our list, we collect your
          email address. We also collect anonymous, cookieless analytics via Umami to
          understand which pages and prints are popular — this data cannot be tied back
          to you personally.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-10 font-serif text-2xl font-semibold text-charcoal">
          What we do with it
        </h2>
        <p className="text-soft-charcoal">
          We use your email to send you the download link you requested and, if you
          opt in, one monthly email featuring a new free print and shop news. That&apos;s
          it — we don&apos;t send anything else, and we never sell or share your data with
          third parties.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-10 font-serif text-2xl font-semibold text-charcoal">
          Where it lives
        </h2>
        <p className="text-soft-charcoal">
          Email delivery and list management is handled by Resend. Download history
          (used only to enforce the 3-download-per-week fair-use limit) is stored in
          Sanity.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-10 font-serif text-2xl font-semibold text-charcoal">
          Your rights
        </h2>
        <p className="text-soft-charcoal">
          Every marketing email includes an unsubscribe link. You can also email{" "}
          <a href="mailto:hello@thepixelprince.com" className="underline hover:text-sage-500">
            hello@thepixelprince.com
          </a>{" "}
          at any time to request that your data be deleted, in line with GDPR and CCPA.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-10 font-serif text-2xl font-semibold text-charcoal">
          Cookies
        </h2>
        <p className="text-soft-charcoal">
          We don&apos;t use tracking cookies. Our analytics (Umami) are cookieless by
          design.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-10 font-serif text-2xl font-semibold text-charcoal">
          Contact
        </h2>
        <p className="text-soft-charcoal">
          Questions about this policy? Email{" "}
          <a href="mailto:hello@thepixelprince.com" className="underline hover:text-sage-500">
            hello@thepixelprince.com
          </a>
          .
        </p>
        <p className="mt-4 text-soft-charcoal">
          [KENNY: add your business mailing address here — required by CAN-SPAM]
        </p>
      </section>
    </div>
  );
}
