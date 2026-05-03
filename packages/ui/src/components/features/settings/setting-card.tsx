import React from "react";

type SettingCardProps = {
  title: React.JSX.Element;
  description: React.JSX.Element;
  switchComponent: React.JSX.Element;
};

export function SettingCard({
  title,
  description,
  switchComponent,
}: SettingCardProps) {
  return (
    <div className="flex px-4 py-2 mt-4 w-full space-x-4 items-center h-fit bg-black/5 dark:bg-white/10 rounded-sm shadow-md">
      {switchComponent}
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
