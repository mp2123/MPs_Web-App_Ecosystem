import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, PhoneCallIcon } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud-3";

export function HeroSection() {
	return (
		<section className="mx-auto w-full max-w-5xl">
			{/* Top Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
			>
				<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
			</div>

			{/* X Bold Faded Borders */}
			<div
				aria-hidden="true"
				className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
			>
				<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 left-0 z-10 h-full w-px bg-foreground/15" />
				<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 right-0 z-10 h-full w-px bg-foreground/15" />
			</div>

			{/* main content */}

			<div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-30">
				{/* X Content Faded Borders */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-1 size-full overflow-hidden"
				>
					<div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
					<div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
					<div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
					<div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
				</div>

				<a
					className={cn(
						"group mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-3 py-1 shadow",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
					)}
					href="#link"
				>
					<RocketIcon className="size-3 text-muted-foreground" />
					<span className="text-xs">New Cocktails Added!</span>
					<span className="block h-5 border-l" />

					<ArrowRightIcon className="size-3 duration-150 ease-out group-hover:translate-x-1" />
				</a>

				<div className="fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-300 duration-1000 ease-out">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
						<Sparkles className="h-3 w-3" /> The perfect pour is a calculated collision of chemistry, history, and theater
					</div>
				</div>

				<h1
					className={cn(
						"fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-4xl tracking-tight delay-100 duration-500 ease-out md:text-5xl lg:text-6xl",
						"text-shadow-[0_0px_50px_theme(--color-foreground/.2)] font-black uppercase italic"
					)}
				>
					The Art of <br /> Professional Mixology
				</h1>

				<p className="fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base text-foreground/80 tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-xl">
					Deconstructing the classics. <br /> Mastering the science of the stir.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<Button className="rounded-full" size="lg" variant="secondary">
						<PhoneCallIcon data-icon="inline-start" className="size-4 mr-2" />{" "}
						View Recipes
					</Button>
					<Button className="rounded-full " size="lg">
						Watch Tutorials{" "}
						<ArrowRightIcon 
						className="size-4 ms-2"data-icon="inline-end" />
					</Button>
				</div>
			</div>
		</section>
	);
}

export function LogosSection() {
	return (
		<section className="relative space-y-4 border-t pt-6 pb-10">
			<h2 className="text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
				Featured Spirits & <span className="text-foreground">Glassware Partners</span>
			</h2>
			<div className="relative z-10 mx-auto max-w-4xl">
				<LogoCloud logos={logos} />
			</div>
		</section>
	);
}

const logos = [
	{
		src: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Bacardi_Logo.svg/1200px-Bacardi_Logo.svg.png",
		alt: "Bacardi",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hennessy_Logo.svg/1200px-Hennessy_Logo.svg.png",
		alt: "Hennessy",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Jack_Daniel%27s_Logo.svg/1200px-Jack_Daniel%27s_Logo.svg.png",
		alt: "Jack Daniel's",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Tanqueray_Logo.svg/1200px-Tanqueray_Logo.svg.png",
		alt: "Tanqueray",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Absolut_Vodka_logo.svg/1200px-Absolut_Vodka_logo.svg.png",
		alt: "Absolut",
	},
	{
		src: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Patron_Tequila_logo.svg/1200px-Patron_Tequila_logo.svg.png",
		alt: "Patron",
	},
];
