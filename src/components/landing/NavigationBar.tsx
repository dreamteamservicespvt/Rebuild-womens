import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Home, Dumbbell, DollarSign, MapPin, Users, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const menuItems = [
	{ id: "hero", label: "Home", icon: Home },
	{ id: "sessions", label: "Sessions", icon: Dumbbell },
	{ id: "pricing", label: "Pricing", icon: DollarSign },
	{ id: "join", label: "Join", icon: Users },
	{ id: "location", label: "Location", icon: MapPin },
];

export default function NavigationBar() {
	const { scrollY } = useScroll();
	const navRef = useRef<HTMLElement>(null);
	const [active, setActive] = useState("hero");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const isMobile = useIsMobile();

	// neon shadow on scroll and track if page is scrolled
	useMotionValueEvent(scrollY, "change", (latest) => {
		if (navRef.current) {
			const p = Math.min(latest / 500, 1);
			navRef.current.style.setProperty(
				"--depth-shadow",
				`0 10px ${30 + p * 20}px ${-10 - p * 10}px rgba(0,0,0,${
					0.2 + p * 0.1
				}), 0 0 ${2 + p * 10}px rgba(255,243,24,${
					0.1 + p * 0.1
				})`
			);

			// Update isScrolled state based on scroll position
			setIsScrolled(latest > 10);
		}
	});

	const scrollToSection = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			const navHeight = navRef.current?.offsetHeight || 0;
			const yOffset = -navHeight; // Dynamic offset based on nav height
			const y =
				el.getBoundingClientRect().top + window.pageYOffset + yOffset;

			window.scrollTo({ top: y, behavior: "smooth" });
			setActive(id);
			setMobileMenuOpen(false); // Close mobile menu after selection
		}
	};

	// Fix: Add scroll detection to update active section
	useEffect(() => {
		const handleScroll = () => {
			// Find which section is currently in the viewport
			const sections = menuItems.map((item) => item.id);

			// Start from the bottom of the page and go up
			// This ensures the active section is the one most visible
			for (let i = sections.length - 1; i >= 0; i--) {
				const section = document.getElementById(sections[i]);
				if (section) {
					const rect = section.getBoundingClientRect();
					// If the section is in view (accounting for navbar height)
					if (rect.top <= 100 && rect.bottom >= 100) {
						setActive(sections[i]);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		// Initial check
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile menu when resizing to desktop
	useEffect(() => {
		if (!isMobile && mobileMenuOpen) {
			setMobileMenuOpen(false);
		}
	}, [isMobile, mobileMenuOpen]);

	return (
		<>
			<header
				ref={navRef}
				className={cn(
					"fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 sm:h-20 flex items-center",
					isScrolled ? "backdrop-blur-md bg-black/70" : "bg-transparent"
				)}
			>
				<div className="container-custom h-full flex justify-between items-center">
					<div className="flex items-center">
						<Link
							to="/"
							className="text-xl sm:text-2xl font-bold text-gym-yellow tracking-wider italic"
							style={{
								textShadow: "0 0 10px rgba(255, 243, 24, 0.5)",
							}}
						>
							REBUILD WOMEN'S
						</Link>
					</div>

					{/* Rest of the existing navigation code */}
					<div className="flex items-center">
						{/* Desktop links - hidden on mobile */}
						<div className="hidden md:flex items-center space-x-6">
							{menuItems.map((item) => (
								<motion.div
									key={item.id}
									whileHover={{ scale: 1.05 }}
									className="relative"
								>
									<a
										href={`#${item.id}`}
										onClick={(e) => {
											e.preventDefault();
											scrollToSection(item.id);
										}}
										className={cn(
											"px-4 py-2 text-base font-heading uppercase tracking-wide transition-colors",
											active === item.id
												? "text-gym-yellow"
												: "text-white/80 hover:text-gym-yellow"
										)}
									>
										{item.label}
										{active === item.id && (
											<motion.div
												className="absolute -inset-1 rounded-lg bg-white/5"
												layoutId="activeNavBackground"
												transition={{
													type: "spring",
													bounce: 0.15,
													duration: 0.5,
												}}
											/>
										)}
									</a>
								</motion.div>
							))}

							{/* Join Now with neon fill */}
							<motion.div
								whileHover="hover"
								className="relative ml-2"
								whileTap={{ scale: 0.95 }}
							>
								<Button
									onClick={() => scrollToSection("join")}
									className="relative overflow-hidden px-7 py-2.5 bg-gym-yellow/90 text-black font-heading uppercase tracking-wide rounded-lg"
								>
									<span className="relative z-10">Join Now</span>
									<motion.span
										className="absolute inset-0 bg-gym-yellow"
										variants={{
											initial: { scaleX: 0 },
											hover: {
												scaleX: 1,
												transition: { duration: 0.3 },
											},
										}}
										style={{ originX: 0, opacity: 0.2 }}
									/>
								</Button>
							</motion.div>
						</div>

						{/* Mobile menu button - only visible on mobile */}
						<motion.button
							className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-gym-yellow/20 text-gym-yellow"
							whileTap={{ scale: 0.9 }}
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</motion.button>
					</div>
				</div>
			</header>

			{/* Mobile menu overlay */}
			<AnimatePresence>
				{isMobile && mobileMenuOpen && (
					<motion.div
						className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<div className="flex flex-col items-center gap-6 w-4/5 max-w-xs">
							{menuItems.map((item, index) => (
								<motion.a
									key={item.id}
									href={`#${item.id}`}
									onClick={(e) => {
										e.preventDefault();
										scrollToSection(item.id);
									}}
									className={cn(
										"flex items-center gap-3 w-full py-5 px-6 rounded-xl text-xl font-heading tracking-wide transition-all",
										active === item.id
											? "bg-gym-yellow/20 text-gym-yellow"
											: "text-white hover:bg-white/5"
									)}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * index, duration: 0.3 }}
									whileTap={{ scale: 0.95 }}
								>
									<item.icon className="h-7 w-7" />
									<span>{item.label}</span>
								</motion.a>
							))}

							<motion.div
								className="mt-6 w-full"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.6, duration: 0.3 }}
							>
								<Button
									onClick={() => scrollToSection("join")}
									className="w-full py-6 bg-gym-yellow hover:bg-gym-yellow/90 text-black text-xl font-heading tracking-wide rounded-xl"
								>
									JOIN NOW
								</Button>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Mobile bottom navigation bar - Reduced height */}
			{isMobile && (
				<motion.div
					className="fixed bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md border-t border-white/10"
					initial={{ y: 100 }}
					animate={{ y: 0 }}
					transition={{
						delay: 0.3,
						type: "spring",
						stiffness: 300,
						damping: 30,
					}}
				>
					<div className="flex justify-around items-center py-1.5">
						{menuItems.map((item) => (
							<motion.button
								key={item.id}
								onClick={() => scrollToSection(item.id)}
								className="flex flex-col items-center py-1.5 px-2 relative"
								whileTap={{ scale: 0.9 }}
							>
								{active === item.id && (
									<motion.span
										layoutId="bottomNavIndicator"
										className="absolute inset-0 bg-gym-yellow/20 rounded-lg -z-10"
										transition={{
											type: "spring",
											bounce: 0.2,
											duration: 0.6,
										}}
									/>
								)}
								<item.icon
									className={cn(
										"h-5 w-5 mb-0.5 transition-colors",
										active === item.id
											? "text-gym-yellow"
											: "text-white/70"
									)}
								/>
								<span
									className={cn(
										"text-[10px] transition-colors",
										active === item.id
											? "text-gym-yellow font-medium"
											: "text-white/70"
									)}
								>
									{item.label}
								</span>
							</motion.button>
						))}
					</div>
				</motion.div>
			)}

			{/* Floating Join Now button for mobile - Adjusted position */}
			{isMobile && (
				<motion.div
					className="fixed bottom-16 right-3 z-30"
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						delay: 0.5,
						type: "spring",
						stiffness: 300,
						damping: 15,
					}}
				>
					<Button
						onClick={() => scrollToSection("join")}
						className="h-12 w-12 rounded-full bg-gym-yellow hover:bg-gym-yellow/90 text-black shadow-lg shadow-gym-yellow/20"
						aria-label="Join Now"
					>
						<Users className="h-5 w-5" />
					</Button>
				</motion.div>
			)}
		</>
	);
}
