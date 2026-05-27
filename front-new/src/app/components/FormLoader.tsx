interface FormLoaderProps {
  text?: string;
}

export function FormLoader({ text }: FormLoaderProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[1px]">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="size-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
        {text ? <span className="text-sm">{text}</span> : null}
      </div>
    </div>
  );
}
