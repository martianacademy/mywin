import {
  faChartArea,
  faCube,
  faIdBadge,
  faTrophy,
  faUsers,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconColor = "#DD6B20";

export const NavMenuItems = [
  {
    name: "UserIDs",
    link: "/user",
    icon: <FontAwesomeIcon icon={faIdBadge} shake color={IconColor} />,
  },
  {
    name: "Dashboard",
    link: "",
    icon: <FontAwesomeIcon icon={faChartArea} shake color={IconColor} />,
  },
  {
    name: "Winning Reward",
    link: "winning-rewards",
    icon: <FontAwesomeIcon icon={faTrophy} shake color={IconColor} />,
  },
  {
    name: "Future Secure Wallet",
    link: "future-secure-wallet",
    icon: <FontAwesomeIcon icon={faWallet} shake color={IconColor} />,
  },
  {
    name: "Team",
    link: "team",
    icon: <FontAwesomeIcon icon={faUsers} shake color={IconColor} />,
  },
  {
    name: "TopUp ID",
    link: "top-up-id",
    icon: <FontAwesomeIcon icon={faUsers} shake color={IconColor} />,
  },
];
