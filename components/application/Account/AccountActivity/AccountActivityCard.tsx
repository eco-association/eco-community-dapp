import { Card } from "@ecoinc/ecomponents";
import { useAccountActivity } from "../../../hooks/useAccountActivity";

const AccountActivityCard = () => {
  const activities = useAccountActivity();
  return <Card>Hello</Card>;
};

export default AccountActivityCard;
