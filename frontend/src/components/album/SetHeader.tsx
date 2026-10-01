export function SetHeader({
  setName,
  icon,
}: {
  setName: string;
  icon: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card shadow-md">
          <div
            role="img"
            aria-label="Tales of Middle-earth set icon"
            className="h-8 w-12 bg-amber-300"
            style={{
              maskImage: `url(${icon})`,
              WebkitMaskImage: `url(${icon})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        </span>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Set album
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-amber-100">
            {setName}
          </h1>
        </div>
      </div>
    </div>
  );
}
