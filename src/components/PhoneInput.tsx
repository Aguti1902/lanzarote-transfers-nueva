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

  return (
    <div>
      <span className="mb-1 block text-sm font-medium">
        {dict.common.phone}
        {required ? " *" : ""}
      </span>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="phone-prefix">
          {dict.common.phonePrefix}
        </label>
        <select
          id="phone-prefix"
          className={`${inputClassName} w-[7.5rem] shrink-0`}
          value={selected}
          onChange={(e) => onPrefixChange(e.target.value)}
          required={required}
        >
          {PHONE_PREFIXES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.region} {item.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="tel"
          className={inputClassName}
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
