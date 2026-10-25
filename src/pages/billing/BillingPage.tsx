import { Link } from "react-router-dom";

import { GoldButton } from "@/components/common/GoldButton";
import { AppPageContainer, ParticipantPageHeader } from "@/components/member/app";
import { PaymentHistoryList } from "@/components/payments/PaymentHistoryList";
import { ROUTES } from "@/utils/constants";

export default function BillingPage() {
  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="Billing"
        title="Payment history"
        subtitle="Every payment and its confirmed status, newest first. Open one for full details."
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.ENROLLMENT}>Founding Access plans</Link>
          </GoldButton>
        }
      />
      <PaymentHistoryList />
    </AppPageContainer>
  );
}
