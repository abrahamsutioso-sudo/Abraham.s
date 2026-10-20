import React from 'react';
import {
  Utensils,
  Car,
  ShoppingCart,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Gift,
  Home,
  CircleEllipsis,
  Briefcase,
  Laptop,
  TrendingUp,
  Sparkles,
  PlusCircle,
  Coffee,
  Smartphone,
  Wallet,
  Tag,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Utensils':
    case 'food':
      return <Utensils {...props} />;
    case 'Car':
    case 'transport':
      return <Car {...props} />;
    case 'ShoppingCart':
    case 'groceries':
      return <ShoppingCart {...props} />;
    case 'Receipt':
    case 'bills':
      return <Receipt {...props} />;
    case 'Film':
    case 'entertainment':
      return <Film {...props} />;
    case 'HeartPulse':
    case 'health':
      return <HeartPulse {...props} />;
    case 'GraduationCap':
    case 'education':
      return <GraduationCap {...props} />;
    case 'Gift':
    case 'social':
      return <Gift {...props} />;
    case 'Home':
    case 'housing':
      return <Home {...props} />;
    case 'Briefcase':
    case 'salary':
      return <Briefcase {...props} />;
    case 'Laptop':
    case 'freelance':
      return <Laptop {...props} />;
    case 'TrendingUp':
    case 'investment':
      return <TrendingUp {...props} />;
    case 'Sparkles':
    case 'allowance':
      return <Sparkles {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'Smartphone':
      return <Smartphone {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    default:
      return <CircleEllipsis {...props} />;
  }
};
