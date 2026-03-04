export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Decorative */}
      <div className="relative hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="flex flex-col items-center gap-6 px-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-8 w-8 text-primary-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground">
            Controle Certo
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-primary-foreground/80">
            Gerencie suas finanças com inteligência. Controle receitas,
            despesas, cartões e investimentos em um só lugar.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-primary-foreground/10 p-4">
              <span className="text-2xl font-bold text-primary-foreground">
                100%
              </span>
              <span className="text-xs text-primary-foreground/70">
                Gratuito
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-primary-foreground/10 p-4">
              <span className="text-2xl font-bold text-primary-foreground">
                Seguro
              </span>
              <span className="text-xs text-primary-foreground/70">
                Seus dados
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-primary-foreground/10 p-4">
              <span className="text-2xl font-bold text-primary-foreground">
                Simples
              </span>
              <span className="text-xs text-primary-foreground/70">
                De usar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full items-center justify-center bg-background p-6 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
