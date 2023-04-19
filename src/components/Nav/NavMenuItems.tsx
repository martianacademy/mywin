import { BsShieldFillCheck } from "react-icons/bs";
import { FaChartArea, FaIdBadge, FaIdCard } from "react-icons/fa";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";

export const NavMenuItems = [
  {
    name: "UserIDs",
    link: "/user",
    icon: FaIdBadge,
  },
  {
    name: "Dashboard",
    link: "/user/dashboard",
    icon: FaChartArea,
  },
  {
    name: "Stakings",
    link: "/user/dashboard/stakings",
    icon: MdEnergySavingsLeaf,
  },
  {
    name: "Future Secure Wallet",
    link: "/user/dashboard/future-secure-wallet",
    icon: BsShieldFillCheck,
  },
  {
    name: "Team",
    link: "/user/dashboard/team",
    icon: RiTeamFill,
  },
];
