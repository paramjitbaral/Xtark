import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiCloudflare, SiDocker, SiGithub, SiSupabase, SiVercel } from "react-icons/si";

import { cn } from "@/lib/utils";

export interface ResearchBentoBrand {
  name: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

export interface ResearchBentoGridCopy {
  showcaseTitle: React.ReactNode;
  showcaseDescription: React.ReactNode;
  pricingTitle: React.ReactNode;
  pricingDescription: React.ReactNode;
  pauseTitle: React.ReactNode;
  activeDescription: React.ReactNode;
  pausedDescription: React.ReactNode;
}

export interface ResearchBentoGridProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  monthlyPrice?: number;
  previousPrice?: number;
  currency?: string;
  locale?: string;
  paused?: boolean;
  defaultPaused?: boolean;
  selectedBrand?: number;
  defaultSelectedBrand?: number;
  brands?: readonly ResearchBentoBrand[];
  copy?: Partial<ResearchBentoGridCopy>;
  autoPlay?: boolean;
  brandRotationInterval?: number;
  spotlightInterval?: number;
  userLabel?: string;
  collaboratorLabel?: string;
  onPausedChange?: (paused: boolean) => void;
  onSelectedBrandChange?: (index: number) => void;
}

const spring = { type: "spring", stiffness: 230, damping: 24 } as const;
const LIFTED_TILES = new Set([5, 14, 23, 34, 41, 53, 62, 71, 79, 88, 97, 108, 119, 131, 146, 157, 169, 184, 199, 213, 226, 241]);
const BRIGHT_TILES = new Set([17, 45, 76, 103, 138, 176, 205, 234]);
const INVOICE_BARS = [62, 44, 70, 36, 56];
const DEFAULT_COPY: ResearchBentoGridCopy = {
  showcaseTitle: "One team for your entire stack",
  showcaseDescription: "From product UI to production code, ship focused improvements with the tools your team already trusts.",
  pricingTitle: <>Senior execution.<br />Predictable cost.</>,
  pricingDescription: "Skip expanding headcount for every sprint. Get consistent product and engineering support at a predictable monthly cost.",
  pauseTitle: <>Build on your terms.<br />Pause at any time.</>,
  activeDescription: "Between releases? Pause your workspace and resume when the next sprint is ready.",
  pausedDescription: "Your workspace is paused. Resume whenever the next feature is ready to move.",
};

