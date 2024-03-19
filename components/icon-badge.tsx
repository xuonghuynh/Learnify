import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'
import React from 'react'

const backgroudVariants = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100",
            },
            size: {
                default: "p-2",
                sm: "p-1"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

const iconVarians = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-700",
                success: "text-emerald-700",
            },
            size: {
                default: "h-8 w-8",
                sm: "h-4 w-4"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

type BackgroundVariantsProps = VariantProps<typeof backgroudVariants>;
type IconVariantProps = VariantProps<typeof iconVarians>;

interface IconBadgetProps extends BackgroundVariantsProps, IconVariantProps {
    icon: LucideIcon
}

const IconBadget = ({
    icon: Icon,
    variant,
    size
}: IconBadgetProps) => {
  return (
    <div className={cn(backgroudVariants({variant, size}))}>
      <Icon className={cn(iconVarians({variant, size}), "z-20")}></Icon>
    </div>
  )
}

export default IconBadget
