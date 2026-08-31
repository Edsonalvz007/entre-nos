import type { LucideProps } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  CirclePause,
  Eye,
  Heart,
  Home,
  Info,
  Leaf,
  LockKeyhole,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Volume2,
  VolumeX,
  WandSparkles,
  X,
} from 'lucide-react';

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'help'
  | 'pause-circle'
  | 'eye'
  | 'heart'
  | 'home'
  | 'info'
  | 'leaf'
  | 'lock'
  | 'message'
  | 'minus'
  | 'more'
  | 'pause'
  | 'play'
  | 'plus'
  | 'refresh'
  | 'settings'
  | 'shield'
  | 'sparkles'
  | 'sun'
  | 'users'
  | 'volume-on'
  | 'volume-off'
  | 'wand'
  | 'x';

const iconMap = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  help: CircleHelp,
  'pause-circle': CirclePause,
  eye: Eye,
  heart: Heart,
  home: Home,
  info: Info,
  leaf: Leaf,
  lock: LockKeyhole,
  message: MessageCircle,
  minus: Minus,
  more: MoreHorizontal,
  pause: Pause,
  play: Play,
  plus: Plus,
  refresh: RotateCcw,
  settings: Settings,
  shield: ShieldCheck,
  sparkles: Sparkles,
  sun: Sun,
  users: Users,
  'volume-on': Volume2,
  'volume-off': VolumeX,
  wand: WandSparkles,
  x: X,
} as const;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = iconMap[name];
  return <Component aria-hidden="true" {...props} />;
}
