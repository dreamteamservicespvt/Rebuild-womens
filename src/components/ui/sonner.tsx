import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Set duration to 4.5 seconds to match our hooks implementation
      duration={4500}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gym-gray-dark group-[.toaster]:text-white group-[.toaster]:border-gym-gray-light group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-white/70",
          actionButton:
            "group-[.toast]:bg-gym-yellow group-[.toast]:text-gym-black",
          cancelButton:
            "group-[.toast]:bg-gym-gray group-[.toast]:text-white/70",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
