"use client";

import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/providers/LanguageProvider";

export default function Home() {
  const { t } = useLanguageContext();

  return <Button>{t.login.slogan}</Button>;
}