function ArrowCursor({
  className,
  label,
  inverted = false,
  delay = 0,
  active,
  targetLeft,
}: {
  className?: string;
  label: string;
  inverted?: boolean;
  delay?: number;
  active?: boolean;
  targetLeft?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={cn("absolute z-30 flex flex-col items-start", className)}
      animate={reduceMotion
        ? undefined
        : active !== undefined
          ? active
            ? { x: -3, y: -36, rotate: -1.5 }
            : { x: 0, y: 0, rotate: 0 }
          : targetLeft
            ? { left: targetLeft, x: 0, y: [0, -3, 0], rotate: [0, 1.5, 0] }
            : { x: 0, y: [0, -3, 0], rotate: [0, 1.5, 0] }}
      transition={active !== undefined
        ? {
            duration: active ? 0.68 : 0.82,
            ease: active ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1],
          }
        : targetLeft
          ? {
              left: spring,
              y: { duration: 4.6, delay, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 4.6, delay, repeat: Infinity, ease: "easeInOut" },
            }
          : { duration: 4.6, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none" className="h-auto w-[18px] drop-shadow-md sm:w-[22px] lg:w-[26px]">
        <path
          d="M2.2 2.5 22 15.1l-9.4 2.1-4.1 9.1L2.2 2.5Z"
          className={cn(
            inverted
              ? "fill-white stroke-[#080808]"
              : "fill-[#edff00] stroke-white/70",
          )}
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={cn(
          "ml-2.5 -mt-1 text-[12px] font-semibold tracking-[-0.04em] sm:ml-3 sm:text-[14px] lg:ml-4 lg:text-[17px]",
          inverted
            ? "rounded-full bg-[#f2f2f2] text-black shadow-[0_5px_18px_rgba(0,0,0,0.28)]"
            : cn(
                "rounded-[22px] border border-white/60 bg-[#edff00] text-black",
                active
                  ? "shadow-[0_5px_18px_rgba(0,0,0,0.24),0_0_14px_rgba(237,255,0,0.18)]"
                  : "shadow-[0_5px_18px_rgba(0,0,0,0.22)]",
              ),
        )}
        style={{ padding: '4px 12px', whiteSpace: 'nowrap' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

const DEFAULT_BRANDS: readonly ResearchBentoBrand[] = [
  { name: "Vercel", icon: SiVercel },
  { name: "GitHub", icon: SiGithub },
  { name: "Supabase", icon: SiSupabase },
  { name: "Cloudflare", icon: SiCloudflare },
  { name: "Docker", icon: SiDocker },
];

function BrandMark({ brand }: { brand: ResearchBentoBrand }) {
  const Icon = brand.icon;
  return <Icon className="size-[58%]" aria-hidden />;
}

function Panel({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn(
        "relative isolate overflow-hidden rounded-[15px] border",
        "border-[#292929] bg-black shadow-[inset_0_1px_rgba(255,255,255,0.02),0_12px_32px_rgba(0,0,0,0.22)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function FeatureCopy({ title, children, className }: { title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("absolute inset-x-0 bottom-0 z-20 px-6 pb-6 sm:px-10 sm:pb-8", className)}>
      <h3 className="text-[20px] font-semibold leading-[1.08] tracking-[-0.045em] text-[#f1f1f1] sm:text-[22px]">{title}</h3>
      <p className="max-w-[360px] text-[14px] leading-[1.45] tracking-[-0.015em] text-[#858585] sm:text-[15px] mt-3 sm:mt-4">{children}</p>
    </div>
  );
}

interface DesignsPanelProps {
  brands: readonly ResearchBentoBrand[];
  selectedBrand?: number;
  defaultSelectedBrand: number;
  autoPlay: boolean;
  rotationInterval: number;
  userLabel: string;
  collaboratorLabel: string;
  title: React.ReactNode;
  description: React.ReactNode;
  onSelectedBrandChange?: (index: number) => void;
}

function DesignsPanel({
  brands,
  selectedBrand,
  defaultSelectedBrand,
  autoPlay,
  rotationInterval,
  userLabel,
  collaboratorLabel,
  title,
  description,
  onSelectedBrandChange,
}: DesignsPanelProps) {
  const [internalSelected, setInternalSelected] = React.useState(defaultSelectedBrand);
  const reduceMotion = useReducedMotion();
  const isControlled = selectedBrand !== undefined;
  const selected = Math.min(Math.max(isControlled ? selectedBrand : internalSelected, 0), brands.length - 1);
  const cursorStops = brands.map((_, index) => `${3.1 + (93.8 / Math.max(brands.length, 1)) * (index + 0.5)}%`);

  const selectBrand = React.useCallback((index: number) => {
    if (!isControlled) setInternalSelected(index);
    onSelectedBrandChange?.(index);
  }, [isControlled, onSelectedBrandChange]);

  React.useEffect(() => {
    if (!autoPlay || reduceMotion || brands.length < 2) return;
    const interval = setInterval(() => {
      const next = (selected + 1) % brands.length;
      selectBrand(next);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [autoPlay, brands.length, reduceMotion, rotationInterval, selectBrand, selected]);

  return (
    <Panel className="min-h-[260px] sm:min-h-[320px] @min-[840px]:col-span-12 @min-[840px]:min-h-[302px] @min-[840px]:row-span-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 grid h-[78%] grid-cols-[repeat(28,minmax(0,1fr))] grid-rows-[repeat(9,minmax(0,1fr))] gap-px overflow-hidden"
        style={{ maskImage: "linear-gradient(to bottom,black 0%,black 62%,transparent 100%)" }}
      >
        {Array.from({ length: 252 }, (_, index) => (
          <span
            key={index}
            className={cn(
              "border border-white/[0.018] bg-[#0b0b0b]",
              LIFTED_TILES.has(index) && "bg-[#101010]",
              BRIGHT_TILES.has(index) && "bg-[#151515]",
            )}
          />
        ))}
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-[8%] z-[1] h-[66%] w-[24%] rounded-full bg-white/[0.022] blur-[48px]"
        animate={reduceMotion ? undefined : { x: ["-120%", "520%"] }}
        transition={{ duration: 14, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[76%] bg-[radial-gradient(ellipse_at_50%_18%,transparent_12%,rgba(0,0,0,.5)_58%,#000000_100%)]" />
      
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[760px] pointer-events-none">
        <div className="absolute inset-x-0 top-[9%] z-10 flex items-center gap-1.5 px-5 sm:px-7 sm:top-[6%] sm:gap-2.5 pointer-events-auto">
          {brands.map((brand, index) => (
            <motion.button
              type="button"
              key={brand.name}
              onClick={() => selectBrand(index)}
              aria-label={`Select ${brand.name}`}
              aria-pressed={selected === index}
              className={cn(
                "relative flex aspect-square min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[9px] border sm:rounded-[10px]",
                "bg-[linear-gradient(145deg,#222_0%,#1a1a1a_48%,#141414_100%)] shadow-[inset_0_1px_rgba(255,255,255,.025),0_10px_22px_rgba(0,0,0,.32)]",
                selected === index
                  ? "border-[#edff00]/15 text-[#edff00] shadow-[inset_0_1px_rgba(255,255,255,.025),0_10px_24px_rgba(0,0,0,.34),0_0_18px_rgba(237,255,0,.045)]"
                  : "border-white/[0.055] text-[#e8e8e8]",
              )}
              animate={reduceMotion ? undefined : {
                y: selected === index ? -3 : [0, index % 2 ? 1.5 : -1.5, 0],
                scale: selected === index ? 1.018 : 1,
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ y: { duration: 5 + index * 0.3, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }, scale: spring }}
            >
              {selected === index && (
                <motion.span
                  aria-hidden
                  className="absolute inset-[12%] rounded-full bg-[#edff00]/[0.11]"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.9, 1.08, 0.9] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <motion.span
                className="relative flex size-full items-center justify-center"
                animate={{ scale: selected === index ? 1.06 : 1 }}
                transition={spring}
              >
                <BrandMark brand={brand} />
              </motion.span>
            </motion.button>
          ))}
        </div>

        <ArrowCursor
          label={userLabel}
          className="left-[35%] top-[25%] sm:top-[35%] pointer-events-auto"
          targetLeft={cursorStops[selected]}
          delay={0.2}
        />
        <ArrowCursor label={collaboratorLabel} inverted className="top-[38%] sm:top-[65%] pointer-events-auto" targetLeft="68.7%" delay={0.9} />
      </div>

      <FeatureCopy title={title}>{description}</FeatureCopy>
    </Panel>
  );
}

interface InvoicePanelProps {
  monthlyPrice: number;
  previousPrice: number;
  currency: string;
  locale: string;
  autoPlay: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
}

function InvoicePanel({ monthlyPrice, previousPrice, currency, locale, autoPlay, title, description }: InvoicePanelProps) {
  const reduceMotion = useReducedMotion();
  const [invoiceIndex, setInvoiceIndex] = React.useState(0);
  const formatPrice = React.useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }),
    [currency, locale],
  );
  const invoices = [
    { label: "Invoice", price: previousPrice, previousPrice: null, accent: false },
    { label: "Invoice", price: monthlyPrice, previousPrice, accent: true },
  ];

  React.useEffect(() => {
    if (!autoPlay || reduceMotion) return;
    const interval = setInterval(() => {
      setInvoiceIndex((current) => (current + 1) % invoices.length);
    }, 3900);
    return () => clearInterval(interval);
  }, [autoPlay, invoices.length, reduceMotion]);

  const invoice = invoices[invoiceIndex];

  return (
    <Panel className="min-h-[420px] [container-type:inline-size] sm:min-h-[360px] @min-[840px]:col-span-7 @min-[840px]:min-h-[302px] @min-[840px]:row-span-1">
      <div className="pointer-events-none absolute inset-0 opacity-[0.045]" style={{ backgroundImage: "radial-gradient(circle,currentColor .65px,transparent .75px)", backgroundSize: "11px 11px" }} />
      <div className="absolute inset-x-0 top-0 h-[58%] overflow-hidden sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[53%]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={invoiceIndex}
            className="absolute left-[21%] top-5 h-[225px] w-[58%] overflow-hidden rounded-[10px] border border-[#343434]/80 bg-[linear-gradient(145deg,#1c1c1c_0%,#161616_48%,#101010_100%)] shadow-[inset_0_1px_rgba(255,255,255,.02),0_16px_36px_rgba(0,0,0,.38),0_3px_8px_rgba(0,0,0,.25)] sm:left-auto sm:right-4 sm:h-[250px] sm:w-[89%] @min-[520px]:right-7"
            style={{ padding: '24px' }}
            initial={reduceMotion ? false : { y: 270, opacity: 0, rotate: -1.25 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 285, opacity: 0, rotate: 1.1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between text-[#a0a0a0]">
              <span className="text-[12px]">{invoice.label}</span>
              <span className="relative mt-0.5 size-4 rounded-full bg-[#9e9e9e]"><span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-l-full bg-[#222]" /></span>
            </div>
            <div className="mt-2 flex items-baseline gap-2 whitespace-nowrap">
              <span className={cn("text-[26px] font-medium tracking-[-0.055em] @min-[520px]:text-[30px]", invoice.accent ? "text-[#edff00]" : "text-[#8e8e8e]")}>
                {formatPrice.format(invoice.price)}
              </span>
              {invoice.previousPrice && (
                <span className="text-[14px] text-[#767676] line-through @min-[520px]:text-[16px]">{formatPrice.format(invoice.previousPrice)}</span>
              )}
            </div>
            <div className="flex flex-col" style={{ marginTop: '20px', gap: '10px' }}>
              <div className="h-1 w-[42%] rounded-full bg-white/[0.07]" />
              <div className="h-1 w-[27%] rounded-full bg-white/[0.045]" />
            </div>
            <div className="flex flex-col" style={{ marginTop: '16px', gap: '10px' }}>
              {INVOICE_BARS.map((width, index) => (
                <div key={index} className="flex items-center justify-between" style={{ gap: '16px' }}>
                  <motion.span
                    className="h-2.5 rounded-[3px] bg-white/[0.045]"
                    style={{ width: `${width}%` }}
                    animate={reduceMotion ? undefined : { opacity: [0.35, 0.62, 0.35] }}
                    transition={{ duration: 3.5, delay: index * 0.28, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="h-3 w-[28%] rounded-[4px] bg-white/[0.07]" />
                </div>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(to_bottom,transparent,rgba(17,17,17,.55)_52%,#111_100%)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48%] bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,.12)_24%,rgba(0,0,0,.48)_58%,rgba(0,0,0,.88)_86%,#000000_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-8%] -bottom-[24%] z-10 h-[48%] rounded-[50%] bg-black/75 blur-[38px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-white/[0.025]"
      />

      <FeatureCopy className="sm:right-1/2 sm:pr-3" title={title}>{description}</FeatureCopy>
    </Panel>
  );
}

interface PausePanelProps {
  paused?: boolean;
  defaultPaused: boolean;
  autoPlay: boolean;
  spotlightInterval: number;
  userLabel: string;
  title: React.ReactNode;
  activeDescription: React.ReactNode;
  pausedDescription: React.ReactNode;
  onPausedChange?: (paused: boolean) => void;
}

function PausePanel({
  paused: controlledPaused,
  defaultPaused,
  autoPlay,
  spotlightInterval,
  userLabel,
  title,
  activeDescription,
  pausedDescription,
  onPausedChange,
}: PausePanelProps) {
  const [internalPaused, setInternalPaused] = React.useState(defaultPaused);
  const [demoLit, setDemoLit] = React.useState(true);
  const reduceMotion = useReducedMotion();
  const isControlled = controlledPaused !== undefined;
  const paused = isControlled ? controlledPaused : internalPaused;
  const arrowLit = autoPlay && demoLit && !reduceMotion;

  React.useEffect(() => {
    if (!autoPlay || reduceMotion) return;

    let offTimer: ReturnType<typeof setTimeout> | undefined;
    const illuminate = () => {
      setDemoLit(true);
      offTimer = setTimeout(() => setDemoLit(false), 1500);
    };

    const firstTimer = setTimeout(() => setDemoLit(false), 1500);
    const loopTimer = setInterval(illuminate, spotlightInterval);

    return () => {
      clearTimeout(firstTimer);
      if (offTimer) clearTimeout(offTimer);
      clearInterval(loopTimer);
    };
  }, [autoPlay, reduceMotion, spotlightInterval]);

  const toggle = () => {
    const next = !paused;
    if (!isControlled) setInternalPaused(next);
    onPausedChange?.(next);
  };

  return (
    <Panel className="min-h-[340px] sm:min-h-[320px] @min-[840px]:col-span-5 @min-[840px]:min-h-[302px] @min-[840px]:row-span-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-screen"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 30%,currentColor 0 .45px,transparent .7px),radial-gradient(circle at 70% 65%,currentColor 0 .45px,transparent .75px)",
          backgroundSize: "4px 4px,5px 5px",
        }}
      />
      <div className="absolute inset-x-0 top-0 flex h-[66%] items-center justify-center">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((ring) => (
          <motion.div
            key={ring}
            aria-hidden
            className="absolute border border-white/[0.04]"
            style={{
              width: 190 + ring * 23,
              height: 100 + ring * 16,
              borderRadius: 23 + ring * 3,
              opacity: Math.max(0.18, 0.72 - ring * 0.045),
            }}
            animate={reduceMotion ? undefined : { scale: [0.995, 1.008, 0.995] }}
            transition={{ duration: 5.2, delay: ring * 0.11, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          animate={{ scale: arrowLit ? 1.012 : 1 }}
          className={cn(
            "relative z-10 flex h-[78px] min-w-[174px] items-center justify-center overflow-hidden rounded-[20px] border bg-gradient-to-br px-8 text-[28px] font-semibold tracking-[-0.055em] transition-[border-color,color,box-shadow] duration-500",
            "from-[#181818] to-[#0d0d0d]",
            arrowLit
              ? "border-[#edff00] text-[#050505] shadow-[0_10px_24px_rgba(0,0,0,.28)]"
              : "border-white/[0.14] text-[#f1f1f1] shadow-[inset_0_1px_rgba(255,255,255,.035),0_10px_30px_rgba(0,0,0,.32)]",
          )}
          aria-pressed={paused}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-[#edff00]"
            animate={{ opacity: arrowLit ? 1 : 0 }}
            transition={{ duration: arrowLit ? 0.64 : 0.76, ease: arrowLit ? [0.16, 1, 0.3, 1] : [0.22, 1, 0.36, 1] }}
          />
          <span className="relative">{paused ? "Resume" : "Pause"}</span>
        </motion.button>
        <ArrowCursor label={userLabel} className="left-[57%] top-[70%]" delay={0.5} active={arrowLit} />
      </div>

      <FeatureCopy title={title}>{paused ? pausedDescription : activeDescription}</FeatureCopy>
    </Panel>
  );
}

export function ResearchBentoGrid({
  monthlyPrice = 1990,
  previousPrice = 32000,
  currency = "USD",
  locale = "en-US",
  paused,
  defaultPaused = false,
  selectedBrand,
  defaultSelectedBrand = 1,
  brands = DEFAULT_BRANDS,
  copy,
  autoPlay = true,
  brandRotationInterval = 2600,
  spotlightInterval = 4400,
  userLabel = "You",
  collaboratorLabel = "X7",
  className,
  onPausedChange,
  onSelectedBrandChange,
  ...props
}: ResearchBentoGridProps) {
  const content = { ...DEFAULT_COPY, ...copy };

  if (brands.length === 0) {
    throw new Error("ResearchBentoGrid requires at least one brand.");
  }

  return (
    <div
      {...props}
      className={cn(
        "flex justify-center items-center w-full bg-transparent p-2 text-white [container-type:inline-size] sm:p-3",
        className,
      )}
    >
      <div className="m-auto grid w-full max-w-[1120px] grid-cols-1 gap-2.5 sm:gap-3 @min-[840px]:grid-cols-12 @min-[840px]:grid-rows-2">
        <DesignsPanel
          brands={brands}
          selectedBrand={selectedBrand}
          defaultSelectedBrand={defaultSelectedBrand}
          autoPlay={autoPlay}
          rotationInterval={brandRotationInterval}
          userLabel={userLabel}
          collaboratorLabel={collaboratorLabel}
          title={content.showcaseTitle}
          description={content.showcaseDescription}
          onSelectedBrandChange={onSelectedBrandChange}
        />
        <InvoicePanel
          monthlyPrice={monthlyPrice}
          previousPrice={previousPrice}
          currency={currency}
          locale={locale}
          autoPlay={autoPlay}
          title={content.pricingTitle}
          description={content.pricingDescription}
        />
        <PausePanel
          paused={paused}
          defaultPaused={defaultPaused}
          autoPlay={autoPlay}
          spotlightInterval={spotlightInterval}
          userLabel={userLabel}
          title={content.pauseTitle}
          activeDescription={content.activeDescription}
          pausedDescription={content.pausedDescription}
          onPausedChange={onPausedChange}
        />
      </div>
    </div>
  );
}

export default ResearchBentoGrid;
