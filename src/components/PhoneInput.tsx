"use client";

import { PHONE_PREFIXES, defaultPhonePrefix } from "@/lib/phone";
import { useLocale } from "@/components/LocaleProvider";

type Props = {
  prefix: string;
  number: string;
  onPrefixChange: (prefix: string) => void;
  onNumberChange: (value: string) => void;
  inputClassName: string;
  required?: boolean;
};

export function PhoneInput({
  prefix,
  number,
  onPrefixChange,
  onNumberChange,
  inputClassName,
  required = true,
}: Props) {
  const { dict, locale } = useLocale();
  const selected = prefix || defaultPhonePrefix(locale);
  const chrome = inputClassName
    .replace(/\bw-full\b/g, "")
    .replace(/\bpx-\S+/g, "")
    .replace(/\bpy-\S+/g, "")
    .replace(/\bp-\S+/g, "")
    .trim();

  return (
    <div>
      <span className="mb-1 block text-sm font-medium">
        {dict.common.phone}
        {required ? " *" : ""}
      </span>
      <div
        className={`${chrome} flex w-full items-stretch overflow-hidden p-0`}
      >
        <label className="sr-only" htmlFor="phone-prefix">
          {dict.common.phonePrefix}
        </label>
        <div className="relative w-[3.75rem] shrink-0">
          <select
            id="phone-prefix"
            className="h-full w-full cursor-pointer appearance-none border-0 bg-transparent py-2.5 pl-2.5 pr-5 text-sm tabular-nums outline-none focus:ring-0"
            value={selected}
            onChange={(e) => onPrefixChange(e.target.value)}
            required={required}
          >
            {PHONE_PREFIXES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-ink-muted">
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M2.5 4.5 6 8l3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <span className="my-2 w-px shrink-0 bg-sand-line" aria-hidden />
        <input
          type="tel"
          inputMode="tel"
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-0"
          value={number}
          onChange={(e) => onNumberChange(e.target.value)}
          required={required}
          autoComplete="tel-national"
          placeholder={dict.common.phoneNumber}
        />
      </div>
    </div>
  );
}
